import type {
  Product,
  Transaction,
  Customer,
  Staff,
  Category,
  StockAdjustment,
  Expense,
  DashboardStats,
  ChartDataPoint,
  TopSellingProduct,
  StaffActivity,
  PaymentBreakdown,
  Promotion,
  StoreSettings,
  AuditLogEntry,
  Shift,
} from "@/lib/types"

// ── Categories ──────────────────────────────────────────────────────

export const mockCategories: Category[] = [
  { id: "CAT-001", name: "Coffee", description: "Coffee beans and grounds", productCount: 2, createdAt: "2024-01-01T08:00:00Z" },
  { id: "CAT-002", name: "Tea", description: "Tea leaves and powders", productCount: 1, createdAt: "2024-01-01T08:00:00Z" },
  { id: "CAT-003", name: "Dairy", description: "Milk and dairy alternatives", productCount: 1, createdAt: "2024-01-01T08:00:00Z" },
  { id: "CAT-004", name: "Syrup", description: "Flavored syrups", productCount: 2, createdAt: "2024-01-01T08:00:00Z" },
  { id: "CAT-005", name: "Bakery", description: "Pastries and baked goods", productCount: 2, createdAt: "2024-01-01T08:00:00Z" },
  { id: "CAT-006", name: "Supplies", description: "Store supplies and packaging", productCount: 2, createdAt: "2024-01-01T08:00:00Z" },
]

// ── Staff ────────────────────────────────────────────────────────────

export const mockStaff: Staff[] = [
  { id: "STF-001", name: "Ahmad Rizal", email: "ahmad.rizal@akpos.com", phone: "+62812-1111-1111", role: "admin", status: "active", lastActiveAt: "2025-03-27T14:00:00Z", createdAt: "2024-01-01T08:00:00Z" },
  { id: "STF-002", name: "Rina Kartini", email: "rina.k@akpos.com", phone: "+62812-2222-2222", role: "cashier", status: "active", lastActiveAt: "2025-03-27T13:00:00Z", createdAt: "2024-03-15T08:00:00Z" },
  { id: "STF-003", name: "Dedi Suryanto", email: "dedi.s@akpos.com", phone: "+62812-3333-3333", role: "cashier", status: "active", lastActiveAt: "2025-03-27T12:30:00Z", createdAt: "2024-06-01T08:00:00Z" },
  { id: "STF-004", name: "Lina Wati", email: "lina.w@akpos.com", phone: "+62812-4444-4444", role: "manager", status: "inactive", lastActiveAt: "2025-03-20T08:00:00Z", createdAt: "2024-08-10T08:00:00Z" },
]

// ── Dashboard Stats ─────────────────────────────────────────────────

export const mockDashboardStats: DashboardStats = {
  totalRevenue: 48250000,
  totalOrders: 1284,
  totalCustomers: 573,
  avgOrderValue: 375900,
  todaySales: 2850000,
  todayOrders: 47,
  revenueTrend: 12.5,
  ordersTrend: 8.2,
  customersTrend: 4.1,
  avgOrderTrend: -2.3,
}

// ── Revenue Chart Data ──────────────────────────────────────────────

export const mockRevenueData: ChartDataPoint[] = [
  { label: "Jan", value: 3200000 },
  { label: "Feb", value: 4100000 },
  { label: "Mar", value: 3800000 },
  { label: "Apr", value: 5200000 },
  { label: "May", value: 4800000 },
  { label: "Jun", value: 5600000 },
  { label: "Jul", value: 4900000 },
  { label: "Aug", value: 5100000 },
  { label: "Sep", value: 5800000 },
  { label: "Oct", value: 4600000 },
  { label: "Nov", value: 5400000 },
  { label: "Dec", value: 6200000 },
]

// ── Top Selling Products ────────────────────────────────────────────

export const mockTopSellingProducts: TopSellingProduct[] = [
  { productId: "PRD-001", productName: "Arabica Coffee Beans 1kg", category: "Coffee", unitsSold: 342, revenue: 63270000 },
  { productId: "PRD-007", productName: "Croissant (Plain)", category: "Bakery", unitsSold: 289, revenue: 8092000 },
  { productId: "PRD-003", productName: "Matcha Latte Powder 250g", category: "Tea", unitsSold: 198, revenue: 24750000 },
  { productId: "PRD-008", productName: "Chocolate Muffin", category: "Bakery", unitsSold: 176, revenue: 5632000 },
  { productId: "PRD-005", productName: "Vanilla Syrup 750ml", category: "Syrup", unitsSold: 124, revenue: 8432000 },
]

// ── Staff Activity ──────────────────────────────────────────────────

export const mockStaffActivity: StaffActivity[] = [
  { staffId: "STF-002", staffName: "Rina Kartini", ordersToday: 22, revenueToday: 1450000 },
  { staffId: "STF-003", staffName: "Dedi Suryanto", ordersToday: 18, revenueToday: 1120000 },
  { staffId: "STF-001", staffName: "Ahmad Rizal", ordersToday: 7, revenueToday: 280000 },
]

// ── Payment Breakdown ───────────────────────────────────────────────

export const mockPaymentBreakdown: PaymentBreakdown[] = [
  { method: "cash", label: "Cash", count: 512, amount: 18500000 },
  { method: "qris", label: "QRIS", count: 438, amount: 17200000 },
  { method: "debit_card", label: "Debit Card", count: 334, amount: 12550000 },
]

// ── Products ────────────────────────────────────────────────────────

export const mockProducts: Product[] = [
  { id: "PRD-001", name: "Arabica Coffee Beans 1kg", sku: "COF-ARB-1KG", category: "Coffee", categoryId: "CAT-001", description: "Premium single-origin Arabica beans from Gayo, Aceh", price: 185000, cost: 120000, stock: 142, minStock: 20, status: "in_stock", createdAt: "2025-01-15T08:00:00Z", updatedAt: "2025-03-20T14:30:00Z" },
  { id: "PRD-002", name: "Robusta Coffee Beans 500g", sku: "COF-ROB-500G", category: "Coffee", categoryId: "CAT-001", description: "Strong Robusta beans from Lampung", price: 95000, cost: 55000, stock: 8, minStock: 15, status: "low_stock", createdAt: "2025-01-15T08:00:00Z", updatedAt: "2025-03-18T10:00:00Z" },
  { id: "PRD-003", name: "Matcha Latte Powder 250g", sku: "TEA-MAT-250G", category: "Tea", categoryId: "CAT-002", description: "Japanese ceremonial grade matcha powder", price: 125000, cost: 80000, stock: 56, minStock: 10, status: "in_stock", createdAt: "2025-02-01T08:00:00Z", updatedAt: "2025-03-22T09:15:00Z" },
  { id: "PRD-004", name: "Oat Milk 1L", sku: "MLK-OAT-1L", category: "Dairy", categoryId: "CAT-003", description: "Plant-based oat milk, barista edition", price: 45000, cost: 28000, stock: 0, minStock: 10, status: "out_of_stock", createdAt: "2025-01-20T08:00:00Z", updatedAt: "2025-03-25T16:00:00Z" },
  { id: "PRD-005", name: "Vanilla Syrup 750ml", sku: "SYR-VAN-750", category: "Syrup", categoryId: "CAT-004", description: "Premium French vanilla flavored syrup", price: 68000, cost: 35000, stock: 34, minStock: 5, status: "in_stock", createdAt: "2025-02-10T08:00:00Z", updatedAt: "2025-03-15T11:30:00Z" },
  { id: "PRD-006", name: "Caramel Syrup 750ml", sku: "SYR-CAR-750", category: "Syrup", categoryId: "CAT-004", description: "Rich buttery caramel flavored syrup", price: 68000, cost: 35000, stock: 5, minStock: 5, status: "low_stock", createdAt: "2025-02-10T08:00:00Z", updatedAt: "2025-03-24T13:00:00Z" },
  { id: "PRD-007", name: "Croissant (Plain)", sku: "BKR-CRO-PLN", category: "Bakery", categoryId: "CAT-005", description: "Freshly baked butter croissant", price: 28000, cost: 12000, stock: 24, minStock: 10, status: "in_stock", createdAt: "2025-03-01T08:00:00Z", updatedAt: "2025-03-27T07:00:00Z" },
  { id: "PRD-008", name: "Chocolate Muffin", sku: "BKR-MUF-CHO", category: "Bakery", categoryId: "CAT-005", description: "Double chocolate chip muffin", price: 32000, cost: 14000, stock: 18, minStock: 8, status: "in_stock", createdAt: "2025-03-01T08:00:00Z", updatedAt: "2025-03-27T07:00:00Z" },
  { id: "PRD-009", name: "Paper Cup 12oz (100pcs)", sku: "SUP-CUP-12", category: "Supplies", categoryId: "CAT-006", description: "Disposable paper cups with logo print", price: 75000, cost: 45000, stock: 200, minStock: 50, status: "in_stock", createdAt: "2025-01-05T08:00:00Z", updatedAt: "2025-03-10T08:00:00Z" },
  { id: "PRD-010", name: "Plastic Straw (500pcs)", sku: "SUP-STR-500", category: "Supplies", categoryId: "CAT-006", description: "Eco-friendly biodegradable straws", price: 35000, cost: 18000, stock: 3, minStock: 10, status: "low_stock", createdAt: "2025-01-05T08:00:00Z", updatedAt: "2025-03-26T10:00:00Z" },
]

// ── Transactions ────────────────────────────────────────────────────

export const mockTransactions: Transaction[] = [
  { id: "TXN-001", customerId: "CST-001", customerName: "Andi Pratama", staffId: "STF-002", staffName: "Rina Kartini", items: [{ productId: "PRD-001", productName: "Arabica Coffee Beans 1kg", quantity: 2, price: 185000, discount: 0, subtotal: 370000 }], subtotal: 370000, discount: 0, tax: 40700, total: 410700, paymentMethod: "qris", amountPaid: 410700, change: 0, status: "completed", createdAt: "2025-03-27T09:15:00Z" },
  { id: "TXN-002", customerId: "CST-002", customerName: "Siti Rahayu", staffId: "STF-003", staffName: "Dedi Suryanto", items: [{ productId: "PRD-003", productName: "Matcha Latte Powder 250g", quantity: 1, price: 125000, discount: 0, subtotal: 125000 }, { productId: "PRD-007", productName: "Croissant (Plain)", quantity: 2, price: 28000, discount: 0, subtotal: 56000 }], subtotal: 181000, discount: 0, tax: 19910, total: 200910, paymentMethod: "cash", amountPaid: 210000, change: 9090, status: "completed", createdAt: "2025-03-27T10:30:00Z" },
  { id: "TXN-003", customerName: "Walk-in Customer", staffId: "STF-002", staffName: "Rina Kartini", items: [{ productId: "PRD-008", productName: "Chocolate Muffin", quantity: 3, price: 32000, discount: 0, subtotal: 96000 }], subtotal: 96000, discount: 0, tax: 10560, total: 106560, paymentMethod: "cash", amountPaid: 110000, change: 3440, status: "completed", createdAt: "2025-03-27T11:00:00Z" },
  { id: "TXN-004", customerId: "CST-003", customerName: "Budi Santoso", staffId: "STF-003", staffName: "Dedi Suryanto", items: [{ productId: "PRD-005", productName: "Vanilla Syrup 750ml", quantity: 1, price: 68000, discount: 0, subtotal: 68000 }, { productId: "PRD-006", productName: "Caramel Syrup 750ml", quantity: 1, price: 68000, discount: 0, subtotal: 68000 }], subtotal: 136000, discount: 0, tax: 14960, total: 150960, paymentMethod: "debit_card", amountPaid: 150960, change: 0, status: "pending", createdAt: "2025-03-27T12:45:00Z" },
  { id: "TXN-005", customerId: "CST-004", customerName: "Dewi Lestari", staffId: "STF-002", staffName: "Rina Kartini", items: [{ productId: "PRD-001", productName: "Arabica Coffee Beans 1kg", quantity: 1, price: 185000, discount: 0, subtotal: 185000 }], subtotal: 185000, discount: 0, tax: 20350, total: 205350, paymentMethod: "qris", amountPaid: 205350, change: 0, status: "refunded", createdAt: "2025-03-26T15:30:00Z" },
  { id: "TXN-006", customerName: "Walk-in Customer", staffId: "STF-003", staffName: "Dedi Suryanto", items: [{ productId: "PRD-007", productName: "Croissant (Plain)", quantity: 1, price: 28000, discount: 0, subtotal: 28000 }, { productId: "PRD-008", productName: "Chocolate Muffin", quantity: 1, price: 32000, discount: 0, subtotal: 32000 }], subtotal: 60000, discount: 0, tax: 6600, total: 66600, paymentMethod: "cash", amountPaid: 70000, change: 3400, status: "completed", createdAt: "2025-03-26T14:00:00Z" },
  { id: "TXN-007", customerId: "CST-005", customerName: "Rizky Firmansyah", staffId: "STF-001", staffName: "Ahmad Rizal", items: [{ productId: "PRD-002", productName: "Robusta Coffee Beans 500g", quantity: 3, price: 95000, discount: 0, subtotal: 285000 }, { productId: "PRD-009", productName: "Paper Cup 12oz (100pcs)", quantity: 2, price: 75000, discount: 0, subtotal: 150000 }], subtotal: 435000, discount: 0, tax: 47850, total: 482850, paymentMethod: "qris", amountPaid: 482850, change: 0, status: "completed", createdAt: "2025-03-26T10:15:00Z" },
  { id: "TXN-008", customerId: "CST-001", customerName: "Andi Pratama", staffId: "STF-002", staffName: "Rina Kartini", items: [{ productId: "PRD-003", productName: "Matcha Latte Powder 250g", quantity: 2, price: 125000, discount: 0, subtotal: 250000 }], subtotal: 250000, discount: 0, tax: 27500, total: 277500, paymentMethod: "debit_card", amountPaid: 277500, change: 0, status: "completed", createdAt: "2025-03-25T16:00:00Z" },
  { id: "TXN-009", customerId: "CST-006", customerName: "Mega Puspita", staffId: "STF-003", staffName: "Dedi Suryanto", items: [{ productId: "PRD-004", productName: "Oat Milk 1L", quantity: 4, price: 45000, discount: 0, subtotal: 180000 }], subtotal: 180000, discount: 10000, tax: 18700, total: 188700, paymentMethod: "cash", amountPaid: 200000, change: 11300, status: "pending", createdAt: "2025-03-25T13:30:00Z" },
  { id: "TXN-010", customerName: "Walk-in Customer", staffId: "STF-001", staffName: "Ahmad Rizal", items: [{ productId: "PRD-007", productName: "Croissant (Plain)", quantity: 4, price: 28000, discount: 0, subtotal: 112000 }, { productId: "PRD-003", productName: "Matcha Latte Powder 250g", quantity: 1, price: 125000, discount: 0, subtotal: 125000 }], subtotal: 237000, discount: 0, tax: 26070, total: 263070, paymentMethod: "cash", amountPaid: 270000, change: 6930, status: "completed", createdAt: "2025-03-25T09:00:00Z" },
]

// ── Customers ───────────────────────────────────────────────────────

export const mockCustomers: Customer[] = [
  { id: "CST-001", name: "Andi Pratama", email: "andi.pratama@email.com", phone: "+62812-3456-7890", totalOrders: 24, totalSpent: 4520000, loyaltyPoints: 452, lastOrderAt: "2025-03-27T09:15:00Z", createdAt: "2024-06-15T08:00:00Z" },
  { id: "CST-002", name: "Siti Rahayu", email: "siti.rahayu@email.com", phone: "+62813-4567-8901", totalOrders: 18, totalSpent: 3150000, loyaltyPoints: 315, lastOrderAt: "2025-03-27T10:30:00Z", createdAt: "2024-07-20T08:00:00Z" },
  { id: "CST-003", name: "Budi Santoso", email: "budi.santoso@email.com", phone: "+62814-5678-9012", totalOrders: 31, totalSpent: 6780000, loyaltyPoints: 678, lastOrderAt: "2025-03-27T12:45:00Z", createdAt: "2024-03-10T08:00:00Z" },
  { id: "CST-004", name: "Dewi Lestari", email: "dewi.lestari@email.com", phone: "+62815-6789-0123", totalOrders: 7, totalSpent: 1250000, loyaltyPoints: 125, lastOrderAt: "2025-03-26T15:30:00Z", createdAt: "2024-11-05T08:00:00Z" },
  { id: "CST-005", name: "Rizky Firmansyah", email: "rizky.f@email.com", phone: "+62816-7890-1234", totalOrders: 42, totalSpent: 8900000, loyaltyPoints: 890, lastOrderAt: "2025-03-26T10:15:00Z", createdAt: "2024-01-20T08:00:00Z" },
  { id: "CST-006", name: "Mega Puspita", email: "mega.puspita@email.com", phone: "+62817-8901-2345", totalOrders: 15, totalSpent: 2850000, loyaltyPoints: 285, lastOrderAt: "2025-03-25T13:30:00Z", createdAt: "2024-08-12T08:00:00Z" },
  { id: "CST-007", name: "Hendra Wijaya", email: "hendra.w@email.com", phone: "+62818-9012-3456", totalOrders: 9, totalSpent: 1680000, loyaltyPoints: 168, lastOrderAt: "2025-03-24T11:00:00Z", createdAt: "2024-09-30T08:00:00Z" },
  { id: "CST-008", name: "Putri Amelia", email: "putri.amelia@email.com", phone: "+62819-0123-4567", totalOrders: 56, totalSpent: 12400000, loyaltyPoints: 1240, lastOrderAt: "2025-03-23T16:45:00Z", createdAt: "2023-12-01T08:00:00Z" },
]

// ── Stock Adjustments ───────────────────────────────────────────────

export const mockStockAdjustments: StockAdjustment[] = [
  { id: "ADJ-001", productId: "PRD-004", productName: "Oat Milk 1L", type: "out", quantity: 5, reason: "Expired stock removed", staffId: "STF-001", staffName: "Ahmad Rizal", createdAt: "2025-03-25T16:00:00Z" },
  { id: "ADJ-002", productId: "PRD-001", productName: "Arabica Coffee Beans 1kg", type: "in", quantity: 50, reason: "New supplier delivery", staffId: "STF-001", staffName: "Ahmad Rizal", createdAt: "2025-03-24T09:00:00Z" },
  { id: "ADJ-003", productId: "PRD-010", productName: "Plastic Straw (500pcs)", type: "out", quantity: 2, reason: "Damaged packaging", staffId: "STF-004", staffName: "Lina Wati", createdAt: "2025-03-23T14:30:00Z" },
  { id: "ADJ-004", productId: "PRD-007", productName: "Croissant (Plain)", type: "in", quantity: 30, reason: "Morning bakery batch", staffId: "STF-003", staffName: "Dedi Suryanto", createdAt: "2025-03-27T06:00:00Z" },
  { id: "ADJ-005", productId: "PRD-008", productName: "Chocolate Muffin", type: "in", quantity: 24, reason: "Morning bakery batch", staffId: "STF-003", staffName: "Dedi Suryanto", createdAt: "2025-03-27T06:00:00Z" },
]

// ── Expenses ────────────────────────────────────────────────────────

export const mockExpenses: Expense[] = [
  { id: "EXP-001", category: "rent", description: "Monthly store rent - March 2025", amount: 8500000, staffId: "STF-001", staffName: "Ahmad Rizal", date: "2025-03-01", createdAt: "2025-03-01T08:00:00Z" },
  { id: "EXP-002", category: "utilities", description: "Electricity bill - February", amount: 1250000, staffId: "STF-001", staffName: "Ahmad Rizal", date: "2025-03-05", createdAt: "2025-03-05T10:00:00Z" },
  { id: "EXP-003", category: "supplies", description: "Coffee machine maintenance parts", amount: 350000, staffId: "STF-004", staffName: "Lina Wati", date: "2025-03-10", createdAt: "2025-03-10T14:00:00Z" },
  { id: "EXP-004", category: "salary", description: "Staff salary - March 2025", amount: 12000000, staffId: "STF-001", staffName: "Ahmad Rizal", date: "2025-03-25", createdAt: "2025-03-25T08:00:00Z" },
  { id: "EXP-005", category: "marketing", description: "Social media ads budget", amount: 500000, staffId: "STF-004", staffName: "Lina Wati", date: "2025-03-15", createdAt: "2025-03-15T09:00:00Z" },
  { id: "EXP-006", category: "maintenance", description: "AC unit repair", amount: 750000, staffId: "STF-001", staffName: "Ahmad Rizal", date: "2025-03-20", createdAt: "2025-03-20T11:00:00Z" },
]

// ── Promotions ──────────────────────────────────────────────────────

export const mockPromotions: Promotion[] = [
  { id: "PRM-001", name: "New Customer Discount", code: "WELCOME20", type: "percentage", value: 20, minOrderAmount: 100000, maxDiscount: 50000, applicableCategories: [], usageLimit: 100, usedCount: 34, startDate: "2025-03-01", endDate: "2025-04-30", status: "active", createdAt: "2025-03-01T08:00:00Z" },
  { id: "PRM-002", name: "Coffee Lovers", code: "COFFEE15", type: "percentage", value: 15, minOrderAmount: 50000, maxDiscount: 30000, applicableCategories: ["CAT-001"], usageLimit: 200, usedCount: 87, startDate: "2025-03-01", endDate: "2025-05-31", status: "active", createdAt: "2025-03-01T08:00:00Z" },
  { id: "PRM-003", name: "Flat 10K Off", code: "SAVE10K", type: "fixed", value: 10000, minOrderAmount: 75000, maxDiscount: 10000, applicableCategories: [], usageLimit: 500, usedCount: 156, startDate: "2025-02-01", endDate: "2025-06-30", status: "active", createdAt: "2025-02-01T08:00:00Z" },
  { id: "PRM-004", name: "Holiday Special", code: "HOLIDAY50", type: "percentage", value: 50, minOrderAmount: 200000, maxDiscount: 100000, applicableCategories: [], usageLimit: 50, usedCount: 50, startDate: "2025-01-01", endDate: "2025-01-07", status: "expired", createdAt: "2024-12-20T08:00:00Z" },
  { id: "PRM-005", name: "Ramadan Promo", code: "RAMADAN25", type: "percentage", value: 25, minOrderAmount: 150000, maxDiscount: 75000, applicableCategories: [], usageLimit: 300, usedCount: 0, startDate: "2025-04-01", endDate: "2025-04-30", status: "scheduled", createdAt: "2025-03-25T08:00:00Z" },
  { id: "PRM-006", name: "Bakery Bundle", code: "BAKERY20", type: "fixed", value: 20000, minOrderAmount: 60000, maxDiscount: 20000, applicableCategories: ["CAT-005"], usageLimit: 0, usedCount: 12, startDate: "2025-03-01", endDate: "2025-12-31", status: "disabled", createdAt: "2025-03-01T08:00:00Z" },
]

// ── Default Store Settings ──────────────────────────────────────────

export const mockDefaultStoreSettings: StoreSettings = {
  storeName: "AK POS Store",
  storeAddress: "Jl. Sudirman No. 123, Jakarta Pusat",
  storePhone: "+62 21-1234-5678",
  storeEmail: "store@akpos.com",
  taxRate: 0.11,
  taxLabel: "PPN",
  taxEnabled: true,
  currency: "IDR",
  timezone: "Asia/Jakarta",
  receiptHeader: "Thank you for shopping with us!",
  receiptFooter: "Goods purchased cannot be returned. Valid as tax invoice.",
  showLogo: true,
}

// ── Audit Log ───────────────────────────────────────────────────────

export const mockAuditLog: AuditLogEntry[] = [
  { id: "AUD-001", action: "order_created", description: "Order TXN-001 created for Andi Pratama", staffId: "STF-002", staffName: "Rina Kartini", metadata: { orderId: "TXN-001", amount: 410700 }, createdAt: "2025-03-27T09:15:00Z" },
  { id: "AUD-002", action: "order_created", description: "Order TXN-002 created for Siti Rahayu", staffId: "STF-003", staffName: "Dedi Suryanto", metadata: { orderId: "TXN-002", amount: 200910 }, createdAt: "2025-03-27T10:30:00Z" },
  { id: "AUD-003", action: "stock_adjusted", description: "Oat Milk 1L — 5 units removed (Expired stock)", staffId: "STF-001", staffName: "Ahmad Rizal", metadata: { productId: "PRD-004", quantity: -5 }, createdAt: "2025-03-25T16:00:00Z" },
  { id: "AUD-004", action: "product_updated", description: "Updated price for Arabica Coffee Beans 1kg", staffId: "STF-001", staffName: "Ahmad Rizal", metadata: { productId: "PRD-001" }, createdAt: "2025-03-20T14:30:00Z" },
  { id: "AUD-005", action: "staff_created", description: "New staff member Dedi Suryanto added as cashier", staffId: "STF-001", staffName: "Ahmad Rizal", metadata: { newStaffId: "STF-003" }, createdAt: "2024-06-01T08:00:00Z" },
  { id: "AUD-006", action: "expense_created", description: "Expense recorded: Monthly store rent Rp8,500,000", staffId: "STF-001", staffName: "Ahmad Rizal", metadata: { expenseId: "EXP-001", amount: 8500000 }, createdAt: "2025-03-01T08:00:00Z" },
  { id: "AUD-007", action: "shift_opened", description: "Shift opened with Rp500,000 opening balance", staffId: "STF-002", staffName: "Rina Kartini", metadata: { shiftId: "SHF-003", openingBalance: 500000 }, createdAt: "2025-03-27T07:00:00Z" },
  { id: "AUD-008", action: "shift_closed", description: "Shift closed — cash difference: +Rp5,000", staffId: "STF-002", staffName: "Rina Kartini", metadata: { shiftId: "SHF-003", difference: 5000 }, createdAt: "2025-03-27T15:00:00Z" },
  { id: "AUD-009", action: "order_refunded", description: "Order TXN-005 refunded for Dewi Lestari", staffId: "STF-002", staffName: "Rina Kartini", metadata: { orderId: "TXN-005", amount: 205350 }, createdAt: "2025-03-26T15:35:00Z" },
  { id: "AUD-010", action: "promotion_created", description: "Created promotion 'New Customer Discount' (WELCOME20)", staffId: "STF-001", staffName: "Ahmad Rizal", metadata: { promoId: "PRM-001" }, createdAt: "2025-03-01T08:00:00Z" },
  { id: "AUD-011", action: "category_created", description: "Created category 'Bakery'", staffId: "STF-001", staffName: "Ahmad Rizal", metadata: { categoryId: "CAT-005" }, createdAt: "2024-01-01T08:00:00Z" },
  { id: "AUD-012", action: "settings_updated", description: "Store settings updated — receipt footer changed", staffId: "STF-001", staffName: "Ahmad Rizal", createdAt: "2025-03-15T10:00:00Z" },
  { id: "AUD-013", action: "product_created", description: "New product added: Croissant (Plain)", staffId: "STF-001", staffName: "Ahmad Rizal", metadata: { productId: "PRD-007" }, createdAt: "2025-03-01T08:00:00Z" },
  { id: "AUD-014", action: "stock_adjusted", description: "Arabica Coffee Beans 1kg — 50 units added (Supplier delivery)", staffId: "STF-001", staffName: "Ahmad Rizal", metadata: { productId: "PRD-001", quantity: 50 }, createdAt: "2025-03-24T09:00:00Z" },
  { id: "AUD-015", action: "staff_updated", description: "Staff Lina Wati status changed to inactive", staffId: "STF-001", staffName: "Ahmad Rizal", metadata: { targetStaffId: "STF-004" }, createdAt: "2025-03-20T08:00:00Z" },
]

// ── Shifts ──────────────────────────────────────────────────────────

export const mockShifts: Shift[] = [
  { id: "SHF-001", staffId: "STF-002", staffName: "Rina Kartini", status: "closed", openedAt: "2025-03-25T07:00:00Z", closedAt: "2025-03-25T15:00:00Z", openingBalance: 500000, closingBalance: 1680000, expectedBalance: 1675000, cashSales: 1175000, cardSales: 580000, qrisSales: 420000, totalOrders: 28, totalRevenue: 2175000, notes: "Smooth shift, no issues" },
  { id: "SHF-002", staffId: "STF-003", staffName: "Dedi Suryanto", status: "closed", openedAt: "2025-03-25T15:00:00Z", closedAt: "2025-03-25T22:00:00Z", openingBalance: 500000, closingBalance: 1420000, expectedBalance: 1430000, cashSales: 930000, cardSales: 450000, qrisSales: 380000, totalOrders: 22, totalRevenue: 1760000, notes: "Short Rp10,000 — counted twice" },
  { id: "SHF-003", staffId: "STF-002", staffName: "Rina Kartini", status: "closed", openedAt: "2025-03-26T07:00:00Z", closedAt: "2025-03-26T15:00:00Z", openingBalance: 500000, closingBalance: 1955000, expectedBalance: 1950000, cashSales: 1450000, cardSales: 620000, qrisSales: 510000, totalOrders: 35, totalRevenue: 2580000, notes: "Busy morning rush" },
  { id: "SHF-004", staffId: "STF-003", staffName: "Dedi Suryanto", status: "closed", openedAt: "2025-03-26T15:00:00Z", closedAt: "2025-03-26T22:00:00Z", openingBalance: 500000, closingBalance: 1310000, expectedBalance: 1310000, cashSales: 810000, cardSales: 390000, qrisSales: 340000, totalOrders: 19, totalRevenue: 1540000 },
  { id: "SHF-005", staffId: "STF-002", staffName: "Rina Kartini", status: "closed", openedAt: "2025-03-27T07:00:00Z", closedAt: "2025-03-27T15:00:00Z", openingBalance: 500000, closingBalance: 1725000, expectedBalance: 1720000, cashSales: 1220000, cardSales: 550000, qrisSales: 480000, totalOrders: 30, totalRevenue: 2250000, notes: "Over Rp5,000" },
]

