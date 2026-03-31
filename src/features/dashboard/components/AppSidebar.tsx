import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  ChartBar,
  Package,
  Receipt,
  Users,
  Gear,
  Storefront,
  SignOut,
  CaretUpDown,
  CashRegister,
  Tag,
  UserList,
  Cube,
  Wallet,
  ChartPieSlice,
  Megaphone,
  Clock,
  ClipboardText,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useLowStockProducts } from "@/features/dashboard/components/LowStockAlert"

const navMain = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: ChartBar },
      { title: "POS Terminal", url: "/pos", icon: CashRegister },
    ],
  },
  {
    label: "Management",
    items: [
      {
        title: "Products",
        url: "/dashboard/products",
        icon: Package,
        showStockBadge: true,
      },
      { title: "Categories", url: "/dashboard/categories", icon: Tag },
      { title: "Promotions", url: "/dashboard/promotions", icon: Megaphone },
      { title: "Transactions", url: "/dashboard/transactions", icon: Receipt },
      { title: "Customers", url: "/dashboard/customers", icon: Users },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Staff", url: "/dashboard/staff", icon: UserList },
      { title: "Shifts", url: "/dashboard/shifts", icon: Clock },
      {
        title: "Stock Adjustments",
        url: "/dashboard/stock-adjustments",
        icon: Cube,
      },
      { title: "Expenses", url: "/dashboard/expenses", icon: Wallet },
    ],
  },
  {
    label: "Analytics",
    items: [
      { title: "Reports", url: "/dashboard/reports", icon: ChartPieSlice },
      { title: "Audit Log", url: "/dashboard/audit-log", icon: ClipboardText },
    ],
  },
  {
    label: "System",
    items: [{ title: "Settings", url: "/dashboard/settings", icon: Gear }],
  },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const lowStockProducts = useLowStockProducts()

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    navigate("/login")
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Storefront size={18} weight="bold" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">AK POS</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Admin Panel
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navMain.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <div className="relative">
                          <item.icon size={18} weight="duotone" />
                          {"showStockBadge" in item &&
                            item.showStockBadge &&
                            lowStockProducts.length > 0 && (
                              <span className="absolute -top-1 -right-1.5 flex size-2 rounded-full bg-red-500" />
                            )}
                        </div>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-linear-to-br from-violet-500 to-purple-600 text-xs text-white font-bold">
                      AR
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Ahmad Rizal</span>
                    <span className="truncate text-xs text-muted-foreground">
                      Administrator
                    </span>
                  </div>
                  <CaretUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-64 rounded-xl p-0"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                {/* Profile header */}
                <div className="p-4 pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-linear-to-br from-violet-500 to-purple-600 text-sm text-white font-bold">
                        AR
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">Ahmad Rizal</p>
                      <p className="text-xs text-muted-foreground truncate">ahmad.rizal@akpos.com</p>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      Administrator
                    </span>
                    <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                      Active
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator className="mx-0" />
                <div className="p-1.5">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-lg text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer gap-2 px-3 py-2.5"
                  >
                    <SignOut size={16} weight="duotone" />
                    <span className="text-sm font-medium">Log out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
