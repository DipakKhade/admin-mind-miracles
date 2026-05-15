import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

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

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, name, email, phone, age, gender, place } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    const clients = await getCollection("mindmiracles", "clientMaster");
    const updateFields: Record<string, unknown> = {};

    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (age !== undefined) updateFields.age = Number(age);
    if (gender !== undefined) updateFields.gender = gender;
    if (place !== undefined) updateFields.place = place;

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const result = await clients.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    const clients = await getCollection("mindmiracles", "clientMaster");
    const result = await clients.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 }
    );
  }
}
