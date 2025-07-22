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
import { getCashFlowLoanAcReport } from '@/utils/api'
import type { GetCashFlowLoanReportType } from '@/utils/type'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { formatIndianNumber } from '@/utils/formatNumber'
import { format } from 'path'

export default function CashFlowLoanAc() {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const [cashFlowData, setCashFlowData] = useState<GetCashFlowLoanReportType>(
    {}
  )
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const fetchCashFlowData = useCallback(async () => {
    if (!selectedDate) {
      console.log('Missing required date parameter')
      return
    }

    try {
      setLoading(true)
      const response = await getCashFlowLoanAcReport(selectedDate, token)
      setCashFlowData(response.data || {})
      console.log('🚀 ~ fetchCashFlowData ~ response.data:', response.data)
    } catch (error) {
      console.error('Error fetching cash flow loan data:', error)
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

  const formatInterestRate = (rate: string) => {
    return `${rate}%`
  }

  const generateExcel = () => {
    exportToExcel(cashFlowData, 'cash-flow-loan-report-' + selectedDate)
  }

  const exportToExcel = (data: GetCashFlowLoanReportType, fileName: string) => {
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

  const flattenData = (data: GetCashFlowLoanReportType): any[] => {
    return Object.values(data).flat().map((item) => ({
      companyName: item.companyName,
      accountNo: item.accountNo,
      limit: item.limit,
      type: item.type,
      interestRate: item.interestRate,
      bank: item.bank,
      openingBalance: item.openingBalance,
      deposit: item.deposit,
      withdrawal: item.withdrawal,
      closingBalance: item.closingBalance,
    }))
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Cash Flow Loan Account Report</h1>
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
        <Button onClick={fetchCashFlowData} className="px-4 py-2">
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
        ) : Object.keys(cashFlowData).length > 0 ? (
          Object.entries(cashFlowData).map(([groupKey, accounts]) => (
            <Card key={groupKey} className="shadow-md">
              <CardContent className="p-0">
                <div className="bg-muted/30 px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold">{groupKey}</h3>
                </div>
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold">Account No</TableHead>
                        <TableHead className="font-bold">Bank</TableHead>
                        <TableHead className="font-bold">Limit</TableHead>
                        <TableHead className="font-bold">
                          Interest Rate
                        </TableHead>
                        <TableHead className="font-bold">
                          Opening Balance
                        </TableHead>
                        <TableHead className="font-bold">Deposit</TableHead>
                        <TableHead className="font-bold">Withdrawal</TableHead>
                        <TableHead className="font-bold">
                          Closing Balance
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accounts.map((account, index) => (
                        <TableRow
                          key={`${groupKey}-${account.accountNo}-${index}`}
                        >
                          <TableCell>{account.accountNo}</TableCell>
                          <TableCell>{account.bank}</TableCell>
                          <TableCell>BDT {formatIndianNumber((account.limit))}</TableCell>
                          <TableCell>
                            {formatInterestRate(account.interestRate)}
                          </TableCell>
                          <TableCell>
                            BDT {formatIndianNumber((account.openingBalance))}
                          </TableCell>
                          <TableCell>
                            BDT {formatIndianNumber((account.deposit))}
                          </TableCell>
                          <TableCell>
                            BDT {formatIndianNumber((account.withdrawal))}
                          </TableCell>
                          <TableCell>
                            BDT {formatIndianNumber((account.closingBalance))}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-semibold">
                        <TableCell colSpan={4}>Group Total</TableCell>
                        <TableCell>
                          BDT {formatIndianNumber(
                            accounts.reduce(
                              (sum, account) => sum + account.openingBalance,
                              0
                            )
                          )}
                        </TableCell>
                        <TableCell>
                          BDT {formatIndianNumber(
                            accounts.reduce(
                              (sum, account) => sum + account.deposit,
                              0
                            )
                          )}
                        </TableCell>
                        <TableCell>
                          BDT {formatIndianNumber(
                            accounts.reduce(
                              (sum, account) => sum + account.withdrawal,
                              0
                            )
                          )}
                        </TableCell>
                        <TableCell>
                          BDT {formatIndianNumber(
                            accounts.reduce(
                              (sum, account) => sum + account.closingBalance,
                              0
                            )
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))
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
