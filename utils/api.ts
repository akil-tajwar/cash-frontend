import { fetchApi } from '@/utils/http'
import {
  CreateBankAccountType,
  CreateCompanyType,
  GetBankAccountType,
  GetCompanyType,
} from '@/utils/type'

export async function createCompany(
  data: CreateCompanyType,
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

export async function createBankAccount(
  data: CreateBankAccountType,
  token: string
) {
  return fetchApi<CreateBankAccountType>({
    url: 'api/account-main/create-account-main',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getBankAccounts(token: string) {
  return fetchApi<GetBankAccountType[]>({
    url: 'api/account-main/get-all-account-mains',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}
