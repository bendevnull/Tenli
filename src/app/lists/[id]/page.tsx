"use client";
import ListComponent from "@/components/List";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSessionUser } from "@/hooks/useSessionUser";
import { List } from "@/types/User";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function ListPage({ params }: { params: { id: string } }) {
    const [id, setId] = useState<string | null>(null);
    const [list, setList] = useState<List | null>(null);
    const [loading, setLoading] = useState(true);
    const [responses, setResponses] = useState<any[] | null>(null);
    const [responsesLoading, setResponsesLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [sessionUserHasResponded, setSessionUserHasResponded] = useState(false);
    const [sessionUserResponseLoading, setSessionUserResponseLoading] = useState(true);

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

    useEffect(() => {
        if (!id) return;
        setResponsesLoading(true);

        async function fetchResponses() {
            const response = await fetch(`/api/lists/${id}/responses?page=${page}&limit=${limit}`);
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
    }, [page, limit, id]);

    useEffect(() => {
        if (!sessionUser || !list) return;
        setSessionUserResponseLoading(true);

        async function checkUserResponse() {
            const response = await fetch(`/api/lists/${id}/responses?user=${sessionUser.name}&include=responses`);
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

    if (loading || userLoading || sessionUserResponseLoading) {
        return <LoadingSpinner />;
    }

    if (!list) {
        redirect("/error/404");
    }

    // console.log("List data:", list);

    return (
        <div className="flex flex-col flex-grow bg-gray-100">
            <ListComponent list={list} response={list.responses[0]} className="mt-4" />
            <div className="container mx-auto p-4 flex flex-col gap-4">
                <div className="w-full bg-white p-4 mb-4 rounded shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">Responses</h2>
                        { sessionUser && sessionUser.id !== list.author?.id && !sessionUserHasResponded && (
                            <a href={`/lists/${id}/respond`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:bg-blue-700">
                                Add Response
                            </a>
                        )}
                    </div>
                    { !responsesLoading ? (
                        responses && responses.length <= 1 ? (
                            <p className="text-gray-600">No responses yet.</p>
                        ) : (
                            responses?.slice(1).map((response) => (
                                <ListComponent key={response.id} list={list} author={list.author} response={response} />
                            ))
                        )
                    ) : (
                        <LoadingSpinner />
                    )}
                </div>
            </div>
        </div>
    );
}