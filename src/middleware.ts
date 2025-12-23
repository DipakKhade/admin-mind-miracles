import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import * as jose from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SEC!)

const PUBLIC_ROUTES = ["/login", "/register"]

export async function middleware(req: NextRequest) {
  debugger
  const { pathname } = req.nextUrl
  const token = req.cookies.get("token")?.value

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  // Redirect root based on auth
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(token ? "/home" : "/login", req.url)
    )
  }

  //  No token → login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    })

    //  Invalid token payload
    if (!payload?.username) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Forward user info to Apollo / backend
    const headers = new Headers(req.headers)
    headers.set("x-user-id", String(payload.userId))
    headers.set("x-user-role", String(payload.role ?? "user"))

    return NextResponse.next({
      request: { headers },
    })

  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
  matcher: [
    "/",
    "/home/:path*",
    "/api/graphql", 
  ],
}
