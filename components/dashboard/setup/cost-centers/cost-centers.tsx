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
import { Building2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { CreateCostCenterType, GetCostCenterType } from '@/utils/type'
import { createCostCenter, getAllCostCenters } from '@/utils/api'
import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'

const CostCenters = () => {
  const { toast } = useToast()

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

  // State for loading indicators
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State for form data
  const [formData, setFormData] = useState<CreateCostCenterType>({
    costCenterName: '',
    costCenterDescription: '',
    budget: 0,
    actual: 0,
    companyCode: null,
    isActive: true,
    isVehicle: false,
    startDate: null,
    endDate: null,
    createdBy: 1, // Default value, should be replaced with actual user ID
    createdAt: new Date(),
    updatedBy: null,
    updatedAt: null,
  })

  // State for table data
  const [costCenters, setCostCenters] = useState<GetCostCenterType[]>([])

  // Function to fetch cost centers
  const fetchCostCenters = useCallback(async () => {
    if (!token) return
    setIsLoading(true)
    try {
      const response = await getAllCostCenters(token)
      if (response?.error?.status === 401) {
        router.push('/unauthorized-access')
        return
      } else {
        console.log('🚀 ~ fetchCostCenters ~ response:', response)
        setCostCenters(response.data ?? [])
      }
    } catch (error) {
      console.error('Error fetching cost centers:', error)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  // Fetch cost centers on component mount
  useEffect(() => {
    fetchCostCenters()
  }, [fetchCostCenters, token])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    // Convert numeric fields to numbers
    if (name === 'budget' || name === 'actual' || name === 'companyCode') {
      setFormData((prev) => ({
        ...prev,
        [name]:
          value === '' ? (name === 'companyCode' ? null : 0) : Number(value),
      }))
    } else if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else if (type === 'date') {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? new Date(value) : null,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Call API to create cost center
      await createCostCenter(formData, token)

      // Refresh the cost centers list
      await fetchCostCenters()

      // Reset form and close popup
      setFormData({
        costCenterName: '',
        costCenterDescription: '',
        budget: 0,
        actual: 0,
        companyCode: null,
        isActive: true,
        isVehicle: false,
        startDate: null,
        endDate: null,
        createdBy: userData?.userId || 0,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: null,
      })

      setIsPopupOpen(false)

      toast({
        title: 'Success',
        description: 'Cost center created successfully',
      })
    } catch (error) {
      console.error('Error creating cost center:', error)
      toast({
        title: 'Error',
        description: 'Failed to create cost center. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-amber-100 p-2 rounded-md">
            <Building2 className="text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold">Cost Centers</h2>
        </div>
        <Button
          className="bg-yellow-400 hover:bg-yellow-500 text-black"
          onClick={() => setIsPopupOpen(true)}
        >
          Add
        </Button>
      </div>

      {/* Table for cost center data */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-amber-100">
            <TableRow>
              <TableHead>Cost Center Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Actual</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading cost centers...
                </TableCell>
              </TableRow>
            ) : costCenters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No cost centers found. Add your first one!
                </TableCell>
              </TableRow>
            ) : (
              costCenters.map((costCenter) => (
                <TableRow key={costCenter.costCenterId}>
                  <TableCell>{costCenter.costCenterName}</TableCell>
                  <TableCell>
                    {costCenter.costCenterDescription || '-'}
                  </TableCell>
                  <TableCell>${costCenter.budget.toLocaleString()}</TableCell>
                  <TableCell>${costCenter.actual.toLocaleString()}</TableCell>
                  <TableCell>
                    {costCenter.isActive ? 'Active' : 'Inactive'}
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
        title="Add Cost Center"
        size="sm:max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="costCenterName">Cost Center Name</Label>
              <Input
                id="costCenterName"
                name="costCenterName"
                value={formData.costCenterName}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costCenterDescription">Description</Label>
              <Input
                id="costCenterDescription"
                name="costCenterDescription"
                value={formData.costCenterDescription || ''}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="actual">Actual</Label>
                <Input
                  id="actual"
                  name="actual"
                  type="number"
                  value={formData.actual}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive || false}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300"
                disabled={isSubmitting}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyCode">Company Code</Label>
            <Input
              id="companyCode"
              name="companyCode"
              type="number"
              value={formData.companyCode || ''}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id="isVehicle"
              name="isVehicle"
              checked={formData.isVehicle || false}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-gray-300"
              disabled={isSubmitting}
            />
            <Label htmlFor="isVehicle">Is Vehicle</Label>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={
                  formData.startDate
                    ? new Date(formData.startDate).toISOString().split('T')[0]
                    : ''
                }
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={
                  formData.endDate
                    ? new Date(formData.endDate).toISOString().split('T')[0]
                    : ''
                }
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPopupOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Popup>
    </div>
  )
}

export default CostCenters
