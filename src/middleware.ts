import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import * as jose from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SEC!)

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value

  console.log("middleware triggered:", req.nextUrl.pathname)

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try {
    const data = await jose.jwtVerify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    })

    if(data.payload) {
      return NextResponse.next() 
    } else {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
  matcher: ["/home/:path*", "/login"], 
}
