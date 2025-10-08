import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { decodedToken } from "@/helpers/decoder";

export async function POST(req: Request) {
    try {

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return new NextResponse("Unauthorized - No Token Found", { status: 401 });
        }

        const decoded = decodedToken(token) as { artistId: string };
        const decodedArtistId = decoded.artistId;

        const verifyArtist = await prisma.artist.findUnique({
            where: { id: decodedArtistId }
        });

        if (!verifyArtist) {
            return new NextResponse("Unauthorized - Invalid Artist", { status: 401 });
        }

        const body = await req.json();
        const {
            name,
            cover,
            mainImageUrl,
            coverImageUrl,
        } = body;

        if (!name) {
            return new NextResponse("Bad Request - Missing Fields", { status: 400 });
        }

        const existingAlbum = await prisma.album.findFirst({
            where: { name }
        });

        if (existingAlbum) {
            return new NextResponse("Conflict - Album Already Exists", { status: 409 });
        }

        const newAlbum = await prisma.album.create({
            data: {
                name,
                cover,
                mainImageUrl,
                coverImageUrl,
                artistId: decodedArtistId
            }
        });

        return NextResponse.json(newAlbum, { status: 201 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
