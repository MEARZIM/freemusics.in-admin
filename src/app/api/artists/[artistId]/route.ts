import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { decodedToken } from "@/helpers/decoder";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request, {
    params
}: {
    params: {
        artistId: string;
    }
}) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;
        const admin = decodedToken(token ? token : "");
        const { artistId } = await params;

        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!artistId) {
            return new NextResponse("Artist Id is required", { status: 400 });
        }

        const adminValidation = await prisma.admin.findUnique({
            where: { id: admin.adminId },
        });

        if (!adminValidation) {
            return NextResponse.json({ error: "Unauthorized Admin" }, { status: 401 });
        }

        const body = await req.json();
        const { name, email, password } = body;

        if (!name || typeof name !== "string") {
            return NextResponse.json({ error: "Invalid name" }, { status: 400 });
        }

        if (!email || typeof name !== "string") {
            return NextResponse.json({ error: "Invalid name" }, { status: 400 });
        }

        const isValidArtist = await prisma.artist.findUnique({
            where: { id: artistId },
        });
        
        if (!isValidArtist) {
            return NextResponse.json({ error: "Artist not found" }, { status: 404 });
        }

        const existingArtist = await prisma.artist.findUnique({
            where: {
                email
            },
        });

        if (existingArtist) {
            return NextResponse.json({ error: "Email Already exist" }, { status: 404 });
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const updatedArtist = await prisma.artist.update({
                where: { id: artistId },
                data: {
                    name,
                    email,
                    password: hashedPassword
                },
            });
            return NextResponse.json(updatedArtist, { status: 200 });
        }
        const updatedArtist = await prisma.artist.update({
            where: { id: artistId },
            data: {
                name,
                email
            },
        });

        return NextResponse.json(updatedArtist, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(req: Request, {
    params
}: {
    params: {
        artistId: string;
    }
}) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;
        const admin = decodedToken(token ? token : "");
        const { artistId } = await params;

        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!artistId) {
            return new NextResponse("Artist Id is required", { status: 400 });
        }

        const adminValidation = await prisma.admin.findUnique({
            where: { id: admin.adminId },
        });

        if (!adminValidation) {
            return NextResponse.json({ error: "Unauthorized Admin" }, { status: 401 });
        }

        const existingArtist = await prisma.artist.findUnique({
            where: { id: artistId },
        });

        if (!existingArtist) {
            return NextResponse.json({ error: "Artist not found" }, { status: 404 });
        }

        await prisma.artist.delete({
            where: { id: artistId },
        });

        return NextResponse.json({ message: "Artist deleted successfully" }, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}


export async function GET(req: Request, {
    params
}: {
    params: {
        artistId: string;
    }
}) {
    try {
        const { artistId } = await params;

        if (!artistId) {
            return new NextResponse("Artist Id is required", { status: 400 });
        }

        const artist = await prisma.artist.findUnique({
            where: { id: artistId },
            select: {
                id: true,
                name: true,
                email: true,
                bio: true,
                avatar: true,
                password: false,
                albums: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });

        if (!artist) {
            return NextResponse.json({ error: "Artist not found" }, { status: 404 });
        }

        return NextResponse.json(artist, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}