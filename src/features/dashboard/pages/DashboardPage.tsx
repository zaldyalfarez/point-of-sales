import {
  CurrencyDollar,
  ShoppingCart,
  Users,
  ChartLineUp,
  Storefront,
  Trophy,
  Warning,
  Package,
} from "@phosphor-icons/react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatsCard } from "@/features/dashboard/components/StatsCard"
import { useLowStockProducts } from "@/features/dashboard/components/LowStockAlert"
import {
  mockDashboardStats,
  mockRevenueData,
  mockTransactions,
  mockTopSellingProducts,
  mockStaffActivity,
  mockPaymentBreakdown,
} from "@/lib/mock-data"

const chartConfig = {
  value: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  completed: "default",
  pending: "secondary",
  refunded: "destructive",
}

export function DashboardPage() {
  const stats = mockDashboardStats
  const maxSold = Math.max(...mockTopSellingProducts.map((p) => p.unitsSold))
  const lowStockProducts = useLowStockProducts()

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          trend={stats.revenueTrend}
          icon={CurrencyDollar}
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          trend={stats.ordersTrend}
          icon={ShoppingCart}
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          trend={stats.customersTrend}
          icon={Users}
        />
        <StatsCard
          title="Avg. Order Value"
          value={formatCurrency(stats.avgOrderValue)}
          trend={stats.avgOrderTrend}
          icon={ChartLineUp}
        />
        <StatsCard
          title="Today's Sales"
          value={formatCurrency(stats.todaySales)}
          trend={0}
          icon={Storefront}
          className="sm:col-span-2 lg:col-span-1"
        />
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Warning size={18} weight="fill" className="text-amber-500" />
              <CardTitle className="text-base">Low Stock Alert</CardTitle>
              <Badge variant="secondary" className="text-[10px] ml-auto">
                {lowStockProducts.length} item{lowStockProducts.length > 1 ? "s" : ""}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className={`flex items-center gap-3 rounded-lg border p-3 ${
                    product.stock === 0
                      ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10"
                      : "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/10"
                  }`}
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Package size={14} weight="duotone" className="text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{product.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {product.stock === 0 ? (
                        <span className="text-red-500 font-semibold">Out of stock</span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400">Stock: {product.stock} / Min: {product.minStock}</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chart + Top Selling */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for the current year</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <AreaChart data={mockRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent formatter={(v) => formatCurrency(v as number)} />} />
                <Area dataKey="value" type="monotone" fill="url(#fillRevenue)" stroke="var(--color-value)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Selling Products */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy size={18} weight="duotone" className="text-amber-500" />
              <CardTitle>Top Selling Items</CardTitle>
            </div>
            <CardDescription>By units sold this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTopSellingProducts.map((product, i) => (
                <div key={product.productId} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-bold bg-muted">
                        {i + 1}
                      </span>
                      <span className="truncate text-sm font-medium">{product.productName}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-semibold">{product.unitsSold}</span>
                      <span className="text-xs text-muted-foreground ml-1">sold</span>
                    </div>
                  </div>
                  <Progress value={(product.unitsSold / maxSold) * 100} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Activity + Payment Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Staff Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Staff Activity</CardTitle>
            <CardDescription>Today's performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockStaffActivity.map((staff) => (
                <div key={staff.staffId} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{staff.staffName}</p>
                    <p className="text-xs text-muted-foreground">{staff.ordersToday} orders today</p>
                  </div>
                  <p className="text-sm font-bold">{formatCurrency(staff.revenueToday)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Breakdown by payment type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPaymentBreakdown.map((pm) => {
                const totalAmount = mockPaymentBreakdown.reduce((s, p) => s + p.amount, 0)
                const pct = Math.round((pm.amount / totalAmount) * 100)
                return (
                  <div key={pm.method} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{pm.label}</span>
                      <span className="text-sm font-semibold">{formatCurrency(pm.amount)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={pct} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest 10 transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden sm:table-cell">Staff</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Payment</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-mono text-xs">{txn.id}</TableCell>
                    <TableCell>{txn.customerName}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{txn.staffName}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{formatDate(txn.createdAt)}</TableCell>
                    <TableCell className="hidden lg:table-cell capitalize">{txn.paymentMethod.replace("_", " ")}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(txn.total)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[txn.status]} className="capitalize">{txn.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
