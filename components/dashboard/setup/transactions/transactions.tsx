'use client'

import type React from 'react'
import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popup } from '@/utils/popup'
import { useEffect } from 'react'
import { createTransactions, getBankAccounts, getTransactions } from '@/utils/api'
import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { CreateTransactionType, GetBankAccountType, GetTransactionType } from '@/utils/type'

const Transactions = () => {
  // State for popup visibility
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  useInitializeUser()
  const [userData] = useAtom(userDataAtom)
  const [token] = useAtom(tokenAtom)
  const router = useRouter()

  useEffect(() => {
    const checkUserData = () => {
      const storedUserData = localStorage.getItem('currentUser')
      const storedToken = localStorage.getItem('authToken')
      if (!storedUserData || !storedToken) {
        console.log('No user data or token found in localStorage')
        router.push('/signin')
        return
      }
    }
    checkUserData()
  }, [userData, token, router])

  // State for form data
  const [formData, setFormData] = useState<CreateTransactionType>({
    transactionDate: new Date().toISOString().slice(0, 10), // Format for date input (YYYY-MM-DD)
    accountId: 0,
    transactionType: 'Deposit',
    details: 'demo',
    amount: 0,
  })

  // State for transactions data
  const [transactions, setTransactions] = useState<GetTransactionType[]>([])
  const [bankAccounts, setBankAccounts] = useState<GetBankAccountType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    if (!token) return
    try {
      setIsLoading(true)
      const response = await getTransactions(token)
      if (response?.error?.status === 401) {
        router.push('/unauthorized-access')
        return
      } else {
        console.log('🚀 ~ fetchTransactions ~ response:', response)
        setTransactions(response.data ?? [])
        setError(null)
      }
    } catch (err) {
      setError('Failed to fetch transactions')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [token, router])

  const fetchBankAccounts = useCallback(async () => {
    if (!token) return
    try {
      setIsLoading(true)
      const response = await getBankAccounts(token)
      if (response?.error?.status === 401) {
        router.push('/unauthorized-access')
        return
      } else {
        console.log('🚀 ~ fetchBankAccounts ~ response:', response)
        setBankAccounts(response.data ?? [])
        setError(null)
      }
    } catch (err) {
      setError('Failed to fetch bank accounts')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [token, router])

  // Fetch transactions when component mounts
  useEffect(() => {
    fetchTransactions()
    fetchBankAccounts()
  }, [fetchTransactions, fetchBankAccounts, token])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const dataToSubmit = {
        ...formData,
        amount: Number(formData.amount),
        transactionDate: formData.transactionDate || new Date().toISOString(),
        accountId: Number(formData.accountId),
      }
      await createTransactions(dataToSubmit, token)

      // Refresh the transactions list
      const updatedTransactions = await getTransactions(token)
      setTransactions(updatedTransactions.data ?? [])

      // Reset form and close popup
      setFormData({
        transactionDate: new Date().toISOString().slice(0, 10), // Format for date input
        accountId: 0,
        transactionType: 'Deposit',
        details: 'demo',
        amount: 0,
      })
      setIsPopupOpen(false)
    } catch (err) {
      setError('Failed to create transaction')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-yellow-100 p-2 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amber-600"
            >
              <path d="M3 3v5h5" />
              <path d="M21 21v-5h-5" />
              <path d="M21 3a16 16 0 0 0-13 13" />
              <path d="M11 21a16 16 0 0 0 13-13" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">Transactions</h2>
        </div>
        <Button
          className="bg-yellow-400 hover:bg-yellow-500 text-black"
          onClick={() => setIsPopupOpen(true)}
        >
          Add Transaction
        </Button>
      </div>

      {/* Table for transaction data */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-amber-100">
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Loading transactions...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-4 text-red-500"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.accountNumber}</TableCell>
                  <TableCell>
                    {formatDate(transaction.transactionDate)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.transactionType === 'Deposit'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {transaction.transactionType}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.details || '-'}</TableCell>
                  <TableCell>
                    <span
                      className={
                        transaction.transactionType === 'Deposit'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {transaction.transactionType === 'Deposit' ? '+' : '-'}$
                      {transaction.amount.toLocaleString()}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Popup with form */}
      <Popup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title="Add Transaction"
        size="max-w-2xl h-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transactionDate">Transaction Date *</Label>
              <Input
                id="transactionDate"
                name="transactionDate"
                type="date"
                value={formData.transactionDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionType">Transaction Type *</Label>
              <Select
                value={formData.transactionType}
                onValueChange={(value) =>
                  handleSelectChange('transactionType', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Deposit">Deposit</SelectItem>
                  <SelectItem value="Withdraw">Withdraw</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Details *</Label>
              <Input
                id="details"
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                placeholder="Enter transaction details"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountId">Bank Account *</Label>
              <Select
                value={formData.accountId.toString()}
                onValueChange={(value) =>
                  handleSelectChange('accountId', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bank account" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts?.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.accountNo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="1"
                min="0"
                value={formData.amount || ''}
                onChange={(e) => {
                  const value = e.target.value
                    ? Number.parseInt(e.target.value)
                    : 0
                  setFormData((prev) => ({
                    ...prev,
                    amount: value,
                  }))
                }}
                placeholder="Enter amount"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPopupOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Transaction'}
            </Button>
          </div>
        </form>
      </Popup>
    </div>
  )
}

export default Transactions
