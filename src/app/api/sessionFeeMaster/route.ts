import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("sessionId");

    const fees = await getCollection("mindmiracles", "sessionFeeMaster");
    const filter: Record<string, unknown> = {};
    if (sessionId) filter.sessionId = sessionId;

    const data = await fees.find(filter).toArray();
    const mapped = data.map((doc) => ({
      id: doc._id.toString(),
      sessionId: doc.sessionId ?? "",
      clientId: doc.clientId ?? "",
      clientName: doc.clientName ?? "",
      feeType: doc.feeType ?? "one_time",
      totalFee: doc.totalFee ?? 0,
      installmentsCount: doc.installmentsCount ?? 0,
      createdAt: doc.createdAt ?? "",
    }));
    return NextResponse.json(mapped);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch fees" },
      { status: 500 }
    );
  }
}
