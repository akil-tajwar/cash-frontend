import { z } from 'zod'

export const companySchema = z.object({
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
export const createCompanySchema = companySchema.omit({ companyId: true })
export type GetCompanyType = z.infer<typeof companySchema>
export type CreateCompanyType = z.infer<typeof createCompanySchema>

export const bankAccount = z.object({
  id: z.number(),
  bankName: z.string().min(1, 'Bank name is required'),
  accountType: z.number(),
  accountNo: z.number(),
  limit: z.number().optional(),
  interestRate: z.number().optional(),
  balance: z.number().default(0),
  term: z.number().optional(),
  companyId: z.number(),
})
export const createBankAccount = bankAccount.omit({ id: true })
export type GetBankAccountType = z.infer<typeof bankAccount> & {
  companyName: string
}
export type CreateBankAccountType = z.infer<typeof createBankAccount>

export const transactionSchema = z.object({
  id: z.number().int().positive(),
  accountId: z.number().int().positive(),
  transactionDate: z
    .string()
    .datetime()
    .default(() => new Date().toISOString()),
  transactionType: z.enum(['Deposit', 'Withdraw']),
  details: z.enum(['demo']).default('demo'), // this will be come from another table
  amount: z.number().int(),
})
export const createTransactionSchema = transactionSchema.omit({ id: true })
export type GetTransactionType = z.infer<typeof transactionSchema> & {
  accountNumber: number
}
export type CreateTransactionType = z.infer<typeof createTransactionSchema>

export const SignInRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export const PermissionSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const RolePermissionSchema = z.object({
  roleId: z.number(),
  permissionId: z.number(),
  permission: PermissionSchema,
})

export const RoleSchema = z.object({
  roleId: z.number(),
  roleName: z.string(),
  rolePermissions: z.array(RolePermissionSchema),
})

export const UserCompanySchema = z.object({
  userId: z.number(),
  companyId: z.number(),
  company: companySchema,
})

export const UserSchema = z.object({
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
})

export const SignInResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
})

export type SignInRequest = z.infer<typeof SignInRequestSchema>
export type SignInResponse = z.infer<typeof SignInResponseSchema>

export interface UserCompany {
  userId: number
  companyId: number
}

export interface Company {
  companyId: number
  address: string
  companyName: string
}

export interface CompanyFromLocalstorage {
  company: {
    companyId: number
    companyName: string
  }
}

export interface SubItem {
  name: string
  source: string
}

export interface SubItemGroup {
  name: string
  items: SubItem[]
}

export interface MenuItem {
  name: string
  subItemGroups: SubItemGroup[]
}

export interface LocationFromLocalstorage {
  location: {
    locationId: number
    address: string
    companyId: number
  }
}

const AccountEntrySchema = z.object({
  companyId: z.number(),
  companyName: z.string(),
  accountNo: z.number(),
  limit: z.number(),
  typeId: z.number(),
  interestRate: z.string(), // because it's quoted as a string (e.g., "91.00")
  bank: z.string(),
  openingBalance: z.number(),
  deposit: z.number(),
  withdrawal: z.number(),
  closingBalance: z.number()
});

// The full report schema with dynamic company keys
export const CashFlowLoanReportSchema = z.record(z.string(), z.array(AccountEntrySchema));
export type GetCashFlowLoanReportType = z.infer<typeof CashFlowLoanReportSchema>;
