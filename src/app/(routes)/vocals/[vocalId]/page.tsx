import React from 'react'
import { prisma } from '@/lib/prisma';

import { VocalForm } from './components/vocal-form';

const DynamicVocalPage = async ({
    params
}: {
    params: {
        vocalId: string;
    }
}) => {
    
    const { vocalId } = await params;

    const vocal = await prisma.vocal.findUnique ({
        where: {
            id: vocalId as string
        }
    });

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8'>
                <VocalForm initialData={vocal}/>
            </div>
        </div>
    )
}

export default DynamicVocalPage