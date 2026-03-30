import { useLocation } from "react-router-dom"
import { Moon, Sun } from "@phosphor-icons/react"
import { useTheme } from "@/components/theme-provider"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { LowStockAlert } from "@/features/dashboard/components/LowStockAlert"

const pageNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/products": "Products",
  "/dashboard/products/new": "Add Product",
  "/dashboard/categories": "Categories",
  "/dashboard/promotions": "Promotions",
  "/dashboard/transactions": "Transactions",
  "/dashboard/customers": "Customers",
  "/dashboard/staff": "Staff",
  "/dashboard/staff/new": "Add Staff",
  "/dashboard/shifts": "Shifts",
  "/dashboard/stock-adjustments": "Stock Adjustments",
  "/dashboard/expenses": "Expenses",
  "/dashboard/reports": "Reports",
  "/dashboard/audit-log": "Audit Log",
  "/dashboard/settings": "Settings",
}

export function DashboardHeader() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const currentPage = pageNames[location.pathname] || "Dashboard"

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{currentPage}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-1">
        <LowStockAlert />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </div>
    </header>
  )
}
