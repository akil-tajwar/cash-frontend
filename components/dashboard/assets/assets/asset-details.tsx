'use client'

import type React from 'react'
import { format } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronDown, FileText, Pencil, Plus, Printer } from 'lucide-react'
import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'
import { useAtom } from 'jotai'
import { toast, useToast } from '@/hooks/use-toast'
import {
  createMaintenance,
  createWarranty,
  getAllAssetDetails,
  getAssetMaintenanceById,
  getAssetWarrantyeById,
  getDepreciationByAssetId,
} from '@/utils/api'
import {
  createMaintenanceSchema,
  CreateMaintenanceType,
  createWarrantySchema,
  CreateWarrantyType,
  GetAssetDetailsType,
  GetDepTranType,
  GetMaintenanceType,
  GetWarrantyType,
} from '@/utils/type'

// Types for additional data
type EventData = {
  id: number
  date: string
  event: string
  description: string
  performedBy: string
}

type PhotoData = {
  id: number
  url: string
  caption: string
}

type DocData = {
  id: number
  fileName: string
  description: string
  fileType: string
  uploadDate: string
  uploadedBy: string
}

export default function AssetDetails() {
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
  const params = useParams()
  const { toast } = useToast()

  const [assetData, setAssetData] = useState<GetAssetDetailsType | null>(null)
  const [depreciation, setDepreciation] = useState<GetDepTranType[]>([])
  const [maintenanceData, setMaintenanceData] = useState<GetMaintenanceType[]>(
    []
  )
  const [warranty, setWarranty] = useState<GetWarrantyType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dummy data for additional tabs (would be replaced with API calls in a real implementation)
  const [eventsData] = useState<EventData[]>([
    {
      id: 1,
      date: '04/02/2025',
      event: 'Maintenance Check',
      description: 'Regular maintenance check performed',
      performedBy: 'Tech Support',
    },
    {
      id: 2,
      date: '03/30/2025',
      event: 'Assigned',
      description: 'Asset assigned to John Smith',
      performedBy: 'HR Department',
    },
    {
      id: 3,
      date: '03/28/2025',
      event: 'Purchased',
      description: 'Asset purchased and added to inventory',
      performedBy: 'Procurement',
    },
  ])

  const [photos, setPhotos] = useState<PhotoData[]>([
    {
      id: 1,
      url: '/placeholder.svg?height=200&width=200',
      caption: 'Front view',
    },
    {
      id: 2,
      url: '/placeholder.svg?height=200&width=200',
      caption: 'Side view',
    },
    {
      id: 3,
      url: '/placeholder.svg?height=200&width=200',
      caption: 'Back view',
    },
  ])

  const [docs, setDocs] = useState<DocData[]>([
    {
      id: 1,
      fileName: 'Invoice.pdf',
      description: 'Purchase invoice',
      fileType: 'PDF',
      uploadDate: '03/28/2025',
      uploadedBy: 'Finance Dept',
    },
    {
      id: 2,
      fileName: 'Warranty.pdf',
      description: 'Warranty certificate',
      fileType: 'PDF',
      uploadDate: '03/28/2025',
      uploadedBy: 'Admin',
    },
    {
      id: 3,
      fileName: 'Manual.pdf',
      description: 'User manual',
      fileType: 'PDF',
      uploadDate: '03/29/2025',
      uploadedBy: 'Tech Support',
    },
  ])

  // Fetch asset details
  const fetchAssetDetails = useCallback(async () => {
    if (!token) return

    try {
      const assetId = Number(params.id)
      if (isNaN(assetId)) {
        throw new Error('Invalid asset ID')
      }
      const data = await getAllAssetDetails(token, assetId)
      if (data?.error?.status === 401) {
        router.push('/unauthorized-access')
        return
      } else {
        setAssetData(data.data || null)
        console.log(
          '🚀 ~ fetchAssetDetails ~ data.data || null:',
          data.data || null
        )
      }
    } catch (err) {
      console.error('Failed to fetch asset details:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to load asset details'
      )
      toast({
        title: 'Error',
        description: 'Failed to load asset details. Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [params.id, token, toast, router])

  const fetchDepreciations = useCallback(async () => {
    if (!token) return

    try {
      const assetId = Number(params.id)
      if (isNaN(assetId)) {
        throw new Error('Invalid asset ID')
      }
      const data = await getDepreciationByAssetId(token, assetId)
      if (data?.error?.status === 401) {
        router.push('/unauthorized-access')
        return
      } else {
        setDepreciation(data.data || [])
        console.log("🚀 ~ fetchDepreciations ~ data.data:", data.data)
      }
    } catch (err) {
      console.error('Failed to fetch asset details:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to load asset details'
      )
      toast({
        title: 'Error',
        description: 'Failed to load asset details. Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [params.id, token, toast, router])

  const fetchMaintenance = useCallback(async () => {
    if (!token) return
    try {
      const assetId = String(params.id)
      if (!assetId) {
        throw new Error('Invalid asset ID')
      }
      const response = await getAssetMaintenanceById(token, assetId)
      if (response.error?.status === 401) {
        router.push('/unauthorized-access')
        return
      } else if (response.data) {
        setMaintenanceData(response.data || [])
        console.log("🚀 ~ fetchMaintenance ~ response.data:", response.data)
      } else {
        setMaintenanceData([])
        if (response.error) {
          toast({
            title: 'Error',
            description: response.error.message,
            variant: 'destructive',
          })
        }
      }
    } catch (error) {
      console.error('Error fetching maintenance records:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch maintenance records',
        variant: 'destructive',
      })
    }
  }, [token, toast, router, params.id])

  const fetchAssetWarranty = useCallback(async () => {
    if (!token) return
    try {
      const assetId = String(params.id)
      if (!assetId) {
        throw new Error('Invalid asset ID')
      }
      const response = await getAssetWarrantyeById(token, assetId)
      if (response.error?.status === 401) {
        router.push('/unauthorized-access')
        return
      } else if (response.data) {
        setWarranty(response.data)
        console.log("🚀 ~ fetchAssetWarranty ~ response.data:", response.data)
      } else {
        setWarranty([])
        if (response.error) {
          toast({
            title: 'Error',
            description: response.error.message,
            variant: 'destructive',
          })
        }
      }
    } catch (error) {
      console.error('Error fetching maintenance records:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch maintenance records',
        variant: 'destructive',
      })
    }
  }, [token, toast, router, params.id])

  useEffect(() => {
    fetchMaintenance()
    fetchAssetDetails()
    fetchDepreciations()
    fetchAssetWarranty()
  }, [
    fetchAssetDetails,
    fetchDepreciations,
    fetchAssetWarranty,
    fetchMaintenance,
  ])

  // Add new photo
  const handleAddPhoto = (photoData: { url: string; caption: string }) => {
    setPhotos([...photos, { id: photos.length + 1, ...photoData }])
  }

  // Add new document
  const handleAddDoc = (docData: {
    fileName: string
    description: string
    fileType: string
  }) => {
    setDocs([
      ...docs,
      {
        id: docs.length + 1,
        ...docData,
        uploadDate: new Date().toLocaleDateString(),
        uploadedBy: 'Current User',
      },
    ])
  }

  // Add new warranty
  const handleAddWarranty = (warrantyData: CreateWarrantyType) => {
    setWarranty([
      ...warranty,
      {
        id: warranty.length + 1,
        type: warrantyData.type,
        asset_id: warrantyData.asset_id,
        start_date: warrantyData.start_date,
        end_date: warrantyData.end_date,
        warranty_provider: warrantyData.warranty_provider,
        description: warrantyData.description,
      },
    ])
  }

  // Add new maintenance
  const handleAddMaintenance = (maintenanceData: CreateMaintenanceType) => {
    setMaintenanceData(prev => [
      ...prev,
      {
        assetId: Number(params.id),
        maintDate: maintenanceData.maintDate,
        type: maintenanceData.type,
        cost: maintenanceData.cost,
        description: maintenanceData.description || '',
        performedBy: maintenanceData.performedBy,
      }
    ])
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  // Error state
  if (error || !assetData) {
    return (
      <div className="container mx-auto p-4">
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error || 'Asset not found'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="text-primary mr-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-medium">Asset View</h1>
      </div>

      {/* Asset Title and Actions */}
      <div className="flex justify-between items-center mb-4 border-b pb-4">
        <h2 className="text-xl font-medium">{assetData.assetName}</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <Pencil className="h-4 w-4" />
            Edit Asset
          </Button>
          <Button className="flex items-center gap-1">
            More Actions
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Asset Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-1 border rounded-md p-4 flex items-center justify-center">
          <Image
            src="/placeholder.svg?height=250&width=250"
            alt="Asset Image"
            width={250}
            height={250}
            className="object-contain"
          />
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="grid grid-cols-2">
            <div className="p-1 text-sm border text-muted-foreground">
              Asset Code
            </div>
            <div className="p-1 border">{assetData.assetCode}</div>
          </div>
          <div className="grid grid-cols-2">
            <div className="p-1 text-sm border text-muted-foreground">
              Location
            </div>
            <div className="p-1 border">
              {assetData.locationName ? assetData.locationName : 'N/A'}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="p-1 text-sm border text-muted-foreground">
              Purchase Date
            </div>
            <div className="p-1 border">
              {format(new Date(assetData.purDate), 'dd/MM/yyyy')}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="p-1 text-sm border text-muted-foreground">
              Department
            </div>
            <div className="p-1 border">
              {assetData.departmentName ? assetData.departmentName : 'N/A'}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="p-1 text-sm border text-muted-foreground">
              Asset Value
            </div>
            {/* <div className="p-1 border">
              {assetData.assetValue.toLocaleString()}
            </div> */}
          </div>
          <div className="grid grid-cols-2">
            <div className="p-1 text-sm border text-muted-foreground">
              Category
            </div>
            <div className="p-1 border">Category {assetData.categoryName}</div>
          </div>
          <div className="grid grid-cols-2">
            <div className="p-1 text-sm border text-muted-foreground">
              Model
            </div>
            <div className="p-1 border">{assetData.model || 'N/A'}</div>
          </div>
          <div className="grid grid-cols-2">
            <div className="p-1 text-sm border text-muted-foreground">User</div>
            <div className="p-1 border">{assetData.user || 'N/A'}</div>
          </div>
          <div className="grid grid-cols-2">
            <div className="p-1 text-sm border text-muted-foreground">
              Current Value
            </div>
            {/* <div className="p-1 border">
              {assetData.currentValue
                ? `${assetData.currentValue.toLocaleString()}`
                : 'N/A'}
            </div> */}
          </div>
          <div className="grid grid-cols-2">
            <div className="text-sm border p-1 text-muted-foreground">
              Status
            </div>
            <div
              className={`p-1 border ${assetData.status === 'Active' ? 'text-green-600' : ''}`}
            >
              {assetData.status || 'Active'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="details"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
          >
            Events
          </TabsTrigger>
          <TabsTrigger
            value="photos"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
          >
            Photos
          </TabsTrigger>
          <TabsTrigger
            value="docs"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
          >
            Docs
          </TabsTrigger>
          <TabsTrigger
            value="depreciation"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
          >
            Depreciation
          </TabsTrigger>
          <TabsTrigger
            value="warranty"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
          >
            Warranty
          </TabsTrigger>
          <TabsTrigger
            value="maintenance"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
          >
            Maint.
          </TabsTrigger>
        </TabsList>

        {/* Details Tab Content */}
        <TabsContent value="details" className="mt-6">
          <h3 className="text-lg font-medium mb-4">Asset Details</h3>

          <div className="mb-6">
            <h4 className="text-primary font-medium mb-2">Miscellaneous</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-2">
                <div className="p-1 border text-sm text-muted-foreground">
                  Serial No
                </div>
                <div className="border p-1">{assetData.slNo || 'N/A'}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="p-1 border text-sm text-muted-foreground">
                  Supplier
                </div>
                {/* <div className="border p-1">
                  {assetData.manufacure
                    ? `Supplier ${assetData.manufacure}`
                    : 'N/A'}
                </div> */}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-primary font-medium mb-2">Custom fields</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-2">
                <div className="p-1 border text-sm text-muted-foreground">
                  Asset Name
                </div>
                <div className="border p-1">{assetData.assetName}</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="p-1 border text-sm text-muted-foreground">
                  Asset Code
                </div>
                <div className="border p-1">{assetData.assetCode}</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-primary font-medium mb-2">Depreciation</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-2">
                <div className="p-1 border text-sm text-muted-foreground">
                  Asset Value
                </div>
                <div className="border p-1">
                  {/* {assetData.assetValue.toLocaleString()} */}
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="p-1 border text-sm text-muted-foreground">
                  Depreciation Rate
                </div>
                <div className="border p-1">
                  {/* {assetData.depRate ? `${assetData.depRate}%` : 'N/A'} */}
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="p-1 border text-sm text-muted-foreground">
                  Salvage Value
                </div>
                <div className="border p-1">
                  {/* {assetData.salvageValue
                    ? `${assetData.salvageValue.toLocaleString()}`
                    : 'N/A'} */}
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="p-1 border text-sm text-muted-foreground">
                  Current Value
                </div>
                <div className="border p-1">
                  {/* {assetData.currentValue
                    ? `${assetData.currentValue.toLocaleString()}`
                    : 'N/A'} */}
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="p-1 border text-sm text-muted-foreground">
                  Start Date
                </div>
                <div className="p-1 border">
                  {format(new Date(assetData.startDate), 'dd/MM/yyyy')}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-primary font-medium mb-2">Creation</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-2">
                <div className="p-1 border text-sm text-muted-foreground">
                  Created At
                </div>
                <div className="p-1 border">
                  {format(new Date(assetData.createdAt), 'dd/MM/yyyy')}
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="p-1 border text-sm text-muted-foreground">
                  Created By
                </div>
                <div className="border p-1">
                  {assetData.createdBy ? assetData.createdBy : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-primary font-medium mb-2">Notes</h4>
            <p className='border p-1'>{assetData.notes}</p>
          </div>
        </TabsContent>

        {/* Events Tab Content */}
        <TabsContent value="events" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Events</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Performed By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventsData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-gray-500"
                  >
                    No events found for this asset.
                  </TableCell>
                </TableRow>
              ) : (
                eventsData.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.date}</TableCell>
                    <TableCell>{event.event}</TableCell>
                    <TableCell>{event.description}</TableCell>
                    <TableCell>{event.performedBy}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Photos Tab Content */}
        <TabsContent value="photos" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Photos</h3>
            <AddPhotoDialog onAddPhoto={handleAddPhoto} />
          </div>
          {photos.length === 0 ? (
            <div className="text-center py-12 border rounded-md">
              <p className="text-gray-500">
                No photos available for this asset.
              </p>
              <Button
                className="mt-4"
                onClick={() =>
                  document
                    .querySelector<HTMLButtonElement>('[data-add-photo]')
                    ?.click()
                }
              >
                Add First Photo
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="border rounded-md overflow-hidden"
                >
                  <Image
                    src={photo.url || '/placeholder.svg'}
                    alt={photo.caption}
                    width={200}
                    height={200}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-2 text-sm">{photo.caption}</div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Docs Tab Content */}
        <TabsContent value="docs" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Documents</h3>
            <AddDocDialog onAddDoc={handleAddDoc} />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>File Type</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-gray-500"
                  >
                    No documents found for this asset.
                  </TableCell>
                </TableRow>
              ) : (
                docs.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {doc.fileName}
                    </TableCell>
                    <TableCell>{doc.description}</TableCell>
                    <TableCell>{doc.fileType}</TableCell>
                    <TableCell>{doc.uploadDate}</TableCell>
                    <TableCell>{doc.uploadedBy}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Depreciation Tab Content */}
        <TabsContent value="depreciation" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Depreciation</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Name</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Useful Life</TableHead>
                <TableHead>Asset Value</TableHead>
                <TableHead>Accumulated Depreciation</TableHead>
                <TableHead>Salvage Value</TableHead>
                <TableHead>Effective Date</TableHead>
                <TableHead>Frequency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {depreciation?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-6 text-gray-500"
                  >
                    No depreciation data found for this asset.
                  </TableCell>
                </TableRow>
              ) : (
                depreciation?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.bookName}</TableCell>
                    <TableCell>{item.method}</TableCell>
                    <TableCell>{item.rate}</TableCell>
                    <TableCell>{item.usefullLife}</TableCell>
                    <TableCell>{item.assetValue}</TableCell>
                    <TableCell>{item.accDep}</TableCell>
                    <TableCell>{item.salvageValue}</TableCell>
                    <TableCell>{formatDate(item.effectiveDate)}</TableCell>
                    <TableCell>{item.Frequency}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Warranty Tab Content */}
        <TabsContent value="warranty" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Warranty</h3>
            <AddWarrantyDialog onAddWarranty={handleAddWarranty} />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warranty?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No warranty found
                  </TableCell>
                </TableRow>
              ) : (
                warranty?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{formatDate(item.start_date)}</TableCell>
                    <TableCell>{formatDate(item.end_date)}</TableCell>
                    <TableCell>{item.warranty_provider}</TableCell>
                    <TableCell>{item.description}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Maintenance Tab Content */}
        <TabsContent value="maintenance" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Maintenance</h3>
            <AddMaintenanceDialog onAddMaintenance={handleAddMaintenance} />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Performed By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenanceData?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No maintenance found
                  </TableCell>
                </TableRow>
              ) : (
                maintenanceData?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{formatDate(item.maintDate)}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.cost}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.performedBy}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Add Photo Dialog Component
function AddPhotoDialog({ onAddPhoto }: { onAddPhoto: (data: any) => void }) {
  const [open, setOpen] = useState(false)
  const [caption, setCaption] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddPhoto({
      url: '/placeholder.svg?height=200&width=200',
      caption: caption,
    })
    setCaption('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1" data-add-photo>
          <Plus className="h-4 w-4" />
          Add Photo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Photo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photo">Photo</Label>
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <div className="flex flex-col items-center">
                <div className="mb-2">
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    alt="Upload preview"
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </div>
                <Button type="button" variant="outline" size="sm">
                  Choose File
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Supported formats: JPG, PNG, GIF
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Input
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter a caption for this photo"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Photo</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Add Document Dialog Component
function AddDocDialog({ onAddDoc }: { onAddDoc: (data: any) => void }) {
  const [open, setOpen] = useState(false)
  const [fileName, setFileName] = useState('')
  const [description, setDescription] = useState('')
  const [fileType, setFileType] = useState('PDF')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddDoc({
      fileName,
      description,
      fileType,
    })
    setFileName('')
    setDescription('')
    setFileType('PDF')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Document
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Document File</Label>
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <Button type="button" variant="outline">
                Choose File
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Supported formats: PDF, DOC, DOCX, XLS, XLSX
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fileName">File Name</Label>
            <Input
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter document description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fileType">File Type</Label>
            <Select value={fileType} onValueChange={setFileType}>
              <SelectTrigger>
                <SelectValue placeholder="Select file type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="DOC">DOC</SelectItem>
                <SelectItem value="DOCX">DOCX</SelectItem>
                <SelectItem value="XLS">XLS</SelectItem>
                <SelectItem value="XLSX">XLSX</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Document</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Add Warranty Dialog Component
function AddWarrantyDialog({
  onAddWarranty,
}: {
  onAddWarranty: (data: CreateWarrantyType) => void
}) {
  const [token] = useAtom(tokenAtom)
  const params = useParams()
  const [open, setOpen] = useState(false)

  const form = useForm<CreateWarrantyType>({
    resolver: zodResolver(createWarrantySchema),
    defaultValues: {
      type: undefined,
      start_date: '',
      end_date: '',
      warranty_provider: '',
      description: '',
      asset_id: Number(params.id),
    },
  })

  const onSubmit = async (data: CreateWarrantyType) => {
    try {
      await createWarranty(data, token)

      form.reset()
      setOpen(false)
      onAddWarranty(data)

      toast({
        title: 'Success',
        description: 'Warranty record created successfully',
      })
    } catch (error) {
      console.error('Error creating warranty record:', error)
      toast({
        title: 'Error',
        description: 'Failed to create warranty record. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Warranty
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Warranty Information</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warranty Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select warranty type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard Warranty">
                          Standard Warranty
                        </SelectItem>
                        <SelectItem value="Extended Warranty">
                          Extended Warranty
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="warranty_provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider Details</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter provider details (address, phone, email)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter warranty details (optional)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Warranty</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
// Add Maintenance Dialog Component
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import formatDate from '@/utils/formatDate'

export function AddMaintenanceDialog({
  onAddMaintenance,
}: {
  onAddMaintenance: (data: CreateMaintenanceType) => void
}) {
  const [token] = useAtom(tokenAtom)
  const params = useParams()
  const [open, setOpen] = useState(false)

  const form = useForm<CreateMaintenanceType>({
    resolver: zodResolver(createMaintenanceSchema),
    defaultValues: {
      maintDate: '',
      type: undefined,
      cost: '',
      description: '',
      performedBy: '',
      assetId: Number(params.id),
    },
  })

  const onSubmit = async (data: CreateMaintenanceType) => {
    try {
      await createMaintenance(data, token)

      // Reset form and close dialog
      form.reset()
      setOpen(false)
      onAddMaintenance(data)

      toast({
        title: 'Success',
        description: 'Maintenance record created successfully',
      })
    } catch (error) {
      console.error('Error creating maintenance record:', error)
      toast({
        title: 'Error',
        description: 'Failed to create maintenance record. Please try again.',
        variant: 'destructive',
      })
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Maintenance
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Maintenance Record</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="maintDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select maintenance type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Preventive">Preventive</SelectItem>
                      <SelectItem value="Corrective">Corrective</SelectItem>
                      <SelectItem value="Condition-based">
                        Condition-based
                      </SelectItem>
                      <SelectItem value="Predictive">Predictive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. ₹2,000.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter maintenance details"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="performedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Performed By</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Tech Support" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Record</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
