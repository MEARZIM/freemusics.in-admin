'use client'

import { auth } from '@/lib/authClient';
import React from 'react'
import { Button } from './button';

const SignOutButton = () => {
    const handleSignOut = async () => {
        const res = await auth.signOut();
        if (res.success) {
            window.location.reload();
        }
    }
    return (
        <>
            <Button
                onClick={handleSignOut}
                variant={"link"}
                className="p-0 hover:cursor-pointer"
            >
                Sign Out
            </Button>
        </>
    )
}

export default SignOutButton
