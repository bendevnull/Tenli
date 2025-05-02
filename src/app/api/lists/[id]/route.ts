import filter from "@/lib/filter";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id: listId } = await params;

    const searchParams = new URL(request.url).searchParams;
    const include = searchParams.get("include");
    const exclude = searchParams.get("exclude");

    const list = await prisma.list.findUnique({
        where: { id: listId },
        include: {
            responses: {
                // include only first response
                take: 1,
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

    const listResponse = filter(list, include?.split(" "), exclude?.split(" "));

    return new Response(JSON.stringify(listResponse), { status: 200, headers: { "Content-Type": "application/json" } });
}