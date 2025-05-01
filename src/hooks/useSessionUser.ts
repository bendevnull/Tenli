import { useEffect, useState } from "react";

export interface Session {
    user: {
        id: string;
        name?: string;
        email?: string;
    };
}

export function useSessionUser() {
    const [user, setUser] = useState<any | null>(null);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await fetch("/api/auth/user");
                if (response.ok) {
                    const data = await response.json();
                    // console.log("Session data:", data);
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            } finally {
                setUserLoading(false);
            }
        };

        fetchSession();
    }, []);

    return { user, userLoading };
}
