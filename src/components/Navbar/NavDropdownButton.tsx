'use client';
import { useState, useEffect, useRef } from "react";
import { Roles } from "@/types/Roles";

function DropdownButton({ text, href, disabled=false }: { text: string; href: string; disabled?: boolean }) {
    return (
        disabled ? (
            <span className="block px-4 py-2 text-gray-400 text-center cursor-not-allowed">{text}</span>
        ) : (
            <a href={href} className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-center">{text}</a>
        )
    );
}

export default function NavDropdownButton({ user }: { user: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="hover:text-gray-600 focus:outline-none cursor-pointer flex items-center gap-2"
            >
                {user.name}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 min-w-[8rem] bg-white border border-gray-300 rounded shadow-lg z-50">
                    <DropdownButton text="Profile" href="/profile" />
                    <DropdownButton text="Settings" href="/settings" disabled />
                    {user.role == Roles.ADMIN && (
                        <DropdownButton text="Admin" href="/admin" disabled />
                    )}
                    <DropdownButton text="Logout" href="/logout" />
                </div>
            )}
        </div>
    );
}