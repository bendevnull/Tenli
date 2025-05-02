import { getUser } from "@/app/api/user/route";
import { auth } from "@/lib/auth";
import { Roles } from "@/types/Roles";
import { User } from "@/types/User";

export type AuthResponse = {
    status: number;
    redirect: string | null;
    session: User | null;
};

export async function requireAuth(redirectPath: string = "/login", requiredRole?: Roles, callback: string = "/"): Promise<AuthResponse> {
    const { searchParams } = new URL(window.location.href);
    callback = searchParams.get("callbackUrl") || callback;
    
    const session = await auth();

    if (!session) {
        return { status: 401, redirect: `${redirectPath}?redirect=${callback}`, session: null };
    }

    const user = await getUser(session.user?.id);

    if (!user) {
        return { status: 500, redirect: "/error/500", session: null };
    }

    if (requiredRole && (user.role != requiredRole)) {
        return { status: 403, redirect: "/error/403", session: user };
    }

    return { status: 200, redirect: null, session: user };
}