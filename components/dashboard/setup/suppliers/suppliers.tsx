"use client"

import type React from "react"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popup } from "@/utils/popup"
import { Building2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import type { CreateSupplierType, GetSupplierType } from "@/utils/type"
import { createSupplier, getAllSuppliers } from "@/utils/api"
import { tokenAtom, useInitializeUser, userDataAtom } from "@/utils/user"
import { useAtom } from "jotai"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

const Suppliers = () => {
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
  const [formData, setFormData] = useState<CreateSupplierType>({
    name: "",
    displayName: "",
    companyName: "",
    type: "Supplier",
    email: "",
    phone: "",
    mobile: "",
    website: "",
    isCompany: true,
    vat: "",
    street: "",
    city: "",
    zip: "",
    active: true,
    comment: "",
    createdBy: userData?.userId || 0,
    createdAt: new Date(),
  })

  // State for table data
  const [suppliers, setSuppliers] = useState<GetSupplierType[]>([])

  const fetchSuppliers = useCallback(async () => {
    if (!token) return
    setIsLoading(true)
    try {
      const response = await getAllSuppliers(token)
      if (response?.error?.status === 401) {
        router.push("/unauthorized-access")
        return
      } else {
        console.log("🚀 ~ fetchSuppliers ~ response:", response)
        setSuppliers(response.data ?? [])
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers()
  }, [fetchSuppliers])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle checkbox change
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      try {
        const payload = {
          ...formData,
          createdBy: userData?.userId || 0,
          createdAt: new Date(),
        }

        await createSupplier(payload, token)

        // Refresh the suppliers list
        fetchSuppliers()

        // Reset form and close popup
        resetForm()
      } catch (error) {
        console.error("Error creating supplier:", error)
      }
    },
    [formData, userData, token, fetchSuppliers],
  )

  const resetForm = () => {
    setFormData({
      name: "",
      displayName: "",
      companyName: "",
      type: "Supplier",
      email: "",
      phone: "",
      mobile: "",
      website: "",
      isCompany: true,
      vat: "",
      street: "",
      city: "",
      zip: "",
      active: true,
      comment: "",
      createdBy: userData?.userId || 0,
      createdAt: new Date(),
    })
    setIsPopupOpen(false)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-amber-100 p-2 rounded-md">
            <Building2 className="text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold">Suppliers</h2>
        </div>
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black" onClick={() => setIsPopupOpen(true)}>
          Add
        </Button>
      </div>

      {/* Table for supplier data */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-amber-100">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Loading suppliers...
                </TableCell>
              </TableRow>
            ) : suppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No suppliers found
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.id}</TableCell>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        supplier.type === "Supplier" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {supplier.type}
                    </span>
                  </TableCell>
                  <TableCell>{supplier.companyName || "-"}</TableCell>
                  <TableCell>{supplier.mobile}</TableCell>
                  <TableCell>{supplier.email || "-"}</TableCell>
                  <TableCell>{supplier.city}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${supplier.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {supplier.active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Popup with form */}
      <Popup isOpen={isPopupOpen} onClose={resetForm} title="Add Supplier" size="sm:max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name*</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                name="displayName"
                value={formData.displayName || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type*</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Supplier">Supplier</SelectItem>
                  <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile*</Label>
              <Input id="mobile" name="mobile" value={formData.mobile} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={formData.phone || ""} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email || ""} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" value={formData.website || ""} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City*</Label>
              <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Street</Label>
              <Input id="street" name="street" value={formData.street || ""} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input id="zip" name="zip" value={formData.zip || ""} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vat">VAT</Label>
              <Input id="vat" name="vat" value={formData.vat || ""} onChange={handleInputChange} />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Input id="comment" name="comment" value={formData.comment || ""} onChange={handleInputChange} />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isCompany"
                checked={formData.isCompany}
                onCheckedChange={(checked) => handleCheckboxChange("isCompany", checked as boolean)}
              />
              <Label htmlFor="isCompany">Is Company</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => handleCheckboxChange("active", checked as boolean)}
              />
              <Label htmlFor="active">Active</Label>
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

export default Suppliers
