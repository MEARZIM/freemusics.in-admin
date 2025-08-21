'use client'

import React, { useEffect, useState } from 'react'

import AuthForm from '@/components/form/AuthForm'
import { UserLock } from 'lucide-react';

const SignInPage = () => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true)
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">

                    <h2 className="mt-10 text-center flex items-center justify-center gap-2 text-2xl/9 font-bold tracking-tight text-black">Sign in to your account {`(Admin)`} <UserLock color='red' /></h2>
                    <AuthForm pageName={'Sign In'} />
                </div>
            </div>
        </>
    )
}

export default SignInPage
