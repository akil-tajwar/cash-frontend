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
import { getBankUtilizationReport } from '@/utils/api'
import type { GetBankUtilizationReportType } from '@/utils/type'

export default function BankUtilizationReport() {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const [bankUtilizationData, setBankUtilizationData] = useState<
    GetBankUtilizationReportType[]
  >([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const fetchBankUtilizationData = useCallback(async () => {
    if (!selectedDate) {
      console.log('Missing required date parameter')
      return
    }

    try {
      setLoading(true)
      const response = await getBankUtilizationReport(selectedDate, token)
      setBankUtilizationData(Array.isArray(response.data) ? response.data : [])
      console.log(
        '🚀 ~ fetchBankUtilizationData ~ response.data:',
        response.data
      )
    } catch (error) {
      console.error('Error fetching bank utilization data:', error)
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

  const formatPercentage = (percent: number) => {
    return `${percent.toFixed(2)}%`
  }

  const calculateTotals = () => {
    return bankUtilizationData.reduce(
      (totals, item) => ({
        limit: totals.limit + Number.parseFloat(item.limit),
        balanceOnDate:
          totals.balanceOnDate + Number.parseFloat(item.balanceOnDate),
        utilizePercent: totals.utilizePercent + item.utilizePercent,
      }),
      { limit: 0, balanceOnDate: 0, utilizePercent: 0 }
    )
  }

  const totals = calculateTotals()

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Bank Utilization Report</h1>
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
        <Button onClick={fetchBankUtilizationData} className="px-4 py-2">
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
        ) : bankUtilizationData.length > 0 ? (
          <Card className="shadow-md">
            <CardContent className="p-0">
              <div className="bg-muted/30 px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">
                  Bank Utilization Analysis
                </h3>
              </div>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Bank Name</TableHead>
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
                    {bankUtilizationData.map((item, index) => (
                      <TableRow key={`bank-utilization-${index}`}>
                        <TableCell>{item.bankName}</TableCell>
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
                      <TableCell>Total</TableCell>
                      <TableCell>
                        {formatCurrency(totals.limit.toString())}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(totals.balanceOnDate.toString())}
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
