import { Roles } from "./Roles";

export type User = {
    id: string;
    role: Roles;
    name: string | null;
    email: string | null;
    createdAt: Date;
    updatedAt: Date;
    image: string | null;
    createdLists: List[];
    responses: Response[];
};

export type List = {
    id: string;
    name: string;
    author: User;
    createdAt: Date;
    updatedAt: Date;
    responses: Response[];
};

export type Response = {
    id: string;
    listId: string;
    userId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    list: List;
    user: User;
};