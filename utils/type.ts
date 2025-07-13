import { z } from 'zod'

export const companySchema = z.object({
  companyId: z.number().int().positive(), // primary key
  companyName: z.string().max(100),
  address: z.string().max(255).nullable().optional(),
  city: z.string().max(50).nullable().optional(),
  state: z.string().max(50).nullable().optional(),
  country: z.string().max(50).nullable().optional(),
  postalCode: z.string().max(20).nullable().optional(),
  phone: z.string().max(20).nullable().optional(),
  email: z.string().email().max(100).nullable().optional(),
  website: z.string().url().max(100).nullable().optional(),
  taxId: z.string().max(50).nullable().optional(),
  logo: z.string().nullable().optional(), // text column
  parentCompanyId: z.number().int().positive().nullable().optional(),
  active: z.boolean().optional(), // default is true
  createdAt: z.string().datetime().optional(), // timestamp
  updatedAt: z.string().datetime().optional(), // timestamp
});
export const createCompanySchema = companySchema.omit({ companyId: true });
export type GetCompanyType = z.infer<typeof companySchema>;
export type CreateCompanyType = z.infer<typeof createCompanySchema>;

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
export type GetBankAccountType = z.infer<typeof bankAccount>
export type CreateBankAccountType = z.infer<typeof createBankAccount>

export const transactionSchema = z.object({
  id: z.number().int().positive(),
  transactionDate: z.string().datetime().default(() => new Date().toISOString()),
  transactionType: z.enum(['Deposite', 'Withdraw']),
  details: z.string(),
  amount: z.number().int(),
})
export const createTransactionSchema = transactionSchema.omit({ id: true })
export type GetTransactionType = z.infer<typeof transactionSchema>
export type CreateTransactionType = z.infer<typeof createTransactionSchema>



















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


