import { auth } from "@/lib/auth";
import filter from "@/lib/filter";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id: listId } = await params;
    const searchParams = new URL(request.url).searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const user = searchParams.get("user");
    const excludeAuthorResponses = searchParams.get("excludeAuthorResponses") != "false";
    const include = searchParams.get("include");
    const exclude = searchParams.get("exclude");

    const list = await prisma.list.findUnique({
        where: {
            id: listId,
        },
        include: {
            author: true,
        },
    });

    if (!list) { return Response.json({ error: "List not found" }, { status: 404 }); }

    const [ responses, totalCount ] = await prisma.$transaction([
        prisma.response.findMany({
            where: {
                listId,
                ...(user && { user: { name: { equals: user, mode: "insensitive" } } }),
                ...(excludeAuthorResponses && { userId: { not: list?.authorId } }),
            },
            include: {
                user: {
                    omit: {
                        email: true,
                        emailVerified: true,
                    }
                },
            },
            orderBy: {
                createdAt: "asc",
            },
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
        }),
        prisma.response.count({
            where: {
                listId,
                ...(user && { user: { name: { equals: user, mode: "insensitive" } } }),
                ...(excludeAuthorResponses && { userId: { not: list?.authorId } }),
            }
        })
    ])

    if (!list) {
        return new Response("List not found", { status: 404 });
    }

    const response = filter({
        responses,
        pageCount: Math.ceil(totalCount / parseInt(limit)),
        page: parseInt(page),
        limit: parseInt(limit),
    }, include?.split(" "), exclude?.split(" "));

    return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
    
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const session = await auth();
    const { id: listId } = await params;

    const formData = await request.formData();
    const authorId = session?.user?.id || null;
    const items = Array.from({ length: 10 }, (_, i) => formData.get(`item${i + 1}`) as string);

    const list = await prisma.list.findUnique({
        where: {
            id: listId,
        }
    });

    const existingResponse = await prisma.response.findFirst({
        where: {
            listId,
            userId: authorId,
        }
    });

    if (!authorId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    if (!listId) {
        return new Response(JSON.stringify({ error: "List ID is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    if (items.length > 10 || items.length < 10) {
        return new Response(JSON.stringify({ error: "You must add 10 items" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    if (items.some(item => item.length < 3)) {
        return new Response(JSON.stringify({ error: "Each item must be at least 3 characters long" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    if (items.some(item => item.length > 100)) {
        return new Response(JSON.stringify({ error: "Each item must be at most 100 characters long" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    if (!list) {
        return new Response(JSON.stringify({ error: "List not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    if (existingResponse || list.authorId === authorId) {
        return new Response(JSON.stringify({ error: "You have already responded to this list" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    
    const response = await prisma.response.create({
        data: {
            content: JSON.stringify(items),
            listId: list.id,
            userId: authorId,
        },
    });

    return redirect(`/lists/${listId}`);
}