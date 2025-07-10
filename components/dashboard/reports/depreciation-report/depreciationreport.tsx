'use client'

import { useCallback, useEffect, useState } from 'react'
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
import {
  getAllDepreciationBook,
  getAllDepreciationTransactions,
  getDepreciationReport,
} from '@/utils/api'
import type {
  GetDepreciationBookType,
  GetDepreciationReportType,
  GetDepTranType,
} from '@/utils/type'
import { tokenAtom, useInitializeUser } from '@/utils/user'
import { useAtom } from 'jotai'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default function DepreciationReport() {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)

  const router = useRouter()
  const [selectedBookId, setSelectedBookId] = useState<number>(0)
  const [selectedDepPeriod, setSelectedDepPeriod] = useState<number>(0)
  const [periodId, setPeriodId] = useState<string>('')
  const [depreciationData, setDepreciationData] = useState<
    GetDepreciationReportType[]
  >([])
  const [bookData, setBookData] = useState<GetDepreciationBookType[]>([])
  const [depTranData, setDepTranData] = useState<GetDepTranType[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    if (!token || !periodId || !selectedBookId) return
    try {
      setLoading(true)
      const response = await getDepreciationReport(
        token,
        periodId,
        selectedBookId
      )
      if (response?.error?.status === 401) {
        // router.push('/unauthorized-access')
        return
      } else {
        setDepreciationData(response.data || [])
        console.log('🚀 ~ fetchData ~ response.data:', response.data)
      }
    } catch (error) {
      console.error('Error fetching selectDep report:', error)
    } finally {
      setLoading(false)
    }
  }, [token, periodId, selectedBookId])

  const fetchBookData = useCallback(async () => {
    if (!token) return
    try {
      setLoading(true)
      const response = await getAllDepreciationBook(token)
      if (response?.error?.status === 401) {
        // router.push('/unauthorized-access')
        return
      } else {
        setBookData(response.data || [])
        console.log('🚀 ~ fetchBookData ~ response.data:', response.data)
      }
    } catch (error) {
      console.error('Error fetching depreciation report:', error)
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
        // router.push('/unauthorized-access')
        return
      } else {
        const uniquePeriods =
          response.data?.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.period === item.period)
          ) || []
        setDepTranData(uniquePeriods)
        console.log('ddddddddddddddddddd', uniquePeriods)
      }
    } catch (error) {
      console.error('Error fetching depreciation report:', error)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchBookData()
    fetchDepTran()
  }, [fetchBookData, fetchDepTran])

  const handlePrint = () => {
    window.print()
  }

  const flattenData = (data: GetDepreciationReportType[]): any[] => {
    return data.map((item) => ({
      asset_name: item.asset_name,
      transaction_date: item.transaction_date,
      depreciation_method: item.depreciation_method,
      depreciation_amount: item.depreciation_amount,
      depreciation_rate: item.depreciation_rate,
      useful_life_months: item.useful_life_months,
      residual_value: item.residual_value,
      current_value: item.current_value,
      acc_dep: item.acc_dep,
    }))
  }

  const generateExcel = () => {
    exportToExcel(depreciationData, 'depreciation-report')
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return format(new Date(dateString), 'MMM dd, yyyy')
  }

  const exportToExcel = (
    data: GetDepreciationReportType[],
    fileName: string
  ) => {
    const worksheet = XLSX.utils.json_to_sheet(flattenData(data))
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Depreciation Report')
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    })
    saveAs(blob, `${fileName}.xlsx`)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Depreciation Report</h1>
        <div className="flex gap-2">
          <Button onClick={generateExcel} className="print:hidden">
            Export to Excel
          </Button>
          <Button onClick={handlePrint} className="print:hidden">
            Print
          </Button>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-4 print:hidden">
        <div>
          <label className="block text-sm font-medium mb-1">Period</label>
          <Select
            value={periodId}
            onValueChange={(value) => setPeriodId(value)}
          >
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
          <label className="block text-sm font-medium mb-1">Book</label>
          <Select
            value={selectedBookId.toString()}
            onValueChange={(value) => setSelectedBookId(Number(value))}
          >
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
        <div className="flex items-end">
          <Button onClick={fetchData} className="px-4 py-2">
            Show
          </Button>
        </div>
      </div>{' '}
      <Card className="shadow-md">
        <CardContent className="overflow-auto">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Transaction Date</TableHead>
                  <TableHead>Depreciation Method</TableHead>
                  <TableHead>Depreciation Amount (BDT)</TableHead>
                  <TableHead>Depreciation Rate (%)</TableHead>
                  <TableHead>Useful Life (Months)</TableHead>
                  <TableHead>Residual Value (BDT)</TableHead>
                  <TableHead>Current Value (BDT)</TableHead>
                  <TableHead>Accumulated Depreciation (BDT)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {depreciationData.length > 0 ? (
                  depreciationData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.asset_name}</TableCell>
                      <TableCell>{formatDate(item.transaction_date)}</TableCell>
                      <TableCell>{item.depreciation_method}</TableCell>
                      <TableCell>{item.depreciation_amount}</TableCell>
                      <TableCell>{item.depreciation_rate}</TableCell>
                      <TableCell>{item.useful_life_months}</TableCell>
                      <TableCell>{item.residual_value}</TableCell>
                      <TableCell>{item.current_value}</TableCell>
                      <TableCell>{item.acc_dep}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      className="text-center text-gray-500"
                    >
                      No data found for this date
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
