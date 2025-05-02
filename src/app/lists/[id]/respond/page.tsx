"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSessionUser } from "@/hooks/useSessionUser";
import { List } from "@/types/User";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateResponsePage({ params }: { params: { id: string } }) {
    const { user, userLoading } = useSessionUser();
    const [error, setError] = useState<string | null>(null);
    const [list, setList] = useState<List | null>(null);
    const [listLoading, setListLoading] = useState(true);
    const [listId, setListId] = useState<string | null>(null);

    useEffect(() => {
        async function unwrapParams() {
            const resolvedParams = await params;
            setListId(resolvedParams.id);
        }

        unwrapParams();
    }, [params]);

    useEffect(() => {
        async function fetchList() {
            if (!listId) return;
            const response = await fetch(`/api/lists/${listId}`);
            if (!response.ok) {
                console.error("Failed to fetch list data");
                redirect("/error/500");
            }
            const data = await response.json();
            setList(data);
            setListLoading(false);
        }

        fetchList();
    }, [listId]);

    if (userLoading || listLoading) {
        return <LoadingSpinner />;
    }

    if (!list || !listId) {
        redirect("/error/404");
    }

    if (!user) {
        // redirect to login if user is not authenticated
        redirect(`/login?redirect=/lists/${listId}/respond`);
    }

    return (
        <div className="flex flex-col flex-grow justify-center items-center">
            <form action={`/api/lists/${listId}/responses`} method="post" className="w-full max-w-[480px]">
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