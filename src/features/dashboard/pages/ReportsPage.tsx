import { useState } from "react"
import { DownloadSimple } from "@phosphor-icons/react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  mockRevenueData,
  mockTopSellingProducts,
  mockStaffActivity,
  mockPaymentBreakdown,
} from "@/lib/mock-data"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

const salesChartConfig = {
  value: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

export function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    start: "2025-01-01",
    end: "2025-12-31",
  })

  const totalRevenue = mockRevenueData.reduce((s, d) => s + d.value, 0)
  const totalOrders = 1284
  const avgOrder = Math.round(totalRevenue / totalOrders)

  const handleExport = () => {
    // Generate CSV
    const header = "Month,Revenue\n"
    const rows = mockRevenueData.map((d) => `${d.label},${d.value}`).join("\n")
    const blob = new Blob([header + rows], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sales-report.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">Analytics and business insights</p>
      </div>

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="products">Product Report</TabsTrigger>
          <TabsTrigger value="staff">Staff Report</TabsTrigger>
        </TabsList>

        {/* ── Sales Report ────────────────────────────────────────── */}
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <CardTitle>Sales Report</CardTitle>
                  <CardDescription>Revenue and order trends</CardDescription>
                </div>
                <div className="flex items-end gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Start</Label>
                    <Input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange((r) => ({ ...r, start: e.target.value }))}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">End</Label>
                    <Input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange((r) => ({ ...r, end: e.target.value }))}
                      className="text-xs"
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <DownloadSimple size={14} className="mr-1" /> CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* KPIs */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                  <p className="text-xl font-bold">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                  <p className="text-xl font-bold">{totalOrders.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-xs text-muted-foreground">Avg. Order</p>
                  <p className="text-xl font-bold">{formatCurrency(avgOrder)}</p>
                </div>
              </div>

              {/* Chart */}
              <ChartContainer config={salesChartConfig} className="h-64 w-full">
                <BarChart data={mockRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent formatter={(v) => formatCurrency(v as number)} />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>

              {/* Payment Breakdown */}
              <div>
                <h3 className="mb-2 text-sm font-semibold">Payment Method Breakdown</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {mockPaymentBreakdown.map((pm) => (
                    <div key={pm.method} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-medium">{pm.label}</p>
                        <p className="text-xs text-muted-foreground">{pm.count} orders</p>
                      </div>
                      <p className="text-sm font-bold">{formatCurrency(pm.amount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Product Report ──────────────────────────────────────── */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Products ranked by units sold</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">#</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="hidden sm:table-cell">Category</TableHead>
                    <TableHead className="text-right">Units Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTopSellingProducts.map((p, i) => (
                    <TableRow key={p.productId}>
                      <TableCell className="font-bold text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="font-medium">{p.productName}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline">{p.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{p.unitsSold.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(p.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Staff Report ────────────────────────────────────────── */}
        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance</CardTitle>
              <CardDescription>Today's activity by staff member</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff</TableHead>
                    <TableHead className="text-right">Orders Today</TableHead>
                    <TableHead className="text-right">Revenue Today</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStaffActivity.map((s) => (
                    <TableRow key={s.staffId}>
                      <TableCell className="font-medium">{s.staffName}</TableCell>
                      <TableCell className="text-right">{s.ordersToday}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(s.revenueToday)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
