import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { decodedToken } from "@/helpers/decoder";
import { cookies } from "next/headers";

export async function PATCH(req: Request, {
    params
}: {
    params: {
        genreId: string;
    }
}) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;
        const admin = decodedToken(token ? token : "");
        const { genreId } = await params;

        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!genreId) {
            return new NextResponse("Genre Id is required", { status: 400 });
        }

        const adminValidation = await prisma.admin.findUnique({
            where: { id: admin.adminId },
        });

        if (!adminValidation) {
            return NextResponse.json({ error: "Unauthorized Admin" }, { status: 401 });
        }

        const body = await req.json();
        const { name } = body;

        if (!name || typeof name !== "string") {
            return NextResponse.json({ error: "Invalid name" }, { status: 400 });
        }

        const existingGenre = await prisma.genre.findUnique({
            where: { id: genreId },
        });

        if (!existingGenre) {
            return NextResponse.json({ error: "Genre not found" }, { status: 404 });
        }

        const updatedGenre = await prisma.genre.update({
            where: { id: genreId },
            data: { name },
        });

        return NextResponse.json(updatedGenre, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(req: Request, {
    params
}: {
    params: {
        genreId: string;
    }
}) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;
        const admin = decodedToken(token ? token : "");
        const { genreId } = await params;

        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!genreId) {
            return new NextResponse("Genre Id is required", { status: 400 });
        }

        const adminValidation = await prisma.admin.findUnique({
            where: { id: admin.adminId },
        });

        if (!adminValidation) {
            return NextResponse.json({ error: "Unauthorized Admin" }, { status: 401 });
        }

        const existingGenre = await prisma.genre.findUnique({
            where: { id: genreId },
        });

        if (!existingGenre) {
            return NextResponse.json({ error: "Genre not found" }, { status: 404 });
        }

        await prisma.genre.delete({
            where: { id: genreId },
        });

        return NextResponse.json({ message: "Genre deleted successfully" }, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}


export async function GET(req: Request, {
    params
}: {
    params: {
        genreId: string;
    }
}) {
    try {
        const { genreId } = await params;

        if (!genreId) {
            return new NextResponse("Genre Id is required", { status: 400 });
        }

        const genre = await prisma.genre.findUnique({
            where: { id: genreId },
        });

        if (!genre) {
            return NextResponse.json({ error: "Genre not found" }, { status: 404 });
        }

        return NextResponse.json(genre, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}