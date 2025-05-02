import filter from "@/lib/filter";
import { prisma } from "@/lib/prisma";
import Snowflake from "@/lib/snowflake";
import { roleFromString, Roles } from "@/types/Roles";
import { User } from "@/types/User";

export async function getUser(userId?: string | null, userName?: string | null): Promise<User | null> {
    const [ user, createdListCount, responseCount ] = await prisma.$transaction([
        prisma.user.findFirst({
            where: {
                OR: [
                    { id: userId || undefined },
                    { name: {
                        equals: userName || undefined,
                        mode: "insensitive"
                    }},
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
                            },
                            include: { user: {
                                omit: {
                                    email: true,
                                    emailVerified: true,
                                }
                            }},
                        },
                    },
                    take: 3,
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
                        list: {
                            include: {
                                author: {
                                    omit: {
                                        email: true,
                                        emailVerified: true,
                                    }
                                },
                            },
                        },
                        user: {
                            omit: {
                                email: true,
                                emailVerified: true,
                            }
                        }
                    },
                    omit: {
                        listId: true,
                    },
                    take: 5,
                },
                badges: {
                    omit: { id: true }
                },
            },
        }),
        prisma.list.count({
            where: {
                author: {
                    id: {
                        equals: userId || undefined
                    },
                    name: {
                        equals: userName || undefined,
                        mode: "insensitive"
                    }
                }
            },
        }),
        prisma.response.count({
            where: {
                OR: [
                    { userId: userId || undefined },
                    { user: { name: { equals: userName || undefined, mode: "insensitive" } } }
                ],
                NOT: {
                    list: {
                        OR: [
                            { authorId: userId || undefined },
                            { author: { name: { equals: userName || undefined, mode: "insensitive" } } }
                        ]
                    }
                }
            },
        })
    ]);

    if (!user) return null;
    
    return {
        id: user.id,
        name: user.name || null,
        image: user.image || null,
        role: roleFromString(user.role) || Roles.USER,
        badges: user.badges,
        createdLists: user.createdLists,
        responses: user.responses,
        createdListCount,
        responseCount,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    } as User
}

export async function GET(req: Request) {
    const searchParams = new URL(req.url).searchParams;
    const userId = searchParams.get("id");
    const userName = searchParams.get("name");
    const exclude = searchParams.get("exclude");
    const include = searchParams.get("include");

    if (!userId && !userName) {
        return new Response("User ID or name is required", { status: 400 });
    }

    const user = await getUser(userId, userName);

    if (!user) return new Response("User not found", { status: 404 });
    const userResponse = filter(user, include?.split(" "), exclude?.split(" "));

    return new Response(JSON.stringify(userResponse), { status: 200, headers: { "Content-Type": "application/json" } });
}