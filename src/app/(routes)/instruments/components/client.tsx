"use client"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import Heading from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { InstrumentsColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"
import { useEffect, useState } from "react"

interface instrumentsClientProps {
    data: InstrumentsColumn[]
}

export const InstrumentsClient = ({
    data
}: instrumentsClientProps) => {
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
                    title={`Instruments (${data.length})`}
                    description="Manage instruments for your store"
                />
                <Button className="hover:cursor-pointer" onClick={() => router.push(`/instruments/672aef4e799bcb3920aacd1d`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                </Button>
            </div>

            <Separator />
            <DataTable columns={columns} data={data} searchKey="name" />


            <Heading
                title={"API"}
                description={"API calls for instruments."}
            />
            <Separator />
            <ApiList entityName="instruments" entityIdName="instrumentsId" />
        </>
    )
}