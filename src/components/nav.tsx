import React from 'react'
import { cookies } from 'next/headers'

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import MainNav from '@/components/main-nav'
import { auth, AuthResponse } from '@/lib/authClient'
import SignOutButton from './ui/signout-button'


const Navbar = async () => {
    const token = (await cookies()).get("token")?.value;
    const admin = token ? await auth.getUser(token) as AuthResponse : null;





    return (
        <div className='border-b '>
            <div className='flex h-16 items-center px-4 gap-4'>
                <MainNav />
                <div className='ml-auto flex items-center space-x-4' >
                    {admin && admin?.success && <>
                        <div className='hover:courser-pointer'>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="rounded-lg ">
                                        <AvatarImage
                                            src="https://github.com/evilrabbit.png"
                                            alt="@evilrabbit"
                                        />
                                        <AvatarFallback>{admin.admin?.id.slice(0, 2)}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="start">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            Profile
                                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Settings
                                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Keyboard shortcuts
                                            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>GitHub</DropdownMenuItem>
                                    <DropdownMenuItem>Support</DropdownMenuItem>
                                    <DropdownMenuItem disabled>API</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <SignOutButton />
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </div>
                    </>}
                </div>
            </div>
        </div>
    )
}

export default Navbar