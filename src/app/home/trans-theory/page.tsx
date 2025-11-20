"use client"

import { DataTable } from "@/components/data-table"

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "wpNumber", label: "WhatsApp Number", sortable: true },
  { key: "razorpayPaymentId", label: "Payment ID", sortable: false },
  {
    key: "isAddedToGroup",
    label: "Added to Group",
    sortable: true,
    render: (value: any) => (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
      >
        {value ? "Yes" : "No"}
      </span>
    ),
  },
]

export default function TransTheory() {
  return <DataTable apiUrl="/api/wp-group-members" columns={columns} title="WhatsApp Group Members" />
}
