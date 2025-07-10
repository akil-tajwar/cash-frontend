import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const mockValuationData = [
  {
    assetId: "A001",
    name: "Laptop Dell XPS 15",
    purchaseValue: 120000,
    accumulatedDepreciation: 30000,
    netBookValue: 90000,
    location: "Head Office"
  },
  {
    assetId: "A002",
    name: "Office Chair",
    purchaseValue: 5000,
    accumulatedDepreciation: 2000,
    netBookValue: 3000,
    location: "Branch Office"
  },
  {
    assetId: "A003",
    name: "Projector",
    purchaseValue: 45000,
    accumulatedDepreciation: 15000,
    netBookValue: 30000,
    location: "Training Room"
  }
];

export default function AssetValuationSummary() {
  const [assetIdFilter, setAssetIdFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const handlePrint = () => {
    window.print();
  };

  const filteredData = mockValuationData.filter((item) => {
    const matchAsset = !assetIdFilter || item.assetId.toLowerCase().includes(assetIdFilter.toLowerCase());
    const matchLocation = !locationFilter || item.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchAsset && matchLocation;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Asset Valuation Summary (Demo)</h1>
        <Button onClick={handlePrint} className="print:hidden">Print</Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 print:hidden">
        <div>
          <Label className="mb-1 block">Asset ID</Label>
          <Input type="text" placeholder="e.g. A001" value={assetIdFilter} onChange={(e) => setAssetIdFilter(e.target.value)} />
        </div>
        <div>
          <Label className="mb-1 block">Location</Label>
          <Input type="text" placeholder="e.g. Head Office" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} />
        </div>
      </div>

      <Card className="shadow-md">
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Purchase Value (BDT)</TableHead>
                <TableHead>Accumulated Depreciation (BDT)</TableHead>
                <TableHead>Net Book Value (BDT)</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.assetId}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.purchaseValue}</TableCell>
                  <TableCell>{item.accumulatedDepreciation}</TableCell>
                  <TableCell>{item.netBookValue}</TableCell>
                  <TableCell>{item.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
