import React from 'react'
import { format } from 'date-fns';

import { prisma } from '@/lib/prisma'
import { VideoThemesClient } from './components/client'
import { VideoThemesColumn } from './components/columns'

const VideoThemesPage = async () => {

    const videoTheme = await prisma.videoTheme.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedVideoThemes : VideoThemesColumn[]  = videoTheme.map((item) => ({
        id: item.id,
        name: item.name,
        createdAt: format(item.createdAt, "MMMM do yyyy") 
    }))

    return (
        <>
            <section className='flex-col'>
                <div className='flex-1 space-y-4 p-8 pt-6'>
                    <VideoThemesClient data={formattedVideoThemes}/>
                </div>
            </section>
        </>
    )
}

export default VideoThemesPage