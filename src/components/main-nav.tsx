"use client"

import { cn } from "@/lib/utils"
import Link from "next/link";
import { useParams, usePathname } from "next/navigation"

const MainNav = ({
    className,
    ...props
}: React.HtmlHTMLAttributes<HTMLElement>) => {

    const pathName = usePathname();

    const routes = [
        {
            href: `/`,
            label: 'Overview',
            active: pathName === `/`
        },
        {
            href: `/artists`,
            label: 'Artists',
            active: pathName === `/artists`
        },
        {
            href: `/moods`,
            label: 'Moods',
            active: pathName === `/moods`
        },
        {
            href: `/videoThemes`,
            label: 'Video Themes',
            active: pathName === `/videoThemes`
        },
        {
            href: `/instruments`,
            label: 'Instruments',
            active: pathName === `/instruments`
        },
        {
            href: `/genres`,
            label: 'Genres',
            active: pathName === `/genres`
        },
        {
            href: `/vocals`,
            label: 'Vocals',
            active: pathName === `/vocals`
        },
        {
            href: `/settings`,
            label: 'Settings',
            active: pathName === `/settings`
        }
    ];

    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn("text-sm font-semibold transition-colors hover:text-primary",
                        route.active ? "text-black dark:text-white" : "text-muted-foreground"
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    )
}

export default MainNav