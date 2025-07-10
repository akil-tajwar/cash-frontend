'use client'

import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
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
import { Popup } from '@/utils/popup'
import { Plus } from 'lucide-react'
import { format } from 'date-fns'
import type {
  CreateAssetCapexAdditionType,
  GetAssetCapexAdditionType,
  GetAssetType,
} from '@/utils/type'
import { createAddition, getAllAditions, getAllAssets } from '@/utils/api'
import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'
import { useAtom } from 'jotai'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'

const AssetAddition = () => {
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

  // State for popup visibility
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // State for form data
  const [formData, setFormData] = useState<CreateAssetCapexAdditionType>({
    assetId: 0,
    additionDate: format(new Date(), 'yyyy-MM-dd'),
    addedValue: 0,
    description: '',
    newBookValue: undefined,
    createdBy: userData?.userId || 0,
  })

  // State for table data
  const [additions, setAdditions] = useState<GetAssetCapexAdditionType[]>([])
  const [assets, setAssets] = useState<GetAssetType[]>([])

  const fetchAdditions = useCallback(async () => {
    if (!token) return
    setIsLoading(true)
    try {
      const response = await getAllAditions(token)
      console.log('🚀 ~ fetchAdditions ~ response:', response)
      if (response?.error?.status === 401) {
        router.push('/unauthorized-access')
        return
      } else {
        setAdditions(response.data ?? [])
      }
    } catch (error) {
      console.error('Error fetching asset additions:', error)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  const fetchAssets = useCallback(async () => {
    if (!token) return
    try {
      const data = await getAllAssets(token)
      console.log('🚀 ~ fetchAssets ~ data:', data)
      if (data?.error?.status === 401) {
        router.push('/unauthorized-access')
        return
      } else {
        setAssets(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch assets:', error)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  // Fetch additions on component mount
  useEffect(() => {
    fetchAdditions()
    fetchAssets()
  }, [fetchAdditions, fetchAssets])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value
          ? Number(value)
          : name === 'assetId' || name === 'addedValue'
            ? 0
            : undefined,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      try {
        const payload = {
          ...formData,
          createdBy: userData?.userId || 0,
        }

        await createAddition(payload, token)

        // Refresh the additions list
        fetchAdditions()

        // Reset form and close popup
        resetForm()
      } catch (error) {
        console.error('Error creating asset addition:', error)
      }
    },
    [formData, userData, token, fetchAdditions]
  )

  const resetForm = () => {
    setFormData({
      assetId: 0,
      additionDate: format(new Date(), 'yyyy-MM-dd'),
      addedValue: 0,
      description: '',
      newBookValue: undefined,
      createdBy: userData?.userId || 0,
    })
    setIsPopupOpen(false)
  }

  // Format date for display
  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-'
    try {
      return format(new Date(date), 'MMM dd, yyyy')
    } catch {
      return date
    }
  }

  // Format currency for display
  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-yellow-400 p-2 rounded-md">
            <Plus className="bg-yellow-400" />
          </div>
          <h2 className="text-lg font-semibold">Asset Additions</h2>
        </div>
        <Button
          className="bg-yellow-400 hover:bg-yellow-500 text-black"
          onClick={() => setIsPopupOpen(true)}
        >
          Add Addition
        </Button>
      </div>

      {/* Table for asset addition data */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-amber-100">
            <TableRow>
              <TableHead>Sl No</TableHead>
              <TableHead>Addition Date</TableHead>
              <TableHead>Added Value</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Loading asset additions...
                </TableCell>
              </TableRow>
            ) : additions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No asset additions found
                </TableCell>
              </TableRow>
            ) : (
              additions.map((addition, index) => (
                <TableRow key={addition.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{formatDate(addition.additionDate)}</TableCell>
                  <TableCell>{formatCurrency(addition.addedValue)}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {addition.description || '-'}
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
        onClose={resetForm}
        title="Add Asset Capex Addition"
        size="sm:max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="assetId">Assets</Label>
              <Select
                name="assetId"
                value={formData.assetId.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, assetId: parseInt(value) }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an asset" />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem
                      key={asset.id ?? 0}
                      value={(asset.id ?? 0).toString()}
                    >
                      {asset.assetName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionDate">Addition Date*</Label>
              <Input
                id="additionDate"
                name="additionDate"
                type="date"
                value={formData.additionDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addedValue">Added Value*</Label>
              <Input
                id="addedValue"
                name="addedValue"
                type="number"
                min="0"
                step="0.01"
                value={formData.addedValue}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newBookValue">New Book Value</Label>
              <Input
                id="newBookValue"
                name="newBookValue"
                type="number"
                min="0"
                step="0.01"
                value={formData.newBookValue ?? ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description ?? ''}
                onChange={handleInputChange}
                placeholder="Optional description..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit">Save Addition</Button>
          </div>
        </form>
      </Popup>
    </div>
  )
}

export default AssetAddition
