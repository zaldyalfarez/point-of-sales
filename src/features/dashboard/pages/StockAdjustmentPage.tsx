import { useState } from "react"
import { Plus, ArrowUp, ArrowDown } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { mockStockAdjustments, mockProducts } from "@/lib/mock-data"
import type { AdjustmentType } from "@/lib/types"

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function StockAdjustmentPage() {
  const [adjustments, setAdjustments] = useState(mockStockAdjustments)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({
    productId: "",
    type: "in" as AdjustmentType,
    quantity: "",
    reason: "",
  })

  const handleSave = () => {
    const product = mockProducts.find((p) => p.id === form.productId)
    if (!product) return
    setAdjustments((prev) => [
      {
        id: `ADJ-${String(prev.length + 1).padStart(3, "0")}`,
        productId: form.productId,
        productName: product.name,
        type: form.type,
        quantity: Number(form.quantity),
        reason: form.reason,
        staffId: "STF-001",
        staffName: "Ahmad Rizal",
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ])
    setDialogOpen(false)
    setForm({ productId: "", type: "in", quantity: "", reason: "" })
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Stock Adjustments</h1>
        <p className="text-sm text-muted-foreground">Track inventory changes</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Adjustment History</CardTitle>
              <CardDescription>{adjustments.length} adjustments</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus size={16} className="mr-1" /> New Adjustment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Stock Adjustment</DialogTitle>
                  <DialogDescription>Record a stock change</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Product</Label>
                    <Select value={form.productId} onValueChange={(v) => setForm((f) => ({ ...f, productId: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                      <SelectContent>
                        {mockProducts.map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as AdjustmentType }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in">Stock In</SelectItem>
                          <SelectItem value="out">Stock Out</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={form.quantity}
                        onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Reason</Label>
                    <Input
                      value={form.reason}
                      onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                      placeholder="e.g. Supplier delivery, damaged goods"
                    />
                  </div>
                  <Button onClick={handleSave} className="w-full" disabled={!form.productId || !form.quantity || !form.reason}>
                    Save Adjustment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="hidden sm:table-cell">Reason</TableHead>
                  <TableHead className="hidden md:table-cell">Staff</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adjustments.map((adj) => (
                  <TableRow key={adj.id}>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(adj.createdAt)}</TableCell>
                    <TableCell className="font-medium">{adj.productName}</TableCell>
                    <TableCell>
                      <Badge variant={adj.type === "in" ? "default" : "destructive"} className="gap-1">
                        {adj.type === "in" ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                        {adj.type === "in" ? "In" : "Out"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {adj.type === "in" ? "+" : "-"}{adj.quantity}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{adj.reason}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{adj.staffName}</TableCell>
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
