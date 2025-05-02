import { signIn } from "@/lib/auth";

export default function ProviderButton({ provider, redirectUrl = "/", disabled = false }: { provider: string, redirectUrl?: string, disabled?: boolean }) {
    return (
        <form action={async () => {
            "use server";
            await signIn(provider.toLowerCase(), { redirectTo: redirectUrl });
        }}>
            <button type="submit" className={`p-2 pr-4 w-full max-w-md bg-white border border-gray-300 text-gray-700 rounded flex items-center gap-4 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}`} disabled={disabled}>
                <img src={`/oauth/${provider.toLowerCase()}.svg`} alt={provider} className="w-5 h-5 ml-2" />
                <span className="text-left flex-1">Sign in with {provider}</span>
            </button>
        </form>
    );
}