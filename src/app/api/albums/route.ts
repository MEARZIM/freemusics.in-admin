import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";


export async function GET(req: Request) {
    try {

        const albums = await prisma.album.findMany({
            orderBy: { name: 'asc' },
        });

        return NextResponse.json(albums, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}