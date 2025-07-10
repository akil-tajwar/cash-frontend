'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowUpDown, Eye, MoreVertical, Pencil } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import type {
  CreateDepreciationInfoType,
  GetAssetType,
  CreateAssetCapexAdditionType,
  CreateAssetPartialRetirementType,
  GetDepreciationBookType,
  GetDepartmentType,
  GetCategoryType,
  GetLocationType,
  GetSupplierType,
  EditAssetType,
  CreateDisposeType,
} from '@/utils/type'
import {
  createDepreciationInfo,
  getAllAssets,
  createAddition,
  createRetirement,
  getAllDepreciationBook,
  getAllSuppliers,
  updateAsset,
  getAllDepartments,
  getAllCategories,
  getAllLocations,
  createDispose,
} from '@/utils/api'
import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'
import { useAtom } from 'jotai'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  createDepreciationInfoSchema,
  createAssetCapexAdditionSchema,
  createAssetPartialRetirementSchema,
  editAssetSchema,
  createDisposeSchema,
} from '@/utils/type'
import { useRouter } from 'next/navigation'
import { CustomCombobox } from '@/utils/custom-combobox'
import { format } from 'date-fns'
import { z } from 'zod'

const Assets = () => {
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

  // State for assets data
  const [assets, setAssets] = useState<GetAssetType[]>([])
  const [suppliers, setSuppliers] = useState<GetSupplierType[]>([])
  const [depreciationBooks, setDepreciationBooks] = useState<
    GetDepreciationBookType[]
  >([])
  const [departments, setDepartments] = useState<GetDepartmentType[]>([])
  const [categories, setCategories] = useState<GetCategoryType[]>([])
  const [locations, setLocations] = useState<GetLocationType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // State for dialogs
  const [isDepreciationDialogOpen, setIsDepreciationDialogOpen] =
    useState(false)
  const [isAdditionDialogOpen, setIsAdditionDialogOpen] = useState(false)
  const [isRetirementDialogOpen, setIsRetirementDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDisposeDialogOpen, setIsDisposeDialogOpen] = useState(false)
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null)
  const [editAsset, setEditAsset] = useState<GetAssetType | null>(null)

  // Sorting states
  const [sortColumn, setSortColumn] = useState<keyof GetAssetType>('id')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Filter assets based on search term
  const filteredAssets = assets.filter((asset) =>
    Object.values(asset).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  // const paginatedAssets = filteredAssets.slice(
  //   startIndex,
  //   startIndex + itemsPerPage
  // )

  // Form setups
  const depreciationForm = useForm<CreateDepreciationInfoType>({
    resolver: zodResolver(createDepreciationInfoSchema),
    defaultValues: {
      depreciationMethod: 'Straight Line',
      startingValue: 0,
      depreciationRate: 0,
      bookId: 0,
      usefulLifeMonths: 0,
      accDepValue: 0,
      residualValue: 0,
      effectiveDate: new Date().toISOString().split('T')[0],
      createdBy: userData?.userId,
    },
  })

  const additionForm = useForm<CreateAssetCapexAdditionType>({
    resolver: zodResolver(createAssetCapexAdditionSchema),
    defaultValues: {
      assetId: 0,
      additionDate: new Date().toISOString().split('T')[0],
      addedValue: 0,
      description: '',
      supplierId: 0,
      newBookValue: 0,
      createdBy: userData?.userId,
    },
  })

  const retirementForm = useForm<CreateAssetPartialRetirementType>({
    resolver: zodResolver(createAssetPartialRetirementSchema),
    defaultValues: {
      assetId: 0,
      retirementDate: new Date().toISOString().split('T')[0],
      retiredValue: 0,
      reason: '',
      updatedBookValue: 0,
      createdBy: userData?.userId,
    },
  })

  const disposalForm = useForm<CreateDisposeType>({
      resolver: zodResolver(createDisposeSchema),
      defaultValues: {
        asset_id: 0,
        dispose_date: format(new Date(), 'yyyy-MM-dd'),
        reason: '',
        method: 'Sell',
        value: '',
        remarks: '',
        performed_by: userData?.userId?.toString() || '',
      },
    })
  

  const editForm = useForm<EditAssetType>({
    resolver: zodResolver(editAssetSchema),
    defaultValues: {
      departmentId: 0,
      categoryId: 0,
      locationId: 0,
      user: ''
    },
  })

  // Fetch functions
  const fetchAssets = useCallback(async () => {
    if (!token) return
    try {
      const data = await getAllAssets(token)
      if (data?.error?.status === 401) {
        router.push('/unauthorized-access')
        return
      } else {
        setAssets(data.data || [])
        console.log("🚀 ~ fetchAssets ~ data:", data)
      }
    } catch (error) {
      console.error('Failed to fetch assets:', error)
      toast({
        title: 'Error',
        description: 'Failed to load assets. Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast, token, router])

  const fetchDepreciationBooks = useCallback(async () => {
    if (!token) return
    try {
      const response = await getAllDepreciationBook(token)
      if (response?.error?.status === 401) {
        router.push('/unauthorized-access')
        return
      } else if (response.data) {
        setDepreciationBooks(response.data)
      } else {
        setDepreciationBooks([])
        if (response.error) {
          toast({
            title: 'Error',
            description: response.error.message,
            variant: 'destructive',
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch depreciation books:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch depreciation books',
        variant: 'destructive',
      })
    }
  }, [token, router, toast])

  const fetchSuppliers = useCallback(async () => {
    if (!token) return
    try {
      const response = await getAllSuppliers(token)
      if (response?.error?.status === 401) {
        router.push('/unauthorized-access')
        return
      } else if (response.data) {
        setSuppliers(response.data)
      } else {
        setSuppliers([])
        if (response.error) {
          toast({
            title: 'Error',
            description: response.error.message,
            variant: 'destructive',
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch suppliers',
        variant: 'destructive',
      })
    }
  }, [token, router, toast])

  const fetchDepartments = useCallback(async () => {
    if (!token) return
    try {
      const response = await getAllDepartments(token)
      if (response?.error?.status === 401) {
        router.push('/unauthorized-access')
        return
      } else if (response.data) {
        setDepartments(response.data)
      } else {
        setDepartments([])
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch departments',
        variant: 'destructive',
      })
    }
  }, [token, router, toast])

  const fetchCategories = useCallback(async () => {
    if (!token) return
    try {
      const response = await getAllCategories(token)
      if (response?.error?.status === 401) {
        router.push('/unauthorized-access')
        return
      } else if (response.data) {
        setCategories(response.data)
      } else {
        setCategories([])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch categories',
        variant: 'destructive',
      })
    }
  }, [token, router, toast])

  const fetchLocations = useCallback(async () => {
    if (!token) return
    try {
      const response = await getAllLocations(token)
      if (response?.error?.status === 401) {
        router.push('/unauthorized-access')
        return
      } else if (response.data) {
        setLocations(response.data)
      } else {
        setLocations([])
      }
    } catch (error) {
      console.error('Failed to fetch locations:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch locations',
        variant: 'destructive',
      })
    }
  }, [token, router, toast])

  useEffect(() => {
    fetchAssets()
    fetchDepreciationBooks()
    fetchSuppliers()
    fetchDepartments()
    fetchCategories()
    fetchLocations()
  }, [
    fetchAssets,
    fetchDepreciationBooks,
    fetchSuppliers,
    fetchDepartments,
    fetchCategories,
    fetchLocations,
  ])

  // Dialog handlers
  const handleOpenDepreciationDialog = (assetId: number) => {
    const defaultDepMethod = 'Straight Line'
    depreciationForm.reset({
      assetId: assetId,
      bookId: 1,
      depreciationMethod: defaultDepMethod,
      startingValue: 0,
      depreciationRate: defaultDepMethod === 'Straight Line' ? 0 : 1,
      usefulLifeMonths: defaultDepMethod === 'Straight Line' ? 1 : 0,
      residualValue: 0,
      effectiveDate: new Date().toISOString().split('T')[0],
      createdBy: userData?.userId,
    })
    setSelectedAssetId(assetId)
    setIsDepreciationDialogOpen(true)
  }

  const depreciationMethod = depreciationForm.watch('depreciationMethod')

  useEffect(() => {
    if (depreciationMethod === 'Straight Line') {
      depreciationForm.setValue('usefulLifeMonths', 1)
      depreciationForm.setValue('depreciationRate', 0)
    } else if (depreciationMethod === 'Declining Balance') {
      depreciationForm.setValue('depreciationRate', 1)
      depreciationForm.setValue('usefulLifeMonths', 0)
    }
  }, [depreciationMethod, depreciationForm])

  const handleOpenAdditionDialog = (assetId: number) => {
    setSelectedAssetId(assetId)
    additionForm.reset({
      assetId: assetId,
      additionDate: new Date().toISOString().split('T')[0],
      addedValue: 0,
      description: '',
      supplierId: 0,
      newBookValue: 0,
      createdBy: userData?.userId,
    })
    setIsAdditionDialogOpen(true)
  }

  const handleOpenRetirementDialog = (assetId: number) => {
    setSelectedAssetId(assetId)
    retirementForm.reset({
      assetId: assetId,
      retirementDate: new Date().toISOString().split('T')[0],
      retiredValue: 0,
      reason: '',
      updatedBookValue: 0,
      createdBy: userData?.userId,
    })
    setIsRetirementDialogOpen(true)
  }

  const handleOpenDisposalDialog = (assetId: number) => {
      setSelectedAssetId(assetId)
      disposalForm.reset({
        asset_id: assetId,
        dispose_date: format(new Date(), 'yyyy-MM-dd'),
        reason: '',
        method: 'Sell',
        value: '',
        remarks: '',
        performed_by: userData?.username || '',
      })
      setIsDisposeDialogOpen(true)
    }
  

  const handleEdit = (asset: GetAssetType) => {
    setEditAsset(asset)
    editForm.reset({
      id: asset.id,
      departmentId: asset.departmentId || 0,
      categoryId: asset.categoryId || 0,
      locationId: asset.locationId || 0,
      user: asset.user || '',
    })
    setIsEditDialogOpen(true)
  }

  console.log('Form state errors:', disposalForm.formState.errors)
  // console.log('Form values:', editForm.getValues())

  // Form submission handlers
  const onDepreciationSubmit = async (data: CreateDepreciationInfoType) => {
    try {
      const response = await createDepreciationInfo(data, token)
      if (response.data) {
        if (
          data.depreciationMethod === 'Straight Line' &&
          (data.usefulLifeMonths ?? 0) <= 0
        ) {
          toast({
            title: 'Validation Error',
            description:
              'Useful life (months) must be greater than 0 for Straight Line method.',
            variant: 'destructive',
          })
          return
        } else {
          toast({
            title: 'Success',
            description: 'Depreciation information created successfully.',
          })
        }

        if (
          data.depreciationMethod === 'Declining Balance' &&
          (data.depreciationRate ?? 0) <= 0
        ) {
          toast({
            title: 'Validation Error',
            description:
              'Depreciation rate must be greater than 0 for Declining Method.',
            variant: 'destructive',
          })
          return
        } else {
          toast({
            title: 'Success',
            description: 'Depreciation information created successfully.',
          })
        }

        setIsDepreciationDialogOpen(false)
      } else {
        toast({
          title: 'Error',
          description: response.error?.message || response.error?.status,
          variant: 'destructive',
        })
      }
      fetchAssets()
    } catch (error) {
      console.error('Failed to create depreciation info:', error)
      toast({
        title: 'Error',
        description: 'Failed to create depreciation information.',
        variant: 'destructive',
      })
    }
  }

  const onAdditionSubmit = async (data: CreateAssetCapexAdditionType) => {
    try {
      const response = await createAddition(data, token)
      toast({
        title: 'Success',
        description: 'Asset addition created successfully.',
      })
      setIsAdditionDialogOpen(false)
      fetchAssets()
    } catch (error) {
      console.error('Failed to create addition:', error)
      toast({
        title: 'Error',
        description: 'Failed to create asset addition.',
        variant: 'destructive',
      })
    }
  }

  const onRetirementSubmit = async (data: CreateAssetPartialRetirementType) => {
    try {
      const response = await createRetirement(data, token)
      toast({
        title: 'Success',
        description: 'Asset retirement created successfully.',
      })
      setIsRetirementDialogOpen(false)
      fetchAssets()
    } catch (error) {
      console.error('Failed to create retirement:', error)
      toast({
        title: 'Error',
        description: 'Failed to create asset retirement.',
        variant: 'destructive',
      })
    }
  }

  const onDisposeSubmit = async (data: CreateDisposeType) => {
      try {
        const response = await createDispose(data, token)
        toast({
          title: 'Success',
          description: 'Asset disposal created successfully.',
        })
        setIsDisposeDialogOpen(false)
        fetchAssets()
      } catch (error) {
        console.error('Failed to create disposal:', error)
        toast({
          title: 'Error',
          description: 'Failed to create asset disposal.',
          variant: 'destructive',
        })
      }
    }
  
  const onEditSubmit = async (data: EditAssetType) => {
    if (!editAsset) return

    try {
      if (!editAsset?.id) {
        toast({
          title: 'Error',
          description: 'Asset ID is missing.',
          variant: 'destructive',
        })
        return
      }

      const updateData = {
        id: Number(editAsset.id),
        departmentId: Number(data.departmentId),
        categoryId: Number(data.categoryId),
        locationId: Number(data.locationId),
        user: String(data.user),
      }

      const response = await updateAsset(updateData, token)

      if (response.data) {
        toast({
          title: 'Success',
          description: 'Asset updated successfully.',
        })
        setIsEditDialogOpen(false)
        setEditAsset(null)
        fetchAssets()
      } else {
        toast({
          title: 'Error',
          description: response.error?.message || 'Failed to update asset.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Failed to update asset:', error)
      toast({
        title: 'Error',
        description: 'Failed to update asset.',
        variant: 'destructive',
      })
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return format(new Date(dateString), 'MMM dd, yyyy')
  }

  const handleSort = (column: keyof GetAssetType) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortedAssets = useMemo(() => {
    return [...assets].sort((a, b) => {
      const aValue = a[sortColumn] ?? ''
      const bValue = b[sortColumn] ?? ''
      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return sortDirection === 'asc'
          ? aValue === bValue
            ? 0
            : aValue
              ? -1
              : 1
          : aValue === bValue
            ? 0
            : aValue
              ? 1
              : -1
      }
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [assets, sortColumn, sortDirection])

  const paginatedAssets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedAssets.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedAssets, currentPage, itemsPerPage])

  return (
    <div className="p-6 space-y-6">
      {/* Header with title, search, and add button */}
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
          <h2 className="text-lg font-semibold">Assets</h2>
        </div>

        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="w-64"
          />
          <Link href={'/dashboard/assets/add-assets'}>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
              Add
            </Button>
          </Link>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : (
        <>
          {/* Table for asset data */}
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-amber-100">
                <TableRow>
                  <TableHead 
                    onClick={() => handleSort('assetCode')}
                    className="cursor-pointer"
                  >
                    Asset Code <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('assetName')}
                    className="cursor-pointer"
                  >
                    Asset Name <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('purDate')}
                    className="cursor-pointer"
                  >
                    Purchase Date <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('status')}
                    className="cursor-pointer flex items-center"
                  >
                    <p>Status</p> <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('model')}
                    className="cursor-pointer"
                  >
                    Model <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('slNo')}
                    className="cursor-pointer"
                  >
                    Serial No. <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAssets.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-gray-500"
                    >
                      No assets found. Add your first asset to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>{asset.assetCode}</TableCell>
                      <TableCell>{asset.assetName}</TableCell>
                      <TableCell>{formatDate(asset.purDate)}</TableCell>
                      <TableCell>{asset.status || 'Active'}</TableCell>
                      <TableCell>{asset.model || 'N/A'}</TableCell>
                      <TableCell>{asset.slNo || 'N/A'}</TableCell>
                      <TableCell className="flex items-center space-x-2">
                        <Link
                          href={`/dashboard/assets/assets/asset-details/${asset.id}`}
                        >
                          <Eye className="h-8 w-8 rounded-md cursor-pointer bg-amber-200 p-2" />
                        </Link>
                        <Pencil
                          onClick={() => handleEdit(asset)}
                          className="h-8 w-8 rounded-md cursor-pointer bg-amber-200 p-2"
                        />
                        {asset.status !== 'SOLD' && (
                          <div className="relative inline-block">
                            <button
                              onClick={() => {
                                const dropdown = document.getElementById(
                                  `dropdown-${asset.id}`
                                )
                                if (dropdown) {
                                  dropdown.classList.toggle('hidden')
                                }
                              }}
                              className="h-8 w-8 p-0 rounded"
                            >
                              <MoreVertical className="h-5 w-5 cursor-pointer text-amber-600 hover:text-amber-800" />
                              <span className="sr-only">Open menu</span>
                            </button>
                            <div
                              id={`dropdown-${asset.id}`}
                              className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="py-1">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    if (asset.id !== undefined) {
                                      handleOpenDepreciationDialog(asset.id)
                                      const dropdown = document.getElementById(
                                        `dropdown-${asset.id}`
                                      )
                                      if (dropdown) {
                                        dropdown.classList.add('hidden')
                                      }
                                    }
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                >
                                  Create Depreciation Info
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    if (asset.id !== undefined) {
                                      handleOpenAdditionDialog(asset.id)
                                      const dropdown = document.getElementById(
                                        `dropdown-${asset.id}`
                                      )
                                      if (dropdown) {
                                        dropdown.classList.add('hidden')
                                      }
                                    }
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                >
                                  Create Addition
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    if (asset.id !== undefined) {
                                      handleOpenRetirementDialog(asset.id)
                                      const dropdown = document.getElementById(
                                        `dropdown-${asset.id}`
                                      )
                                      if (dropdown) {
                                        dropdown.classList.add('hidden')
                                      }
                                    }
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                >
                                  Create Retirement
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    if (asset.id !== undefined) {
                                      handleOpenDisposalDialog(asset.id)
                                      const dropdown = document.getElementById(
                                        `dropdown-${asset.id}`
                                      )
                                      if (dropdown) {
                                        dropdown.classList.add('hidden')
                                      }
                                    }
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                >
                                  Create Disposal
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination controls */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <Button
              onClick={() => {
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <span className="mx-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => {
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </>
      )}

      {/* Edit Asset Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>
              Make changes to the asset details here.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onEditSubmit)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <CustomCombobox
                        items={departments.map((dept) => ({
                          id: dept.departmentID?.toString() || '',
                          name: dept.departmentName || '',
                        }))}
                        value={
                          field.value
                            ? {
                                id: field.value.toString(),
                                name:
                                  departments.find(
                                    (dept) =>
                                      dept.departmentID?.toString() ===
                                      field.value.toString()
                                  )?.departmentName || '',
                              }
                            : null
                        }
                        onChange={(value) =>
                          field.onChange(value ? parseInt(value.id) : '')
                        }
                        placeholder="Select department"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CustomCombobox
                        items={categories.map((cat) => ({
                          id: cat.category_id?.toString() || '',
                          name: cat.category_name || '',
                        }))}
                        value={
                          field.value
                            ? {
                                id: field.value.toString(),
                                name:
                                  categories.find(
                                    (cat) =>
                                      cat.category_id?.toString() ===
                                      field.value.toString()
                                  )?.category_name || '',
                              }
                            : null
                        }
                        onChange={(value) =>
                          field.onChange(value ? parseInt(value.id) : '')
                        }
                        placeholder="Select category"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="locationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <CustomCombobox
                        items={locations.map((loc) => ({
                          id: loc.id?.toString() || '',
                          name: loc.name || '',
                        }))}
                        value={
                          field.value
                            ? {
                                id: field.value.toString(),
                                name:
                                  locations.find(
                                    (loc) => loc.id?.toString() === field.value.toString()
                                  )?.name || '',
                              }
                            : null
                        }
                        onChange={(value) =>
                          field.onChange(value ? parseInt(value.id) : '')
                        }
                        placeholder="Select location"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDisposeDialogOpen} onOpenChange={setIsDisposeDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Asset Disposal</DialogTitle>
            <DialogDescription>Enter the disposal details for this asset.</DialogDescription>
          </DialogHeader>
          <Form {...disposalForm}>
            <form onSubmit={disposalForm.handleSubmit(onDisposeSubmit)} className="space-y-4">
              <FormField
                control={disposalForm.control}
                name="dispose_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disposal Date</FormLabel>
                    <FormControl>
                      <input
                        type="date"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={disposalForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter reason for disposal..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={disposalForm.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disposal Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select disposal method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Sell">Sell</SelectItem>
                        <SelectItem value="Scrap">Scrap</SelectItem>
                        <SelectItem value="Donate">Donate</SelectItem>
                        <SelectItem value="Transfer">Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={disposalForm.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={disposalForm.control}
                name="performed_by"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Performed By</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={disposalForm.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Additional notes..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDisposeDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white">
                  Create Disposal
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Depreciation Info Dialog */}
      <Dialog
        open={isDepreciationDialogOpen}
        onOpenChange={setIsDepreciationDialogOpen}
      >
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Create Depreciation Information</DialogTitle>
            <DialogDescription>
              Enter the depreciation details for this asset.
            </DialogDescription>
          </DialogHeader>
          <Form {...depreciationForm}>
            <form
              onSubmit={depreciationForm.handleSubmit(onDepreciationSubmit)}
              className="grid grid-cols-2 gap-4"
            >
              <FormField
                control={depreciationForm.control}
                name="depreciationMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Depreciation Method</FormLabel>
                    <FormControl>
                      <CustomCombobox
                        items={[
                          { id: 'Straight Line', name: 'Straight Line' },
                          {
                            id: 'Declining Balance',
                            name: 'Declining Balance',
                          },
                        ]}
                        value={
                          field.value
                            ? {
                                id: field.value,
                                name: field.value,
                              }
                            : null
                        }
                        onChange={(value) =>
                          field.onChange(value ? value.id : '')
                        }
                        placeholder="Select method"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={depreciationForm.control}
                name="bookId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Depreciation Book</FormLabel>
                    <FormControl>
                      <CustomCombobox
                        items={depreciationBooks.map((book) => ({
                          id: book.id.toString(),
                          name: book.name,
                        }))}
                        value={
                          field.value
                            ? {
                                id: field.value.toString(),
                                name:
                                  depreciationBooks.find(
                                    (b) => b.id === field.value
                                  )?.name || '',
                              }
                            : null
                        }
                        onChange={(value) =>
                          field.onChange(
                            value ? Number.parseInt(value.id, 10) : 0
                          )
                        }
                        placeholder="Select depreciation book"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={depreciationForm.control}
                name="startingValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={depreciationForm.control}
                name="depreciationRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Depreciation Rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        max={100}
                        onChange={(e) => {
                          const value = Number.parseFloat(e.target.value)
                          field.onChange(Math.min(value, 100))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={depreciationForm.control}
                name="accDepValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accumulated Depreciation Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={depreciationForm.control}
                name="usefulLifeMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Useful Life (Months)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={depreciationForm.control}
                name="residualValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residual Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={depreciationForm.control}
                name="effectiveDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Effective Date</FormLabel>
                    <FormControl>
                      <input
                        type="date"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                        value={
                          field.value
                            ? typeof field.value === 'string'
                              ? field.value
                              : field.value instanceof Date
                                ? field.value.toISOString().split('T')[0]
                                : ''
                            : ''
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="col-span-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDepreciationDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Addition Dialog */}
      <Dialog
        open={isAdditionDialogOpen}
        onOpenChange={setIsAdditionDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Asset Addition</DialogTitle>
            <DialogDescription>
              Enter the addition details for this asset.
            </DialogDescription>
          </DialogHeader>
          <Form {...additionForm}>
            <form
              onSubmit={additionForm.handleSubmit(onAdditionSubmit)}
              className="space-y-4"
            >
              <FormField
                control={additionForm.control}
                name="additionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Addition Date</FormLabel>
                    <FormControl>
                      <input
                        type="date"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={additionForm.control}
                name="addedValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Added Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={additionForm.control}
                name="newBookValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Book Value (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={additionForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter description of the addition..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={additionForm.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={
                        field.value !== undefined
                          ? String(field.value)
                          : undefined
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a supplier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem
                            key={supplier.id}
                            value={supplier.id?.toString() ?? ''}
                          >
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAdditionDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Create Addition
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Retirement Dialog */}
      <Dialog
        open={isRetirementDialogOpen}
        onOpenChange={setIsRetirementDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Asset Retirement</DialogTitle>
            <DialogDescription>
              Enter the retirement details for this asset.
            </DialogDescription>
          </DialogHeader>
          <Form {...retirementForm}>
            <form
              onSubmit={retirementForm.handleSubmit(onRetirementSubmit)}
              className="space-y-4"
            >
              <FormField
                control={retirementForm.control}
                name="retirementDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retirement Date</FormLabel>
                    <FormControl>
                      <input
                        type="date"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={retirementForm.control}
                name="retiredValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retired Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={retirementForm.control}
                name="updatedBookValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Updated Book Value (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={retirementForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter reason for retirement..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRetirementDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Create Retirement
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Assets
