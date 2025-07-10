import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const mockAssets = [
  {
    id: "A001",
    name: "Laptop Dell XPS 15",
    category: "Electronics",
    acquisitionDate: "2023-01-15",
    cost: 150000,
    vendor: "TechBazaar",
    location: "Dhaka HQ",
    assignedTo: "Rahim Uddin",
    status: "Active",
    serialNumber: "SN123456789",
    depreciationMethod: "Straight Line",
    usefulLife: 5,
    bookValue: 120000,
  },
  {
    id: "A002",
    name: "Office Chair",
    category: "Furniture",
    acquisitionDate: "2022-07-10",
    cost: 8000,
    vendor: "FurniWorld",
    location: "Chittagong Branch",
    assignedTo: "Meherun Nesa",
    status: "Active",
    serialNumber: "CH4567",
    depreciationMethod: "Reducing Balance",
    usefulLife: 8,
    bookValue: 7000,
  },
  // Add more mock assets here
];

export default function AssetRegister() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Asset Register Report (Demo)</h1>
        <Button onClick={handlePrint} className="print:hidden">Print</Button>
      </div>
      <Card className="shadow-md">
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Acquisition Date</TableHead>
                <TableHead>Cost (BDT)</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Depreciation Method</TableHead>
                <TableHead>Useful Life (yrs)</TableHead>
                <TableHead>Book Value (BDT)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>{asset.id}</TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell>{asset.acquisitionDate}</TableCell>
                  <TableCell>{asset.cost}</TableCell>
                  <TableCell>{asset.vendor}</TableCell>
                  <TableCell>{asset.location}</TableCell>
                  <TableCell>{asset.assignedTo}</TableCell>
                  <TableCell>{asset.status}</TableCell>
                  <TableCell>{asset.serialNumber}</TableCell>
                  <TableCell>{asset.depreciationMethod}</TableCell>
                  <TableCell>{asset.usefulLife}</TableCell>
                  <TableCell>{asset.bookValue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
