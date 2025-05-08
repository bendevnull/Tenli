import { NextRequest } from "next/server";
import { getUser } from "../../user/route";

export async function GET(req: NextRequest, { params }: { params: { user: string } }) {
    const { user: userName } = await params;
    const { searchParams } = new URL(req.url);
    const size = searchParams.get("size") || "128";

    if (!userName) {
        return new Response(JSON.stringify({error: "User name is required"}), { status: 400 });
    }

    const user = await getUser(userName);
    if (!user) return new Response(JSON.stringify({error: "User not found"}), { status: 404 });
    if (!user.image) return new Response(JSON.stringify({error: "User image not found"}), { status: 404 });
    const image = user.image;
    const response = await fetch(`${image}?size=${size}`, {
        method: "GET",
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0",
        },
    });
    if (!response.ok) {
        return new Response(JSON.stringify({error: "Unable to retrieve image"}), { status: 500 });
    }
    
    const imageBlob = await response.blob();
    return new Response(imageBlob, {
        status: 200,
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0",
            "Content-Disposition": `inline; filename=${user.name}.png`,
        },
    });
}