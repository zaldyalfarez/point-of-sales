import { useState, useMemo } from "react"
import { MagnifyingGlass, Receipt } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { mockTransactions, mockStaff } from "@/lib/mock-data"
import type { Transaction, TransactionStatus } from "@/lib/types"

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
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  completed: "default",
  pending: "secondary",
  refunded: "destructive",
}

const paymentLabels: Record<string, string> = {
  cash: "Cash",
  debit_card: "Debit Card",
  qris: "QRIS",
}

const filters: { label: string; value: TransactionStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Refunded", value: "refunded" },
]

export function TransactionsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">("all")
  const [staffFilter, setStaffFilter] = useState("all")
  const [receiptTxn, setReceiptTxn] = useState<Transaction | null>(null)

  const filteredTransactions = useMemo(() => {
    let result = mockTransactions

    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter)
    }
    if (staffFilter !== "all") {
      result = result.filter((t) => t.staffId === staffFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (t) => t.id.toLowerCase().includes(q) || t.customerName.toLowerCase().includes(q)
      )
    }

    return result
  }, [search, statusFilter, staffFilter])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-sm text-muted-foreground">View and manage all transactions</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>
                {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="relative w-full sm:w-48">
                <MagnifyingGlass size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
              </div>
              <Select value={staffFilter} onValueChange={setStaffFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="All Staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff</SelectItem>
                  {mockStaff.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <Button
                key={f.value}
                variant={statusFilter === f.value ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(f.value)}
              >
                {f.label}
              </Button>
            ))}
          </div>
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
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-mono text-xs">{txn.id}</TableCell>
                    <TableCell>{txn.customerName}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{txn.staffName}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{formatDate(txn.createdAt)}</TableCell>
                    <TableCell className="hidden lg:table-cell">{paymentLabels[txn.paymentMethod]}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(txn.total)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[txn.status]} className="capitalize">{txn.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="size-7" onClick={() => setReceiptTxn(txn)}>
                        <Receipt size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">No transactions found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Receipt Dialog */}
      <Dialog open={!!receiptTxn} onOpenChange={() => setReceiptTxn(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Receipt — {receiptTxn?.id}</DialogTitle>
            <DialogDescription>Transaction details</DialogDescription>
          </DialogHeader>
          {receiptTxn && (
            <div className="space-y-3 rounded-lg border bg-muted/30 p-4 text-xs">
              <div className="text-center font-bold">AK POS</div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer</span>
                <span>{receiptTxn.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Staff</span>
                <span>{receiptTxn.staffName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{formatDate(receiptTxn.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <span>{paymentLabels[receiptTxn.paymentMethod]}</span>
              </div>
              <Separator />
              {receiptTxn.items.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>{item.productName} × {item.quantity}</span>
                  <span>{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(receiptTxn.subtotal)}</span>
              </div>
              {receiptTxn.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(receiptTxn.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(receiptTxn.tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm font-bold">
                <span>Total</span>
                <span>{formatCurrency(receiptTxn.total)}</span>
              </div>
              {receiptTxn.paymentMethod === "cash" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paid</span>
                    <span>{formatCurrency(receiptTxn.amountPaid)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-emerald-600">
                    <span>Change</span>
                    <span>{formatCurrency(receiptTxn.change)}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
