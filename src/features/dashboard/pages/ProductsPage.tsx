import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { MagnifyingGlass, Plus, PencilSimple } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { mockProducts } from "@/lib/mock-data"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  in_stock: "default",
  low_stock: "secondary",
  out_of_stock: "destructive",
}

const statusLabel: Record<string, string> = {
  in_stock: "In Stock",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
}

export function ProductsPage() {
  const [search, setSearch] = useState("")

  const filteredProducts = useMemo(() => {
    if (!search) return mockProducts
    const q = search.toLowerCase()
    return mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <p className="text-sm text-muted-foreground">Manage your product inventory</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Products</CardTitle>
              <CardDescription>
                {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-full sm:w-56">
                <MagnifyingGlass size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
              </div>
              <Button size="sm" asChild>
                <Link to="/dashboard/products/new">
                  <Plus size={16} className="mr-1" /> Add
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="hidden sm:table-cell">SKU</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="hidden sm:table-cell font-mono text-xs text-muted-foreground">{product.sku}</TableCell>
                    <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                    <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                    <TableCell className="text-right hidden sm:table-cell">{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[product.status]}>{statusLabel[product.status]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="size-7" asChild>
                        <Link to={`/dashboard/products/${product.id}/edit`}>
                          <PencilSimple size={14} />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No products found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
