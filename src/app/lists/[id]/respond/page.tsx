import { getListById } from "@/app/api/lists/[id]/route";
import { requireAuth } from "@/middleware/requireAuth";
import { redirect } from "next/navigation";
import CreateResponsePage from "./CreateResponsePage";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = await params;

    const session = await requireAuth(`/lists/${id}/respond`);
    if (session.status !== 200 || !session.user) redirect(session.redirect || "/error/500");

    const list = await getListById(id);
    if (!list) redirect("/error/404");

    return (
        <CreateResponsePage list={list} />
    );
}