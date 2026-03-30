import { useState, useMemo } from "react"
import { MagnifyingGlass, Star } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { mockCustomers, mockTransactions } from "@/lib/mock-data"
import type { Customer } from "@/lib/types"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export function CustomersPage() {
  const [search, setSearch] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const filteredCustomers = useMemo(() => {
    if (!search) return mockCustomers
    const q = search.toLowerCase()
    return mockCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
    )
  }, [search])

  const customerHistory = useMemo(() => {
    if (!selectedCustomer) return []
    return mockTransactions.filter((t) => t.customerId === selectedCustomer.id)
  }, [selectedCustomer])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-sm text-muted-foreground">Manage your customer database</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Customers</CardTitle>
              <CardDescription>
                {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <MagnifyingGlass size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Orders</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Points</TableHead>
                  <TableHead className="hidden md:table-cell">Last Order</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{customer.email}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">{customer.phone}</TableCell>
                    <TableCell className="text-right hidden md:table-cell">{customer.totalOrders}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(customer.totalSpent)}</TableCell>
                    <TableCell className="text-center hidden sm:table-cell">
                      <Badge variant="secondary" className="gap-1">
                        <Star size={10} weight="fill" className="text-amber-500" />
                        {customer.loyaltyPoints}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{formatDate(customer.lastOrderAt)}</TableCell>
                  </TableRow>
                ))}
                {filteredCustomers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No customers found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedCustomer?.name}</DialogTitle>
            <DialogDescription>{selectedCustomer?.email} · {selectedCustomer?.phone}</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg border p-3">
                  <p className="text-lg font-bold">{selectedCustomer.totalOrders}</p>
                  <p className="text-[10px] text-muted-foreground">Orders</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-lg font-bold">{formatCurrency(selectedCustomer.totalSpent)}</p>
                  <p className="text-[10px] text-muted-foreground">Spent</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-lg font-bold flex items-center justify-center gap-1">
                    <Star size={14} weight="fill" className="text-amber-500" />
                    {selectedCustomer.loyaltyPoints}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Points</p>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold">Purchase History</h4>
                {customerHistory.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No transactions found in mock data</p>
                ) : (
                  <div className="space-y-2">
                    {customerHistory.map((txn) => (
                      <div key={txn.id} className="flex items-center justify-between rounded-lg border p-2.5 text-xs">
                        <div>
                          <p className="font-mono font-medium">{txn.id}</p>
                          <p className="text-muted-foreground">{formatDate(txn.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(txn.total)}</p>
                          <p className="text-muted-foreground capitalize">{txn.paymentMethod.replace("_", " ")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
