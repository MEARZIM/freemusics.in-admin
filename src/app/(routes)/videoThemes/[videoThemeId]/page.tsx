import React from 'react'
import { prisma } from '@/lib/prisma';

import { VideoThemeForm } from './components/videoTheme-form';

const DynamicVideoThemePage = async ({
    params
}: {
    params: {
        videoThemeId: string;
    }
}) => {
    
    const { videoThemeId } = await params;

    const videoTheme = await prisma.videoTheme.findUnique ({
        where: {
            id: videoThemeId as string
        }
    });

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8'>
                <VideoThemeForm initialData={videoTheme}/>
            </div>
        </div>
    )
}

export default DynamicVideoThemePage