import { useState } from "react"
import { Plus, PencilSimple, Trash } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { mockCategories } from "@/lib/mock-data"

export function CategoryPage() {
  const [categories, setCategories] = useState(mockCategories)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", description: "" })

  const handleSave = () => {
    if (editingId) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingId ? { ...c, name: form.name, description: form.description } : c
        )
      )
    } else {
      setCategories((prev) => [
        ...prev,
        {
          id: `CAT-${String(prev.length + 1).padStart(3, "0")}`,
          name: form.name,
          description: form.description,
          productCount: 0,
          createdAt: new Date().toISOString(),
        },
      ])
    }
    setDialogOpen(false)
    setEditingId(null)
    setForm({ name: "", description: "" })
  }

  const handleEdit = (id: string) => {
    const cat = categories.find((c) => c.id === id)
    if (cat) {
      setForm({ name: cat.name, description: cat.description })
      setEditingId(id)
      setDialogOpen(true)
    }
  }

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  const openNew = () => {
    setForm({ name: "", description: "" })
    setEditingId(null)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <p className="text-sm text-muted-foreground">Manage product categories</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Categories</CardTitle>
              <CardDescription>{categories.length} categories</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={openNew}>
                  <Plus size={16} className="mr-1" /> Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit" : "Add"} Category</DialogTitle>
                  <DialogDescription>
                    {editingId ? "Update category details" : "Create a new product category"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="catName">Name</Label>
                    <Input
                      id="catName"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Category name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="catDesc">Description</Label>
                    <Input
                      id="catDesc"
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Category description"
                    />
                  </div>
                  <Button onClick={handleSave} className="w-full" disabled={!form.name}>
                    {editingId ? "Update" : "Create"} Category
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Description</TableHead>
                <TableHead className="text-right">Products</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                    {cat.description}
                  </TableCell>
                  <TableCell className="text-right">{cat.productCount}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="size-7" onClick={() => handleEdit(cat.id)}>
                        <PencilSimple size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(cat.id)}
                        disabled={cat.productCount > 0}
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
