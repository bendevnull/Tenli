"use client";
import { List, User } from "@/types/User";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function CreateResponsePage({ list }: { list: List }) {
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // setError(null)
        const formData = new FormData(e.currentTarget);
        
        const response = await fetch(`/api/lists/${list.id}/responses`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            console.error("Failed to submit response");
            setError(`Failed to submit response: ${(await response.json()).error || "Unknown error"}`);
            return;
        }

        redirect(`/lists/${list.id}`);
    }

    return (
        <div className="flex flex-col flex-grow justify-center items-center">
            <form className="w-full max-w-[480px]" onSubmit={handleSubmit}>
                <div className="p-4 border border-gray-300 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200 w-full">
                    <h3 className="text-xl font-bold mb-2">Responding to "{list?.name}"</h3>
                    {error && <p className="text-red-500">{error}</p>}
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
                        Submit Response
                    </button>
                </div>
            </form>
        </div>
    );
}