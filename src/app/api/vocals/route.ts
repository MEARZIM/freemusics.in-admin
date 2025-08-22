import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
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
        const { name } = body;

        if (!name || typeof name !== "string") {
            return NextResponse.json({ error: "Invalid name" }, { status: 400 });
        }

        const existingVocal = await prisma.vocal.findUnique({
            where: { name },
        });

        if (existingVocal) {
            return NextResponse.json({ error: "Vocal already exists" }, { status: 400 });
        }

        const vocal = await prisma.vocal.create({
            data: { name },
        });

        return NextResponse.json(vocal, { status: 201 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {

        const vocals = await prisma.vocal.findMany({
            orderBy: { name: 'asc' },
        });

        return NextResponse.json(vocals, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}