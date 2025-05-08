import filter from "@/lib/filter";
import { prisma } from "@/lib/prisma";
import { List } from "@/types/User";
import { getUser } from "../../user/route";
import { auth } from "@/lib/auth";

export async function getListById(listId: string): Promise<List | null> {
    // const listData = await prisma.list.findUnique({
    //     where: { id: listId },
    //     include: {
    //         responses: {
    //             // include only first response
    //             take: 1,
    //             include: {
    //                 user: {
    //                     omit: {
    //                         email: true,
    //                         emailVerified: true,
    //                     }
    //                 }
    //             }
    //         },
    //         author: {
    //             omit: {
    //                 email: true,
    //                 emailVerified: true,
    //             }
    //         }
    //     },
    //     omit: {
    //         authorId: true,
    //     }
    // });

    const [listData, responseCount] = await prisma.$transaction([
        prisma.list.findUnique({
            where: { id: listId },
            include: {
                responses: {
                    include: {
                        user: {
                            omit: {
                                email: true,
                                emailVerified: true,
                            }
                        }
                    },
                    take: 1,
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
        }),
        prisma.response.count({
            where: {
                listId,
            }
        })
    ]);

    if (!listData) return null
    
    return {
        ...listData,
        responseCount,
    };
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id: listId } = await params;

    const searchParams = new URL(request.url).searchParams;
    const include = searchParams.get("include");
    const exclude = searchParams.get("exclude");

    const list = await getListById(listId);

    if (!list) {
        return new Response("List not found", { status: 404 });
    }

    const listResponse = filter(list, include?.split(" "), exclude?.split(" "));

    return new Response(JSON.stringify(listResponse), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id: listId } = await params;

    const session = await auth();
    const sessionUser = await getUser(session?.user?.name);

    if (!sessionUser) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    const list = await getListById(listId);

    if (!list) {
        return new Response(JSON.stringify({ error: "List not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    if (list.author.id !== sessionUser.id && sessionUser.role !== "ADMIN") {
        return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
    }


    await prisma.list.delete({
        where: { id: listId },
    });

    return new Response(JSON.stringify({ message: "List deleted successfully" }), { status: 200, headers: { "Content-Type": "application/json" } });
}