import { getUser } from "@/app/api/user/route";
import { auth } from "@/lib/auth";
import { Roles } from "@/types/Roles";
import { User } from "@/types/User";

export type AuthResponse = {
    status: number;
    redirect: string | null;
    user: User | null;
};

export async function requireAuth(redirect: string, requiredRole?: Roles, redirectUrl: string = "/login"): Promise<AuthResponse> {
    const session = await auth();

    if (!session) {
        return { status: 401, redirect: `${redirectUrl}?redirect=${redirect}`, user: null };
    }

    const user = await getUser(session.user?.name);

    if (!user) {
        return { status: 500, redirect: "/error/500", user: null };
    }

    if (requiredRole && (user.role != requiredRole)) {
        return { status: 403, redirect: "/error/403", user };
    }

    return { status: 200, redirect: null, user };
}