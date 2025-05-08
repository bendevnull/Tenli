import { getListById } from "@/app/api/lists/[id]/route";
import { getUser } from "@/app/api/user/route";
import { auth } from "@/lib/auth";
import ListPage from "./ListPage";
import { Metadata } from "next";
import { List } from "@/types/User";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const { id } = await params;
    const list: List | null = await getListById(id);
    const responseCount = list?.responseCount ? list.responseCount - 1 : 0;

    return {
        title: list?.name || "List",
        openGraph: {
            title: list?.name || "List",
            description: `List created by ${list?.author.name}\nView the list and its responses, and join ${responseCount} ${responseCount == 1 ? "other person" : "others"} in responding to this list!`,
            url: `/lists/${id}`,
            siteName: "Tenli",
            images: [{ url: "/tenli-square.png" }],
        }

    };
}

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = await params;
    const session = await auth();
    const list = await getListById(id);
    const sessionUser = await getUser(session?.user?.name);

    return (
        <ListPage list={list} sessionUser={sessionUser} />
    );
}