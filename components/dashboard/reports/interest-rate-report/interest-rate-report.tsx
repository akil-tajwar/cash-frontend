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
import { getInterestRateReport } from '@/utils/api'
import type { GetInterestRateReportType } from '@/utils/type'

export default function InterestRateReport() {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const [interestRateData, setInterestRateData] = useState<
    GetInterestRateReportType[]
  >([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const fetchInterestRateData = useCallback(async () => {
    if (!selectedDate) {
      console.log('Missing required date parameter')
      return
    }

    try {
      setLoading(true)
      const response = await getInterestRateReport(selectedDate, token)
      setInterestRateData(Array.isArray(response.data) ? response.data : [])
      console.log('🚀 ~ fetchInterestRateData ~ response.data:', response.data)
    } catch (error) {
      console.error('Error fetching interest rate data:', error)
    } finally {
      setLoading(false)
    }
  }, [token, selectedDate])

  const handlePrint = () => {
    window.print()
  }

  const formatCurrency = (amount: string) => {
    const numAmount = Number.parseFloat(amount)
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(numAmount)
  }

  const formatInterestRate = (rate: string) => {
    return `${rate}%`
  }

  const formatPercentage = (percent: number) => {
    return `${percent.toFixed(2)}%`
  }

  const calculateTotals = () => {
    return interestRateData.reduce(
      (totals, item) => ({
        totalLimit: totals.totalLimit + Number.parseFloat(item.totalLimit),
        balanceOnDate:
          totals.balanceOnDate + Number.parseFloat(item.balanceOnDate),
        balancePercent: totals.balancePercent + item.balancePercent,
      }),
      { totalLimit: 0, balanceOnDate: 0, balancePercent: 0 }
    )
  }

  const totals = calculateTotals()

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Interest Rate Report</h1>
        <Button onClick={handlePrint} className="print:hidden">
          Print
        </Button>
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
        <Button onClick={fetchInterestRateData} className="px-4 py-2">
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
        ) : interestRateData.length > 0 ? (
          <Card className="shadow-md">
            <CardContent className="p-0">
              <div className="bg-muted/30 px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">
                  Interest Rate Analysis
                </h3>
              </div>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Description</TableHead>
                      <TableHead className="font-bold">Interest Rate</TableHead>
                      <TableHead className="font-bold">Total Limit</TableHead>
                      <TableHead className="font-bold">
                        Balance on Date
                      </TableHead>
                      <TableHead className="font-bold">
                        Balance Percent
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interestRateData.map((item, index) => (
                      <TableRow key={`interest-rate-${index}`}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>
                          {formatInterestRate(item.interestRate)}
                        </TableCell>
                        <TableCell>{formatCurrency(item.totalLimit)}</TableCell>
                        <TableCell>
                          {formatCurrency(item.balanceOnDate)}
                        </TableCell>
                        <TableCell>
                          {formatPercentage(item.balancePercent)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-semibold bg-muted/20">
                      <TableCell>Total</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        {formatCurrency(totals.totalLimit.toString())}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(totals.balanceOnDate.toString())}
                      </TableCell>
                      <TableCell>
                        {formatPercentage(totals.balancePercent)}
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
