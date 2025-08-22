import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { decodedToken } from "@/helpers/decoder";
import { cookies } from "next/headers";

export async function PATCH(req: Request, {
    params
}: {
    params: {
        videoThemeId: string;
    }
}) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;
        const admin = decodedToken(token ? token : "");
        const { videoThemeId } = await params;

        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!videoThemeId) {
            return new NextResponse("VideoTheme Id is required", { status: 400 });
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

        const existingVideoTheme = await prisma.videoTheme.findUnique({
            where: { id: videoThemeId },
        });

        if (!existingVideoTheme) {
            return NextResponse.json({ error: "VideoTheme not found" }, { status: 404 });
        }

        const updatedVideoTheme = await prisma.videoTheme.update({
            where: { id: videoThemeId },
            data: { name },
        });

        return NextResponse.json(updatedVideoTheme, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(req: Request, {
    params
}: {
    params: {
        videoThemeId: string;
    }
}) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;
        const admin = decodedToken(token ? token : "");
        const { videoThemeId } = await params;

        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!videoThemeId) {
            return new NextResponse("VideoTheme Id is required", { status: 400 });
        }

        const adminValidation = await prisma.admin.findUnique({
            where: { id: admin.adminId },
        });

        if (!adminValidation) {
            return NextResponse.json({ error: "Unauthorized Admin" }, { status: 401 });
        }

        const existingVideoTheme = await prisma.videoTheme.findUnique({
            where: { id: videoThemeId },
        });

        if (!existingVideoTheme) {
            return NextResponse.json({ error: "VideoTheme not found" }, { status: 404 });
        }

        await prisma.videoTheme.delete({
            where: { id: videoThemeId },
        });

        return NextResponse.json({ message: "VideoTheme deleted successfully" }, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}


export async function GET(req: Request, {
    params
}: {
    params: {
        videoThemeId: string;
    }
}) {
    try {
        const { videoThemeId } = await params;

        if (!videoThemeId) {
            return new NextResponse("VideoTheme Id is required", { status: 400 });
        }

        const videoTheme = await prisma.videoTheme.findUnique({
            where: { id: videoThemeId },
        });

        if (!videoTheme) {
            return NextResponse.json({ error: "VideoTheme not found" }, { status: 404 });
        }

        return NextResponse.json(videoTheme, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}