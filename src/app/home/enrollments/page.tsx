"use client"

import { DataTable } from "@/components/data-table"
import { format } from "date-fns"

const columns = [
  { key: "userId", label: "User ID", sortable: true },
  { key: "courseId", label: "Course ID", sortable: true },
  {
    key: "enrolledAt",
    label: "Enrolled",
    sortable: true,
    render: (value: any) => (value ? format(new Date(value), "MMM dd, yyyy") : "-"),
  },
  { key: "certificationId", label: "Certification ID", sortable: false },
]

export default function EnrollmentsPage() {
  return <DataTable apiUrl="/api/enrollments" columns={columns} title="Enrollments Management" />
}
