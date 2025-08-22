import React from 'react'
import { format } from 'date-fns';

import { prisma } from '@/lib/prisma'
import { ArtistsClient } from './components/client'
import { ArtistsColumn } from './components/columns'

const ArtistsPage = async () => {

    const artist = await prisma.artist.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            albums: true
        }
    })

    const formattedArtists : ArtistsColumn[]  = artist.map((item) => ({
        id: item.id,
        name: item.name,
        bio: item.bio,
        albums: item.albums,
        createdAt: format(item.createdAt, "MMMM do yyyy") 
    }))

    return (
        <>
            <section className='flex-col'>
                <div className='flex-1 space-y-4 p-8 pt-6'>
                    <ArtistsClient data={formattedArtists}/>
                </div>
            </section>
        </>
    )
}

export default ArtistsPage