"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type ArtistsColumn
    = {
        id: string
        name: string
        bio: string
        albums: string[]
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