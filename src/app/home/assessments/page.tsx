"use client"

import { DataTable } from "@/components/data-table"
import { format } from "date-fns"

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "mobile", label: "Mobile", sortable: false },
  { key: "occupation", label: "Occupation", sortable: false },
  {
    key: "score",
    label: "Score",
    sortable: true,
    render: (value: any) => <span className="font-semibold">{value || 0}</span>,
  },
  {
    key: "createdAt",
    label: "Submitted",
    sortable: true,
    render: (value: any) => (value ? format(new Date(value), "MMM dd, yyyy") : "-"),
  },
]

export default function AssessmentsPage() {
  return <DataTable apiUrl="/api/assessment-results" columns={columns} title="Assessment Results" />
}
