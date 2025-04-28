import { signOut } from "@/lib/auth";

export default function DropdownLogoutButton() {
    return (
        <form action={async () => {
            "use server"
            await signOut({ redirectTo: "/" })
        }}>
            <button type="submit" className="block w-full text-center px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">Logout</button>
        </form>
    );
}