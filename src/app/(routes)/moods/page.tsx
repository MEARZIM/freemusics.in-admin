import React from 'react'
import { format } from 'date-fns';

import { prisma } from '@/lib/prisma'
import { MoodsClient } from './components/client'
import { MoodsColumn } from './components/columns'

const MoodsPage = async () => {

    const mood = await prisma.mood.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedMoods : MoodsColumn[]  = mood.map((item) => ({
        id: item.id,
        name: item.name,
        createdAt: format(item.createdAt, "MMMM do yyyy") 
    }))

    return (
        <>
            <section className='flex-col'>
                <div className='flex-1 space-y-4 p-8 pt-6'>
                    <MoodsClient data={formattedMoods}/>
                </div>
            </section>
        </>
    )
}

export default MoodsPage