"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAtom } from "jotai"
import { tokenAtom, useInitializeUser } from "@/utils/user"
import {
  getAllCompanies,
  getAllDepreciationBook,
  getAllDepreciationTransactions,
  getMonthlyDepreciationInfoReport,
} from "@/utils/api"
import type { GetCompanyType, DepreciationInfoReportType, GetDepreciationBookType, GetDepTranType } from "@/utils/type"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DepreciationInfoReport() {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)

  const [depreciationData, setDepreciationData] = useState<DepreciationInfoReportType[]>([])
  const [companyData, setCompanyData] = useState<GetCompanyType[]>([])
  const [selectedBookId, setSelectedBookId] = useState<number>(0)
  const [periodId, setPeriodId] = useState<string>("")
  const [bookData, setBookData] = useState<GetDepreciationBookType[]>([])
  const [depTranData, setDepTranData] = useState<GetDepTranType[]>([])
  const [companyId, setCompanyId] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  const fetchDepreciationData = useCallback(async () => {
    if (!companyId || !selectedBookId || !periodId) {
      console.log("Missing required parameters")
      return
    }

    try {
      setLoading(true)
      const response = await getMonthlyDepreciationInfoReport(token, companyId, selectedBookId, periodId)
      setDepreciationData(response.data || [])
      console.log("🚀 ~ fetchDepreciationData ~ response.data:", response.data)
    } catch (error) {
      console.error("Error fetching depreciation info data:", error)
    } finally {
      setLoading(false)
    }
  }, [token, companyId, selectedBookId, periodId])

  const fetchCompanyData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getAllCompanies(token)
      setCompanyData(response.data || [])
      console.log("🚀 ~ fetchCompanyData ~ response.data:", response.data)
    } catch (error) {
      console.error("Error fetching company data:", error)
    } finally {
      setLoading(false)
    }
  }, [token])

  const fetchBookData = useCallback(async () => {
    if (!token) return
    try {
      setLoading(true)
      const response = await getAllDepreciationBook(token)
      if (response?.error?.status === 401) {
        return
      } else {
        setBookData(response.data || [])
        console.log("🚀 ~ fetchBookData ~ response.data:", response.data)
      }
    } catch (error) {
      console.error("Error fetching book data:", error)
    } finally {
      setLoading(false)
    }
  }, [token])

  const fetchDepTran = useCallback(async () => {
    if (!token) return
    try {
      setLoading(true)
      const response = await getAllDepreciationTransactions(token)
      if (response?.error?.status === 401) {
        return
      } else {
        const uniquePeriods =
          response.data?.filter((item, index, self) => index === self.findIndex((t) => t.period === item.period)) || []
        setDepTranData(uniquePeriods)
        console.log("🚀 ~ fetchDepTran ~ uniquePeriods:", uniquePeriods)
      }
    } catch (error) {
      console.error("Error fetching depreciation transactions:", error)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchCompanyData()
    fetchBookData()
    fetchDepTran()
  }, [fetchCompanyData, fetchBookData, fetchDepTran])

  const handlePrint = () => {
    window.print()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(2)}%`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-BD")
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Monthly Depreciation Info Report</h1>
        <Button onClick={handlePrint} className="print:hidden">
          Print
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 print:hidden items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Period</label>
          <Select value={periodId} onValueChange={(value) => setPeriodId(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {depTranData.map((item) => (
                <SelectItem key={item.id} value={item.period}>
                  {item.period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block">Company</Label>
          <Select
            onValueChange={(value) => setCompanyId(Number(value))}
            value={companyId ? companyId.toString() : undefined}
          >
            <SelectTrigger>
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
        <div>
          <label className="block text-sm font-medium mb-1">Book</label>
          <Select value={selectedBookId.toString()} onValueChange={(value) => setSelectedBookId(Number(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select book" />
            </SelectTrigger>
            <SelectContent>
              {bookData.map((book) => (
                <SelectItem key={book.id} value={book.id.toString()}>
                  {book.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={fetchDepreciationData} className="px-4 py-2">
          Show
        </Button>
      </div>

      <Card className="shadow-md">
        <CardContent className="overflow-auto">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Commencement</TableHead>
                  <TableHead>Sub Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Actual Value</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead>Useful Life</TableHead>
                  <TableHead>Depreciation %</TableHead>
                  <TableHead>Depreciation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {depreciationData.length > 0 ? (
                  depreciationData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.code}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{formatDate(item.commencement)}</TableCell>
                      <TableCell>{item.subCategory}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.department}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.actualValue)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.currentValue)}</TableCell>
                      <TableCell className="text-center">{item.usefulLife} years</TableCell>
                      <TableCell className="text-right">{formatPercentage(item.depreciationPercentage)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(item.depreciation)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center text-gray-500">
                      No data found for the selected criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {depreciationData.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Actual Value:</span>
              <span className="font-bold">
                {formatCurrency(depreciationData.reduce((sum, item) => sum + item.actualValue, 0))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Current Value:</span>
              <span className="font-bold">
                {formatCurrency(depreciationData.reduce((sum, item) => sum + item.currentValue, 0))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Depreciation:</span>
              <span className="font-bold text-lg">
                {formatCurrency(depreciationData.reduce((sum, item) => sum + item.depreciation, 0))}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
