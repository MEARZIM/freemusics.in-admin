import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { decodedToken } from "@/helpers/decoder";
import { cookies } from "next/headers";

export async function PATCH(req: Request, {
    params
}: {
    params: {
        vocalId: string;
    }
}) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;
        const admin = decodedToken(token ? token : "");
        const { vocalId } = await params;

        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!vocalId) {
            return new NextResponse("Vocal Id is required", { status: 400 });
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

        const existingVocal = await prisma.vocal.findUnique({
            where: { id: vocalId },
        });

        if (!existingVocal) {
            return NextResponse.json({ error: "Vocal not found" }, { status: 404 });
        }

        const updatedVocal = await prisma.vocal.update({
            where: { id: vocalId },
            data: { name },
        });

        return NextResponse.json(updatedVocal, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(req: Request, {
    params
}: {
    params: {
        vocalId: string;
    }
}) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;
        const admin = decodedToken(token ? token : "");
        const { vocalId } = await params;

        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!vocalId) {
            return new NextResponse("Vocal Id is required", { status: 400 });
        }

        const adminValidation = await prisma.admin.findUnique({
            where: { id: admin.adminId },
        });

        if (!adminValidation) {
            return NextResponse.json({ error: "Unauthorized Admin" }, { status: 401 });
        }

        const existingVocal = await prisma.vocal.findUnique({
            where: { id: vocalId },
        });

        if (!existingVocal) {
            return NextResponse.json({ error: "Vocal not found" }, { status: 404 });
        }

        await prisma.vocal.delete({
            where: { id: vocalId },
        });

        return NextResponse.json({ message: "Vocal deleted successfully" }, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}


export async function GET(req: Request, {
    params
}: {
    params: {
        vocalId: string;
    }
}) {
    try {
        const { vocalId } = await params;

        if (!vocalId) {
            return new NextResponse("Vocal Id is required", { status: 400 });
        }

        const vocal = await prisma.vocal.findUnique({
            where: { id: vocalId },
        });

        if (!vocal) {
            return NextResponse.json({ error: "Vocal not found" }, { status: 404 });
        }

        return NextResponse.json(vocal, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}