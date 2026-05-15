import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const courses = await getCollection("mindmiracles", "Course");
    const data = await courses.find().sort({ createdAt: -1 }).toArray();
    const mapped = data.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title ?? "",
      description: doc.description ?? "",
      price: doc.price ?? 0,
      isActive: doc.isActive ?? false,
      previewURL: doc.previewURL ?? "",
      thumbnailURL: doc.thumbnailURL ?? "",
      createdAt: doc.createdAt ?? "",
    }));
    return NextResponse.json(mapped);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, price, previewURL, isActive } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const courses = await getCollection("mindmiracles", "Course");
    const now = new Date();

    const doc = {
      title,
      description: description ?? "",
      price: Number(price) || 0,
      previewURL: previewURL ?? "",
      isActive: isActive ?? true,
      thumbnailURL: "",
      createdAt: now,
      updatedAt: now,
    };

    const result = await courses.insertOne(doc);
    return NextResponse.json(
      { success: true, id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, title, description, price, previewURL, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const courses = await getCollection("mindmiracles", "Course");
    const updateFields: Record<string, unknown> = { updatedAt: new Date() };

    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (price !== undefined) updateFields.price = Number(price);
    if (previewURL !== undefined) updateFields.previewURL = previewURL;
    if (isActive !== undefined) updateFields.isActive = isActive;

    const result = await courses.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}
