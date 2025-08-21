import React from 'react'
import { format } from 'date-fns';

import { prisma } from '@/lib/prisma'
import { VocalsClient } from './components/client'
import { VocalsColumn } from './components/columns'

const VocalsPage = async () => {

    const genre = await prisma.genre.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedVocals : VocalsColumn[]  = genre.map((item) => ({
        id: item.id,
        name: item.name,
        createdAt: format(item.createdAt, "MMMM do yyyy") 
    }))

    return (
        <>
            <section className='flex-col'>
                <div className='flex-1 space-y-4 p-8 pt-6'>
                    <VocalsClient data={formattedVocals}/>
                </div>
            </section>
        </>
    )
}

export default VocalsPage