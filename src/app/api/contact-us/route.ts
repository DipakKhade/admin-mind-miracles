import { getContactMessages } from "@/db/db-queries"
import { SortDirection } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const sortBy = searchParams.get("sortBy") || "_id"
    const sortOrder = searchParams.get("sortOrder") as SortDirection || "ascending"

    const data = await getContactMessages(page, limit, search, sortBy, sortOrder)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch contact messages" }, { status: 500 })
  }
}
