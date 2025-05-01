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
        return redirect("/login?redirect=/lists/create");
    }

    return (
        <div className="flex flex-col flex-grow bg-gray-100 justify-center items-center">
            <form action="/api/lists" method="post" className="w-full max-w-[480px]" onSubmit={handleSubmit}>
                    <div className="p-4 border border-gray-300 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200 w-full">
                        <h3 className="text-xl font-bold mb-2">Create a new list</h3>
                        {error && <p className="text-red-500">{error}</p>}
                        <input
                            type="text"
                            name="title"
                            placeholder="List title"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            required
                        />
                        { [...Array(10)].map((_, index) => (
                            <div key={index} className="flex items-center mb-4 w-full">
                                <span className="mr-2 w-6 text-right">{index + 1}.</span>
                                <div className="w-full">
                                    <input
                                        type="text"
                                        name={`item${index + 1}`}
                                        placeholder={`Item ${index + 1}`}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                            </div>
                        )) }
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                        >
                            Create List
                        </button>
                    </div>
                </form>
        </div>
    );
}