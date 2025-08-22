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

        if (action === "signup") {
            if (!email || !password) {
                return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
            }
            const admin = await registerAdmin(email, password);
            return NextResponse.json({ success: true, admin });
        }

        if (action === "signin") {
            if (!email || !password) {
                return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
            }
            const { token, admin } = await loginAdmin(email, password);

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



async function registerAdmin(email: string, password: string) {
    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) throw new Error("Admin already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({
        data: { email, password: hashedPassword },
    });

    return { id: admin.id, email: admin.email };
}

async function loginAdmin(email: string, password: string) {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign({ adminId: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: "7d" });
    return { token, admin: { id: admin.id, email: admin.email } };
}