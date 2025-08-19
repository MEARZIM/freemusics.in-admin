import React from 'react'
import { redirect } from 'next/navigation'

import MainNav from '@/components/main-nav'


const Navbar = async () => {
    // User authentication check
    return (
        <div className='border-b '>
            <div className='flex h-16 items-center px-4 gap-4'>
                <MainNav />
                <div className='ml-auto flex items-center space-x-4' >
                    {/* Add user profile or other components here */}
                    Profile
                </div>
            </div>
        </div>
    )
}

export default Navbar