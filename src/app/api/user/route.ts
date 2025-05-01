import { prisma } from "@/lib/prisma";
import { roleFromString, Roles } from "@/types/Roles";
import { User } from "@/types/User";

// export type APIUser = {
//     id: string;
//     name: string | null;
//     image: string | null;
//     role: Roles;
//     createdLists: any[];
//     responses: any[];
//     createdListCount: number;
//     responseCount: number;
//     createdAt: Date;
//     updatedAt: Date;
// }

export async function getUser(userId?: string | null, userName?: string | null): Promise<User | null> {
    const user = await prisma.user.findFirst({
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

    if (!user) return null;
    
    return {
        id: user.id,
        name: user.name || null,
        image: user.image || null,
        role: roleFromString(user.role) || Roles.USER,
        createdLists: user.createdLists.slice(0, 3),
        responses: user.responses.slice(0, 5),
        createdListCount: user.createdLists.length,
        responseCount: user.responses.length,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    } as User
}

export async function GET(req: Request) {
    const userId = new URL(req.url).searchParams.get("id");
    const userName = new URL(req.url).searchParams.get("name");
    const exclude = new URL(req.url).searchParams.get("exclude");
    const include = new URL(req.url).searchParams.get("include");

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