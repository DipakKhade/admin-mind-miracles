import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.toLowerCase() ?? "";

    const users = await getCollection("mindmiracles", "User");
    const data = await users.find().sort({ name: 1 }).toArray();

    const mapped = data.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name ?? doc.displayName ?? "",
      email: doc.email ?? "",
    }));

    const filtered = search
      ? mapped.filter(
          (u) =>
            u.name.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search)
        )
      : mapped;

    return NextResponse.json(filtered.slice(0, 50));
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
