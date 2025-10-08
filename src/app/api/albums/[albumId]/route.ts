import { decodedToken } from "@/helpers/decoder";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: { albumId: string } }
) {
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
        const { name,
            cover,
            mainImageUrl,
            coverImageUrl,
        } = body;


        if (!name || !mainImageUrl || !coverImageUrl || !cover) {
            return new NextResponse("All fields are required.", { status: 400 });
        }



        if (!params.albumId) {
            return new NextResponse("Album Id is required", { status: 400 });
        }


        const album = await prisma.album.updateMany({
            where: {
                id: params.albumId,
            },
            data: {
                name,
                cover,
                mainImageUrl,
                coverImageUrl,
            }
        })

        return NextResponse.json(album, { status: 200 });

    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { albumId: string } }
) {
    try {
        if (!params.albumId) {
            return new NextResponse("Album Id is required", { status: 400 });
        }
        const album = await prisma.album.findUnique({
            where: {
                id: params.albumId,
            },
            include: {
                tracks: true,
                artist: true,
            }
        })
        return NextResponse.json(album, { status: 200 });

    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { albumId: string } }
) {
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

        if (!params.albumId) {
            return new NextResponse("Album Id is required", { status: 400 });
        }


        //s Find the Track IDs that are associated *only* with this album.

        const albumTrackAlbums = await prisma.trackAlbum.findMany({
            where: { albumId: params.albumId },
            select: { trackId: true }
        });

        const trackIds = albumTrackAlbums.map(ta => ta.trackId);


        const tracksToDelete: string[] = [];

        for (const trackId of trackIds) {

            const trackAlbumCount = await prisma.trackAlbum.count({
                where: { trackId: trackId }
            });


            if (trackAlbumCount === 1) {
                tracksToDelete.push(trackId);
            }
        }


        await prisma.trackAlbum.deleteMany({
            where: { albumId: params.albumId },
        });


        if (tracksToDelete.length > 0) {
            await prisma.track.deleteMany({
                where: {
                    id: {
                        in: tracksToDelete
                    }
                }
            });
        }


        const album = await prisma.album.deleteMany({
            where: {
                id: params.albumId,
                artistId: decodedArtistId
            }
        });


        if (album.count === 0) {
            return new NextResponse("Album not found or you are not the owner", { status: 404 });
        }

        return NextResponse.json(album, { status: 200 });

    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}