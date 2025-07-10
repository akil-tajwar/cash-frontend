"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, FileEdit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const ListOfWarrenties = () => {
  // State for table data
  const [warranties, setWarranties] = useState([
    // Sample data
    {
      id: 1,
      assetTagId: "AST001",
      active: true,
      description: "Extended Hardware Coverage",
      duration: 36,
      expireDate: "2026-05-15",
      notes: "Covers all hardware components except battery",
    },
    {
      id: 2,
      assetTagId: "AST002",
      active: false,
      description: "Basic Warranty",
      duration: 12,
      expireDate: "2023-10-22",
      notes: "Standard manufacturer warranty",
    },
    {
      id: 3,
      assetTagId: "AST003",
      active: true,
      description: "Premium Support",
      duration: 24,
      expireDate: "2025-03-18",
      notes: "24/7 technical support included",
    },
  ])

  return (
    <div className="p-6 space-y-6">
      {/* Header with title */}
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-amber-100 p-2 rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-amber-600"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold">Warranty Details</h2>
      </div>

      {/* Table for warranty data */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-amber-100">
            <TableRow>
              <TableHead>Asset Tag ID</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Duration (Months)</TableHead>
              <TableHead>Expire Date</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warranties.map((warranty) => (
              <TableRow key={warranty.id}>
                <TableCell>{warranty.assetTagId}</TableCell>
                <TableCell>
                  <Badge
                    variant={warranty.active ? "default" : "outline"}
                    className={
                      warranty.active
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    {warranty.active ? "Active" : "Expired"}
                  </Badge>
                </TableCell>
                <TableCell>{warranty.description}</TableCell>
                <TableCell>{warranty.duration}</TableCell>
                <TableCell>{warranty.expireDate}</TableCell>
                <TableCell>{warranty.notes}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ListOfWarrenties

