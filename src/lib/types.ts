// ── API Response Types ──────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

// ── Auth Types ──────────────────────────────────────────────────────

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "cashier" | "manager"
  avatar?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

// ── Staff Types ─────────────────────────────────────────────────────

export interface Staff {
  id: string
  name: string
  email: string
  phone: string
  role: "admin" | "cashier" | "manager"
  status: "active" | "inactive"
  avatar?: string
  lastActiveAt: string
  createdAt: string
}

export interface CreateStaffRequest {
  name: string
  email: string
  phone: string
  role: "admin" | "cashier" | "manager"
}

export type UpdateStaffRequest = Partial<CreateStaffRequest> & { status?: "active" | "inactive" }

// ── Category Types ──────────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  description: string
  productCount: number
  createdAt: string
}

export interface CreateCategoryRequest {
  name: string
  description: string
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>

// ── Product Types ───────────────────────────────────────────────────

export type ProductStatus = "in_stock" | "low_stock" | "out_of_stock"

export interface ProductVariant {
  id: string
  name: string
  sku: string
  priceAdjustment: number
  stock: number
}

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  categoryId: string
  description: string
  price: number
  cost: number
  stock: number
  minStock: number
  status: ProductStatus
  image?: string
  variants?: ProductVariant[]
  createdAt: string
  updatedAt: string
}

export interface CreateProductRequest {
  name: string
  sku: string
  categoryId: string
  description: string
  price: number
  cost: number
  stock: number
  minStock: number
  image?: string
}

export type UpdateProductRequest = Partial<CreateProductRequest>

// ── Transaction Types ───────────────────────────────────────────────

export type TransactionStatus = "completed" | "pending" | "refunded"
export type PaymentMethod = "cash" | "debit_card" | "qris"

export interface TransactionItem {
  productId: string
  productName: string
  quantity: number
  price: number
  discount: number
  subtotal: number
}

export interface Transaction {
  id: string
  customerId?: string
  customerName: string
  staffId: string
  staffName: string
  items: TransactionItem[]
  subtotal: number
  discount: number
  tax: number
  total: number
  paymentMethod: PaymentMethod
  amountPaid: number
  change: number
  status: TransactionStatus
  createdAt: string
}

// ── Cart Types (POS Terminal) ───────────────────────────────────────

export interface CartItem {
  product: Product
  selectedVariant?: ProductVariant
  quantity: number
  discount: number
}

export interface OrderDiscount {
  type: "percentage" | "fixed"
  value: number
}

// ── Customer Types ──────────────────────────────────────────────────

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  loyaltyPoints: number
  lastOrderAt: string
  createdAt: string
}

export interface CreateCustomerRequest {
  name: string
  email: string
  phone: string
}

export type UpdateCustomerRequest = Partial<CreateCustomerRequest>

// ── Stock Adjustment Types ──────────────────────────────────────────

export type AdjustmentType = "in" | "out"

export interface StockAdjustment {
  id: string
  productId: string
  productName: string
  type: AdjustmentType
  quantity: number
  reason: string
  staffId: string
  staffName: string
  createdAt: string
}

export interface CreateStockAdjustmentRequest {
  productId: string
  type: AdjustmentType
  quantity: number
  reason: string
}

// ── Expense Types ───────────────────────────────────────────────────

export type ExpenseCategory = "rent" | "utilities" | "supplies" | "salary" | "maintenance" | "marketing" | "other"

export interface Expense {
  id: string
  category: ExpenseCategory
  description: string
  amount: number
  staffId: string
  staffName: string
  date: string
  createdAt: string
}

export interface CreateExpenseRequest {
  category: ExpenseCategory
  description: string
  amount: number
  date: string
}

// ── Dashboard Types ─────────────────────────────────────────────────

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  avgOrderValue: number
  todaySales: number
  todayOrders: number
  revenueTrend: number
  ordersTrend: number
  customersTrend: number
  avgOrderTrend: number
}

export interface TopSellingProduct {
  productId: string
  productName: string
  category: string
  unitsSold: number
  revenue: number
}

export interface StaffActivity {
  staffId: string
  staffName: string
  ordersToday: number
  revenueToday: number
}

export interface ChartDataPoint {
  label: string
  value: number
  [key: string]: string | number
}

export interface PaymentBreakdown {
  method: PaymentMethod
  label: string
  count: number
  amount: number
}

// ── Promotion / Coupon Types ────────────────────────────────────────

export type PromotionType = "percentage" | "fixed" | "buy_x_get_y"
export type PromotionStatus = "active" | "scheduled" | "expired" | "disabled"

export interface Promotion {
  id: string
  name: string
  code: string
  type: PromotionType
  value: number
  minOrderAmount: number
  maxDiscount: number
  applicableCategories: string[]
  usageLimit: number
  usedCount: number
  startDate: string
  endDate: string
  status: PromotionStatus
  createdAt: string
}

export interface CreatePromotionRequest {
  name: string
  code: string
  type: PromotionType
  value: number
  minOrderAmount: number
  maxDiscount: number
  applicableCategories: string[]
  usageLimit: number
  startDate: string
  endDate: string
}

// ── Store Settings / Tax / Receipt Types ────────────────────────────

export interface StoreSettings {
  storeName: string
  storeAddress: string
  storePhone: string
  storeEmail: string
  taxRate: number
  taxLabel: string
  taxEnabled: boolean
  currency: string
  timezone: string
  receiptHeader: string
  receiptFooter: string
  showLogo: boolean
}

// ── Audit Log Types ─────────────────────────────────────────────────

export type AuditAction =
  | "order_created"
  | "order_refunded"
  | "product_created"
  | "product_updated"
  | "product_deleted"
  | "stock_adjusted"
  | "staff_created"
  | "staff_updated"
  | "category_created"
  | "category_updated"
  | "expense_created"
  | "promotion_created"
  | "promotion_updated"
  | "shift_opened"
  | "shift_closed"
  | "settings_updated"

export interface AuditLogEntry {
  id: string
  action: AuditAction
  description: string
  staffId: string
  staffName: string
  metadata?: Record<string, string | number>
  createdAt: string
}

// ── Shift / Cash Register Types ─────────────────────────────────────

export type ShiftStatus = "open" | "closed"

export interface Shift {
  id: string
  staffId: string
  staffName: string
  status: ShiftStatus
  openedAt: string
  closedAt?: string
  openingBalance: number
  closingBalance?: number
  expectedBalance?: number
  cashSales: number
  cardSales: number
  qrisSales: number
  totalOrders: number
  totalRevenue: number
  notes?: string
}

export interface OpenShiftRequest {
  openingBalance: number
}

export interface CloseShiftRequest {
  closingBalance: number
  notes?: string
}
