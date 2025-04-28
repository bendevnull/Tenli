import { signIn } from "@/lib/auth";

export default function ProviderButton({ provider }: { provider: string }) {
    return (
        <form action={async () => {
            "use server";
            await signIn(provider.toLowerCase(), { redirectTo: "/" });
        }}>
            <button type="submit" className="p-2 pr-4 w-full max-w-md bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-100 flex items-center gap-4 cursor-pointer">
                <img src={`/oauth/${provider.toLowerCase()}.svg`} alt={provider} className="w-5 h-5 ml-2" />
                <span className="text-left flex-1">Sign in with {provider}</span>
            </button>
        </form>
    );
}