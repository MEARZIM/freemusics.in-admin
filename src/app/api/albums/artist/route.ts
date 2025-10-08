import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { decodedToken } from "@/helpers/decoder";


export async function GET(req: Request) {
    try {

        const cookieStore = await cookies();
        // console.log(cookieStore);
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return new NextResponse("Unauthorized - No Token Found", { status: 401 });
        }

        const decoded = decodedToken(token) as { artistId: string };
        const artistId = decoded.artistId;

        const albums = await prisma.album.findMany({
            orderBy: { name: 'asc' },
            where: { artistId }
        });

        return NextResponse.json(albums, { status: 200 });

    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
