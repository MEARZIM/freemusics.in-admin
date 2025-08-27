import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { decodedToken } from "@/helpers/decoder";

export async function POST(req: Request) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;
        const admin = decodedToken(token ? token : "");

        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const adminValidation = await prisma.admin.findUnique({
            where: { id: admin.adminId, },
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
            return NextResponse.json({ error: "Invalid Email" }, { status: 400 });
        }

        const existingArtist = await prisma.artist.findUnique({
            where: { email },
        });

        if (existingArtist) {
            return NextResponse.json({ error: "Artist already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const artist = await prisma.artist.create({
            data: {
                name,
                email,
                password: hashedPassword
            },
        });

        return NextResponse.json(artist, { status: 201 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {

        const artists = await prisma.artist.findMany({
            orderBy: { name: "asc" },
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
                    },
                },
            },
        });



        return NextResponse.json(artists, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}