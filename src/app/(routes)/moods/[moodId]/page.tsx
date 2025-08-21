import React from 'react'
import { prisma } from '@/lib/prisma';

import { MoodForm } from './components/mood-form';

const DynamicMoodPage = async ({
    params
}: {
    params: {
        moodId: string;
    }
}) => {
    
    const { moodId } = await params;

    const mood = await prisma.mood.findUnique ({
        where: {
            id: moodId as string
        }
    });

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8'>
                <MoodForm initialData={mood}/>
            </div>
        </div>
    )
}

export default DynamicMoodPage