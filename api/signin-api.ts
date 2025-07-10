import axios from 'axios'
import { fetchApi } from '@/utils/http'
import { z } from 'zod'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const SignInRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

// Define nested schemas to match the actual response
const PermissionSchema = z.object({
  id: z.number(),
  name: z.string(),
})

const RolePermissionSchema = z.object({
  roleId: z.number(),
  permissionId: z.number(),
  permission: PermissionSchema,
})

const RoleSchema = z.object({
  roleId: z.number(),
  roleName: z.string(),
  rolePermissions: z.array(RolePermissionSchema),
})

const CompanySchema = z.object({
  companyId: z.number(),
  companyName: z.string(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
  postalCode: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  website: z.string().nullable(),
  taxId: z.string().nullable(),
  logo: z.string().nullable(),
  parentCompanyId: z.number().nullable(),
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

const UserCompanySchema = z.object({
  userId: z.number(),
  companyId: z.number(),
  company: CompanySchema,
})

// Update UserSchema to match the actual response
const UserSchema = z.object({
  userId: z.number(),
  username: z.string(),
  password: z.string(),
  active: z.boolean(),
  roleId: z.number(),
  isPasswordResetRequired: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  role: RoleSchema,
  userCompanies: z.array(UserCompanySchema),
  // Remove fields that don't exist in the actual response:
  // voucherTypes and employeeId
})

// Update the response schema to match the actual API response
const SignInResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
})

export type SignInRequest = z.infer<typeof SignInRequestSchema>
export type SignInResponse = z.infer<typeof SignInResponseSchema>

export async function signIn(credentials: SignInRequest) {
  return fetchApi<SignInResponse>({
    url: 'api/auth/login',
    method: 'POST',
    body: credentials,
    schema: SignInResponseSchema,
  })
}
