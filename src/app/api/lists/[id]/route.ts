import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const listId = (await params).id;

    const list = await prisma.list.findUnique({
        where: { id: listId },
        include: { responses: true },
    });

    if (!list) {
        return new Response("List not found", { status: 404 });
    }

    return new Response(JSON.stringify(list), { status: 200 });
}