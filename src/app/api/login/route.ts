import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getCollection } from "@/lib/mongodb";

const secret = new TextEncoder().encode(process.env.JWT_SEC || "mind1234");

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const admins = await getCollection("mindmiracles", "adminMaster");
    const admin = await admins.findOne({ username });

    if (!admin || admin.password !== password) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const token = await new SignJWT({ username })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secret);

    const response = NextResponse.json({ success: true });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
