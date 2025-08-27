import React from 'react'
import { prisma } from '@/lib/prisma';

import { ArtistsForm } from './components/artist-form';

const DynamicArtistsPage = async ({
    params
}: {
    params: {
        artistId: string;
    }
}) => {

    const { artistId } = await params;

    const artist = await prisma.artist.findUnique({
        where: {
            id: artistId as string
        },
        select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            avatar: true,
            password: false,
            albums: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    });

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8'>
                <ArtistsForm initialData={artist} />
            </div>
        </div>
    )
}

export default DynamicArtistsPage