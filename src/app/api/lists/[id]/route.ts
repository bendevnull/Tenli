import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const listId = (await params).id;

    const list = await prisma.list.findUnique({
        where: { id: listId },
        include: {
            responses: {
                orderBy: { createdAt: "desc" },
                include: {
                    user: {
                        omit: {
                            email: true,
                            emailVerified: true,
                        }
                    }
                }
            },
            author: {
                omit: {
                    email: true,
                    emailVerified: true,
                }
            }
        },
        omit: {
            authorId: true,
        }
    });

    if (!list) {
        return new Response("List not found", { status: 404 });
    }

    return new Response(JSON.stringify(list), { status: 200, headers: { "Content-Type": "application/json" } });
}