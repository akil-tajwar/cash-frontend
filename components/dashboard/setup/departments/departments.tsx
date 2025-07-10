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
import { Users } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'
import { CreateDepartmentType, GetDepartmentType } from '@/utils/type'
import { createDepartment, getAllDepartments } from '@/utils/api'
import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'

const Departments = () => {
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
  const [formData, setFormData] = useState<CreateDepartmentType>({
    departmentName: '',
    budget: undefined,
    companyCode: undefined,
    isActive: true,
    startDate: new Date(),
    endDate: null,
    createdBy: userData?.userId || 0,
    actual: undefined,
  })

  // State for table data
  const [departments, setDepartments] = useState<GetDepartmentType[]>([])

  const fetchDepartments = useCallback(async () => {
    if (!token) return
    setIsLoading(true)
    try {
      const response = await getAllDepartments(token)
      if (response?.error?.status === 401) {
        router.push('/unauthorized-access')
        return
      } else {
        console.log('🚀 ~ fetchDepartments ~ response:', response)
        setDepartments(response.data ?? [])
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments()
  }, [fetchDepartments])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? Number(value) : undefined,
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

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isActive: checked,
    }))
  }

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      try {
        // Convert Date objects to 'YYYY-MM-DD' strings
        const payload = {
          ...formData,
          startDate: formData.startDate ? new Date(formData.startDate) : null,
          endDate: formData.endDate ? new Date(formData.endDate) : null,
        }

        await createDepartment(payload, token)

        // Refresh the departments list
        fetchDepartments()

        // Reset form and close popup
        resetForm()
      } catch (error) {
        console.error('Error creating department:', error)
      }
    },
    [formData, userData, token, fetchDepartments]
  )

  const resetForm = () => {
    setFormData({
      departmentName: '',
      budget: undefined,
      companyCode: undefined,
      isActive: true,
      startDate: new Date(),
      endDate: null,
      createdBy: userData?.userId || 0,
      actual: undefined,
    })
    setIsPopupOpen(false)
  }

  // Format date for display
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '-'
    return format(new Date(date), 'MMM dd, yyyy')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-amber-100 p-2 rounded-md">
            <Users className="text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold">Departments</h2>
        </div>
        <Button
          className="bg-yellow-400 hover:bg-yellow-500 text-black"
          onClick={() => setIsPopupOpen(true)}
        >
          Add
        </Button>
      </div>

      {/* Table for department data */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-amber-100">
            <TableRow>
              <TableHead>Department ID</TableHead>
              <TableHead>Department Name</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Company Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Actual</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Loading departments...
                </TableCell>
              </TableRow>
            ) : departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No departments found
                </TableCell>
              </TableRow>
            ) : (
              departments.map((department) => (
                <TableRow key={department.departmentID}>
                  <TableCell>{department.departmentID}</TableCell>
                  <TableCell>{department.departmentName}</TableCell>
                  <TableCell>{department.budget ?? '-'}</TableCell>
                  <TableCell>{department.companyCode ?? '-'}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${department.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {department.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(department.startDate)}</TableCell>
                  <TableCell>{formatDate(department.endDate)}</TableCell>
                  <TableCell>{department.actual ?? '-'}</TableCell>
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
        title="Add Department"
        size="sm:max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="departmentName">Department Name*</Label>
              <Input
                id="departmentName"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                value={formData.budget ?? ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyCode">Company Code</Label>
              <Input
                id="companyCode"
                name="companyCode"
                type="number"
                value={formData.companyCode ?? ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actual">Actual</Label>
              <Input
                id="actual"
                name="actual"
                type="number"
                value={formData.actual ?? ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={
                    formData.startDate
                      ? format(new Date(formData.startDate), 'yyyy-MM-dd')
                      : ''
                  }
                  onChange={handleInputChange}
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
                      ? format(new Date(formData.endDate), 'yyyy-MM-dd')
                      : ''
                  }
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive ?? false}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Popup>
    </div>
  )
}

export default Departments
