"use client"
import { DataTable } from "@/components/data-table"
import { format } from "date-fns"

const columns = [
  { key: "razorpayPaymentId", label: "Payment ID", sortable: true },
  {
    key: "amount",
    label: "Amount",
    sortable: true,
    render: (value: any) => `₹${value || 0}`,
  },
  { key: "method", label: "Method", sortable: true },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (value: any) => (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${value === "COMPLETED" ? "bg-green-100 text-green-800" : value === "PENDING" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
      >
        {value || "PENDING"}
      </span>
    ),
  },
  {
    key: "paidAt",
    label: "Paid Date",
    sortable: true,
    render: (value: any) => (value ? format(new Date(value), "MMM dd, yyyy") : "-"),
  },
]

export default function PaymentsPage() {
  return <DataTable apiUrl="/api/payments" columns={columns} title="Payments Management" />
}
