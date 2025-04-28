import { auth } from "@/lib/auth";

export const GET = async (req: Request) => {
    const session = await auth();

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    if (!session.user) {
        return new Response("User not found", { status: 404 });
    }

    return new Response(JSON.stringify({
        id: session.user.id,
        name: session.user.name || null,
        email: session.user.email || null,
        image: session.user.image || null,
    }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
};