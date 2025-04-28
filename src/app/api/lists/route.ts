import { NextApiRequest } from "next";
import { prisma } from "@/lib/prisma";

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 12;

async function getAuthorLists(authorId: string, limit: number, validSearch: string | null, random: boolean) {
    const authorLists = await prisma.list.findMany({
        where: { authorId: { equals: authorId } },
        include: { responses: true, author: true }
    });

    if (random) {
        return authorLists.sort(() => 0.5 - Math.random()).slice(0, limit);
    }

    if (validSearch) {
        return authorLists.filter(list =>
            list.name.toLowerCase().includes(validSearch.toLowerCase())
        ).slice(0, limit);
    }

    return authorLists.slice(0, limit);
}

async function getRandomLists(limit: number) {
    const dbLists = await prisma.list.findMany({ take: MAX_LIMIT, include: { responses: true, author: true } });
    return dbLists.sort(() => 0.5 - Math.random()).slice(0, limit);
}

async function getSearchedLists(validSearch: string, limit: number) {
    return await prisma.list.findMany({
        where: {
            name: { contains: validSearch, mode: "insensitive" }
        },
        include: { responses: true, author: true },
        take: limit
    });
}

async function getDefaultLists(limit: number) {
    return await prisma.list.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { responses: true, author: true }
    });
}

export async function GET(request: NextApiRequest) {
    const query = new URL(request.url!).searchParams;
    const limit = query.get("limit") ? Math.min(parseInt(query.get("limit") as string), MAX_LIMIT) : DEFAULT_LIMIT;
    const search = query.get("search");
    const validSearch = search && search.length >= 3 ? search : null;
    const random = query.get("random") ? true : false;
    const authorId = query.get("authorId") ? query.get("authorId") : null;

    let lists;

    if (authorId) {
        lists = await getAuthorLists(authorId, limit, validSearch, random);
    } else if (random) {
        lists = await getRandomLists(limit);
    } else if (validSearch) {
        lists = await getSearchedLists(validSearch, limit);
    } else {
        lists = await getDefaultLists(limit);
    }

    return new Response(JSON.stringify(lists), { status: 200, headers: { "Content-Type": "application/json" } });
}