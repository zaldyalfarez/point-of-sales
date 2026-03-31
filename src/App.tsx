import { HashRouter, Routes, Route, Navigate } from "react-router-dom"
import { LoginPage } from "@/features/auth/pages/LoginPage"
import { DashboardLayout } from "@/features/dashboard/layouts/DashboardLayout"
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage"
import { ProductsPage } from "@/features/dashboard/pages/ProductsPage"
import { ProductFormPage } from "@/features/dashboard/pages/ProductFormPage"
import { CategoryPage } from "@/features/dashboard/pages/CategoryPage"
import { TransactionsPage } from "@/features/dashboard/pages/TransactionsPage"
import { CustomersPage } from "@/features/dashboard/pages/CustomersPage"
import { StaffPage } from "@/features/dashboard/pages/StaffPage"
import { StaffFormPage } from "@/features/dashboard/pages/StaffFormPage"
import { StockAdjustmentPage } from "@/features/dashboard/pages/StockAdjustmentPage"
import { ExpensesPage } from "@/features/dashboard/pages/ExpensesPage"
import { ReportsPage } from "@/features/dashboard/pages/ReportsPage"
import { SettingsPage } from "@/features/dashboard/pages/SettingsPage"
import { PromotionsPage } from "@/features/dashboard/pages/PromotionsPage"
import { AuditLogPage } from "@/features/dashboard/pages/AuditLogPage"
import { ShiftManagementPage } from "@/features/dashboard/pages/ShiftManagementPage"
import { POSPage } from "@/features/pos/pages/POSPage"

export function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* POS Terminal (full-screen, no sidebar) */}
        <Route path="/pos" element={<POSPage />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />

          {/* Management */}
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:id/edit" element={<ProductFormPage />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="promotions" element={<PromotionsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="customers" element={<CustomersPage />} />

          {/* Operations */}
          <Route path="staff" element={<StaffPage />} />
          <Route path="staff/new" element={<StaffFormPage />} />
          <Route path="staff/:id/edit" element={<StaffFormPage />} />
          <Route path="shifts" element={<ShiftManagementPage />} />
          <Route path="stock-adjustments" element={<StockAdjustmentPage />} />
          <Route path="expenses" element={<ExpensesPage />} />

          {/* Analytics */}
          <Route path="reports" element={<ReportsPage />} />
          <Route path="audit-log" element={<AuditLogPage />} />

          {/* System */}
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Redirect root to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  )
}

export default App
