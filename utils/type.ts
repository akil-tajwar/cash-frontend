import { isLastDayOfMonth } from 'date-fns'
import { locationSchema } from '@/api/company-api'
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






















//department
export const createDepartmentSchema = z.object({
  departmentName: z.string().min(1, 'Department name is required'),
  budget: z.number().optional(),
  companyCode: z.number().optional(),
  isActive: z.boolean().optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  createdBy: z.number(),
  actual: z.number().optional(),
})
export type CreateDepartmentType = z.infer<typeof createDepartmentSchema>

export const getDepartmentSchema = z.object({
  departmentID: z.number(),
  departmentName: z.string().min(1, 'Department name is required'),
  budget: z.number().optional(),
  companyCode: z.number().optional(),
  isActive: z.boolean().optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  createdBy: z.number(),
  actual: z.number().optional(),
})
export type GetDepartmentType = z.infer<typeof getDepartmentSchema>

//cost center
export const getCostCenterSchema = z.object({
  costCenterId: z.number(),
  costCenterName: z.string(),
  costCenterDescription: z.string().nullable().optional(), // assuming it can be null or missing
  budget: z.number(),
  actual: z.number(),
  companyCode: z.number().nullable().optional(), // in case foreign key is optional
  isActive: z.boolean().nullable().optional(),
  isVehicle: z.boolean().nullable().optional(),
  startDate: z.coerce.date().nullable().optional(),
  endDate: z.coerce.date().nullable().optional(),
  createdBy: z.number(),
  createdAt: z.coerce.date().nullable().optional(),
  updatedBy: z.number().nullable().optional(),
  updatedAt: z.coerce.date().nullable().optional(),
});
export type GetCostCenterType = z.infer<typeof getCostCenterSchema>;

export const createCostCenterSchema = z.object({
  costCenterName: z.string(),
  costCenterDescription: z.string().nullable().optional(), // assuming it can be null or missing
  budget: z.number(),
  actual: z.number(),
  companyCode: z.number().nullable().optional(), // in case foreign key is optional
  isActive: z.boolean().nullable().optional(),
  isVehicle: z.boolean().nullable().optional(),
  startDate: z.coerce.date().nullable().optional(),
  endDate: z.coerce.date().nullable().optional(),
  createdBy: z.number(),
  createdAt: z.coerce.date().nullable().optional(),
  updatedBy: z.number().nullable().optional(),
  updatedAt: z.coerce.date().nullable().optional(),
});
export type CreateCostCenterType = z.infer<typeof createCostCenterSchema>;

//asset category
export const getCategorySchema = z.object({
  category_id: z.number().int().optional(), // optional for auto-increment on insert
  category_name: z.string().max(255),
  depreciation_rate: z.number().nonnegative().nullable().optional(), // allow null if needed
  account_code: z.string().max(30).nullable().optional(),
  depreciation_account_code: z.string().max(30).nullable().optional(),
  parent_cat_code: z.number().int().nullable().optional(),
  created_by: z.number().int(),
  created_time: z.date().optional(), // usually set by DB
  updated_by: z.number().int().nullable().optional(),
  updated_time: z.date().optional(), // set automatically on update
});
export type GetCategoryType = z.infer<typeof getCategorySchema>

export const createCategorySchema = z.object({
  category_id: z.number().int().optional(), // optional for auto-increment on insert
  category_name: z.string().max(255),
  depreciation_rate: z.number().nonnegative().nullable().optional(), // allow null if needed
  account_code: z.string().max(30).nullable().optional(),
  depreciation_account_code: z.string().max(30).nullable().optional(),
  parent_cat_code: z.number().int().nullable().optional(),
  created_by: z.number().int(),
  created_time: z.date().optional(), // usually set by DB
  updated_by: z.number().int().nullable().optional(),
  updated_time: z.date().optional(), // set automatically on update
});
export type CreateCategoryType = z.infer<typeof createCategorySchema>

// asset
export const createAsset = z.object({
  assetCode: z.string().max(100),
  assetName: z.string().max(255),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  purDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  categoryId: z.number().int(),
  subCategoryId: z.number().int(),
  supplierId: z.number().int().nullable().optional(),
  user: z.string().max(100).nullable().optional(),
  companyId: z.number().int(),
  locationId: z.number().int().nullable().optional(),
  sectionId: z.number().int().nullable().optional(),
  departmentId: z.number().int().nullable().optional(),
  // assetValue: z.number(),
  // currentValue: z.number().nullable().optional(),
  // depRate: z.number().nullable().optional(),
  // salvageValue: z.number().nullable().optional(),
  status: z.string().max(50).nullable().optional(),
  // soldDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  // soldValue: z.number().nullable().optional(),
  // mfgCode: z.number().int().nullable().optional(),
  // mfgYear: z.number().int().nullable().optional(),
  countryCode: z.number().int().nullable().optional(),
  model: z.string().max(255).nullable().optional(),
  slNo: z.string().max(255).nullable().optional(),
  costCenterId: z.number().int().nullable().optional(),
  assetGlCode: z.string().max(100).nullable().optional(),
  createdBy: z.number().int().nullable().optional(),
  notes: z.string().max(500).nullable().optional(), // Optional notes field
  createdAt: z.string().optional(), // Normally comes from DB
  updatedBy: z.number().int().nullable().optional(),
  updatedAt: z.string().optional(), // Normally comes from DB
});
export type CreateAssetType = z.infer<typeof createAsset>;

export const getAsset = z.object({
  id: z.number().int().optional(), // optional because it's autoincrement
  assetCode: z.string().max(100),
  assetName: z.string().max(255),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  purDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  categoryId: z.number().int(),
  supplierId: z.number().int().nullable().optional(),
  user: z.string().max(100).nullable().optional(),
  locationId: z.number().int().nullable().optional(),
  sectionId: z.number().int().nullable().optional(),
  departmentId: z.number().int().nullable().optional(),
  // assetValue: z.number(),
  // currentValue: z.number().nullable().optional(),
  // depRate: z.number().nullable().optional(),
  // salvageValue: z.number().nullable().optional(),
  status: z.string().max(50).nullable().optional(),
  // soldDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  // soldValue: z.number().nullable().optional(),
  // mfgCode: z.number().int().nullable().optional(),
  // mfgYear: z.number().int().nullable().optional(),
  countryCode: z.number().int().nullable().optional(),
  model: z.string().max(255).nullable().optional(),
  slNo: z.string().max(255).nullable().optional(),
  costCenterId: z.number().int().nullable().optional(),
  assetGlCode: z.string().max(100).nullable().optional(),
  createdBy: z.number().int().nullable().optional(),
  notes: z.string().max(500).nullable().optional(), // Optional notes field
  createdAt: z.string().optional(), // Normally comes from DB
  updatedBy: z.number().int().nullable().optional(),
  updatedAt: z.string().optional(), // Normally comes from DB
});
export type GetAssetType = z.infer<typeof getAsset>;

export const editAssetSchema = z.object({
  id: z.number(),
  departmentId: z.number(),
  categoryId: z.number(),
  locationId: z.number(),
  user: z.string(),
});
export type EditAssetType = z.infer<typeof editAssetSchema>;


export const assetDetailsSchema = z.object({
  id: z.number(),
  assetCode: z.string(),
  assetName: z.string(),
  startDate: z.string(), // use z.coerce.date() if it's a date string you want to convert
  purDate: z.string(),
  categoryName: z.string(),
  user: z.string(), // assuming user is a username or similar string; change if it's an object
  locationName: z.string(),
  sectionName: z.string(),
  departmentName: z.string(),
  // assetValue: z.number(),
  // currentValue: z.number(),
  // depRate: z.number(),
  // salvageValue: z.number(),
  status: z.string(),
  // soldDate: z.string().nullable(), // assuming soldDate can be null
  // soldValue: z.string().nullable(), // likely a typo, same as soldDate — adjust as needed
  // manufacure: z.string(),
  // mfgYear: z.number(),
  country: z.string(),
  model: z.string(),
  slNo: z.string(),
  costCenter: z.string(),
  assetGlCode: z.string(),
  notes: z.string().max(500).nullable().optional(),
  createdBy: z.string(),
  createdAt: z.string(),
  assetDepStartValue: z.number(),
});
export type GetAssetDetailsType = z.infer<typeof assetDetailsSchema>;


//supplier
export const getSupplierSchema = z.object({
  id: z.number().int().optional(), // auto-increment primary key
  name: z.string().max(255),
  displayName: z.string().max(255).nullable().optional(),
  companyName: z.string().max(255).nullable().optional(),
  type: z.enum(["Supplier", "Manufacturer"]),
  email: z.string().max(100).email().nullable().optional(),
  phone: z.string().max(20).nullable().optional(),
  mobile: z.string().max(20),
  website: z.string().max(255).url().nullable().optional(),
  isCompany: z.boolean().default(true),
  vat: z.string().max(100).nullable().optional(),
  street: z.string().max(255).nullable().optional(),
  city: z.string().max(100),
  zip: z.string().max(20).nullable().optional(),
  active: z.boolean().default(true),
  comment: z.string().nullable().optional(),
  createdBy: z.number().int().nullable().optional(),
  createdAt: z.date().optional(), // You might parse this with new Date() if needed
  updatedBy: z.number().int().nullable().optional(),
  updatedAt: z.date().optional(),
});
export type GetSupplierType = z.infer<typeof getSupplierSchema>;

export const createSupplierSchema = z.object({
  name: z.string().max(255),
  displayName: z.string().max(255).nullable().optional(),
  companyName: z.string().max(255).nullable().optional(),
  type: z.enum(["Supplier", "Manufacturer"]),
  email: z.string().max(100).email().nullable().optional(),
  phone: z.string().max(20).nullable().optional(),
  mobile: z.string().max(20),
  website: z.string().max(255).url().nullable().optional(),
  isCompany: z.boolean().default(true),
  vat: z.string().max(100).nullable().optional(),
  street: z.string().max(255).nullable().optional(),
  city: z.string().max(100),
  zip: z.string().max(20).nullable().optional(),
  active: z.boolean().default(true),
  comment: z.string().nullable().optional(),
  createdBy: z.number().int().nullable().optional(),
  createdAt: z.date().optional(), // You might parse this with new Date() if needed
  updatedBy: z.number().int().nullable().optional(),
  updatedAt: z.date().optional(),
});
export type CreateSupplierType = z.infer<typeof createSupplierSchema>;

//location
export const getLocationSchema = z.object({
  id: z.number().int().optional(), // auto-increment primary key
  name: z.string().max(255),
});
export type GetLocationType = z.infer<typeof getLocationSchema>;

export const createLocationSchema = z.object({
  name: z.string().max(255),
});
export type CreateLocationType = z.infer<typeof createLocationSchema>;

//section(sites)
export const getSiteSchema = z.object({
  id: z.number().int().optional(), // auto-increment primary key
  name: z.string().max(255),
});
export type GetSiteType = z.infer<typeof getSiteSchema>;

export const createSiteSchema = z.object({
  name: z.string().max(255),
});
export type CreateSiteType = z.infer<typeof createSiteSchema>;

//depreciation book
export const getDepreciationBookSchema = z.object({
  id: z.number(),
  name: z.string().max(100),
  description: z.string().nullable(), // assuming text can be null
  companyId: z.number().int(),
  companyName: z.string(),
  depFreq: z.string(),
  isActive: z.boolean().default(true),
  createdBy: z.number().nullable(), // assuming it can be null if not set
  createdAt: z.string(), // or z.coerce.date() if parsed as Date
  updatedAt: z.string(), // same here
});
export type GetDepreciationBookType = z.infer<typeof getDepreciationBookSchema>;

export const createDepreciationBookSchema = z.object({
  name: z.string().max(100),
  description: z.string().nullable(), // assuming text can be null
  companyId: z.number().int(),
  depFreq: z.string(),
  isActive: z.boolean().default(true),
  createdBy: z.number().nullable(), // assuming it can be null if not set
  createdAt: z.string(), // or z.coerce.date() if parsed as Date
  updatedAt: z.string(), // same here
});
export type CreateDepreciationBookType = z.infer<typeof createDepreciationBookSchema>;

//depreciation info
export const createDepreciationInfoSchema = z.object({
  assetId: z.number().int(),
  bookId: z.number().int(),
  depreciationMethod: z.enum(['Straight Line', 'Declining Balance']),
  depreciationRate: z.number().optional(), // optional if nullable in DB
  usefulLifeMonths: z.number().int().optional(), // optional if nullable in DB
  residualValue: z.number().optional(), // optional if nullable in DB
  effectiveDate: z.string().or(z.date()), // can accept either string or Date object
  startingValue: z.number(),
  accDepValue: z.number(),
  createdBy: z.number().int().optional(), // optional if set by backend
});
export type CreateDepreciationInfoType = z.infer<typeof createDepreciationInfoSchema>;

//depreciation transaction
export const getDepTranSchema = z.object({
  id: z.number().int(),
  bookName: z.string(),
  method: z.enum(['Straight Line', 'Declining Balance']),
  rate: z.number(),
  usefullLife: z.number().int(),
  assetValue: z.number(),
  accDep: z.number(),
  salvageValue: z.number(),
  effectiveDate: z.string().datetime(),
  Frequency: z.enum(['Monthly', 'Yearly', 'Quarterly'])
});
export type GetDepTranType = z.infer<typeof getDepTranSchema>;

export const createAssetDepreciationSchema = z.object({
  company_id: z.number().int(),
  depreciation_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD expected)"),
  book_id: z.number().int(),
  saveToDatabase: z.boolean()
});
export type CreateAssetDepreciationType = z.infer<typeof createAssetDepreciationSchema>;

//maintenance
export const getMaintenanceSchema = z.object({
  id: z.number().optional(), // serial PK, usually auto-generated
  assetId: z.number().int().nonnegative(),
  maintDate: z.string().date(), // assuming input as ISO string; adjust if using Date object directly
  type: z.enum(["Preventive", "Corrective", "Condition-based"]),
  cost: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: "Invalid cost format" }), // for form input as string
  description: z.string().optional(),
  performedBy: z.string().min(1),
});
export type GetMaintenanceType = z.infer<typeof getMaintenanceSchema>;

export const createMaintenanceSchema = z.object({
  assetId: z.number().int().nonnegative(),
  maintDate: z.string().date(), // assuming input as ISO string; adjust if using Date object directly
  type: z.enum(["Preventive", "Corrective", "Condition-based"]),
  cost: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: "Invalid cost format" }), // for form input as string
  description: z.string().optional(),
  performedBy: z.string().min(1),
});
export type CreateMaintenanceType = z.infer<typeof createMaintenanceSchema>;

//warrenty
export const getWarrantySchema = z.object({
  id: z.number().optional(), // Auto-increment primary key
  asset_id: z.number().int().nonnegative(),
  type: z.enum(["Standard Warranty", "Extended Warranty"]),
  start_date: z.string().date(), // ISO date string (adjust to `z.coerce.date()` if needed)
  end_date: z.string().date(),
  warranty_provider: z.string().min(1), // text field with address + phone + email
  description: z.string().max(500).optional(),
});
export type GetWarrantyType = z.infer<typeof getWarrantySchema>;

export const createWarrantySchema = z.object({
  asset_id: z.number().int().nonnegative(),
  type: z.enum(["Standard Warranty", "Extended Warranty"]),
  start_date: z.string().date(), // ISO date string (adjust to `z.coerce.date()` if needed)
  end_date: z.string().date(),
  warranty_provider: z.string().min(1), // text field with address + phone + email
  description: z.string().max(500).optional(),
});
export type CreateWarrantyType = z.infer<typeof createWarrantySchema>;

//dispose
export const getDisposeSchema = z.object({
  id: z.number().int().optional(), // optional if auto-incremented
  asset_id: z.number().int().nonnegative(),
  asset_name: z.string().min(1, { message: "Asset name is required" }),
  dispose_date: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid date format" }
  ),
  reason: z.string().min(1, { message: "Reason is required" }),
  method: z.enum(["Sell", "Scrap", "Donate", "Transfer"]),
  value: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Must be a valid decimal with up to 2 digits after decimal"),
  remarks: z.string().optional(),
  performed_by: z.string().min(1, { message: "Performed by is required" }),
});
export type GetDisposeType = z.infer<typeof getDisposeSchema>;

export const createDisposeSchema = z.object({
  asset_id: z.number().int().nonnegative(),
  dispose_date: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid date format" }
  ),
  reason: z.string().min(1, { message: "Reason is required" }),
  method: z.enum(["Sell", "Scrap", "Donate", "Transfer"]),
  value: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Must be a valid decimal with up to 2 digits after decimal"),
  remarks: z.string().optional(),
  performed_by: z.string().min(1, { message: "Performed by is required" }),
});
export type CreateDisposeType = z.infer<typeof createDisposeSchema>;

//asset partial retirement
export const getAssetPartialRetirementSchema = z.object({
  id: z.number().int().optional(), // Optional because it's auto-incremented
  assetId: z.number().int().nonnegative(),
  retirementDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (expected YYYY-MM-DD)"),
  retiredValue: z.number().nonnegative(),
  reason: z.string().optional(),
  updatedBookValue: z.number().nonnegative().optional(),
  createdBy: z.number().int().optional(),
  createdAt: z.string().datetime().optional() // auto-generated timestamp
});
export type GetAssetPartialRetirementType = z.infer<typeof getAssetPartialRetirementSchema>;

export const createAssetPartialRetirementSchema = z.object({
  assetId: z.number().int().nonnegative(),
  retirementDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (expected YYYY-MM-DD)"),
  retiredValue: z.number().nonnegative(),
  reason: z.string().optional(),
  updatedBookValue: z.number().nonnegative().optional(),
  createdBy: z.number().int().optional(),
  createdAt: z.string().datetime().optional() // auto-generated timestamp
});
export type CreateAssetPartialRetirementType = z.infer<typeof createAssetPartialRetirementSchema>;

//asset capex addition
export const getAssetCapexAdditionSchema = z.object({
  id: z.number().int().optional(), // auto-incremented
  assetId: z.number().int().nonnegative(),
  additionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (expected YYYY-MM-DD)"),
  addedValue: z.number().nonnegative(),
  description: z.string().optional(),
  newBookValue: z.number().nonnegative().optional(),
  createdBy: z.number().int().optional(),
  createdAt: z.string().datetime().optional() // set automatically by DB
});
export type GetAssetCapexAdditionType = z.infer<typeof getAssetCapexAdditionSchema>;

export const createAssetCapexAdditionSchema = z.object({
  assetId: z.number().int().nonnegative(),
  additionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (expected YYYY-MM-DD)"),
  addedValue: z.number().nonnegative(),
  description: z.string().optional(),
  newBookValue: z.number().nonnegative().optional(),
  supplierId: z.number().int().optional(),
  createdBy: z.number().int().optional(),
  createdAt: z.string().datetime().optional() // set automatically by DB
});
export type CreateAssetCapexAdditionType = z.infer<typeof createAssetCapexAdditionSchema>;

//depreciation report
export const getDepreciationReportSchema = z.object({
  id: z.number(),
  asset_id: z.number(),
  book_id: z.number(),
  asset_name: z.string(),
  book_name: z.string(),
  transaction_date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  period: z.string().regex(/^\d{4}-\d{2}$/, {
    message: "Period must be in YYYY-MM format",
  }),
  depreciation_amount: z.number(),
  depreciation_method: z.string(),
  created_by: z.number(),
  depreciation_rate: z.number(),
  useful_life_months: z.number(),
  residual_value: z.number(),
  current_value: z.number(),
  acc_dep: z.number(),
});
export type GetDepreciationReportType = z.infer<typeof getDepreciationReportSchema>;

//asset-depreciation
const assetDepreciationSchema = z.object({
  assetId: z.number(),
  assetName:z.string(),
  bookId: z.number(),
  bookName:z.string(),
  transactionDate: z.string().datetime(), // ISO date string
  period: z.string(),                    // e.g. "2025-06"
  depreciationAmount: z.number(),
  createdBy: z.number()
});
export type AssetDepreciationType = z.infer<typeof assetDepreciationSchema>;

//gl-depreciation-report
export const glDepreciationReportSchema = z.object({
  period: z.string(), // if it's a date you can use z.string().regex() or z.date()
  asset_gl: z.string(),
  costCenterCode: z.string(),
  totalDepreciation: z.number(),
});

export type GLDepreciationReportType = z.infer<typeof glDepreciationReportSchema>;

//asset-info-report
export const assetInfoReportchema = z.object({
  item_code: z.string(),
  item_desc: z.string(),
  mfg_code: z.string(),
  mfg_name: z.string(),
  c_origin: z.string(),
  m_model: z.string(),
  mfg_yy: z.union([z.string(), z.number()]), // depends on your data source
  mc_sl: z.string(),
  mc_loc: z.union([z.string(), z.number()]),
  comm_dt: z.string(), // you can add date regex if needed
  mc_sup: z.number(),
  supplier_name: z.string(),
  a_loc: z.union([z.string(), z.number()]),
  a_sec: z.union([z.string(), z.number()]),
  a_cat: z.union([z.string(), z.number()]),
  a_dept: z.union([z.string(), z.number()]),
  a_st: z.string(),
  a_value: z.number(),
  curr_value: z.number(),
  l_time: z.number(),
  d_pct: z.number(),
  yy_dep: z.number(),
  accu_dep_o: z.number(),
  accu_dep: z.number(),
  b_value: z.number(),
  b_name: z.string(),
  a_scat: z.union([z.string(), z.number()]),
  cc_code: z.number(),
  cc_desc: z.string(),
  oh_amt: z.number(),
  oh_l_time: z.number(),
  oh_dt: z.string(),
  r_l_time: z.number(),
  u_l_time: z.number(),
  u_accu_dep: z.number(),
  a_st_dt: z.string(),
  s_amt: z.number(),
  a_rem: z.string(),
  sold_dt: z.string(),
});
export type AssetInfoReportType = z.infer<typeof assetInfoReportchema>;

export const catAndSubcatAccuDepReportType = z.object({
  subCategory: z.string(),
  parentCategory: z.string(),
  totalDepreciation: z.number(),
});
export type CatAndSubcatAccuDepReportType = z.infer<typeof catAndSubcatAccuDepReportType>;

export const depreciationInfoReportSchema = z.object({
  code: z.string(),
  description: z.string(),
  commencement: z.string(), // You can add date validation if needed
  subCategory: z.string(),
  locationId: z.union([z.string(), z.number()]),
  location: z.string(),
  departmentId: z.union([z.string(), z.number()]),
  department: z.string(),
  actualValue: z.number(),
  currentValue: z.number(),
  usefulLife: z.number(),
  depreciationPercentage: z.number(),
  depreciation: z.number(),
});
export type DepreciationInfoReportType = z.infer<typeof depreciationInfoReportSchema>;






















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

export type LocationData = z.infer<typeof locationSchema>

export interface LocationFromLocalstorage {
  location: {
    locationId: number
    address: string
    companyId: number
  }
}

export const resPartnerSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required'),
  companyName: z.string().optional().nullable(),
  type: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  website: z.union([z.string().url(), z.string().length(0)]).optional(),
  isCompany: z.boolean().optional(),
  vat: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  active: z.boolean().optional(),
  creditLimit: z.number().nonnegative().optional(),
  customerRank: z.number().nonnegative().optional(),
  supplierRank: z.number().nonnegative().optional(),
  comment: z.string().optional(),
  createdBy: z.number().optional(),
  updatedBy: z.number().optional(),
})

export type ResPartner = z.infer<typeof resPartnerSchema> & {
  id: number
  companyId?: number
  createdAt?: string
  updatedAt?: string
}

export type ResPartnerCreate = Omit<
  ResPartner,
  'id' | 'createdBy' | 'updatedBy' | 'createdAt' | 'updatedAt'
>
export type ResPartnerUpdate = Omit<
  ResPartner,
  'id' | 'createdBy' | 'createdAt' | 'updatedAt'
>

export type Period = {
  periodId: number
  yearId: number
  periodName: string
  startDate: Date
  endDate: Date
  isOpen: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: number
}

export const updatePostingPeriodsSchema = z.object({
  postingIds: z.array(z.number().positive()).nonempty(),
  isOpen: z.boolean(),
})

//bank account type
export const bankAccountSchema = z.object({
  id: z.number(),
  accountName: z
    .string()
    .min(2, 'Account name must be at least 2 characters.')
    .max(100, 'Account name must not exceed 100 characters.'),
  accountNumber: z
    .string()
    .min(5, 'Account number must be at least 5 characters.')
    .max(50, 'Account number must not exceed 50 characters.'),
  bankName: z
    .string()
    .min(2, 'Bank name must be at least 2 characters.')
    .max(100, 'Bank name must not exceed 100 characters.'),
  branchName: z
    .string()
    .max(100, 'Branch name must not exceed 100 characters.')
    .optional(),
  ifscCode: z
    .string()
    .max(20, 'IFSC code must not exceed 20 characters.')
    .optional()
    .nullable(),
  swiftCode: z
    .string()
    .max(20, 'SWIFT code must not exceed 20 characters.')
    .optional()
    .nullable(),
  currencyId: z.string().max(36, 'Currency ID must not exceed 36 characters'),
  accountType: z.enum(['Savings', 'Current', 'Overdraft', 'Fixed']),
  openingBalance: z
    .number()
    .nonnegative('Opening balance must be a non-negative number.')
    .multipleOf(0.01, 'Opening balance must have at most 2 decimal places.'),
  validityDate: z
    .string()
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),
  assetDetails: z
    .string()
    .max(255, 'Asset details must not exceed 255 characters')
    .optional()
    .nullable(),
  isActive: z.boolean(),
  isReconcilable: z.boolean(),
  glAccountId: z.number(),
  bankCode: z
    .string()
    .max(50, 'Bank code must not exceed 50 characters')
    .optional()
    .nullable(),
  integrationId: z
    .string()
    .max(36, 'Integration ID must not exceed 36 characters')
    .optional()
    .nullable(),
  notes: z.string().max(500, 'Notes must not exceed 500 characters').optional(),
  createdBy: z.number(),
  updatedBy: z.number().optional(),
})

export type BankAccount = z.infer<typeof bankAccountSchema> & {
  createdAt?: string
  updatedAt?: string
}

export const createBankAccountSchema = z.object({
  accountName: z
    .string()
    .min(2, 'Account name must be at least 2 characters.')
    .max(100, 'Account name must not exceed 100 characters.'),
  accountNumber: z
    .string()
    .min(5, 'Account number must be at least 5 characters.')
    .max(50, 'Account number must not exceed 50 characters.'),
  bankName: z
    .string()
    .min(2, 'Bank name must be at least 2 characters.')
    .max(100, 'Bank name must not exceed 100 characters.'),
  branchName: z
    .string()
    .max(100, 'Branch name must not exceed 100 characters.')
    .optional(),
  ifscCode: z
    .string()
    .max(20, 'IFSC code must not exceed 20 characters.')
    .optional()
    .nullable(),
  swiftCode: z
    .string()
    .max(20, 'SWIFT code must not exceed 20 characters.')
    .optional()
    .nullable(),
  currencyId: z.string().max(36, 'Currency ID must not exceed 36 characters'),
  accountType: z.enum(['Savings', 'Current', 'Overdraft', 'Fixed']),
  openingBalance: z
    .number()
    .nonnegative('Opening balance must be a non-negative number.')
    .multipleOf(0.01, 'Opening balance must have at most 2 decimal places.'),
  validityDate: z
    .string()
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),
  assetDetails: z
    .string()
    .max(255, 'Asset details must not exceed 255 characters')
    .optional()
    .nullable(),
  isActive: z.boolean(),
  isReconcilable: z.boolean(),
  glAccountId: z.number(),
  bankCode: z
    .string()
    .max(50, 'Bank code must not exceed 50 characters')
    .optional()
    .nullable(),
  integrationId: z
    .string()
    .max(36, 'Integration ID must not exceed 36 characters')
    .optional()
    .nullable(),
  notes: z.string().max(500, 'Notes must not exceed 500 characters').optional(),
  createdBy: z.number(),
  updatedBy: z.number().optional(),
})

export type CreateBankAccount = z.infer<typeof createBankAccountSchema> & {
  createdAt?: string
  updatedAt?: string
}

export type BankAccountCreate = Omit<
  BankAccount,
  'id' | 'createdBy' | 'updatedBy' | 'createdAt' | 'updatedAt'
>
export type BankAccountUpdate = Omit<
  BankAccount,
  'id' | 'createdBy' | 'createdAt' | 'updatedAt'
>

//financial year zod Validation

export const createFinancialYearSchema = z
  .object({
    startdate: z.coerce.date(), // Converts input to a Date object
    enddate: z.coerce.date(), // Converts input to a Date object
    yearname: z.string().min(1, 'Year name is required'), // Must not be empty
    isactive: z.boolean().default(true), // Optional, defaults can be handled elsewhere
    createdby: z.number().int().positive(), // Must be a positive integer
  })
  .refine(
    (data) => {
      // Ensure start date is before end date
      if (data.startdate >= data.enddate) {
        return false
      }
      if (data.startdate.getDate() !== 1) {
        return false
      }

      // Check if end date is the last day of a month
      if (!isLastDayOfMonth(data.enddate)) {
        return false
      }

      return true
    },
    (data) => {
      if (data.startdate >= data.enddate) {
        return {
          message: 'The financial year must start before it ends',
          path: ['startdate', 'enddate'],
        }
      }
      if (data.startdate.getDate() !== 1) {
        return {
          message: 'The start date must be the first day of a month',
          path: ['startdate'],
        }
      }
      if (!isLastDayOfMonth(data.enddate)) {
        return {
          message: 'The end date must be the last day of a month',
          path: ['enddate'],
        }
      }
      return {
        message: 'The financial year must span exactly 12 months',
        path: ['startdate'],
      }
    }
  )

export interface CodeGroup {
  id: string
  code: string
  isExpanded?: boolean
  subgroups?: CodeGroup[]
}

export interface ParentCode {
  code: string
  name: string
}

// Zod schema for Chart of Accounts

export const chartOfAccountSchema = z.object({
  name: z.string().max(255).min(1, 'Account type is required'),
  code: z
    .string()
    .min(1, 'Code is required')
    .max(64, 'Maximum 64 characters allowed'),
  accountType: z
    .string()
    .min(1, 'Account type is required')
    .max(64, 'Maximum 64 characters allowed'),
  parentAccountId: z.number().int(),
  parentName: z.string().min(1, 'Parent account ID is required').optional(),
  currencyId: z.number().int().positive('Currency is required'),
  isReconcilable: z.boolean().default(false),
  withholdingTax: z.boolean().default(false),
  budgetTracking: z.boolean().default(false),
  isActive: z.boolean().default(true),
  isGroup: z.boolean().default(false),
  isCash: z.boolean().default(true),
  isBank: z.boolean().default(false),
  cashTag: z.string(),
  createdBy: z.number().int().positive(),
  notes: z.string(),
})

export type ChartOfAccount = z.infer<typeof chartOfAccountSchema>
//Zod schema for Accounts ( Chart of Accounts with Parent Code)
export const AccountsHeadSchema = z.object({
  accountId: z.number().int().positive(),
  code: z.string(),
  name: z.string(),
  accountType: z.string(),
  parentCode: z.string().nullable(),
  parentName: z.string().nullable(),
  isReconcilable: z.boolean(),
  notes: z.string(),
  isGroup: z.boolean(),
  isCash: z.boolean(),
})
export type AccountsHead = z.infer<typeof AccountsHeadSchema>
//Zod schema for Accounts ( Chart of Accounts with Parent Code)

//Cash Voucher
export interface FormData {
  date: string
  company: string
  location: string
  currency: string
}

export interface Voucher {
  voucherno: string
  companyname: string
  location: string
  currency: string
  journaltype: string
  accountName: string
  costCenter: string
  department: string
  partnerName: string
  notes: string
  totalamount: string
  state: string
  date: string
}

export interface DetailRow {
  id: number
  type: string
  accountName: string
  costCenter: string
  department: string
  partnerName: string
  remarks: string
  amount: string
  isDraft: boolean
}

export interface User {
  userId: number
  username: string
  roleId: number
  roleName: string
  userCompanies: Company[]
  userLocations: Location[]
  voucherTypes: string[]
}

export interface Location {
  locationId: number
  address: string
  companyId: number
}

//journal entry
const JournalEntrySchema = z.object({
  voucherNo: z.string().nullable().optional(), // Will calcualte automatically on backend
  date: z.string(),
  journalType: z.string(),
  state: z.number().default(0),
  companyId: z.number(),
  locationId: z.number(),
  currencyId: z.number(),
  amountTotal: z.number(),
  notes: z.string().optional(),
  periodid: z.number().nullable().optional(), // Will calcualte automatically on backend
  createdBy: z.number(),
})

const JournalDetailSchema = z.object({
  voucherId: z.number().optional(), //Will get from Master Data
  accountId: z.number(),
  costCenterId: z.number().nullable().optional(),
  departmentId: z.number().nullable().optional(),
  debit: z.number(),
  credit: z.number(),
  analyticTags: z.string().nullable().optional(),
  taxId: z.number().nullable().optional(),
  resPartnerId: z.number().nullable().optional(),
  bankaccountid: z.number().nullable().optional(),
  notes: z.string().optional(),
  type: z.string().optional(),
  createdBy: z.number(),
  payTo: z.string().nullable().optional(),
})

export const JournalEntryWithDetailsSchema = z.object({
  journalEntry: JournalEntrySchema,
  journalDetails: z.array(JournalDetailSchema),
})

export type JournalEntryWithDetails = z.infer<
  typeof JournalEntryWithDetailsSchema
>
//Voucher Type Enum
export enum VoucherTypes {
  CashVoucher = 'Cash Voucher',
  BankVoucher = 'Bank Voucher',
  JournalVoucher = 'Journal Voucher',
  ContraVoucher = 'Contra Voucher',
}
//For Sending Journal Query
export const JournalQuerySchema = z.object({
  date: z.string(),
  companyId: z.array(z.number()),
  locationId: z.array(z.number()),
  voucherType: z.nativeEnum(VoucherTypes).optional(),
})
export type JournalQuery = z.infer<typeof JournalQuerySchema>

//For holding Journal Deta
export const JournalResultSchema = z.object({
  voucherid: z.number(),
  voucherno: z.string(),
  date: z.string(),
  journaltype: z.string(),
  state: z.number(),
  companyname: z.string().nullable(),
  location: z.string().nullable(),
  currency: z.string().nullable(),
  totalamount: z.number(),
  notes: z.string().nullable(),
  id: z.number(),
  accountsname: z.string(),
  costcenter: z.string().nullable(),
  department: z.string().nullable(),
  debit: z.number().default(0),
  credit: z.number().default(0),
  partner: z.number().nullable(),
  bankaccount: z.number().nullable(),
  detail_notes: z.string().nullable(),
})
export type JournalResult = z.infer<typeof JournalResultSchema>


//cost center
const costCenterSchema = z.object({
  costCenterId: z.number().min(1, 'Cost center id is required'),
  costCenterName: z.string().min(1, 'Cost center name is required'),
  costCenterDescription: z.string(),
  budget: z.string(),
  actual: z.string().optional(),
  currencyCode: z.enum(['USD', 'BDT', 'EUR', 'GBP']),
  isActive: z.boolean(),
  isVehicle: z.boolean(),
  createdBy: z.number().optional(),
})

export const activateDeactivateCostCenterSchema = z.object({
  costCenterId: z.number().min(1, 'Cost center id is required'),
})
export type CostCenter = z.infer<typeof costCenterSchema>
export const costCentersArraySchema = z.array(costCenterSchema)
export type CostCenterActivateDeactivate = z.infer<
  typeof activateDeactivateCostCenterSchema
>

//Voucher Type by id
const VoucherSchemaById = z.object({
  voucherid: z.number(),
  voucherno: z.string(),
  date: z.string(),
  journaltype: z.string(),
  state: z.number(),
  companyname: z.string(),
  location: z.string(),
  currency: z.string(),
  totalamount: z.number(),
  notes: z.string(),
  id: z.number(),
  accountsname: z.string(),
  costcenter: z.string().nullable(),
  createdby: z.number(),
  department: z.any().nullable(), // If you know the type, replace `z.any()` with the correct type
  debit: z.number(),
  credit: z.number(),
  partner: z.any().nullable(), // If you know the type, replace `z.any()` with the correct type
  bankaccount: z.any().nullable(), // If you know the type, replace `z.any()` with the correct type
  detail_notes: z.string(),
  payTo: z.string().nullable(),
})

export type VoucherById = z.infer<typeof VoucherSchemaById>

const bankAccountDateRangeSchema = z.object({
  bankaccount: z.number(),
  fromdate: z.string(),
  todate: z.string(),
})

export type BankAccountDateRange = z.infer<typeof bankAccountDateRangeSchema>

//edit journal notes
export const DetailNoteSchema = z.object({
  id: z.number(),
  notes: z.string(),
})

export const JournalNotesSchema = z.object({
  id: z.number(),
  notes: z.string(),
})

export type JournalNotes = z.infer<typeof JournalNotesSchema>
export type DetailNote = z.infer<typeof DetailNoteSchema>

//asset
export const createAssetSchema = z.object({
  asset_name: z
    .string()
    .min(2, 'Asset name must be at least 2 characters.')
    .max(255, 'Asset name must not exceed 255 characters.'),
  category_id: z.number().int('Category ID must be an integer.'),
  purchase_date: z.coerce.date(),
  purchase_value: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid decimal format for purchase value.'),
  current_value: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid decimal format for current value.')
    .optional(),
  salvage_value: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid decimal format for salvage value.')
    .optional(),
  depreciation_method: z.enum(['Straight Line', 'Diminishing Balance']),
  useful_life_years: z
    .number()
    .int('Useful life must be an integer.')
    .optional(),
  status: z.enum(['Active', 'Disposed']).default('Active'),
  company_id: z.number().int('Company ID must be an integer.'),
  location_id: z.number().int('Location ID must be an integer.').optional(),
  department_id: z.number().int('Department ID must be an integer.').optional(),
  cost_center_id: z
    .number()
    .int('Cost Center ID must be an integer.')
    .optional(),
  depreciation_rate: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid decimal format for depreciation rate.')
    .optional(),
  created_by: z.number().int('Created by must be an integer.'),
})

export type CreateAssetData = z.infer<typeof createAssetSchema>


// Trial Balance type
export interface TrialBalanceData {
  id: number
  code: string
  name: string
  level: number
  parentCode: string | null
  initialDebit: number
  initialCredit: number
  initialBalance: number
  periodDebit: number
  periodCredit: number
  closingDebit: number
  closingCredit: number
  closingBalance: number
  children: TrialBalanceData[] // Nested structure for sub-items
}

//general ledger
export interface GeneralLedgerType {
  voucherid: number
  voucherno: string
  accountname: string
  debit: number
  credit: number
  accountsdetails: number
  notes: string
  partner: string
  coscenter: string
  department: string
}

export interface PartnerLedgerType {
  voucherid: number
  voucherno: string
  accountname: string
  debit: number
  credit: number
  accountsdetails: number
  notes: string
  partner: string
  coscenter: string
  department: string
}

//cash flow statement type
export interface CashflowStatement {
  debit: number
  credit: number
  cashflowTag: string
}

// cost center summmary backend zod schema
export const CostCenterSummarySchema = z.object({
  fromDate: z.string(),
  endDate: z.string(),
  costCenterIds: z.string().transform((val) => val.split(',').map(Number)),
  companyId: z.string(),
})

export type CostCenterSummarySchemaType = z.infer<
  typeof CostCenterSummarySchema
>

// cost center summary get data type
export interface CostCenterSummaryType {
  costCenterId: number
  costCenterName: string
  accountId: number
  accountName: string
  totalDebit: number
  totalCredit: number
}

//department summary zod
export const DepartmentSummarySchema = z.object({
  departmentId: z.number(),
  departmentName: z.string(),
  accountId: z.number(),
  accountName: z.string(),
  totalDebit: z.number(),
  totalCredit: z.number(),
})

//filter by department summary
export const DepartmentSummaryfilterSchema = z.object({
  fromDate: z.string(),
  endDate: z.string(),
  departmentIds: z.string().transform((val) => val.split(',').map(Number)),
  companyId: z.string(),
})

//deaprtment summary type
export type DepartmentSummaryType = z.infer<typeof DepartmentSummarySchema>
export type DepartmentSummaryfilterType = z.infer<
  typeof DepartmentSummaryfilterSchema
>

//Profit and Loss filter zod
export const ProfitAndLossFilterSchema = z.object({
  fromDate: z.string(),
  endDate: z.string(),
  companyId: z.string(),
})

export const ProfitAndLossSchema = z.object({
  title: z.string(),
  value: z.number(),
  position: z.number(),
  negative: z.boolean().nullable(), // Allows `null` or `boolean` values
})

export type ProfitAndLossFilterType = z.infer<typeof ProfitAndLossFilterSchema>
export type ProfitAndLossType = z.infer<typeof ProfitAndLossSchema>

//level
export interface LevelType {
  title: string
  type?: 'Calculated Field' | 'COA Group'
  COA_ID?: number | null
  position: number
  formula?: string
  negative: boolean
}

// IouRecord loan schema zod
export const IouRecordGetSchema = z.object({
  iouId: z.number(),
  amount: z.number().positive(),
  adjustedAmount: z.number().default(0),
  employeeId: z.number().int().positive(),
  dateIssued: z.coerce.date(),
  dueDate: z.date(),
  status: z.enum(['active', 'inactive']).default('active'),
  notes: z.string().optional(),
  createdBy: z.number().int().positive(),
})

export type IouRecordGetType = z.infer<typeof IouRecordGetSchema>

// IouRecord loan create  schema zod
export const IouRecordCreateSchema = z.object({
  amount: z.number().positive(),
  adjustedAmount: z.number().default(0),
  employeeId: z.number().int().positive(),
  dateIssued: z.coerce.date(),
  dueDate: z.coerce.date(),
  status: z.enum(['active', 'inactive']).default('active'),
  notes: z.string().optional(),
  createdBy: z.number().int().positive(),
})

export type IouRecordCreateType = z.infer<typeof IouRecordCreateSchema>

//IouAdjustmentCreateSchema
export const IouAdjustmentCreateSchema = z.object({
  iouId: z.number().int().positive(),
  amountAdjusted: z.number().default(0),
  adjustmentDate: z.coerce.date(),
  adjustmentType: z.string().max(50),
  notes: z.string().optional(),
})

export type IouAdjustmentCreateType = z.infer<typeof IouAdjustmentCreateSchema>

//employee master employee zod schema
export const EmployeeSchema = z.object({
  id: z.number(),
  employeeId: z.string(),
  employeeName: z.string(),
  employeeContact: z.string().nullable(),
  email: z.string().email(),
  department: z.string(),
  status: z.enum(['active', 'inactive']),
})

// employee master employeee TypeScript type
export type Employee = z.infer<typeof EmployeeSchema>

//Cash Position Bank Balance report type
export interface BankBalance {
  companyId: string
  companyName: string
  BankAccount: string
  AccountType: string
  openingBalance: number
  debitSum: number
  creditSum: number
  closingBalance: number
}

//cash position cash balance report type

export interface CashBalance {
  companyId: string
  companyName: string
  locationName: string
  openingBalance: number
  debitSum: number
  creditSum: number
  closingBalance: number
}

export const exchangeSchema = z.object({
  exchangeDate: z.coerce.date(),
  baseCurrency: z.number().int(),
  rate: z.number(),
})

export type ExchangeType = z.infer<typeof exchangeSchema>

export const currencySchema = z.object({
  currencyId: z.number(),
  currencyCode: z.string(),
  currencyName: z.string(),
  baseCurrency: z.boolean(),
})

export type CurrencyType = z.infer<typeof currencySchema>

// create budget items schema zod
const CreateBudgetItemsSchema = z.object({
  budgetId: z.number().int(),
  accountId: z.number().int(),
  amount: z.number().nullable().optional(),
  createdBy: z.number().int().nullable().optional(),
  actual: z.number().int().nullable().optional(),
})

export type CreateBudgetItemsType = z.infer<typeof CreateBudgetItemsSchema>

//create budget master schema zod
export const CreateBudgetMasterSchema = z.object({
  budgetName: z.string().min(1).max(80),
  companyId: z.number().int(),
  fromDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  toDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  active: z.boolean(),
  locked: z.boolean(),
  createdBy: z.number().int(),
})
export type CreateBudgetMasterType = z.infer<typeof CreateBudgetMasterSchema>

//get master budget type
export interface MasterBudgetType {
  budgetId: number
  name: string
  companyId: number
  fromDate: string // ISO date string
  toDate: string // ISO date string
  locked: boolean
}

// get budget items type
export interface BudgetItems {
  id: number
  budgetId: number
  name: string
  budgetAmount: number
  accountId: number
}

//payment requisition
export enum PurchaseOrderStatus {
  PurchaseOrder = 'Purchase Order',
  GRNCompleted = 'GRN Completed',
  InvoiceCreated = 'Invoice Created',
  PaymentMade = 'Payment Made',
}

export const purchaseOrderMasterSchema = z.object({
  attn: z.string().nullable().optional(),
  poNo: z.string(),
  poDate: z.coerce.date(),
  termsAndConditions: z.string().nullable().optional(),
  totalAmount: z.number(),
  preparedBy: z.string().nullable().optional(),
  checkedBy: z.string().nullable().optional(),
  authorizedBy: z.string().nullable().optional(),
  reqNo: z.string().nullable().optional(),
  status: z.nativeEnum(PurchaseOrderStatus),
  companyId: z.number().int(),
  vendorCode: z.string(),
  createdBy: z.number(),
})

// Zod schema for PurchaseOrderDetails
export const purchaseOrderDetailsSchema = z.object({
  itemCode: z.string(),
  unit: z.string().nullable().optional(),
  quantity: z.number(),
  rate: z.number(),
})

// Zod schema for PurchaseEntryWithDetailsSchema
export const purchaseEntrySchema = z.object({
  purchaseMaster: purchaseOrderMasterSchema,
  purchaseDetails: z.array(purchaseOrderDetailsSchema),
})

export type PurchaseEntryType = z.infer<typeof purchaseEntrySchema>

export interface GetPaymentOrder {
  id: number
  poNo: string
  PurDate: string
  purAttn: string
  reqNo: string
  vendorName: string
  amount: string
  preparedBy: string
  checkedBy: string
  authorizedBy: string
  companyName: string
  status: string
}

//approve invoice
export const approveInvoiceSchema = z.object({
  invoiceId: z.string(),
  approvalStatus: z.string(),
  approvedBy: z.string(),
  poId: z.string(),
})

export type ApproveInvoiceType = z.infer<typeof approveInvoiceSchema>

//create invoice
export const createInvoiceSchema = z.object({
  poId: z.number().int().positive(),
  vendorId: z.number().int().positive(),
  invoiceNumber: z.string().max(50),
  invoiceDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable(),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable(),
  currency: z.string().max(10),
  totalAmount: z.number().nonnegative(),
  vatAmount: z.number().nonnegative().optional(),
  taxAmount: z.number().nonnegative().optional(),
  tdsAmount: z.number().nonnegative().optional(),
  discountAmount: z.number().nonnegative().optional(),
  paymentStatus: z.enum(['Pending', 'Partially Paid', 'Paid', 'Cancelled']),
  paymentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable(),
  approvalStatus: z.enum(['Pending', 'Approved', 'Rejected']),
  approvedBy: z.number().int().positive().optional().nullable(),
  attachmentUrl: z.string().url().optional(),
  createdBy: z.number(),
})

export type CreateInvoiceType = z.infer<typeof createInvoiceSchema>

export const requisitionAdvanceSchema = z.object({
  requisitionNo: z.string().max(50), // Max length of 50
  poId: z.number().int().positive(), // Must be a positive integer
  vendorId: z.number().int().positive(), // Must be a positive integer
  requestedBy: z.number().int().positive(), // Must be a positive integer
  createdBy: z.number().int().positive(), // Must be a positive integer
  checkName: z.string().max(255).optional(), // Optional string with max length 255
  requestedDate: z.coerce.date().optional(), // Auto-defaults to current date if missing
  advanceAmount: z.number().positive(), // Must be a positive number
  approvedAmount: z.number().min(0).optional(), // Cannot be negative, defaults to 0
  currency: z.string().max(10), // Currency as string (ISO code like "USD", "BDT")
  paymentStatus: z.enum(['PENDING', 'PAID', 'REJECTED']).default('PENDING'), // Enum validation
  approvalStatus: z
    .enum(['PENDING', 'APPROVED', 'REJECTED'])
    .default('PENDING'), // Enum validation
  approvedBy: z.number().int().positive().nullable().optional(), // Can be null if not yet approved
  approvedDate: z.coerce.date().nullable().optional(), // Can be null if not yet approved
  remarks: z.string().optional(), // Optional text
})

export type RequisitionAdvanceType = z.infer<typeof requisitionAdvanceSchema>

//approve advance
const approveAdvanceSchema = z.object({
  id: z.number(),
  reqno: z.string(),
  description: z.string().nullable(),
  poid: z.number().nullable(),
  vendorid: z.number().nullable(),
  vendorname: z.string(),
  requestedid: z.number(),
  requestedby: z.string(),
  requestedDate: z.string().datetime(),
  checkName: z.string().nullable(),
  approveamount: z.number().nullable(),
  advanceamount: z.number().nullable(),
  currency: z.string().nullable(),
  approvalStatus: z.string(),
  paymentStatus: z.string(),
  approvedid: z.number().nullable(),
  approvedby: z.string().nullable(),
  approvaldate: z.string().datetime().nullable(),
})

export type ApproveAdvanceType = z.infer<typeof approveAdvanceSchema>

//Get All Vehicle Type
export interface GetAllVehicleType {
  vehicleNo: number
  costCenter: number
  costCenterName: string
  description: string
  purchaseDate: string
  assetId: number
  employeeId: number
  employeeName: string
  user: number
}

//Create Vehicle zod schema
export const createVehicleSchema = z.object({
  costCenterId: z.number().int().nullable(),
  vehicleDescription: z.string().max(45).nullable(),
  purchaseDate: z.coerce.date().nullable(),
  assetId: z.number().int().nullable(),
  employeeId: z.number().int().nullable(),
})
export type CreateVehicleType = z.infer<typeof createVehicleSchema>

// Get GetVehicleConsumptionType

export interface GetVehicleConsumptionType {
  id: number
  vehicleId: number
  octConsumption: number
  gasConsumption: number
  totalConsumption: number
  kmrsPerLitr: number
  transDate: string // ISO date string
  createdBy: number
  createdAt: string // ISO date string
}

//Create createVehicleFuelConsumptionSchema
export const createVehicleFuelConsumptionSchema = z.object({
  vehicleId: z.number().int(),
  octConsumption: z.number().nullable(),
  gasConsumption: z.number().nullable(),
  totalConsumption: z.number().nullable(),
  kmrsPerLitr: z.number().nullable(),
  transDate: z.coerce.date(),
  createdBy: z.number().int(),
})

export type createVehicleFuelConsumptionType = z.infer<
  typeof createVehicleFuelConsumptionSchema
>

//bank reconciliation
export const bankReconciliationSchema = z.object({
  bankId: z.number().int(),
  voucherId: z.number().int().nullable(),
  checkNo: z.string().max(45).nullable(),
  amount: z.number().nullable(),
  type: z.string().max(45).nullable(),
  reconciled: z.number().int().min(0).max(1).nullable(),
  comments: z.string().max(45).nullable(),
  date: z.string().max(45).nullable(),
  reconcileId: z.boolean().nullable(),
})

export type BankReconciliationType = z.infer<
  typeof bankReconciliationSchema
> & { id: number }

//bank transaction
export const getBankTransactionSchema = z.object({
  id: z.number(),
  bankId: z.number(),
  date: z.string(),
  description: z.string(),
  amount: z.string(),
  currency: z.string(),
  status: z.string(),
  checkNo: z.string(),
  reconcileId: z.boolean().nullable(),
})

export type GetBankTransactionType = z.infer<typeof getBankTransactionSchema>

//fund position
const BalanceEntrySchema = z.object({
  date: z.string(),
  accountNumber: z.string().nullable(),
  accountHead: z.null(),
  balance: z.string().nullable(),
  companyName: z.string().nullable(),
})

// Define the schema for cash balance
const CashBalanceSchema = z.array(BalanceEntrySchema)

// Define the schema for bank balance
const BankBalanceSchema = z.array(z.array(BalanceEntrySchema))

// Define the main response schema
export const FundPositionSchema = z.object({
  cashBalance: CashBalanceSchema,
  BankBalance: BankBalanceSchema,
})

// Infer the TypeScript type from the schema
export type FundPositionType = z.infer<typeof FundPositionSchema>

//bank-transactions
export const createBankTransactionSchema = z.object({
  bankId: z.string().optional(),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  description: z.string().optional(),
  amount: z.string(),
  currency: z.string(),
  status: z.enum(['Matched', 'Unmatched', 'Pending']).default('Pending'),
})

export type createBankTransactionType = z.infer<
  typeof createBankTransactionSchema
>

export const CreateElectricityMeterSchema = z.object({
  idelectricityMeterId: z.number().int().positive(),
  electricityMeterName: z.string().max(45),
  companyId: z.number().int(),
  meterType: z.number().int().default(0),
  costCenterId: z.number().int(),
  meterDescription: z.string().max(80),
  provAccountId: z.number().nonnegative(),
  accountId: z.number().nonnegative(),
})

export type CreateElectricityMeterType = z.infer<
  typeof CreateElectricityMeterSchema
>

//Get Electricity Meter
export interface GetElectricityMeterType {
  meterid: number
  meterName: string
  companyId: number
  companyName: string
  metertpe: number
  description: string
  costCenterid: number
  costCenterName: string
  provaccountId: number
  provaccountName: string
  accountid: number
  accountHead: string
}

//Get Bills get type
export interface GetElectricityBillType {
  id: number
  meterName: string
  billDate: string // Or Date if you prefer to handle it as a Date object
  amount: number
  payment: number
  description: string
}

//Create Electricity Bill Schema
export const CreateElectricityBillSchema = z.object({
  billId: z.number().int().positive(), // Primary key with auto-increment
  meterNo: z.number().int(), // Foreign key to electricity_meter
  billDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // Date in YYYY-MM-DD format, // Date in YYYY-MM-DD format
  amount: z.number(), // Double column for the amount
  payment: z.number().int().min(0).max(1), // Tinyint column for payment status (0 or 1)
})

export type CreateElectricityBillType = z.infer<
  typeof CreateElectricityBillSchema
>

// vehicle summary zod schema type
const VehicleSummarySchema = z.object({
  vehicleNo: z.number(),
  'Accounts Payable': z.string(), // Assuming it's a string because of the negative sign and decimal format
  'Barrett Kelley': z.string(),
  'Hashim England 1': z.string(),
  total_oct_consumption: z.null(),
  total_gas_consumption: z.null(),
  total_km: z.null(),
})

export type VehicleSummaryType = z.infer<typeof VehicleSummarySchema>

// Expense Data type
export interface GEtExpenseDataType {
  name: string
  groupName: string
  totalDebit: number
  totalCredit: number
  netExpense: number
  lastMonthDebit: number
  lastMonthCredit: number
  lastMonthNetExpense: number
}

//Get cost breakdown data type
export interface GetCostBreakdownType {
  financialTag: string
  balance: number
}

//Get cost breakdown data type
export interface GetCostBreakdownType {
  financialTag: string
  balance: number
}

//Get cost breakdown Details data type
export interface GetCostBreakdownDetailsType {
  name: string
  balance: number
}

//bank reconciliaton report
export const bankReconciliationReportSchema = z.object({
  dateRange: z.object({
    from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
    to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),

  openingBalance: z.object({
    book: z.number(),
    bank: z.number(),
  }),

  reconciledAmount: z.string(), // String representation of a number

  unreconciledAmount: z.object({
    total: z.number(),
    breakdown: z.object({
      onlyInBooks: z.array(z.any()), // Empty array in the example
      onlyInBank: z.array(
        z.object({
          id: z.number(),
          date: z.string().datetime(), // ISO date string
          description: z.string(),
          amount: z.string(), // String representation of a number
          currency: z.string(),
          status: z.string(),
          checkNo: z.string(),
          unreconciledReason: z.string(),
        })
      ),
    }),
  }),

  closingBalance: z.object({
    book: z.string(),
    bank: z.string(),
  }),
})

export type BankReconciliationReportType = z.infer<
  typeof bankReconciliationReportSchema
>
