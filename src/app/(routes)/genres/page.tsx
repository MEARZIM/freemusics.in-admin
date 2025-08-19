import React from 'react'
import { format } from 'date-fns';

import { prisma } from '@/lib/prisma'
import { GenresClient } from './components/client'
import { GenresColumn } from './components/columns'

const GenersPage = async () => {

    const genre = await prisma.genre.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedGenre : GenresColumn[]  = genre.map((item) => ({
        id: item.id,
        name: item.name,
        createdAt: format(item.createdAt, "MMMM do yyyy") 
    }))

    return (
        <>
            <section className='flex-col'>
                <div className='flex-1 space-y-4 p-8 pt-6'>
                    <GenresClient data={formattedGenre}/>
                </div>
            </section>
        </>
    )
}

export default GenersPage