'use client'

import { useCallback, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useAtom } from 'jotai'
import { tokenAtom, useInitializeUser } from '@/utils/user'
import { getBankTypeUtilizationReport } from '@/utils/api'
import type { GetBankTypeUtilizationReportType } from '@/utils/type'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default function BankTypeUtilizationReport() {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const [bankTypeUtilizationData, setBankTypeUtilizationData] = useState<
    GetBankTypeUtilizationReportType[]
  >([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const fetchBankTypeUtilizationData = useCallback(async () => {
    if (!selectedDate) {
      console.log('Missing required date parameter')
      return
    }

    try {
      setLoading(true)
      const response = await getBankTypeUtilizationReport(selectedDate, token)
      setBankTypeUtilizationData(Array.isArray(response.data) ? response.data : [])
      console.log(
        '🚀 ~ fetchBankTypeUtilizationData ~ response.data:',
        response.data
      )
    } catch (error) {
      console.error('Error fetching bank type utilization data:', error)
    } finally {
      setLoading(false)
    }
  }, [token, selectedDate])

  const handlePrint = () => {
    window.print()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatPercentage = (percent: number) => {
    return `${percent.toFixed(2)}%`
  }

  const calculateTotals = () => {
    return bankTypeUtilizationData.reduce(
      (totals, item) => ({
        limit: Number(totals.limit) + Number(item.limit),
        balanceOnDate: Number(totals.balanceOnDate) + Number(item.balanceOnDate),
        utilizePercent: Number(totals.utilizePercent) + Number(item.utilizePercent),
      }),
      { limit: 0, balanceOnDate: 0, utilizePercent: 0 }
    )
  }

  const totals = calculateTotals()

  const generateExcel = () => {
    exportToExcel(bankTypeUtilizationData, 'bank-type-utilization-report-' + selectedDate)
  }

  const exportToExcel = (data: GetBankTypeUtilizationReportType[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(flattenData(data))
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trial Balance')
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    })
    saveAs(blob, `${fileName}.xlsx`)
  }

  const flattenData = (data: GetBankTypeUtilizationReportType[]): any[] => {
    return Object.values(data).flat().map((item) => ({
      bankName: item.bankName,
      accountType: item.accountType,
      limit: item.limit,
      balanceOnDate: item.balanceOnDate,
      utilizePercent: item.utilizePercent,
    }))
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Bank Type Utilization Report</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={generateExcel}
            variant="ghost"
            className="flex items-center gap-2 bg-green-100 text-green-900 hover:bg-green-200"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.5 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7.5L14.5 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 2V8H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 13H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 17H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 9H8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-medium">Excel</span>
          </Button>
          <Button onClick={handlePrint} className="print:hidden">
            Print
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 print:hidden items-end">
        <div>
          <Label className="mb-1 block">Date</Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-[180px]"
          />
        </div>
        <Button onClick={fetchBankTypeUtilizationData} className="px-4 py-2">
          Show
        </Button>
      </div>

      <div className="space-y-6">
        {loading ? (
          <Card className="shadow-md">
            <CardContent className="p-8 text-center">
              <p>Loading...</p>
            </CardContent>
          </Card>
        ) : bankTypeUtilizationData.length > 0 ? (
          <Card className="shadow-md">
            <CardContent className="p-0">
              <div className="bg-muted/30 px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">
                  Bank Type Utilization Analysis
                </h3>
              </div>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Bank Name</TableHead>
                      <TableHead className="font-bold">Account Type</TableHead>
                      <TableHead className="font-bold">Limit</TableHead>
                      <TableHead className="font-bold">
                        Balance on Date
                      </TableHead>
                      <TableHead className="font-bold">
                        Utilize Percent
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bankTypeUtilizationData.map((item, index) => (
                      <TableRow key={`bank-type-utilization-${index}`}>
                        <TableCell>{item.bankName}</TableCell>
                        <TableCell>{item.accountType}</TableCell>
                        <TableCell>{formatCurrency(item.limit)}</TableCell>
                        <TableCell>
                          {formatCurrency(item.balanceOnDate)}
                        </TableCell>
                        <TableCell>
                          {formatPercentage(item.utilizePercent)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-semibold bg-muted/20">
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell>{formatCurrency(totals.limit)}</TableCell>
                      <TableCell>
                        {formatCurrency(totals.balanceOnDate)}
                      </TableCell>
                      <TableCell>
                        {formatPercentage(totals.utilizePercent)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-md">
            <CardContent className="p-8 text-center text-gray-500">
              No data found for the selected date.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
