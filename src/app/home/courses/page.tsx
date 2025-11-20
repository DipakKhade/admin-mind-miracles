"use client"
import { DataTable } from "@/components/data-table"
import { format } from "date-fns"

const columns = [
  { key: "title", label: "Title", sortable: true },
  { key: "description", label: "Description", sortable: false },
  {
    key: "price",
    label: "Price",
    sortable: true,
    render: (value: any) => `$${value || 0}`,
  },
  {
    key: "isActive",
    label: "Active",
    sortable: true,
    render: (value: any) => (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
      >
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Created",
    sortable: true,
    render: (value: any) => (value ? format(new Date(value), "MMM dd, yyyy") : "-"),
  },
]

export default function CoursesPage() {
  return <DataTable apiUrl="/api/courses" columns={columns} title="Courses Management" />
}
