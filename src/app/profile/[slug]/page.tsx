import { getUser } from "@/app/api/user/route";
import { auth } from "@/lib/auth";
import ProfilePage from "./ProfilePage";
import { Metadata } from "next";
import { redirect } from "next/navigation";

async function getUserBySlug(slug: string, sessionUser: any) {
    slug = decodeURIComponent(slug);
    return slug != "@me" ? await getUser(slug) : sessionUser;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = await params;
    const session = await auth();
    const sessionUser = await getUser(session?.user?.name);
    const user = await getUserBySlug(slug, sessionUser);

    return {
        title: `${user?.name}'s Profile` || "Unknown Profile",
        openGraph: {
            title: `${user?.name}'s Profile` || "Unknown Profile",
            description: `View ${user?.name}'s profile, lists, and responses. They have created ${user?.createdListCount} ${user?.createdListCount == 1 ? "list" : "lists"} and have ${user?.responseCount} ${user?.responseCount == 1 ? "response" : "responses"}.`,
            type: "profile",
            url: `/profile/${slug}`,
            siteName: "Tenli",
            images: [{ url: `/api/avatars/${user?.name}?size=256` }],
        },
    };
}

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const session = await auth();
    const sessionUser = await getUser(session?.user?.name);
    const user = await getUserBySlug(slug, sessionUser);

    if (!user && !sessionUser) {
        return redirect("/login");
    }

    return (
        <ProfilePage user={user} sessionUser={sessionUser} />
    );
}