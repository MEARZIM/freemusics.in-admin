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

        const existingInstrument = await prisma.instrument.findUnique({
            where: { name },
        });

        if (existingInstrument) {
            return NextResponse.json({ error: "Instrument already exists" }, { status: 400 });
        }

        const instrument = await prisma.instrument.create({
            data: { name },
        });

        return NextResponse.json(instrument, { status: 201 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {

        const instruments = await prisma.instrument.findMany({
            orderBy: { name: 'asc' },
        });

        return NextResponse.json(instruments, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}