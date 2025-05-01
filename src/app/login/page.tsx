import Container from '@/components/Container';
import ProviderButton from '@/components/Login/ProviderButton';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import animations from '@/styles/animations.module.css';

export default async function LoginPage({ searchParams }: { searchParams: { redirect: string } }) {
    const callbackUrl = (await searchParams).redirect || '/';
    console.log("Callback URL:", callbackUrl);
    const session = await auth();
    if (session) redirect(callbackUrl);

    return (
        <Container className={animations.fadeInTop}>
            <div className="flex flex-col p-6 border border-gray-300 rounded-lg bg-white shadow-md mt-[-10%]">
                <h2 className="text-center text-xl font-semibold mb-5">Login</h2>
                <div className="flex flex-col gap-3">
                    <ProviderButton provider="Google" callbackUrl={callbackUrl} />
                    <ProviderButton provider="Facebook" callbackUrl={callbackUrl} />
                    <ProviderButton provider="Instagram" callbackUrl={callbackUrl} />
                    <ProviderButton provider="Discord" callbackUrl={callbackUrl} />
                    <button className="p-2 pr-4 w-full max-w-md bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-100 flex items-center gap-4 cursor-pointer">
                        <img src={`/oauth/email.svg`} alt="Email" className="w-5 h-5 ml-2" />
                        <span className="text-left flex-1">
                            <a href="/login/email" className="w-full h-full">Sign in with Email</a>
                        </span>
                    </button>
                </div>
            </div>
        </Container>
    );
};
