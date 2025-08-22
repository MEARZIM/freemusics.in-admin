import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { decodedToken } from "@/helpers/decoder";
import { cookies } from "next/headers";

export async function PATCH(req: Request, {
    params
}: {
    params: {
        instrumentId: string;
    }
}) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;
        const admin = decodedToken(token ? token : "");
        const { instrumentId } = await params;

        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!instrumentId) {
            return new NextResponse("Instrument Id is required", { status: 400 });
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

        const existingInstrument = await prisma.instrument.findUnique({
            where: { id: instrumentId },
        });

        if (!existingInstrument) {
            return NextResponse.json({ error: "Instrument not found" }, { status: 404 });
        }

        const updatedInstrument = await prisma.instrument.update({
            where: { id: instrumentId },
            data: { name },
        });

        return NextResponse.json(updatedInstrument, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(req: Request, {
    params
}: {
    params: {
        instrumentId: string;
    }
}) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;
        const admin = decodedToken(token ? token : "");
        const { instrumentId } = await params;

        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!instrumentId) {
            return new NextResponse("Instrument Id is required", { status: 400 });
        }

        const adminValidation = await prisma.admin.findUnique({
            where: { id: admin.adminId },
        });

        if (!adminValidation) {
            return NextResponse.json({ error: "Unauthorized Admin" }, { status: 401 });
        }

        const existingInstrument = await prisma.instrument.findUnique({
            where: { id: instrumentId },
        });

        if (!existingInstrument) {
            return NextResponse.json({ error: "Instrument not found" }, { status: 404 });
        }

        await prisma.instrument.delete({
            where: { id: instrumentId },
        });

        return NextResponse.json({ message: "Instrument deleted successfully" }, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}


export async function GET(req: Request, {
    params
}: {
    params: {
        instrumentId: string;
    }
}) {
    try {
        const { instrumentId } = await params;

        if (!instrumentId) {
            return new NextResponse("Instrument Id is required", { status: 400 });
        }

        const instrument = await prisma.instrument.findUnique({
            where: { id: instrumentId },
        });

        if (!instrument) {
            return NextResponse.json({ error: "Instrument not found" }, { status: 404 });
        }

        return NextResponse.json(instrument, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}