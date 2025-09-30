"use client"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import Heading from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TracksColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"
import { useEffect, useState } from "react"

interface TrackClientProps {
    data: TracksColumn[]
}

export const TracksClient = ({
    data
}: TrackClientProps) => {
    const parmas = useParams();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Tracks (${data.length})`}
                    description="Manage Tracks for your store"
                />
                
            </div>

            <Separator />
            <DataTable columns={columns} data={data} searchKey="name" />


            <Heading
                title={"API"}
                description={"API calls for Track."}
            />
            <Separator />
            <ApiList entityName="tracks" entityIdName="trackId" />
        </>
    )
}