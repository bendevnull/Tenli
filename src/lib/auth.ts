import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Instagram from "next-auth/providers/instagram";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [ Discord, Google, Facebook, Instagram ],
    callbacks: {
        async redirect({ url, baseUrl }) {
            if (url.startsWith(baseUrl)) return url;
            if (url.startsWith("/")) return new URL(url, baseUrl).toString();
            return baseUrl;
        }
    }
});