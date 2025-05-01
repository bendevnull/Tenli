import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const authorName = formData.get("authorName") as string | null;
    const authorId = formData.get("authorId") as string | null;
    const items = Array.from({ length: 10 }, (_, i) => formData.get(`item${i + 1}`) as string);


    const list = await prisma.list.create({
        data: {
            name: title,
            authorId: authorId || undefined,
        },
    });

    await prisma.response.create({
        data: {
            content: JSON.stringify(items),
            listId: list.id,
            userId: authorId || undefined,
        },
    });

    // console.log("Received data:", { title, author: authorId ? authorId : authorName, items });
    return new Response("Data received", { status: 200 });
}