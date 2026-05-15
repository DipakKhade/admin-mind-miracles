import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const clientId = url.searchParams.get("clientId");

    const sessions = await getCollection("mindmiracles", "sessionMaster");
    const filter: Record<string, unknown> = {};
    if (clientId) filter.clientId = clientId;

    const data = await sessions
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    const mapped = data.map((doc) => ({
      id: doc._id.toString(),
      clientId: doc.clientId ?? "",
      clientName: doc.clientName ?? "",
      sessionsRequired: doc.sessionsRequired ?? 0,
      sessionsCompleted: doc.sessionsCompleted ?? 0,
      status: doc.status ?? "Active",
      createdAt: doc.createdAt ?? "",
    }));
    return NextResponse.json(mapped);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientId, clientName, sessionsRequired, feeType, totalFee, installmentsCount } = body;

    if (!clientId || !sessionsRequired) {
      return NextResponse.json(
        { error: "Client and sessions required are mandatory" },
        { status: 400 }
      );
    }

    const sessionMaster = await getCollection("mindmiracles", "sessionMaster");
    const now = new Date().toISOString();

    const sessionDoc = {
      clientId,
      clientName: clientName ?? "",
      sessionsRequired: Number(sessionsRequired),
      sessionsCompleted: 0,
      status: "Active",
      createdAt: now,
    };

    const result = await sessionMaster.insertOne(sessionDoc);
    const sessionId = result.insertedId.toString();

    if (totalFee) {
      const feeMaster = await getCollection("mindmiracles", "sessionFeeMaster");
      await feeMaster.insertOne({
        sessionId,
        clientId,
        clientName: clientName ?? "",
        feeType: feeType ?? "one_time",
        totalFee: Number(totalFee),
        installmentsCount: feeType === "installments" ? Number(installmentsCount ?? 0) : 0,
        createdAt: now,
      });
    }

    return NextResponse.json(
      { success: true, id: sessionId },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, sessionsRequired, sessionsCompleted, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const sessionMaster = await getCollection("mindmiracles", "sessionMaster");
    const updateFields: Record<string, unknown> = {};

    if (sessionsRequired !== undefined) {
      updateFields.sessionsRequired = Number(sessionsRequired);
    }
    if (sessionsCompleted !== undefined) {
      updateFields.sessionsCompleted = Number(sessionsCompleted);
    }
    if (status !== undefined) {
      updateFields.status = status;
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const result = await sessionMaster.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}
