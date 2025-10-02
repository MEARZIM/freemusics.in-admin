import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma"; 

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req: NextRequest, {
    params
}: {
    params: { action: string };
}) {
    try {
        const { action } = await params;
        const { email, password } = await req.json();

        // if (action === "signup") {
        //     if (!email || !password) {
        //         return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        //     }
        //     const artist = await registerArtist(email, password);
        //     return NextResponse.json({ success: true, artist });
        // }

        if (action === "signin") {
            if (!email || !password) {
                return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
            }
            const { token, artist } = await loginArtist(email, password);

            const response = NextResponse.json({ success: true });


            response.cookies.set("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });


            return response;
        }

        if (action === "signout") {
            const response = NextResponse.json({ success: true });
            response.cookies.set("token", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
            });
            return response;

        }

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}



// async function registerArtist(email: string, password: string) {
//     const existingArtist = await prisma.artist.findUnique({ where: { email } });
//     if (existingArtist) throw new Error("Artist already exists");

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const artist = await prisma.artist.create({
//         data: { email, password: hashedPassword },
//     });

//     return { id: artist.id, email: artist.email };
// }

async function loginArtist(email: string, password: string) {
    const artist = await prisma.artist.findUnique({ where: { email } });
    if (!artist) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, artist.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign({ artistId: artist.id, email: artist.email }, JWT_SECRET, { expiresIn: "7d" });
    return { token, artist: { id: artist.id, email: artist.email } };
}