import { signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function GET() {
    await signOut({ redirectTo: "/" });
}