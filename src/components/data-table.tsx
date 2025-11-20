"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, Search } from "lucide-react"
import { SortDirection } from "mongodb"
import { toast } from "sonner"

interface DataTableProps {
  apiUrl: string
  columns: Array<{
    key: string
    label: string
    sortable?: boolean
    render?: (value: any, row: any) => React.ReactNode
  }>
  title: string
}


export function DataTable({ apiUrl, columns, title }: DataTableProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(0)
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<SortDirection>("ascending")

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData()
    }, 300)

    return () => clearTimeout(timer)
  }, [search, page, sortBy, sortOrder])

  async function fetchData() {
    try {
      setLoading(true)
      toast.loading("")
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        sortBy,
        sortOrder: sortOrder.toString(),
      })

      const response = await fetch(`${apiUrl}?${params}`)
      const result = await response.json()

      setData(
        result.users ||
          result.courses ||
          result.enrollments ||
          result.payments ||
          result.contacts ||
          result.members ||
          result.results ||
          [],
      )
      setTotal(result.total)
      setPages(result.pages)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      toast.dismiss()
      setLoading(false)
    }
  }

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "descending" ? "ascending" : "descending")
    } else {
      setSortBy(key)
      setSortOrder("descending")
    }
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <div className="w-full space-y-4 p-2">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-emerald-200">
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} className="px-4 py-3">
                    {column.sortable ? (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="flex items-center gap-2 hover:text-foreground text-muted-foreground transition-colors"
                      >
                        {column.label}
                        {sortBy === column.key &&
                          (sortOrder === 1 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                      </button>
                    ) : (
                      column.label
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row._id}>
                    {columns.map((column) => (
                      <TableCell key={`${row._id}-${column.key}`} className="px-4 py-3">
                        {column.render
                          ? column.render(row[column.key], row)
                          : String(row[column.key] || "-").substring(0, 50)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)} of {total} entries
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1 || loading}>
            Previous
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm">
              Page {page} of {pages}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === pages || loading}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
