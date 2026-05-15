import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const courseId = url.searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    const enrollments = await getCollection("mindmiracles", "Enrollment");
    const users = await getCollection("mindmiracles", "User");

    const data = await enrollments
      .find({ courseId: new ObjectId(courseId) })
      .sort({ enrolledAt: -1 })
      .toArray();

    const mapped = await Promise.all(
      data.map(async (doc) => {
        let userName = "";
        let userEmail = "";
        try {
          const user = await users.findOne({ _id: new ObjectId(doc.userId) });
          if (user) {
            userName = user.name ?? user.displayName ?? "";
            userEmail = user.email ?? "";
          }
        } catch {
          // user not found
        }

        return {
          id: doc._id.toString(),
          userId: doc.userId.toString(),
          userName,
          userEmail,
          certificationId: doc.certificationId ?? "",
          enrolledAt: doc.enrolledAt ?? "",
        };
      })
    );

    return NextResponse.json(mapped);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { courseId, userId } = body;

    if (!courseId || !userId) {
      return NextResponse.json(
        { error: "courseId and userId are required" },
        { status: 400 }
      );
    }

    const enrollments = await getCollection("mindmiracles", "Enrollment");

    const existing = await enrollments.findOne({
      courseId: new ObjectId(courseId),
      userId: new ObjectId(userId),
    });

    if (existing) {
      return NextResponse.json(
        { error: "User is already enrolled in this course" },
        { status: 409 }
      );
    }

    const certId = `MM-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const doc = {
      courseId: new ObjectId(courseId),
      userId: new ObjectId(userId),
      enrolledAt: new Date().toISOString(),
      certificationId: certId,
    };

    const result = await enrollments.insertOne(doc);
    return NextResponse.json(
      { success: true, id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to create enrollment" },
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
        { error: "Enrollment ID is required" },
        { status: 400 }
      );
    }

    const enrollments = await getCollection("mindmiracles", "Enrollment");
    const result = await enrollments.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete enrollment" },
      { status: 500 }
    );
  }
}
