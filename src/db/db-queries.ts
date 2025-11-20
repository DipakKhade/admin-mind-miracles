import clientPromise from "./mongo"
import { SortDirection } from "mongodb"

const DB_NAME = "mindmiracles"

export async function getDatabase() {
  const client = await clientPromise
  return client.db(DB_NAME)
}

export async function getUsers(page = 1, limit = 10, search = "", sortBy = "_id", sortOrder: SortDirection = "ascending") {
  const db = await getDatabase()
  const skip = (page - 1) * limit

  const query = search
    ? {
        $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }],
      }
    : {}

  const users = await db
    .collection("User")
    .find(query)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .toArray()

  const total = await db.collection("User").countDocuments(query)

  return { users, total, pages: Math.ceil(total / limit) }
}

export async function getCourses(page = 1, limit = 10, search = "", sortBy = "_id", sortOrder: SortDirection = "ascending") {
  const db = await getDatabase()
  const skip = (page - 1) * limit

  const query = search ? { title: { $regex: search, $options: "i" } } : {}

  const courses = await db
    .collection("Course")
    .find(query)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .toArray()

  const total = await db.collection("Course").countDocuments(query)

  return { courses, total, pages: Math.ceil(total / limit) }
}

export async function getEnrollments(page = 1, limit = 10, search = "", sortBy = "_id", sortOrder: SortDirection = "ascending") {
  const db = await getDatabase()
  const skip = (page - 1) * limit

  const query = search
    ? {
        $or: [{ userId: { $regex: search, $options: "i" } }, { courseId: { $regex: search, $options: "i" } }],
      }
    : {}

  const enrollments = await db
    .collection("Enrollment")
    .find(query)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .toArray()

  const total = await db.collection("Enrollment").countDocuments(query)

  return { enrollments, total, pages: Math.ceil(total / limit) }
}

export async function getPayments(page = 1, limit = 10, search = "", sortBy = "_id", sortOrder: SortDirection = "ascending") {
  const db = await getDatabase()
  const skip = (page - 1) * limit

  const query = search
    ? {
        $or: [{ razorpayPaymentId: { $regex: search, $options: "i" } }, { status: { $regex: search, $options: "i" } }],
      }
    : {}

  let payments = await db
    .collection("Payment")
    .find(query)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .toArray()

  const total = await db.collection("Payment").countDocuments(query)
  
  payments = payments.map((x:any) => {
    return {
      ...x,
      amount: (x.amount)/100
    }
  })

  return { payments, total, pages: Math.ceil(total / limit) }
}

export async function getContactMessages(page = 1, limit = 10, search = "", sortBy = "_id", sortOrder: SortDirection = "ascending") {
  const db = await getDatabase()
  const skip = (page - 1) * limit

  const query = search
    ? {
        $or: [
          { email: { $regex: search, $options: "i" } },
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
        ],
      }
    : {}

  const contacts = await db
    .collection("ContactUs")
    .find(query)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .toArray()

  const total = await db.collection("ContactUs").countDocuments(query)

  return { contacts, total, pages: Math.ceil(total / limit) }
}

export async function getWpGroupMembers(page = 1, limit = 10, search = "", sortBy = "_id", sortOrder: SortDirection = "ascending") {
  const db = await getDatabase()
  const skip = (page - 1) * limit

  const query = search
    ? {
        $or: [{ name: { $regex: search, $options: "i" } }, { wpNumber: { $regex: search, $options: "i" } }],
      }
    : {}

  const members = await db
    .collection("WpGroupMembers")
    .find(query)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .toArray()

  const total = await db.collection("WpGroupMembers").countDocuments(query)

  return { members, total, pages: Math.ceil(total / limit) }
}

export async function getAssessmentResults(page = 1, limit = 10, search = "", sortBy = "_id", sortOrder: SortDirection = "ascending") {
  const db = await getDatabase()
  const skip = (page - 1) * limit

  const query = search
    ? {
        $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }],
      }
    : {}

  const results = await db
    .collection("AssessmentResult")
    .find(query)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .toArray()

  const total = await db.collection("AssessmentResult").countDocuments(query)

  return { results, total, pages: Math.ceil(total / limit) }
}
