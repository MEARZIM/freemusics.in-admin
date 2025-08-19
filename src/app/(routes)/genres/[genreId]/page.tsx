import React from 'react'
import { prisma } from '@/lib/prisma';

import { GenreForm } from './components/genre-form';

const DynamicGenrePage = async ({
    params
}: {
    params: {
        genreId: string;
    }
}) => {
    
    const { genreId } = await params;

    const genre = await prisma.genre.findUnique ({
        where: {
            id: genreId as string
        }
    });

    console.log("Genre:", genre);

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8'>
                <GenreForm initialData={genre }/>
            </div>
        </div>
    )
}

export default DynamicGenrePage