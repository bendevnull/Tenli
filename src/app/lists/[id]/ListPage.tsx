"use client";
import ListComponent from "@/components/List";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSessionUser } from "@/hooks/useSessionUser";
import { List, User } from "@/types/User";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function ListPage({ list, sessionUser }: { list: List | null; sessionUser: User | null }) {
    const [responses, setResponses] = useState<any[] | null>(null);
    const [responsesLoading, setResponsesLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [sessionUserHasResponded, setSessionUserHasResponded] = useState(false);
    const [sessionUserResponseLoading, setSessionUserResponseLoading] = useState(true);

    if (!list) {
        return redirect("/error/404");
    }

    useEffect(() => {
        if (!list) return;
        setResponsesLoading(true);

        async function fetchResponses() {
            const response = await fetch(`/api/lists/${list!.id}/responses?page=${page}&limit=${limit}`);
            if (!response.ok) {
                console.error("Failed to fetch responses data");
                setResponsesLoading(false);
                return;
            }

            const data = await response.json();
            setResponses(data.responses);
            setPageCount(data.pageCount);
            setResponsesLoading(false);
        }

        fetchResponses();
    }, [page, limit, list]);

    useEffect(() => {
        if (!sessionUser || !list) return;
        setSessionUserResponseLoading(true);

        async function checkUserResponse() {
            const response = await fetch(`/api/lists/${list!.id}/responses?user=${sessionUser!.name}&include=responses`);
            if (!response.ok) {
                console.error("Failed to check user response");
                setSessionUserResponseLoading(false);
                return;
            }

            const data = await response.json();
            setSessionUserHasResponded(data.responses.length > 0);
            setSessionUserResponseLoading(false);
        }

        checkUserResponse();
    }, [sessionUser, list]);

    if (sessionUserResponseLoading) {
        return <LoadingSpinner />;
    }

    // console.log("List data:", list);

    return (
        <div className="flex flex-col flex-grow bg-gray-100">
            <ListComponent list={list} response={list.responses[0]} className="mt-4" showSettings={ sessionUser?.id === list.author?.id || sessionUser?.role === "ADMIN" } />
            <div className="container mx-auto p-4 flex flex-col gap-4">
                <div className="w-full bg-white p-4 mb-4 rounded shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">Responses</h2>
                        { sessionUser && sessionUser.id !== list.author?.id && !sessionUserHasResponded && (
                            <a href={`/lists/${list.id}/respond`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:bg-blue-700">
                                Add Response
                            </a>
                        )}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        { !responsesLoading ? (
                            responses && responses.length < 1 ? (
                                <p className="text-gray-600">No responses yet.</p>
                            ) : (
                                responses?.map((response) => (
                                    <ListComponent key={response.id} list={list} author={list.author} response={response} hideHeader />
                                ))
                            )
                        ) : (
                            <LoadingSpinner />
                        )}
                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className={`px-4 py-2 rounded ${page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"} mr-4`}
                        >
                            &lt;
                        </button>
                        {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                            <button
                                key={pageNumber}
                                onClick={() => setPage(pageNumber)}
                                className={`mx-1 px-4 py-2 rounded ${
                                    page === pageNumber
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 hover:bg-gray-300"
                                }`}
                            >
                                {pageNumber}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
                            disabled={page === pageCount}
                            className={`px-4 py-2 rounded ${page === pageCount ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"} ml-4`}
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}