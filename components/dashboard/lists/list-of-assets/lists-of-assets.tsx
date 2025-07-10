"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Eye } from "lucide-react"

const ListOfAssets = () => {
  // State for table data
  const [assets, setAssets] = useState([
    // Sample data, you can start with an empty array if preferred
    {
      id: 1,
      description: "Office Laptop",
      assetTagId: "AST001",
      company: "Acme Inc",
      purchaseDate: "2023-05-15",
      cost: "1200.00",
      purchaseFrom: "TechStore",
      brand: "Dell",
      model: "XPS 13",
      serialNo: "DL12345678",
      assetName: "Developer Laptop",
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
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold">List of Assets</h2>
      </div>

      {/* Table for asset data */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-amber-100">
            <TableRow>
              <TableHead>Asset Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Asset Tag ID</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>{asset.assetName}</TableCell>
                <TableCell>{asset.description}</TableCell>
                <TableCell>{asset.assetTagId}</TableCell>
                <TableCell>{asset.company}</TableCell>
                <TableCell>{asset.purchaseDate}</TableCell>
                <TableCell>{asset.cost}</TableCell>
                <TableCell>{asset.brand}</TableCell>
                <TableCell>{asset.model}</TableCell>
                <TableCell>
                <TableCell>
                  <Link href={'/dashboard/assets/assets/asset-details/1'}><Eye /></Link>
                </TableCell>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ListOfAssets

