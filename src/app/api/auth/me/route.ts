import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { adminId: string };
    return NextResponse.json({ success: true, id: decoded.adminId });
  } catch (err: any) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}

