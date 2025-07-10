import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockMovements = [
  {
    date: "2024-01-05",
    assetId: "A001",
    name: "Laptop Dell XPS 15",
    fromLocation: "Dhaka HQ",
    toLocation: "Chittagong Branch",
    movedBy: "Admin User",
    remarks: "Temporary shift for training session"
  },
  {
    date: "2024-03-12",
    assetId: "A002",
    name: "Office Chair",
    fromLocation: "Chittagong Branch",
    toLocation: "Dhaka HQ",
    movedBy: "Maintenance Team",
    remarks: "Repair complete, returned to office"
  },
  // Add more mock movement records here
];

export default function AssetMovementReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handlePrint = () => {
    window.print();
  };

  // Filter movements by date
  const filteredMovements = mockMovements.filter((m) => {
    if (!startDate || !endDate) return true;
    return m.date >= startDate && m.date <= endDate;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Asset Movement Report (Demo)</h1>
        <Button onClick={handlePrint} className="print:hidden">Print</Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 print:hidden">
        <div>
          <label className="block text-sm font-medium mb-1">Period Start</label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Period End</label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      <Card className="shadow-md">
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Asset ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>From Location</TableHead>
                <TableHead>To Location</TableHead>
                <TableHead>Moved By</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovements.map((movement, index) => (
                <TableRow key={index}>
                  <TableCell>{movement.date}</TableCell>
                  <TableCell>{movement.assetId}</TableCell>
                  <TableCell>{movement.name}</TableCell>
                  <TableCell>{movement.fromLocation}</TableCell>
                  <TableCell>{movement.toLocation}</TableCell>
                  <TableCell>{movement.movedBy}</TableCell>
                  <TableCell>{movement.remarks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
