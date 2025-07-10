'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FolderOpen } from 'lucide-react'
import { CreateCategoryType, GetCategoryType } from '@/utils/type'
import { createCategory, getAllCategories } from '@/utils/api'
import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'

const Categories = () => {
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

  // State for form data - updated to match the Zod schema
  const [formData, setFormData] = useState<Partial<CreateCategoryType>>({
    category_name: '',
    depreciation_rate: null,
    account_code: '',
    depreciation_account_code: '',
    parent_cat_code: null,
    created_by: 1, // This should be the current user's ID
  })

  // State for categories data from API
  const [categories, setCategories] = useState<GetCategoryType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        // You'll need to get the token from your auth system
        const response = await getAllCategories(token)
        setCategories(response.data || [])
        setError(null)
      } catch (err) {
        setError('Failed to fetch categories')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    // Handle different input types
    if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? null : Number(value),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? null : value,
      }))
    }
  }

  // Handle select change for parent category
  const handleParentCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      parent_cat_code: value === '' ? null : Number(value),
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      // Prepare data for submission
      const dataToSubmit: CreateCategoryType = {
        ...(formData as CreateCategoryType),
        // Add any additional required fields here
      }

      await createCategory(dataToSubmit, token)

      // Refresh the categories list
      const updatedCategories = await getAllCategories(token)
      setCategories(updatedCategories.data || [])

      // Reset form and close popup
      setFormData({
        category_name: '',
        depreciation_rate: null,
        account_code: '',
        depreciation_account_code: '',
        parent_cat_code: null,
        created_by: userData?.userId,
      })
      setIsPopupOpen(false)
      setError(null)
    } catch (err) {
      setError('Failed to create category')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-amber-100 p-2 rounded-md">
            <FolderOpen className="text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold">Categories</h2>
        </div>
        <Button
          className="bg-yellow-400 hover:bg-yellow-500 text-black"
          onClick={() => setIsPopupOpen(true)}
        >
          Add
        </Button>
      </div>

      {/* Table for category data */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-amber-100">
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Asset Accounting Code</TableHead>
              <TableHead>Depreciation Accounting Code</TableHead>
              <TableHead>Depreciation Rate</TableHead>
              <TableHead>Parent Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading categories...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-4 text-red-500"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.category_id}>
                  <TableCell>{category.category_name}</TableCell>
                  <TableCell>{category.account_code || '-'}</TableCell>
                  <TableCell>
                    {category.depreciation_account_code || '-'}
                  </TableCell>
                  <TableCell>
                    {category.depreciation_rate !== null
                      ? `${category.depreciation_rate}%`
                      : '-'}
                  </TableCell>
                  <TableCell>{category.parent_cat_code || '-'}</TableCell>
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
        title="Add Category"
        size="sm:max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="category_name">Category Name</Label>
              <Input
                id="category_name"
                name="category_name"
                value={formData.category_name || ''}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account_code">Asset Accounting Code</Label>
              <Input
                id="account_code"
                name="account_code"
                value={formData.account_code || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depreciation_account_code">
                Depreciation Accounting Code
              </Label>
              <Input
                id="depreciation_account_code"
                name="depreciation_account_code"
                value={formData.depreciation_account_code || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depreciation_rate">Depreciation Rate (%)</Label>
              <Input
                id="depreciation_rate"
                name="depreciation_rate"
                type="number"
                min="0"
                step="0.01"
                value={
                  formData.depreciation_rate === null
                    ? ''
                    : formData.depreciation_rate
                }
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_cat_code">Parent Category</Label>
              <Select
                value={formData.parent_cat_code?.toString() || ''}
                onValueChange={handleParentCategoryChange}
              >
                <SelectTrigger id="parent_cat_code">
                  <SelectValue placeholder="Select parent category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.category_id}
                      value={category.category_id?.toString() || ''}
                    >
                      {category.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPopupOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Popup>
    </div>
  )
}

export default Categories
