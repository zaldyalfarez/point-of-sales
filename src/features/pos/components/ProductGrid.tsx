import { useState, useMemo } from "react"
import { MagnifyingGlass, Package } from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { mockProducts, mockCategories } from "@/lib/mock-data"
import type { Product } from "@/lib/types"

interface ProductGridProps {
  onAddToCart: (product: Product) => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function ProductGrid({ onAddToCart }: ProductGridProps) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [{ id: "all", name: "All" }, ...mockCategories]

  const filteredProducts = useMemo(() => {
    let result = mockProducts.filter((p) => p.stock > 0)
    if (activeCategory !== "all") {
      result = result.filter((p) => p.categoryId === activeCategory)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      )
    }
    return result
  }, [search, activeCategory])

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="relative mb-3">
        <MagnifyingGlass size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products or scan barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Category Tabs */}
      <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => onAddToCart(product)}
              className="group flex flex-col rounded-lg border bg-card p-3 text-left transition-all hover:border-primary hover:shadow-sm active:scale-[0.98]"
            >
              <div className="mb-2 flex size-10 items-center justify-center rounded-md bg-muted">
                <Package size={20} weight="duotone" className="text-muted-foreground" />
              </div>
              <p className="text-xs font-medium leading-tight line-clamp-2">
                {product.name}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{product.category}</p>
              <div className="mt-auto flex items-center justify-between pt-2">
                <span className="text-sm font-bold">{formatCurrency(product.price)}</span>
                <Badge
                  variant={product.stock <= product.minStock ? "secondary" : "outline"}
                  className="text-[9px]"
                >
                  {product.stock}
                </Badge>
              </div>
            </button>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Package size={40} weight="thin" />
              <p className="mt-2 text-sm">No products found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
