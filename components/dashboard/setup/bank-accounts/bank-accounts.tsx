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
import type { GetBankAccountType, GetBanksType, GetCompanyType } from '@/utils/type'
import {
  createBankAccount,
  getAllCompanies,
  getBankAccounts,
  getBanks,
} from '@/utils/api'
import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { CustomCombobox } from '@/utils/custom-combobox'

const BankAccounts = () => {
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
  const [formData, setFormData] = useState({
    bankId: 0,
    accountType: 1,
    accountNo: '',
    limit: undefined as number | undefined,
    interestRate: undefined as number | undefined,
    balance: 0,
    term: undefined as number | undefined,
    companyId: 0,
  })

  // State for bank accounts data
  const [bankAccounts, setBankAccounts] = useState<GetBankAccountType[]>([])
  const [banks, setBanks] = useState<GetBanksType[]>([])
  const [companies, setCompanies] = useState<GetCompanyType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBanks = useCallback(async () => {
    if (!token) return
    try {
      setIsLoading(true)
      const response = await getBanks(token)
      if (response?.error?.status === 401) {
        router.push('/unauthorized-access')
        return
      } else {
        console.log('🚀 ~ fetchBanks ~ response:', response)
        setBanks(response.data ?? [])
        setError(null)
      }
    } catch (err) {
      setError('Failed to fetch banks')
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

  const fetchCompanies = useCallback(async () => {
    if (!token) return
    try {
      setIsLoading(true)
      const response = await getAllCompanies(token)
      if (response?.error?.status === 401) {
        router.push('/unauthorized-access')
        return
      } else {
        console.log('🚀 ~ fetchCompanies ~ response:', response)
        setCompanies(response.data ?? [])
        setError(null)
      }
    } catch (err) {
      setError('Failed to fetch companies')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  // Fetch bank accounts when component mounts
  useEffect(() => {
    fetchBankAccounts()
    fetchCompanies()
    fetchBanks()
  }, [fetchBankAccounts, fetchCompanies, fetchBanks, token])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)

      const dataToSubmit = {
        ...formData,
        balance: Number(formData.balance),
      }

      await createBankAccount(dataToSubmit as any, token)

      // Refresh the bank accounts list
      const updatedBankAccounts = await getBankAccounts(token)
      setBankAccounts(updatedBankAccounts.data ?? [])

      // Reset form and close popup
      setFormData({
        bankId: 0,
        accountType: 1,
        accountNo: '',
        limit: undefined,
        interestRate: undefined,
        balance: 0,
        term: undefined,
        companyId: 0,
      })
      setIsPopupOpen(false)
    } catch (err) {
      setError('Failed to create bank account')
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

  const handleSelectChange = (name: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
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
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">Bank Accounts</h2>
        </div>
        <Button
          className="bg-yellow-400 hover:bg-yellow-500 text-black"
          onClick={() => setIsPopupOpen(true)}
        >
          Add Account
        </Button>
      </div>

      {/* Table for bank account data */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-amber-100">
            <TableRow>
              <TableHead>Bank Name</TableHead>
              <TableHead>Account Number</TableHead>
              <TableHead>Account Type</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Interest Rate</TableHead>
              <TableHead>Credit Limit</TableHead>
              <TableHead>Company</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Loading bank accounts...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-4 text-red-500"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : bankAccounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No bank accounts found
                </TableCell>
              </TableRow>
            ) : (
              bankAccounts.map((account, index) => (
                <TableRow key={account.id || index}>
                  <TableCell>{account.bankName || '-'}</TableCell>
                  <TableCell>
                    {/* {account.accountNo
                      ? `****${account.accountNo.toString().slice(-4)}`
                      : '-'} */}
                    {account.accountNo || '-'}
                  </TableCell>
                  <TableCell>
                    {account.accountType === 1
                      ? 'Checking'
                      : account.accountType === 2
                        ? 'Savings'
                        : account.accountType === 3
                          ? 'Business'
                          : account.accountType === 4
                            ? 'Money Market'
                            : account.accountType === 5
                              ? 'Term Deposit'
                              : '-'}
                  </TableCell>
                  <TableCell>
                    ${account.balance?.toLocaleString() || '0.00'}
                  </TableCell>
                  <TableCell>
                    {account.interestRate ? `${account.interestRate}%` : '-'}
                  </TableCell>
                  <TableCell>
                    {account.limit ? `$${account.limit.toLocaleString()}` : '-'}
                  </TableCell>
                  <TableCell>{account.companyName || '-'}</TableCell>
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
        title="Add Bank Account"
        size="max-w-2xl h-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankId">Bank Name *</Label>
              <CustomCombobox
                items={banks
                  .filter((bank) => bank.id !== undefined)
                  .map((bank) => ({
                    id: bank.id!.toString(),
                    name: bank.bankName || 'Unnamed Bank',
                  }))}
                value={formData.bankId
                  ? {
                      id: formData.bankId.toString(),
                      name: banks.find((bank) => bank.id === formData.bankId)?.bankName || 'Unnamed Bank',
                    }
                  : null
                }
                onChange={(value: { id: string; name: string } | null) => {
                  const numValue = value ? Number.parseInt(value.id, 10) : 0
                  setFormData((prev) => ({
                    ...prev,
                    bankId: numValue
                  }))
                }}
                placeholder="Select bank"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type *</Label>
                <CustomCombobox
                  items={[
                    { id: "1", name: "Checking" },
                    { id: "2", name: "Savings" },
                    { id: "3", name: "Business" },
                    { id: "4", name: "Money Market" },
                    { id: "5", name: "Term Deposit" }
                  ]}
                  value={formData.accountType ? {
                    id: formData.accountType.toString(),
                    name: ["", "Checking", "Savings", "Business", "Money Market", "Term Deposit"][formData.accountType]
                  } : null}
                  onChange={(value: { id: string; name: string } | null) => {
                    const numValue = value ? Number.parseInt(value.id, 10) : 0
                    setFormData((prev) => ({
                      ...prev,
                      accountType: numValue
                    }))
                  }}
                  placeholder="Select account type"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNo">Account Number *</Label>
                <Input
                  id="accountNo"
                  name="accountNo"
                  value={formData.accountNo || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    setFormData((prev) => ({
                      ...prev,
                      accountNo: value,
                    }))
                  }}
                  placeholder="Enter account number"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyId">Company</Label>
              <CustomCombobox
                items={companies
                  .filter((company) => company.companyId !== undefined)
                  .map((company) => ({
                    id: company.companyId.toString(),
                    name: company.companyName || 'Unnamed Company',
                  }))}
                value={formData.companyId
                  ? {
                      id: formData.companyId.toString(),
                      name: companies.find((company) => company.companyId === formData.companyId)?.companyName || 'Unnamed Company',
                    }
                  : null
                }
                onChange={(value: { id: string; name: string } | null) => {
                  const numValue = value ? Number.parseInt(value.id, 10) : 0
                  setFormData((prev) => ({
                    ...prev,
                    companyId: numValue
                  }))
                }}
                placeholder="Select parent company"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="balance">Balance</Label>
                <Input
                  id="balance"
                  name="balance"
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => {
                    const value = e.target.value
                      ? Number.parseFloat(e.target.value)
                      : 0
                    setFormData((prev) => ({
                      ...prev,
                      balance: value,
                    }))
                  }}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="limit">Credit Limit (Optional)</Label>
                <Input
                  id="limit"
                  name="limit"
                  type="number"
                  step="0.01"
                  value={formData.limit || ''}
                  onChange={(e) => {
                    const value = e.target.value
                      ? Number.parseFloat(e.target.value)
                      : undefined
                    setFormData((prev) => ({
                      ...prev,
                      limit: value,
                    }))
                  }}
                  placeholder="Enter credit limit"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate % (Optional)</Label>
                <Input
                  id="interestRate"
                  name="interestRate"
                  type="number"
                  step="0.01"
                  value={formData.interestRate || ''}
                  onChange={(e) => {
                    const value = e.target.value
                      ? Number.parseFloat(e.target.value)
                      : undefined
                    setFormData((prev) => ({
                      ...prev,
                      interestRate: value,
                    }))
                  }}
                  placeholder="e.g., 2.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="term">Term (Months, Optional)</Label>
                <Input
                  id="term"
                  name="term"
                  type="number"
                  value={formData.term || ''}
                  onChange={(e) => {
                    const value = e.target.value
                      ? Number.parseInt(e.target.value)
                      : undefined
                    setFormData((prev) => ({
                      ...prev,
                      term: value,
                    }))
                  }}
                  placeholder="e.g., 12"
                />
              </div>
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
              {isLoading ? 'Saving...' : 'Save Account'}
            </Button>
          </div>
        </form>
      </Popup>
    </div>
  )
}

export default BankAccounts
