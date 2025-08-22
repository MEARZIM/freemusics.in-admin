import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { decodedToken } from "@/helpers/decoder";
import { cookies } from "next/headers";

export async function PATCH(req: Request, {
    params
}: {
    params: {
        moodId: string;
    }
}) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;
        const admin = decodedToken(token ? token : "");
        const { moodId } = await params;

        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!moodId) {
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

        const existingGenre = await prisma.mood.findUnique({
            where: { id: moodId },
        });

        if (!existingGenre) {
            return NextResponse.json({ error: "Genre not found" }, { status: 404 });
        }

        const updatedGenre = await prisma.mood.update({
            where: { id: moodId },
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
        moodId: string;
    }
}) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;
        const admin = decodedToken(token ? token : "");
        const { moodId } = await params;

        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!moodId) {
            return new NextResponse("Genre Id is required", { status: 400 });
        }

        const adminValidation = await prisma.admin.findUnique({
            where: { id: admin.adminId },
        });

        if (!adminValidation) {
            return NextResponse.json({ error: "Unauthorized Admin" }, { status: 401 });
        }

        const existingGenre = await prisma.mood.findUnique({
            where: { id: moodId },
        });

        if (!existingGenre) {
            return NextResponse.json({ error: "Genre not found" }, { status: 404 });
        }

        await prisma.mood.delete({
            where: { id: moodId },
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
        moodId: string;
    }
}) {
    try {
        const { moodId } = await params;

        if (!moodId) {
            return new NextResponse("Genre Id is required", { status: 400 });
        }

        const mood = await prisma.mood.findUnique({
            where: { id: moodId },
        });

        if (!mood) {
            return NextResponse.json({ error: "Genre not found" }, { status: 404 });
        }

        return NextResponse.json(mood, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}