import { auth } from "@/lib/auth";
import NavDropdownButton from "@/components/Navbar/NavDropdownButton";
import NavbarLayout from "./NavbarLayout";

export default async function Navbar() {
    const session = await auth();
    
    return (
        <NavbarLayout session={session} />
    );
}