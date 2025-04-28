"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSessionUser } from "@/hooks/useSessionUser";
import { redirect } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const schema = z.object({
    title: z.string().nonempty("Title is required"),
});

export default function CreateListPage() {
    const { user, userLoading } = useSessionUser();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;

        const validation = schema.safeParse({ title });
        if (!validation.success) {
            setError(validation.error.errors[0].message);
            return;
        }

        setError(null);
        e.currentTarget.submit();
    };

    if (userLoading) {
        return <LoadingSpinner />;
    }

    if (!user && !userLoading) {
        // redirect to login if user is not authenticated
        return redirect("/login");
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-gray-800">
            <form action="/api/lists/create" method="POST" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="List Title"
                    name="title"
                    className="w-full max-w-md p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {user ? (
                    <input
                        type="hidden"
                        name="authorId"
                        value={user.id}
                    />
                ) : (
                    <input
                        type="text"
                        placeholder="Author Name"
                        name="authorName"
                        className="w-full max-w-md p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                )}
                {[...Array(10)].map((_, index) => (
                    <input
                        key={index}
                        type="text"
                        placeholder={`Item ${index + 1}`}
                        name={`item${index + 1}`}
                        className="w-full max-w-md p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                ))}
                <button
                    type="submit"
                    className="w-full max-w-md p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                >
                    Create List
                </button>
            </form>
        </div>
    );
}