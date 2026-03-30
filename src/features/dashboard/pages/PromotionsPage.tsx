import { useState, useEffect, useMemo } from "react"
import {
  Megaphone,
  Plus,
  PencilSimple,
  Trash,
  ToggleRight,
  Ticket,
  TrendUp,
  Users,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Promotion, PromotionType } from "@/lib/types"
import { mockCategories } from "@/lib/mock-data"
import {
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "@/features/dashboard/services/promotion-service"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  scheduled: "secondary",
  expired: "outline",
  disabled: "destructive",
}

const typeLabels: Record<PromotionType, string> = {
  percentage: "Percentage",
  fixed: "Fixed Amount",
  buy_x_get_y: "Buy X Get Y",
}

const defaultForm = {
  name: "",
  code: "",
  type: "percentage" as PromotionType,
  value: 0,
  minOrderAmount: 0,
  maxDiscount: 0,
  applicableCategories: [] as string[],
  usageLimit: 0,
  startDate: "",
  endDate: "",
}

export function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(defaultForm)

  useEffect(() => {
    getPromotions().then(setPromotions)
  }, [])

  const stats = useMemo(() => {
    const active = promotions.filter((p) => p.status === "active").length
    const totalRedemptions = promotions.reduce((s, p) => s + p.usedCount, 0)
    return { active, totalRedemptions }
  }, [promotions])

  const openCreate = () => {
    setEditingId(null)
    setForm(defaultForm)
    setDialogOpen(true)
  }

  const openEdit = (promo: Promotion) => {
    setEditingId(promo.id)
    setForm({
      name: promo.name,
      code: promo.code,
      type: promo.type,
      value: promo.value,
      minOrderAmount: promo.minOrderAmount,
      maxDiscount: promo.maxDiscount,
      applicableCategories: promo.applicableCategories,
      usageLimit: promo.usageLimit,
      startDate: promo.startDate,
      endDate: promo.endDate,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (editingId) {
      await updatePromotion(editingId, form)
    } else {
      await createPromotion(form)
    }
    const updated = await getPromotions()
    setPromotions(updated)
    setDialogOpen(false)
  }

  const handleDelete = async (id: string) => {
    await deletePromotion(id)
    const updated = await getPromotions()
    setPromotions(updated)
  }

  const handleToggle = async (promo: Promotion) => {
    const newStatus = promo.status === "active" ? "disabled" : "active"
    await updatePromotion(promo.id, { status: newStatus })
    const updated = await getPromotions()
    setPromotions(updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Promotions & Coupons</h1>
          <p className="text-sm text-muted-foreground">
            Manage discount codes and promotions
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} className="mr-1" />
          Add Promotion
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Promos</CardTitle>
            <Megaphone size={18} weight="duotone" className="text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Redemptions</CardTitle>
            <Ticket size={18} weight="duotone" className="text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalRedemptions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Promotions</CardTitle>
            <TrendUp size={18} weight="duotone" className="text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{promotions.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="hidden md:table-cell">Usage</TableHead>
                  <TableHead className="hidden lg:table-cell">Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell className="font-medium">{promo.name}</TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                        {promo.code}
                      </code>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">
                      {typeLabels[promo.type]}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {promo.type === "percentage" ? `${promo.value}%` : formatCurrency(promo.value)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users size={12} />
                        {promo.usedCount}{promo.usageLimit > 0 ? `/${promo.usageLimit}` : ""}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {promo.startDate} — {promo.endDate}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[promo.status]} className="capitalize text-[10px]">
                        {promo.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="size-7" onClick={() => openEdit(promo)}>
                          <PencilSimple size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-7" onClick={() => handleToggle(promo)}>
                          <ToggleRight size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-7 text-destructive" onClick={() => handleDelete(promo.id)}>
                          <Trash size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Promotion" : "Add Promotion"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update promotion details" : "Create a new discount or coupon code"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Summer Sale"
                />
              </div>
              <div className="space-y-2">
                <Label>Code</Label>
                <Input
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. SAVE20"
                  className="font-mono uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as PromotionType }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (Rp)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{form.type === "percentage" ? "Discount (%)" : "Discount (Rp)"}</Label>
                <Input
                  type="number"
                  value={form.value || ""}
                  onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min. Order Amount</Label>
                <Input
                  type="number"
                  value={form.minOrderAmount || ""}
                  onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Max Discount Cap</Label>
                <Input
                  type="number"
                  value={form.maxDiscount || ""}
                  onChange={(e) => setForm((f) => ({ ...f, maxDiscount: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Usage Limit (0 = unlimited)</Label>
                <Input
                  type="number"
                  value={form.usageLimit || ""}
                  onChange={(e) => setForm((f) => ({ ...f, usageLimit: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.applicableCategories[0] || "all"}
                  onValueChange={(v) => setForm((f) => ({
                    ...f,
                    applicableCategories: v === "all" ? [] : [v],
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {mockCategories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name || !form.code || !form.value}>
              {editingId ? "Save Changes" : "Create Promotion"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
