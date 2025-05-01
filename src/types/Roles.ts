export enum Roles {
    ADMIN = "ADMIN",
    USER = "USER",
    MODERATOR = "MODERATOR",
}

export function roleFromString(role: string): Roles {
    switch (role) {
        case "ADMIN":
            return Roles.ADMIN;
        case "USER":
            return Roles.USER;
        case "MODERATOR":
            return Roles.MODERATOR;
        default:
            throw new Error(`Invalid role: ${role}`);
    }
}