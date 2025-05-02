import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import ServerSessionProvider from "@/components/ServerSessionProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// export const metadata: Metadata = {
//     // metadataBase: new URL(process.env.NODE_ENV === "development" ? "https://beta.tenliapp.com" : "https://tenliapp.com"),
//     title: `Tenli${process.env.NODE_ENV === "development" ? " (Development Beta)" : ""}`,
//     // icons: {
//     //     icon: "/tenli-square.png",
//     //     shortcut: "/tenli-square.png",
//     //     apple: "/tenli-square.png",
//     // },
//     openGraph: {
//         type: "website",
//         title: `Tenli${process.env.NODE_ENV === "development" ? " (Development Beta)" : ""}`,
//         description: "Your collection of top ten lists. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. 41123",
//         url: process.env.NODE_ENV === "development" ? "https://beta.tenliapp.com" : "https://tenliapp.com",
//         siteName: "Tenli",
//         images: [
//             {
//                 url: "/tenli-square.png",
//                 width: 512,
//                 height: 512,
                
//             },
//         ],
//     },
// };

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NODE_ENV === "development"
            ? "https://beta.tenliapp.com"
            : "https://tenliapp.com"
    ),
    title: {
        default: `Tenli${
            process.env.NODE_ENV === "development" ? " (Development Beta)" : ""
        }`,
        template: `%s | Tenli${
            process.env.NODE_ENV === "development" ? " (Development Beta)" : ""
        }`,
    },
    openGraph: {
        // type: "website",
        title: `Tenli${process.env.NODE_ENV === "development" ? " (Development Beta)" : ""}`,
        description: "Your collection of top ten lists.",
        url: process.env.NODE_ENV === "development" ? "https://beta.tenliapp.com" : "https://tenliapp.com",
        siteName: "Tenli",
        images: [{ url: "/tenli-square.png" }],
    },
    twitter: {
        card: "summary",
    }
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="bg-white">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
            >
                <ServerSessionProvider>
                    <Navbar />
                </ServerSessionProvider>
                {children}
            </body>
        </html>
    );
}
