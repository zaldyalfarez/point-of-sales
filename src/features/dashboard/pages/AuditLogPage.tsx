import { useState, useEffect, useMemo } from "react"
import {
  ClipboardText,
  Funnel,
  ShoppingCart,
  Package,
  UserCircle,
  Gear,
  Clock,
  ArrowsClockwise,
} from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { AuditLogEntry, AuditAction } from "@/lib/types"
import { mockStaff } from "@/lib/mock-data"
import { getAuditLog, type AuditLogFilters } from "@/features/dashboard/services/audit-service"

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

type ActionCategory = "orders" | "products" | "staff" | "system" | "shift"

function getActionCategory(action: AuditAction): ActionCategory {
  if (action.startsWith("order_")) return "orders"
  if (action.startsWith("product_") || action.startsWith("stock_") || action.startsWith("category_")) return "products"
  if (action.startsWith("staff_")) return "staff"
  if (action.startsWith("shift_")) return "shift"
  return "system"
}

const categoryColors: Record<ActionCategory, "default" | "secondary" | "destructive" | "outline"> = {
  orders: "default",
  products: "secondary",
  staff: "outline",
  shift: "default",
  system: "outline",
}

const categoryIcons: Record<ActionCategory, typeof ShoppingCart> = {
  orders: ShoppingCart,
  products: Package,
  staff: UserCircle,
  shift: Clock,
  system: Gear,
}

const actionLabels: Partial<Record<AuditAction, string>> = {
  order_created: "Order Created",
  order_refunded: "Order Refunded",
  product_created: "Product Created",
  product_updated: "Product Updated",
  product_deleted: "Product Deleted",
  stock_adjusted: "Stock Adjusted",
  staff_created: "Staff Created",
  staff_updated: "Staff Updated",
  category_created: "Category Created",
  category_updated: "Category Updated",
  expense_created: "Expense Created",
  promotion_created: "Promo Created",
  promotion_updated: "Promo Updated",
  shift_opened: "Shift Opened",
  shift_closed: "Shift Closed",
  settings_updated: "Settings Updated",
}

const ITEMS_PER_PAGE = 10

export function AuditLogPage() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([])
  const [filters, setFilters] = useState<AuditLogFilters>({})
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const loadData = () => {
    getAuditLog(filters).then(setEntries)
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const totalPages = Math.ceil(entries.length / ITEMS_PER_PAGE)
  const pagedEntries = useMemo(
    () => entries.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [entries, page]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Log</h1>
          <p className="text-sm text-muted-foreground">
            Track all system activities and changes
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadData}>
          <ArrowsClockwise size={14} className="mr-1" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Funnel size={16} weight="duotone" />
            <CardTitle className="text-sm">Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Select
              value={filters.action || "all"}
              onValueChange={(v) => {
                setFilters((f) => ({ ...f, action: v === "all" ? undefined : (v as AuditAction) }))
                setPage(1)
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {Object.entries(actionLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.staffId || "all"}
              onValueChange={(v) => {
                setFilters((f) => ({ ...f, staffId: v === "all" ? undefined : v }))
                setPage(1)
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Staff" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Staff</SelectItem>
                {mockStaff.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="Start date"
              className="w-40"
              value={filters.startDate || ""}
              onChange={(e) => {
                setFilters((f) => ({ ...f, startDate: e.target.value || undefined }))
                setPage(1)
              }}
            />
            <Input
              type="date"
              placeholder="End date"
              className="w-40"
              value={filters.endDate || ""}
              onChange={(e) => {
                setFilters((f) => ({ ...f, endDate: e.target.value || undefined }))
                setPage(1)
              }}
            />

            {(filters.action || filters.staffId || filters.startDate || filters.endDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters({})
                  setPage(1)
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Log Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-44">Timestamp</TableHead>
                  <TableHead className="w-36">Action</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="hidden md:table-cell">Staff</TableHead>
                  <TableHead className="hidden lg:table-cell w-24">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedEntries.map((entry) => {
                  const category = getActionCategory(entry.action)
                  const Icon = categoryIcons[category]
                  return (
                    <TableRow
                      key={entry.id}
                      className="cursor-pointer"
                      onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                    >
                      <TableCell className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                        {formatDateTime(entry.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={categoryColors[category]} className="text-[10px] gap-1">
                          <Icon size={10} weight="bold" />
                          {actionLabels[entry.action] || entry.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{entry.description}</p>
                        {expandedId === entry.id && entry.metadata && (
                          <div className="mt-2 rounded-md bg-muted p-2 text-xs font-mono space-y-0.5">
                            {Object.entries(entry.metadata).map(([key, val]) => (
                              <div key={key}>
                                <span className="text-muted-foreground">{key}:</span>{" "}
                                <span className="font-semibold">{typeof val === "number" ? val.toLocaleString() : val}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {entry.staffName}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {entry.metadata && (
                          <span className="text-xs text-muted-foreground">
                            {expandedId === entry.id ? "▲" : "▼"} {Object.keys(entry.metadata).length} fields
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
                {pagedEntries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      <ClipboardText size={32} weight="thin" className="mx-auto mb-2" />
                      No audit log entries found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-xs text-muted-foreground">
                Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, entries.length)} of {entries.length}
              </p>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
