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
  DropdownMenuLabel,
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
                    <AvatarFallback className="rounded-lg bg-primary text-xs text-primary-foreground">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Admin</span>
                    <span className="truncate text-xs text-muted-foreground">
                      admin@akpos.com
                    </span>
                  </div>
                  <CaretUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-primary text-xs text-primary-foreground">
                        AD
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Admin</span>
                      <span className="truncate text-xs text-muted-foreground">
                        admin@akpos.com
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <SignOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
