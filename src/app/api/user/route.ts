import { prisma } from "@/lib/prisma";

export type APIUser = {
    id: string;
    name: string | null;
    image: string | null;
    role: string;
    createdLists: any[];
    responses: any[];
    createdListCount: number;
    responseCount: number;
    createdAt: string;
    updatedAt: string;
}

export async function GET(req: Request) {
    const userId = new URL(req.url).searchParams.get("id");
    const userName = new URL(req.url).searchParams.get("name");
    if (!userId && !userName) {
        return new Response("User ID or name is required", { status: 400 });
    }

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { id: userId || undefined },
                { name: userName || undefined },
            ],
        },
        omit: {
            email: true,
            emailVerified: true,
        },
        include: {
            createdLists: {
                orderBy: { createdAt: "desc" },
                omit: {
                    authorId: true,
                },
                include: {
                    responses: {
                        where: {
                            OR: [
                                { user: {
                                    name: {
                                        equals: userName || undefined
                                    }
                                } },
                                { userId: userId || undefined }
                            ]
                        }
                    },
                },
            },
            responses: {
                orderBy: { createdAt: "desc" },
                where: {
                    NOT: {
                        list: {
                            authorId: userId || undefined,
                            author: { name: userName || undefined }
                        }
                    }
                },
                include: {
                    list: true,
                },
                omit: {
                    listId: true,
                }
            },
        },
    });



    if (!user) {
        return new Response("User not found", { status: 404 });
    }
    return new Response(JSON.stringify({
        id: user.id,
        name: user.name || null,
        image: user.image || null,
        role: user.role || "USER",
        createdLists: user.createdLists.slice(0, 3),
        responses: user.responses.slice(0, 5),
        createdListCount: user.createdLists.length,
        responseCount: user.responses.length,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
    } as APIUser), { status: 200, headers: { "Content-Type": "application/json" } });
}