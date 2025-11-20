import { getPayments } from "@/db/db-queries"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const sortBy = searchParams.get("sortBy") || "_id"
    const sortOrder = Number.parseInt(searchParams.get("sortOrder") || "1")

    const data = await getPayments(page, limit, search, sortBy, sortOrder)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}
