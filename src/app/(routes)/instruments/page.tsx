import React from 'react'
import { format } from 'date-fns';

import { prisma } from '@/lib/prisma'
import { InstrumentsClient } from './components/client'
import { InstrumentsColumn } from './components/columns'

const InstrumentsPage = async () => {

    const instrument = await prisma.instrument.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedInstrument : InstrumentsColumn[]  = instrument.map((item) => ({
        id: item.id,
        name: item.name,
        createdAt: format(item.createdAt, "MMMM do yyyy") 
    }))

    return (
        <>
            <section className='flex-col'>
                <div className='flex-1 space-y-4 p-8 pt-6'>
                    <InstrumentsClient data={formattedInstrument}/>
                </div>
            </section>
        </>
    )
}

export default InstrumentsPage