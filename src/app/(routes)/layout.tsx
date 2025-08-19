import { redirect } from "next/navigation";

import Navbar from "@/components/nav";



export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Authenticate the user

    return (
        <>
            <Navbar />
            {children}
        </>
    )
}