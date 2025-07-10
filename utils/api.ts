import { fetchApi } from '@/utils/http'
import {
  AssetDepreciationType,
  AssetInfoReportType,
  CatAndSubcatAccuDepReportType,
  CreateAssetCapexAdditionType,
  CreateAssetDepreciationType,
  CreateAssetPartialRetirementType,
  CreateAssetType,
  CreateCategoryType,
  CreateCompanyType,
  CreateCostCenterType,
  CreateDepartmentType,
  CreateDepreciationBookType,
  CreateDepreciationInfoType,
  CreateDisposeType,
  CreateLocationType,
  CreateMaintenanceType,
  CreateSiteType,
  CreateSupplierType,
  CreateWarrantyType,
  DepreciationInfoReportType,
  EditAssetType,
  GetAssetCapexAdditionType,
  GetAssetDetailsType,
  GetAssetPartialRetirementType,
  GetAssetType,
  GetCategoryType,
  GetCompanyType,
  GetCostCenterType,
  GetDepartmentType,
  GetDepreciationBookType,
  GetDepreciationReportType,
  GetDepTranType,
  GetDisposeType,
  GetLocationType,
  GetMaintenanceType,
  GetSiteType,
  GetSupplierType,
  GetWarrantyType,
  GLDepreciationReportType,
} from '@/utils/type'

export async function getAllDepartments(token: string) {
  return fetchApi<GetDepartmentType[]>({
    url: 'api/department/getall',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createDepartment(
  data: CreateDepartmentType,
  token: string
) {
  return fetchApi<CreateDepartmentType>({
    url: 'api/department/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createCostCenter(
  data: CreateCostCenterType,
  token: string
) {
  return fetchApi<CreateCostCenterType>({
    url: 'api/costCenter/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAllCostCenters(token: string) {
  return fetchApi<GetCostCenterType[]>({
    url: 'api/costCenter/getall',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createCompany(
  data: CreateCostCenterType,
  token: string
) {
  return fetchApi<CreateCompanyType>({
    url: 'api/company/create-company',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAllCompanies(token: string) {
  return fetchApi<GetCompanyType[]>({
    url: 'api/company/get-all-companies',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createCategory(
  data: CreateCategoryType,
  token: string
) {
  return fetchApi<CreateCategoryType>({
    url: 'api/category/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAllCategories(token: string) {
  return fetchApi<GetCategoryType[]>({
    url: 'api/category/getall',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createAsset(
  data: CreateAssetType,
  token: string
) {
  return fetchApi<CreateAssetType>({
    url: 'api/asset/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function updateAsset(
  data: EditAssetType,
  token: string
) {
  return fetchApi<EditAssetType>({
    url: `api/asset/edit/${data.id}`,
    method: 'PATCH',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}


export async function getAllAssets(token: string) {
  return fetchApi<GetAssetType[]>({
    url: 'api/asset/getall',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAllAssetDetails(token: string, id: number) {
  return fetchApi<GetAssetDetailsType>({
    url: `api/asset/getDetails/${id}`,
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createSupplier(
  data: CreateSupplierType,
  token: string
) {
  return fetchApi<CreateSupplierType>({
    url: 'api/supplier/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAllSuppliers(token: string) {
  return fetchApi<GetSupplierType[]>({
    url: 'api/supplier/getall',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createLocation(
  data: CreateLocationType,
  token: string
) {
  return fetchApi<CreateLocationType>({
    url: 'api/location/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAllLocations(token: string) {
  return fetchApi<GetLocationType[]>({
    url: 'api/location/getall',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createSite(
  data: CreateSiteType,
  token: string
) {
  return fetchApi<CreateSiteType>({
    url: 'api/section/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAllSites(token: string) {
  return fetchApi<GetSiteType[]>({
    url: 'api/section/getall',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createDepreciationBook(
  data: CreateDepreciationBookType,
  token: string
) {
  return fetchApi<CreateDepreciationBookType>({
    url: 'api/depBook/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAllDepreciationBook(token: string) {
  return fetchApi<GetDepreciationBookType[]>({
    url: 'api/depBook/getall',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createDepreciationInfo(
  data: CreateDepreciationInfoType,
  token: string
) {
  return fetchApi<CreateDepreciationInfoType>({
    url: 'api/depInfo/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createAssetDepreciation(
  data: CreateAssetDepreciationType,
  token: string
) {
  return fetchApi<AssetDepreciationType[]>({
    url: 'api/depCalculation/calculate',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAllAssetMaintenance(token: string,) {
  return fetchApi<GetMaintenanceType[]>({
    url: 'api/maintenance/getall',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAssetMaintenanceById(token: string, assetId: string) {
  return fetchApi<GetMaintenanceType[]>({
    url: `api/maintenance/getMaintenance/${assetId}`,
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createMaintenance(
  data: CreateMaintenanceType,
  token: string
) {
  return fetchApi<CreateMaintenanceType>({
    url: 'api/maintenance/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAssetWarrantyeById(token: string, assetId: string) {
  return fetchApi<GetWarrantyType[]>({
    url: `api/warranty/getWarranty/${assetId}`,
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createWarranty(
  data: CreateWarrantyType,
  token: string
) {
  return fetchApi<CreateWarrantyType>({
    url: 'api/warranty/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createDispose(
  data: CreateDisposeType,
  token: string
) {
  return fetchApi<CreateDisposeType>({
    url: 'api/dispose/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAllDispose(token: string) {
  return fetchApi<GetDisposeType[]>({
    url: 'api/dispose/getall',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getDepreciationByAssetId(token: string, assetId: number) {
  return fetchApi<GetDepTranType[]>({
    url: `api/depinfo/getbyAsset/${assetId}`,
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAllDepreciationTransactions(token: string) {
  return fetchApi<GetDepTranType[]>({
    url: 'api/depCalculation/getAllDepreciation',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createRetirement(
  data: CreateAssetPartialRetirementType,
  token: string
) {
  return fetchApi<CreateAssetPartialRetirementType>({
    url: 'api/assetRetirement/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAllRetirements(token: string) {
  return fetchApi<GetAssetPartialRetirementType[]>({
    url: 'api/assetRetirement/getall',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createAddition(
  data: CreateAssetCapexAdditionType,
  token: string
) {
  return fetchApi<CreateAssetCapexAdditionType>({
    url: 'api/assetAddition/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAllAditions(token: string) {
  return fetchApi<GetAssetCapexAdditionType[]>({
    url: 'api/assetAddition/getall',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getDepreciationReport(token: string, period: string, bookId: number) {
  return fetchApi<GetDepreciationReportType[]>({
    url: `api/depCalculation/getDepByPeriodAndBook/${period}/${bookId}`,
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getDisposeReport(token: string, disposeDate: string, company_id: number) {
  return fetchApi<GetDisposeType[]>({
    url: `api/dispose/getByDisposeDate/${disposeDate}/${company_id}`,
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getGlDepreciationReport(token: string, companyId: number, bookId: number, period: string) {
  return fetchApi<GLDepreciationReportType[]>({
    url: `api/report/getCostCenterReport?companyId=${companyId}&bookId=${bookId}&period=${period}`,
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getCatAndSubcatAccuDepReport(token: string, companyId: number, bookId: number, period: string) {
  return fetchApi<CatAndSubcatAccuDepReportType[]>({
    url: `api/report/getCatWiseDepReport?companyId=${companyId}&bookId=${bookId}&period=${period}`,
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getMonthlyDepreciationInfoReport(token: string, companyId: number, bookId: number, period: string) {
  return fetchApi<DepreciationInfoReportType[]>({
    url: `api/report/getMonthlyDepInfoReport?companyId=${companyId}&bookId=${bookId}&period=${period}`,
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAssetInfoReport(token: string, companyId: number) {
  return fetchApi<AssetInfoReportType[]>({
    url: `api/report/getAssetInfoReport?companyId=${companyId}`,
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}