"use client";
import { useState } from "react";
import NavDropdownButton from "./NavDropdownButton";
import "@/styles/size.css";

function HomeLink() {
    return (
        <a href="/" className="hover:text-gray-600 active:text-gray-600">Home</a>
    )
}

function ListsLink() {
    return (
        <a href="/lists" className="hover:text-gray-600 active:text-gray-600">Lists</a>
    )
}

function Logo() {
    return (
        <a href="/" className="absolute left-1/2 transform -translate-x-1/2">
            <img src="/tenli.svg" alt="Logo" className="h-8" />
        </a>
    )
}

function CreateListLink() {
    return (
        <a href="/lists/create" className="hover:text-gray-600 active:text-gray-600">Create List</a>
    )
}

function UserLink({ session }: { session: any }) {
    return (
        <>
            {session?.user ? (
                <div className="relative">
                    <NavDropdownButton user={session.user} />
                </div>
            ) : (
                <a href="/login" className="hover:text-gray-600 active:text-gray-600">Login</a>
            )}
        </>
    )
}

export default function NavbarLayout({ session }: { session: any }) {
    // const { width } = useWindowDimensions();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <nav className="bg-white text-gray-800 p-4 relative z-1000 hidden md:block">
                <div className="container mx-auto flex items-center">
                    <div className="flex flex-1 justify-evenly">
                        <HomeLink />
                        <ListsLink />
                    </div>
                    <Logo />
                    <div className="flex flex-1 justify-evenly">
                        <CreateListLink />
                        <UserLink session={session} />
                    </div>
                </div>
            </nav>
            <nav className="bg-white text-gray-800 p-4 relative z-1000 md:hidden">
                <div className="container mx-auto flex items-center justify-between">
                    <a href="/" className="absolute left-1/2 transform -translate-x-1/2">
                        <img src="/tenli.svg" alt="Logo" className="h-8" />
                    </a>
                    <button
                        className="text-gray-800 relative w-6 h-6"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <div
                            className={`absolute top-0 left-0 w-6 h-6 transform transition-transform duration-300 ${
                                isMenuOpen ? "rotate-90" : ""
                            }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                                />
                            </svg>
                        </div>
                    </button>
                </div>
                <div
                    className={`mt-4 flex flex-col items-center space-y-2 overflow-visible transition-all duration-300 z-1001 ${
                        isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <a href="/lists" className="hover:text-gray-600">Lists</a>
                    <a href="/lists/create" className="hover:text-gray-600">Create List</a>
                    {session?.user ? (
                        <div className="relative w-full flex justify-center">
                            <NavDropdownButton user={session.user} />
                        </div>
                    ) : (
                        <a href="/login" className="hover:text-gray-600">Login</a>
                    )}
                </div>
            </nav>
        </>
    )
}