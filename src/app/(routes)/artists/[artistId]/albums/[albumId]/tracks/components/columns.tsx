"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type TracksColumn
    = {
        id: string
        name: string
        thumbnail: string
        duration: string
        url: string
        bpm: number
        preview: string
    }

export const columns: ColumnDef<TracksColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "thumbnail",
        header: "Thumbnail",
    },
    {
        accessorKey: "duration",
        header: "Duration",
    },
    {
        accessorKey: "url",
        header: "Preview",
    },
    {
        accessorKey: "bpm",
        header: "Bpm",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]