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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Cash Flow Loan Account Report</h1>
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
                          <TableCell>{formatCurrency(account.limit)}</TableCell>
                          <TableCell>
                            {formatInterestRate(account.interestRate)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(account.openingBalance)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(account.deposit)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(account.withdrawal)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(account.closingBalance)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-semibold">
                        <TableCell colSpan={4}>Group Total</TableCell>
                        <TableCell>
                          {formatCurrency(
                            accounts.reduce(
                              (sum, account) => sum + account.openingBalance,
                              0
                            )
                          )}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(
                            accounts.reduce(
                              (sum, account) => sum + account.deposit,
                              0
                            )
                          )}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(
                            accounts.reduce(
                              (sum, account) => sum + account.withdrawal,
                              0
                            )
                          )}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(
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
