import { Roles } from "./Roles";

export type User = {
    id: string;
    name: string | null;
    image: string | null;
    role: Roles;
    createdLists: any[];
    responses: any[];
    badges: Badge[];
    createdListCount: number;
    responseCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export type List = {
    id: string;
    name: string;
    author?: any;
    createdAt: Date;
    updatedAt: Date;
    responses: any[];
    responseCount?: number;
};

export type Response = {
    id: string;
    listId: string;
    userId?: string | null;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    list?: List;
    user: User | null;
};

export type Badge = {
    content: string;
    color: string;
}