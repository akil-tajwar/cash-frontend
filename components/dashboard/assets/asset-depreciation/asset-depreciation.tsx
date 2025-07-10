'use client'

import { useCallback, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AssetDepreciationType,
  createAssetDepreciationSchema,
  CreateAssetDepreciationType,
  GetCompanyType,
  GetDepreciationBookType,
  GetDepTranType,
} from '@/utils/type'
import {
  createAssetDepreciation,
  getAllCompanies,
  getAllDepreciationBook,
} from '@/utils/api'
import { CustomCombobox } from '@/utils/custom-combobox'
import { useAtom } from 'jotai'
import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

export default function AssetDepreciation() {
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

  // State variables
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companies, setCompanies] = useState<GetCompanyType[]>([])
  const [depreciationBooks, setDepreciationBooks] = useState<
    GetDepreciationBookType[]
  >([])
  const [previewData, setPreviewData] = useState<
    AssetDepreciationType[] | null
  >(null)
  const [formData, setFormData] = useState<CreateAssetDepreciationType | null>(
    null
  )

  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const form = useForm<CreateAssetDepreciationType>({
    resolver: zodResolver(createAssetDepreciationSchema),
    defaultValues: {
      company_id: 1,
      depreciation_date: '',
      book_id: 0,
      saveToDatabase: false,
    },
  })

  // Filter preview data based on search term
  const filteredPreviewData = previewData
    ? previewData.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : []

  // Calculate pagination
  const totalPages = Math.ceil(
    (filteredPreviewData?.length || 0) / itemsPerPage
  )
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPreviewData = filteredPreviewData?.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const fetchCompanies = useCallback(async () => {
    if (!token) return
    try {
      const response = await getAllCompanies(token)
      if (response?.error?.status === 401) {
        router.push('/unauthorized-access')
        return
      } else if (response.data) {
        setCompanies(response.data)
      } else {
        setCompanies([])
        if (response.error) {
          toast({
            title: 'Error',
            description: response.error.message,
            variant: 'destructive',
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch companies',
        variant: 'destructive',
      })
    }
  }, [token, router])

  // Fetch depreciation books
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
  }, [token, router])

  useEffect(() => {
    fetchCompanies()
    fetchDepreciationBooks()
  }, [fetchCompanies, fetchDepreciationBooks])

  // Handle preview request
  const onPreview = async (data: CreateAssetDepreciationType) => {
    setIsLoading(true)
    try {
      const response = await createAssetDepreciation(
        {
          ...data,
          saveToDatabase: false,
        },
        token
      ) as { error?: any; data?: any } // Add type annotation

      if (response?.error?.details?.error?.statusCode === 400) {
        toast({
          title: 'Error',
          description: 'Depreciation for this peridod already exists.',
          variant: 'destructive',
        })
        console.log('🚀 ~ onPreview ~ response.error:', response.error)
        return
      } else {
        setPreviewData(response.data && response.data)
        console.log('🚀 ~ onPreview ~ response.data:', response.data)
      }
      setFormData(data)
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle final submission to database
  const onSubmit = async () => {
    if (!formData) return

    setIsSubmitting(true)
    try {
      const response = await createAssetDepreciation(
        {
          ...formData,
          saveToDatabase: true,
        },
        token
      )
      toast({
        title: 'Success',
        description: 'Asset depreciation schedule created successfully',
        variant: 'default',
        duration: 3000,
      })

      // Reset the form and preview data after successful submission
      form.reset()
      setPreviewData(null)
      setFormData(null)
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to create asset depreciation schedule',
        variant: 'destructive',
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // Format date for display
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Asset Depreciation</CardTitle>
          <CardDescription>
            Create a new asset depreciation schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit(onPreview)(e)
              }}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="company_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <CustomCombobox
                        items={companies.map((company) => ({
                          id: (
                            company.companyId || company.companyId
                          ).toString(),
                          name:
                            company.companyName ||
                            company.address ||
                            'Unnamed Company',
                        }))}
                        value={
                          field.value
                            ? {
                                id: field.value.toString(),
                                name:
                                  companies.find(
                                    (c) =>
                                      (c.companyId || c.companyId) ===
                                      field.value
                                  )?.companyName ||
                                  companies.find(
                                    (c) =>
                                      (c.companyId || c.companyId) ===
                                      field.value
                                  )?.companyName ||
                                  '',
                              }
                            : null
                        }
                        onChange={(value) =>
                          field.onChange(
                            value ? Number.parseInt(value.id, 10) : 0
                          )
                        }
                        placeholder="Select company"
                      />
                    </FormControl>
                    <FormDescription>
                      Select the company for this depreciation schedule
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="book_id"
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
                    <FormDescription>
                      Select the depreciation book for this schedule
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="depreciation_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Depreciation Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="w-full" />
                    </FormControl>
                    <FormDescription>
                      Select the date for the depreciation schedule
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                className="w-full"
                disabled={isLoading}
                onClick={form.handleSubmit(onPreview)}
              >
                {isLoading
                  ? 'Generating Preview...'
                  : 'Run Depreciation Schedule'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Preview Data Table */}
      {previewData && (
        <Card>
          <CardHeader>
            <CardTitle>Depreciation Schedule Preview</CardTitle>
            <CardDescription>
              Review the calculated depreciation schedule before submitting
            </CardDescription>
            <div className="flex items-center gap-4">
              <Input
                type="text"
                placeholder="Search schedules..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-64"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset ID</TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Book Name</TableHead>
                    <TableHead>Transaction Date</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">
                      Depreciation Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPreviewData && paginatedPreviewData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-6 text-gray-500"
                      >
                        No depreciation schedules found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedPreviewData &&
                    paginatedPreviewData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.assetId}</TableCell>
                        <TableCell>{item.assetName}</TableCell>
                        <TableCell>{item.bookName}</TableCell>
                        <TableCell>
                          {formatDate(item.transactionDate)}
                        </TableCell>
                        <TableCell>{item.period}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.depreciationAmount)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="flex justify-center items-center gap-2">
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                <span className="mx-4">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
              <Button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="w-full md:w-auto"
              >
                {isSubmitting ? 'Saving...' : 'Save Depreciation'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No data message */}
      {previewData && previewData.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                No depreciation schedules to generate for the selected criteria.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
