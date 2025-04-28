import Container from "@/components/Container";
import { redirect } from "next/navigation";

export default function ErrorPage() {
    return redirect("/error/404");
}