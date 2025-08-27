import React from 'react'
import { format } from 'date-fns';

import { prisma } from '@/lib/prisma'
import { AlbumClient } from './components/client'
import { AlbumColumn } from './components/columns'

const AlbumPage = async ({
    params
}: {
    params: {
        artistId: string;
    }
}) => {

    const { artistId } = await params;

    const album = await prisma.album.findMany({
        where:{
            artistId: artistId
        },
        orderBy: {
            createdAt: 'desc'
        },
    })

    const formattedAlbum: AlbumColumn[] = album.map((item) => ({
        id: item.id,
        name: item.name,
        cover: item.cover,
        createdAt: format(item.createdAt, "MMMM do yyyy")
    }))

    return (
        <>
            <section className='flex-col'>
                <div className='flex-1 space-y-4 p-8 pt-6'>
                    <AlbumClient data={formattedAlbum} />
                </div>
            </section>
        </>
    )
}

export default AlbumPage