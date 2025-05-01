import { auth } from "@/lib/auth";
import { Roles } from "@/types/Roles";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";

export async function requireAuth(redirectPath: string = "/login", requiredRole?: Roles, callback: string = "/") {
    const { searchParams } = new URL(window.location.href);
    const callbackUrl = searchParams.get("callbackUrl") || callback;
    
    const session = await auth();
    const user: User = await (await fetch(`${process.env.AUTH_URL}/api/auth/user?id=${session?.user?.id}`)).json();

    if (!session) {
        redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }

    if (requiredRole && (user.role != requiredRole)) {
        redirect("/error/403");
    }

    return session;
}