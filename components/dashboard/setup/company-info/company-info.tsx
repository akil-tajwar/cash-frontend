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
import { Popup } from '@/utils/popup'
import { useEffect } from 'react'
import { GetCompanyType } from '@/utils/type'
import { createCompany, getAllCompanies } from '@/utils/api'
import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'

const CompanyInfo = () => {
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
    companyName: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    phone: '',
    email: '',
    website: '',
    taxId: '',
    logo: 'www.logo.com',
    parentCompanyId: null as number | null,
    active: true,
  })

  // Replace the static companies state with a state that will be populated from the API
  const [companies, setCompanies] = useState<GetCompanyType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  // Add useEffect to fetch companies when component mounts
  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies, token])

  // Update the handleSubmit function to use the createCompany API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      // You'll need to get the token from your auth system

      // Convert parentCompanyId to number if it exists
      const dataToSubmit = {
        ...formData,
        // Add any other transformations needed for the API
      }

      await createCompany(dataToSubmit as any, token) // Using 'as any' temporarily due to type mismatch

      // Refresh the companies list
      const updatedCompanies = await getAllCompanies(token)
      setCompanies(updatedCompanies.data ?? [])

      // Reset form and close popup
      setFormData({
        companyName: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        phone: '',
        email: '',
        website: '',
        taxId: '',
        logo: 'www.logo.com',
        parentCompanyId: null,
        active: true,
      })
      setIsPopupOpen(false)
    } catch (err) {
      setError('Failed to create company')
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

  return (
    <div className="p-6 space-y-6">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-amber-100 p-2 rounded-md">
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
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">Company Details</h2>
        </div>
        <Button
          className="bg-yellow-400 hover:bg-yellow-500 text-black"
          onClick={() => setIsPopupOpen(true)}
        >
          Add
        </Button>
      </div>

      {/* Table for company data */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-amber-100">
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Postal Code</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading companies...
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
            ) : companies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No companies found
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company) => (
                <TableRow key={company.companyId}>
                  <TableCell>{company.companyName}</TableCell>
                  <TableCell>{company.address || '-'}</TableCell>
                  <TableCell>{company.city || '-'}</TableCell>
                  <TableCell>{company.state || '-'}</TableCell>
                  <TableCell>{company.postalCode || '-'}</TableCell>
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
        title="Add Company"
        size="max-w-2xl h-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Logo Upload Section */}
            <div className="space-y-2">
              <Label>Company Logo</Label>
              <div
                className="border-2 border-dashed rounded-md p-6 flex items-center justify-center bg-gray-50 cursor-pointer"
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                <p className="text-gray-600">Drop your image here</p>
                <input
                  type="file"
                  id="logo-upload"
                  className="hidden"
                  accept=".jpg,.jpeg,.gif,.png"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      // In a real implementation, you would handle file upload
                      // and set the returned URL to formData.logo
                      setFormData((prev) => ({
                        ...prev,
                        logo: e.target.files?.[0]?.name || '',
                      }))
                    }
                  }}
                />
              </div>
              <p className="text-sm text-gray-500">
                Only (JPG, GIF, PNG) are allowed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input
                id="taxId"
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentCompanyId">Parent Company ID</Label>
              <Input
                id="parentCompanyId"
                name="parentCompanyId"
                type="number"
                value={formData.parentCompanyId || ''}
                onChange={(e) => {
                  const value = e.target.value
                    ? Number.parseInt(e.target.value)
                    : null
                  setFormData((prev) => ({
                    ...prev,
                    parentCompanyId: value,
                  }))
                }}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    active: e.target.checked,
                  }))
                }}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="active">Active</Label>
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
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Popup>
    </div>
  )
}

export default CompanyInfo
