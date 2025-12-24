"use client"
import { DataTable } from "@/components/data-table"
import { format } from "date-fns"
import { DataGrid } from '@mui/x-data-grid';
import MUITableWrapper from "@/components/mui-table-wrapper";


// const columns = [
//   { key: "name", label: "Name", sortable: true },
//   { key: "email", label: "Email", sortable: true },
//   {
//     key: "role",
//     label: "Role",
//     sortable: true,
//     render: (value: any) => (
//       <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//         {value || "STUDENT"}
//       </span>
//     ),
//   },
//   {
//     key: "createdAt",
//     label: "Joined",
//     sortable: true,
//     render: (value: any) => (value ? format(new Date(value), "MMM dd, yyyy") : "-"),
//   },
//   { key: "whatsAppNo", label: "WhatsApp", sortable: false },
//   { key: "age", label: "Age", sortable: true },
// ]

const columns = [
  { field: "name", headerName: "Name", width: 350, type: 'string' },
  { field: "email", headerName: "Email", width: 400, type: 'string' },
  { field: "age", headerName: "Age", width: 100, type: 'number' },
  { field: "whatsAppNo", headerName: "WhatsApp", width: 100, type: 'string' }
];

export default function UsersPage() {
  // return <DataTable apiUrl="/api/users" columns={columns} title="Users Management" />
//   return <DataGrid
//   rows={data}
//   columns={columns}
//   initialState={{
//     pagination: {
//       paginationModel: {
//         pageSize: 10,
//         page: 0,
//       },
//     },
//   }}
//   pageSizeOptions={[10, 20, 50]}
//   filterModel={{
//     items: [
//       {
//         field: 'name',
//         operator: 'contains',
//         value: '',
//       },
//     ],
//   }}
// />

return <MUITableWrapper collection_key="User" columns={columns} />
}
