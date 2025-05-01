import { prisma } from "@/lib/prisma";
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
                            }
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
                        list: true,
                    },
                    omit: {
                        listId: true,
                    },
                    take: 5,
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
    const userResponse = { ...user };

    if (exclude) {
        console.log(exclude);
        exclude.split(' ').forEach(field => {
            delete (userResponse as Record<string, any>)[field.trim()];
        });
    } else if (include) {
        console.log(include);
        const includeList = include.split(' ');
        Object.keys(userResponse).forEach(key => {
            if (!includeList.includes(key)) {
                delete (userResponse as Record<string, any>)[key];
            }
        });
    }

    return new Response(JSON.stringify(userResponse), { status: 200, headers: { "Content-Type": "application/json" } });
}