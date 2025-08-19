import React from 'react'
import { prisma } from '@/lib/prisma';

import { InstrumentForm } from './components/instruments-form';

const DynamicinstrumentPage = async ({
    params
}: {
    params: {
        instrumentId: string;
    }
}) => {
    
    const { instrumentId } = await params;

    const instrument = await prisma.instrument.findUnique ({
        where: {
            id: instrumentId as string
        }
    });


    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8'>
                <InstrumentForm initialData={instrument}/>
            </div>
        </div>
    )
}

export default DynamicinstrumentPage