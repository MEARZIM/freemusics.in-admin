"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import { Album } from "@prisma/client"

export type ArtistsColumn
    = {
        id: string
        name: string
        bio: string | null
        albums: Album[]
        createdAt: string
    }

export const columns: ColumnDef<ArtistsColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "bio",
        header: "Bio",
    },
    {
        accessorKey: "albums",
        header: "Albums",
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]