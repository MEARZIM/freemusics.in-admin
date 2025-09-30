import React from 'react'
import { prisma } from '@/lib/prisma'

import { TracksClient } from './components/client'
import { TracksColumn } from './components/columns';

const TrackPage = async () => {


  const tracks = await prisma.track.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedTrack: TracksColumn[] = tracks.map((item) => ({
    id: item.id,
    name: item.name,
    preview: item.url,
    thumbnail: item.thumbnail ?? '',
    duration: item.duration,
    bpm: item.bpm ?? 0,
    url: item.url,
  }))


  return (
    <section className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <TracksClient data={formattedTrack} />
      </div>
    </section>
  )
}

export default TrackPage
