import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id: listId } = params;
    const searchParams = new URL(request.url).searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const [ list, totalCount ] = await prisma.$transaction([
        prisma.list.findUnique({
            where: {
                id: listId,
            },
            include: {
                author: true,
                responses: {
                    include: {
                        user: true,
                    },
                    omit: {
                        listId: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: parseInt(limit),
                    skip: (parseInt(page) - 1) * parseInt(limit),
                }
            }
        }),
        prisma.response.count({
            where: {
                listId,
            }
        })
    ]);

    if (!list) {
        return new Response("List not found", { status: 404 });
    }

    const response = {
        responses: list.responses,
        pageCount: Math.ceil(totalCount / parseInt(limit)),
        page: parseInt(page),
        limit: parseInt(limit),
    };

    return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
    
}

export async function POST(request: Request, { params }: { params: { id: string } }) {}