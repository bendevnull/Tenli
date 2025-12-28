import { NextApiRequest } from "next";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 12;

// Define a constant for the common Prisma include object
const PRISMA_INCLUDE = {
    responses: {
        include: {
            user: {
                omit: {
                    email: true,
                    emailVerified: true,
                },
            },
        },
        omit: {
            userId: true,
        },
        take: 1
    },
    author: {
        omit: {
            email: true,
            emailVerified: true,
        },
    },
};

async function getAuthorLists(authorId: string, limit: number, validSearch: string | null, random: boolean, page: number = 1) {
    const where: any = { authorId: { equals: authorId } };
    
    // Add search filter at database level
    if (validSearch) {
        where.name = { contains: validSearch, mode: "insensitive" };
    }

    const authorLists = await prisma.list.findMany({
        where,
        include: PRISMA_INCLUDE,
        take: limit,
        skip: (page - 1) * limit,
    });

    // Only sort randomly if requested (still in-memory but unavoidable for random)
    if (random) {
        return authorLists.sort(() => 0.5 - Math.random());
    }

    return authorLists;
}

async function getRandomLists(limit: number) {
    const totalCount = await prisma.list.count();
    
    // If there are fewer lists than MAX_LIMIT, just fetch all and randomize
    if (totalCount <= MAX_LIMIT) {
        const dbLists = await prisma.list.findMany({
            include: PRISMA_INCLUDE,
        });
        return dbLists.sort(() => 0.5 - Math.random()).slice(0, limit);
    }
    
    // Otherwise, use a random offset to get different lists each time
    const maxOffset = Math.max(0, totalCount - limit);
    const randomOffset = Math.floor(Math.random() * maxOffset);
    
    const dbLists = await prisma.list.findMany({
        take: limit,
        skip: randomOffset,
        include: PRISMA_INCLUDE,
    });
    
    // Shuffle the results for better randomness
    return dbLists.sort(() => 0.5 - Math.random());
}

async function getSearchedLists(validSearch: string, limit: number, page: number = 1) {
    return await prisma.list.findMany({
        where: {
            name: { contains: validSearch, mode: "insensitive" }
        },
        include: PRISMA_INCLUDE,
        take: limit,
        skip: (page - 1) * limit,
    });
}

export async function getDefaultLists(limit: number, page = 1) {
    return await prisma.list.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        include: PRISMA_INCLUDE,
        skip: (page - 1) * limit
    });
}

export async function GET(request: NextApiRequest) {
    const query = new URL(request.url!).searchParams;
    const limit = query.get("limit") ? Math.min(parseInt(query.get("limit") as string), MAX_LIMIT) : DEFAULT_LIMIT;
    const search = query.get("search");
    const validSearch = search && search.length >= 3 ? search : null;
    const random = query.get("random") ? true : false;
    const authorId = query.get("authorId") ? query.get("authorId") : null;
    const page = query.get("page") ? parseInt(query.get("page") as string) : 1;

    let lists;

    if (authorId) {
        lists = await getAuthorLists(authorId, limit, validSearch, random, page);
    } else if (random) {
        lists = await getRandomLists(limit);
    } else if (validSearch) {
        lists = await getSearchedLists(validSearch, limit, page);
    } else {
        lists = await getDefaultLists(limit, page);
    }

    return new Response(JSON.stringify(lists), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(request: Request) {
    const session = await auth();

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const authorId = session?.user?.id || null;
    const items = Array.from({ length: 10 }, (_, i) => formData.get(`item${i + 1}`) as string);

    if (!title || !items.length) {
        return new Response("Title and items are required", { status: 400 });
    }
    if (items.length > 10 || items.length < 10) {
        return new Response("You must add 10 items", { status: 400 });
    }
    if (items.some(item => item.length < 3)) {
        return new Response("Each item must be at least 3 characters long", { status: 400 });
    }
    if (!authorId) {
        return new Response("You must be logged in to create a list", { status: 401 });
    }
    if (title.length < 3) {
        return new Response("Title must be at least 3 characters long", { status: 400 });
    }
    if (title.length > 100) {
        return new Response("Title must be less than 100 characters", { status: 400 });
    }
    if (items.some(item => item.length > 100)) {
        return new Response("Each item must be less than 100 characters", { status: 400 });
    }

    const list = await prisma.list.create({
        data: {
            name: title,
            authorId: authorId,
        },
    });

    await prisma.response.create({
        data: {
            content: JSON.stringify(items),
            listId: list.id,
            userId: authorId,
        },
    });

    // console.log("Received data:", { title, author: authorId ? authorId : authorName, items });
    return redirect(`/lists/${list.id}`);
}