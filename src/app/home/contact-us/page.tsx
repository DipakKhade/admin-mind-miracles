"use client"

import { DataTable } from "@/components/data-table"


const columns = [
  { key: "firstName", label: "First Name", sortable: true },
  { key: "lastName", label: "Last Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "mobileNo", label: "Mobile", sortable: false },
  { key: "place", label: "Location", sortable: false },
  { key: "age", label: "Age", sortable: true },
]

export default function ContactUsPage() {
  return <DataTable apiUrl="/api/contact-us" columns={columns} title="Contact Messages" />
}
