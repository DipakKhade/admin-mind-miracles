import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export async function GET() {
  try {
    const clients = await getCollection("mindmiracles", "clientMaster");
    const data = await clients
      .find({})
      .sort({ registeredDate: -1 })
      .toArray();
    const mapped = data.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name ?? "",
      email: doc.email ?? "",
      phone: doc.phone ?? "",
      age: doc.age ?? 0,
      gender: doc.gender ?? "",
      place: doc.place ?? "",
      registeredDate: doc.registeredDate ?? "",
    }));
    return NextResponse.json(mapped);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, age, gender, place } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const clients = await getCollection("mindmiracles", "clientMaster");
    const doc = {
      name,
      email: email ?? "",
      phone: phone ?? "",
      age: age ? Number(age) : 0,
      gender: gender ?? "",
      place: place ?? "",
      registeredDate: new Date().toISOString().split("T")[0],
    };

    const result = await clients.insertOne(doc);

    return NextResponse.json(
      { success: true, id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}
