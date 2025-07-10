import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const mockMaintenanceLogs = [
  {
    date: "2024-02-10",
    assetId: "A001",
    name: "Laptop Dell XPS 15",
    description: "Battery replacement",
    cost: 5000,
    technician: "Zahid Hossain"
  },
  {
    date: "2024-03-15",
    assetId: "A002",
    name: "Office Chair",
    description: "Wheel repair",
    cost: 1200,
    technician: "Sharif Uddin"
  },
  {
    date: "2024-04-01",
    assetId: "A001",
    name: "Laptop Dell XPS 15",
    description: "Keyboard replacement",
    cost: 2500,
    technician: "Zahid Hossain"
  },
];

export default function MaintenanceReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [assetIdFilter, setAssetIdFilter] = useState("");

  const handlePrint = () => {
    window.print();
  };

  const filteredLogs = mockMaintenanceLogs.filter((log) => {
    const matchDate = !startDate || !endDate || (log.date >= startDate && log.date <= endDate);
    const matchAsset = !assetIdFilter || log.assetId.toLowerCase().includes(assetIdFilter.toLowerCase());
    return matchDate && matchAsset;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Maintenance Report (Demo)</h1>
        <Button onClick={handlePrint} className="print:hidden">Print</Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 print:hidden">
        <div>
          <Label className="mb-1 block">Period Start</Label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <Label className="mb-1 block">Period End</Label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div>
          <Label className="mb-1 block">Asset ID</Label>
          <Input type="text" placeholder="e.g. A001" value={assetIdFilter} onChange={(e) => setAssetIdFilter(e.target.value)} />
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
                <TableHead>Description</TableHead>
                <TableHead>Cost (BDT)</TableHead>
                <TableHead>Technician</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log, index) => (
                <TableRow key={index}>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>{log.assetId}</TableCell>
                  <TableCell>{log.name}</TableCell>
                  <TableCell>{log.description}</TableCell>
                  <TableCell>{log.cost}</TableCell>
                  <TableCell>{log.technician}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
