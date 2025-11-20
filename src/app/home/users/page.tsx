"use client"
import { DataTable } from "@/components/data-table"
import { format } from "date-fns"

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  {
    key: "role",
    label: "Role",
    sortable: true,
    render: (value: any) => (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {value || "STUDENT"}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Joined",
    sortable: true,
    render: (value: any) => (value ? format(new Date(value), "MMM dd, yyyy") : "-"),
  },
  { key: "whatsAppNo", label: "WhatsApp", sortable: false },
  { key: "age", label: "Age", sortable: true },
]

export default function UsersPage() {
  return <DataTable apiUrl="/api/users" columns={columns} title="Users Management" />
}
