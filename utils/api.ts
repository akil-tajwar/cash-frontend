import { fetchApi } from '@/utils/http'
import {
  CreateBankAccountType,
  CreateCompanyType,
  CreateTransactionType,
  GetBankAccountType,
  GetCashFlowLoanReportType,
  GetCompanyType,
  GetTransactionType,
  SignInRequest,
  SignInResponse,
  SignInResponseSchema,
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

export async function createTransactions(
  data: CreateTransactionType,
  token: string
) {
  return fetchApi<CreateTransactionType>({
    url: 'api/transaction/create-transaction',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getTransactions(token: string) {
  return fetchApi<GetTransactionType[]>({
    url: 'api/transaction/get-all-transactions',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function signIn(credentials: SignInRequest) {
  return fetchApi<SignInResponse>({
    url: 'api/auth/login',
    method: 'POST',
    body: credentials,
    schema: SignInResponseSchema,
  })
}

export async function getCashFlowLoanAcReport(
  date: string,
  token: string
) {
  return fetchApi<GetCashFlowLoanReportType>({
    url: `api/report/get-cash-flow-loan-report?date=${date}`,
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}