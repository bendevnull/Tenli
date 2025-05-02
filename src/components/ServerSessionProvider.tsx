import { auth } from "@/lib/auth";
import React from "react";

import { ReactElement } from "react";

export default async function ServerSessionProvider({ children }: { children: ReactElement<{ session?: any }> }) {
    const session = await auth();

    return (
        <>
            {React.isValidElement(children) ? (
                React.cloneElement(children, { session })
            ) : (
                {children}
            )}
        </>
    );
}