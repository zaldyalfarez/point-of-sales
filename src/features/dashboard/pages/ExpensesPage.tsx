import { useState } from "react"
import { Plus, Trash } from "@phosphor-icons/react"
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
import { mockExpenses } from "@/lib/mock-data"
import type { ExpenseCategory } from "@/lib/types"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

const categoryLabels: Record<ExpenseCategory, string> = {
  rent: "Rent",
  utilities: "Utilities",
  supplies: "Supplies",
  salary: "Salary",
  maintenance: "Maintenance",
  marketing: "Marketing",
  other: "Other",
}

const categoryColors: Record<ExpenseCategory, "default" | "secondary" | "outline" | "destructive"> = {
  rent: "default",
  utilities: "secondary",
  supplies: "outline",
  salary: "default",
  maintenance: "secondary",
  marketing: "outline",
  other: "secondary",
}

export function ExpensesPage() {
  const [expenses, setExpenses] = useState(mockExpenses)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({
    category: "" as ExpenseCategory | "",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  })

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  const handleSave = () => {
    setExpenses((prev) => [
      {
        id: `EXP-${String(prev.length + 1).padStart(3, "0")}`,
        category: form.category as ExpenseCategory,
        description: form.description,
        amount: Number(form.amount),
        staffId: "STF-001",
        staffName: "Ahmad Rizal",
        date: form.date,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ])
    setDialogOpen(false)
    setForm({ category: "", description: "", amount: "", date: new Date().toISOString().split("T")[0] })
  }

  const handleDelete = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
        <p className="text-sm text-muted-foreground">Track your store expenses</p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardContent className="flex items-center justify-between pt-6">
          <div>
            <p className="text-sm text-muted-foreground">Total Expenses (This Month)</p>
            <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {expenses.length} entries
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Expenses</CardTitle>
              <CardDescription>Expense records</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus size={16} className="mr-1" /> Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Expense</DialogTitle>
                  <DialogDescription>Record a new expense</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v as ExpenseCategory }))}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryLabels).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="What was this expense for?"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Amount (IDR)</Label>
                      <Input
                        type="number"
                        value={form.amount}
                        onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button onClick={handleSave} className="w-full" disabled={!form.category || !form.description || !form.amount}>
                    Save Expense
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
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="hidden sm:table-cell">Recorded By</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((exp) => (
                  <TableRow key={exp.id}>
                    <TableCell className="text-xs text-muted-foreground">{exp.date}</TableCell>
                    <TableCell>
                      <Badge variant={categoryColors[exp.category]}>{categoryLabels[exp.category]}</Badge>
                    </TableCell>
                    <TableCell>{exp.description}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(exp.amount)}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{exp.staffName}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive" onClick={() => handleDelete(exp.id)}>
                        <Trash size={14} />
                      </Button>
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
