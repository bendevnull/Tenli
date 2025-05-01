"use client";
import ListComponent from "@/components/List";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSessionUser } from "@/hooks/useSessionUser";
import { List } from "@/types/User";
import { useEffect, useState } from "react";

export default function ListPage({ params }: { params: { id: string } }) {
    const [id, setId] = useState<string | null>(null);
    const [list, setList] = useState<List | null>(null);
    const [loading, setLoading] = useState(true);

    const { user: sessionUser, userLoading } = useSessionUser();

    useEffect(() => {
        async function unwrapParams() {
            const resolvedParams = await params;
            setId(resolvedParams.id);
        }

        unwrapParams();
    }, [params]);

    useEffect(() => {
        if (!id) return;

        async function fetchList() {
            const response = await fetch(`/api/lists/${id}`);
            if (!response.ok) {
                console.error("Failed to fetch list data");
                setLoading(false);
                return;
            }

            const data = await response.json();
            setList(data);
            setLoading(false);
        }

        fetchList();
    }, [id]);

    if (loading || userLoading) {
        return <LoadingSpinner />;
    }

    if (!list) {
        return <p>List not found.</p>;
    }

    // console.log("List data:", list);

    return (
        <div className="flex flex-col flex-grow bg-gray-100">
            <ListComponent list={list} className="mt-4" />
            <div className="container mx-auto p-4 flex flex-col gap-4">
                <div className="w-full bg-white p-4 mb-4 rounded shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">Responses</h2>
                        { sessionUser && sessionUser.id !== list.author?.id && (
                            <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 active:bg-blue-700">
                                Add Response
                            </button>
                        )}
                    </div>
                    {list.responses.length <= 1 ? (
                        <p className="text-gray-600">No responses yet.</p>
                    ) : (
                        list.responses.slice(1).map((response) => (
                            <ListComponent key={response.id} list={list} author={list.author} />
                        ))
                    )}
                    </div>
            </div>
        </div>
    );
}