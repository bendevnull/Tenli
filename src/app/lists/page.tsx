import ListComponent from "@/components/List";
import { getDefaultLists } from "../api/lists/route";

export function generateMetadata() {
    return {
        title: "Lists",
        openGraph: {
            title: "Lists",
            description: "View created lists and their responses.",
            url: "/lists",
            siteName: "Tenli",
            images: [{ url: "/tenli-square.png" }],
        },
    };
}

export default async function ListsPage({ searchParams }: { searchParams: { page: string, limit: string } }) {
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const limit = searchParams.limit ? parseInt(searchParams.limit) : 12;
    const lists = await getDefaultLists(limit, page);
    return (
        <div className="flex flex-col flex-grow bg-gray-100">
            <div className="container mx-auto px-4 flex flex-col md:flex-row gap-4 mt-4">
                <div className="w-full bg-white p-4 mb-4 rounded shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Created Lists</h2>
                    { lists.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 ">
                            {lists.map((list) => (
                                <ListComponent key={list.id} list={list} className="mb-4" response={list.responses[0]} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No lists available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}