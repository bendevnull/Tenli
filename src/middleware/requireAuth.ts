import { auth } from "@/lib/auth";
import { Roles } from "@/types/Roles";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";

export async function requireAuth(redirectPath: string = "/login", requiredRole?: Roles) {
    const session = await auth();
    const user: User = await (await fetch(`${process.env.AUTH_URL}/api/auth/user?id=${session?.user?.id}`)).json();

    if (!session) {
        redirect(redirectPath);
    }

    if (requiredRole && (user.role != requiredRole)) {
        redirect("/error/403");
    }

    return session;
}