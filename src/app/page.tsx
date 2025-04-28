
import ListComponent from "@/components/List";
import animations from "@/styles/animations.module.css";

export default async function Home() {
    // Fetch random lists from the database
    const res = await fetch(`${process.env.AUTH_URL}/api/lists?limit=3&random=true`);
    const lists = await res.json();
    return (
        <>
            <div className="flex flex-col items-center justify-center px-12 py-16 bg-white relative text-center">
                <div className={animations.fadeInTop}>
                    <h1 className="text-4xl font-bold text-gray-800">Welcome to Tenli</h1>
                    <p className="text-xl text-gray-600 mt-4">Your collection of top ten lists</p>
                </div>
            </div>
            <div className="px-12 py-16 bg-gray-50">
                <h2 className={`text-2xl font-bold text-gray-800 mb-8 ${animations.fadeIn}`}>Random Lists</h2>
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${animations.fadeIn}`}>
                    {lists.length === 0 ? (
                        <p className="text-lg text-gray-600">No lists available.</p>
                    ) : (
                        lists.map((list: any) => (
                            <ListComponent key={list.id} list={list}/>
                        ))
                    )}
                </div>
            </div>
            <footer className="bg-gray-100 py-8 px-12">
                <div className="flex flex-col items-center">
                    <div className="mb-2">
                        <p className="text-sm text-gray-600">
                            Created by <a className="hover:underline" href="https://github.com/bendevnull">bendevnull</a>
                        </p>
                    </div>
                    <div className="mb-2">
                        <p className="text-sm text-gray-600">Powered by <a className="hover:underline" href="https://nextjs.org">Next.js</a> and <a className="hover:underline" href="https://tailwindcss.com">Tailwind CSS</a></p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 text-center">© {new Date().getFullYear()} Tenli</p>
                    </div>
                    { process.env.NODE_ENV === "development" && (
                        <div className="mt-4">
                            <p className="text-sm text-red-500">Warning: Running in development mode. The database can be reset at anytime and will not persist changes with production!</p>
                        </div>
                    )}
                </div>
            </footer>
        </>
    );
}
