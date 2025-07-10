"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAtom } from "jotai"
import { tokenAtom, useInitializeUser } from "@/utils/user"
import { getAllCompanies, getAssetInfoReport } from "@/utils/api"
import type { GetCompanyType, AssetInfoReportType } from "@/utils/type"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

export default function AssetInfoReport() {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)

  const [assetInfoData, setAssetInfoData] = useState<AssetInfoReportType[]>([])
  const [companyData, setCompanyData] = useState<GetCompanyType[]>([])
  const [companyId, setCompanyId] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  const fetchAssetInfoData = useCallback(async () => {
    if (!companyId) {
      console.log("Company ID is required")
      return
    }

    try {
      setLoading(true)
      const response = await getAssetInfoReport(token, companyId)
      if (response?.error?.status === 401) {
        return
      } else {
        setAssetInfoData(response.data || [])
        console.log("🚀 ~ fetchAssetInfoData ~ response.data:", response.data)
      }
    } catch (error) {
      console.error("Error fetching asset info data:", error)
    } finally {
      setLoading(false)
    }
  }, [token, companyId])

  const fetchCompanyData = useCallback(async () => {
    if (!token) return
    try {
      setLoading(true)
      const response = await getAllCompanies(token)
      if (response?.error?.status === 401) {
        return
      } else {
        setCompanyData(response.data || [])
        console.log("🚀 ~ fetchCompanyData ~ response.data:", response.data)
      }
    } catch (error) {
      console.error("Error fetching company data:", error)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchCompanyData()
  }, [fetchCompanyData])

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    try {
      return format(new Date(dateString), "MMM dd, yyyy")
    } catch {
      return dateString
    }
  }

  const formatCurrency = (amount: number) => {
    if (!amount) return "0.00"
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatValue = (value: string | number) => {
    if (value === null || value === undefined) return "-"
    return value.toString()
  }

  return (
    <div className="p-6 w-[80vw] overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Asset Info Report</h1>
        <Button onClick={handlePrint} className="print:hidden">
          Print
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 print:hidden items-end">
        <div>
          <Label className="mb-1 block">Company</Label>
          <Select
            onValueChange={(value) => setCompanyId(Number(value))}
            value={companyId ? companyId.toString() : undefined}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {companyData.map((company) => (
                <SelectItem key={company.companyId} value={company.companyId.toString()}>
                  {company.companyName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={fetchAssetInfoData} className="px-4 py-2">
          Show
        </Button>
      </div>

      <Card className="shadow-md">
        <CardContent className="overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <p>Loading...</p>
            </div>
          ) : (
            <Table className="w-[20px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">Item Code</TableHead>
                  <TableHead className="min-w-[200px]">Item Description</TableHead>
                  <TableHead className="min-w-[100px]">Mfg Code</TableHead>
                  <TableHead className="min-w-[150px]">Manufacturer</TableHead>
                  <TableHead className="min-w-[100px]">Origin</TableHead>
                  <TableHead className="min-w-[100px]">Model</TableHead>
                  <TableHead className="min-w-[80px]">Mfg Year</TableHead>
                  <TableHead className="min-w-[100px]">Serial No</TableHead>
                  <TableHead className="min-w-[100px]">Location</TableHead>
                  <TableHead className="min-w-[120px]">Commission Date</TableHead>
                  <TableHead className="min-w-[100px]">Supplier ID</TableHead>
                  <TableHead className="min-w-[150px]">Supplier Name</TableHead>
                  <TableHead className="min-w-[100px]">Asset Location</TableHead>
                  <TableHead className="min-w-[100px]">Section</TableHead>
                  <TableHead className="min-w-[100px]">Category</TableHead>
                  <TableHead className="min-w-[100px]">Department</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[120px]">Asset Value</TableHead>
                  <TableHead className="min-w-[120px]">Current Value</TableHead>
                  <TableHead className="min-w-[100px]">Life Time</TableHead>
                  <TableHead className="min-w-[100px]">Dep %</TableHead>
                  <TableHead className="min-w-[120px]">Yearly Dep</TableHead>
                  <TableHead className="min-w-[120px]">Acc Dep (O)</TableHead>
                  <TableHead className="min-w-[120px]">Acc Dep</TableHead>
                  <TableHead className="min-w-[120px]">Book Value</TableHead>
                  <TableHead className="min-w-[150px]">Book Name</TableHead>
                  <TableHead className="min-w-[100px]">Sub Category</TableHead>
                  <TableHead className="min-w-[100px]">CC Code</TableHead>
                  <TableHead className="min-w-[150px]">CC Description</TableHead>
                  <TableHead className="min-w-[120px]">OH Amount</TableHead>
                  <TableHead className="min-w-[100px]">OH Life Time</TableHead>
                  <TableHead className="min-w-[120px]">OH Date</TableHead>
                  <TableHead className="min-w-[100px]">R Life Time</TableHead>
                  <TableHead className="min-w-[100px]">U Life Time</TableHead>
                  <TableHead className="min-w-[120px]">U Acc Dep</TableHead>
                  <TableHead className="min-w-[120px]">Status Date</TableHead>
                  <TableHead className="min-w-[120px]">Sale Amount</TableHead>
                  <TableHead className="min-w-[200px]">Remarks</TableHead>
                  <TableHead className="min-w-[120px]">Sold Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assetInfoData.length > 0 ? (
                  assetInfoData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatValue(item.item_code)}</TableCell>
                      <TableCell>{formatValue(item.item_desc)}</TableCell>
                      <TableCell>{formatValue(item.mfg_code)}</TableCell>
                      <TableCell>{formatValue(item.mfg_name)}</TableCell>
                      <TableCell>{formatValue(item.c_origin)}</TableCell>
                      <TableCell>{formatValue(item.m_model)}</TableCell>
                      <TableCell>{formatValue(item.mfg_yy)}</TableCell>
                      <TableCell>{formatValue(item.mc_sl)}</TableCell>
                      <TableCell>{formatValue(item.mc_loc)}</TableCell>
                      <TableCell>{formatDate(item.comm_dt)}</TableCell>
                      <TableCell>{formatValue(item.mc_sup)}</TableCell>
                      <TableCell>{formatValue(item.supplier_name)}</TableCell>
                      <TableCell>{formatValue(item.a_loc)}</TableCell>
                      <TableCell>{formatValue(item.a_sec)}</TableCell>
                      <TableCell>{formatValue(item.a_cat)}</TableCell>
                      <TableCell>{formatValue(item.a_dept)}</TableCell>
                      <TableCell>{formatValue(item.a_st)}</TableCell>
                      <TableCell>{formatCurrency(item.a_value)}</TableCell>
                      <TableCell>{formatCurrency(item.curr_value)}</TableCell>
                      <TableCell>{formatValue(item.l_time)}</TableCell>
                      <TableCell>{formatValue(item.d_pct)}%</TableCell>
                      <TableCell>{formatCurrency(item.yy_dep)}</TableCell>
                      <TableCell>{formatCurrency(item.accu_dep_o)}</TableCell>
                      <TableCell>{formatCurrency(item.accu_dep)}</TableCell>
                      <TableCell>{formatCurrency(item.b_value)}</TableCell>
                      <TableCell>{formatValue(item.b_name)}</TableCell>
                      <TableCell>{formatValue(item.a_scat)}</TableCell>
                      <TableCell>{formatValue(item.cc_code)}</TableCell>
                      <TableCell>{formatValue(item.cc_desc)}</TableCell>
                      <TableCell>{formatCurrency(item.oh_amt)}</TableCell>
                      <TableCell>{formatValue(item.oh_l_time)}</TableCell>
                      <TableCell>{formatDate(item.oh_dt)}</TableCell>
                      <TableCell>{formatValue(item.r_l_time)}</TableCell>
                      <TableCell>{formatValue(item.u_l_time)}</TableCell>
                      <TableCell>{formatCurrency(item.u_accu_dep)}</TableCell>
                      <TableCell>{formatDate(item.a_st_dt)}</TableCell>
                      <TableCell>{formatCurrency(item.s_amt)}</TableCell>
                      <TableCell>{formatValue(item.a_rem)}</TableCell>
                      <TableCell>{formatDate(item.sold_dt)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={39} className="text-center text-gray-500 py-8">
                      No asset data found for the selected company.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {assetInfoData.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Assets:</span>
              <span className="font-bold">{assetInfoData.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Asset Value:</span>
              <span className="font-bold">
                {formatCurrency(assetInfoData.reduce((sum, item) => sum + (item.a_value || 0), 0))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Current Value:</span>
              <span className="font-bold">
                {formatCurrency(assetInfoData.reduce((sum, item) => sum + (item.curr_value || 0), 0))}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
