import { useState, useMemo } from "react"
import { MagnifyingGlass } from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { mockProducts, mockCategories } from "@/lib/mock-data"
import type { Product, ProductVariant } from "@/lib/types"

interface ProductGridProps {
  onAddToCart: (product: Product, variant?: ProductVariant) => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

const categoryEmojis: Record<string, string> = {
  "CAT-001": "☕",  // Coffee
  "CAT-002": "🍵",  // Tea
  "CAT-003": "🥛",  // Dairy
  "CAT-004": "🧴",  // Syrup
  "CAT-005": "🥐",  // Bakery
  "CAT-006": "📦",  // Supplies
}

function getEmojiForCategory(categoryId: string) {
  return categoryEmojis[categoryId] || "📦"
}

function ProductCard({
  product,
  onSelect,
}: {
  product: Product
  onSelect: (product: Product, variant?: ProductVariant) => void
}) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const hasVariants = product.variants && product.variants.length > 0
  const emoji = getEmojiForCategory(product.categoryId)

  const handleClick = () => {
    if (hasVariants) {
      setPopoverOpen(true)
    } else {
      onSelect(product)
    }
  }

  const handleVariantPick = (variant: ProductVariant) => {
    onSelect(product, variant)
    setPopoverOpen(false)
  }

  const card = (
    <button
      onClick={handleClick}
      className="group flex flex-col rounded-lg border bg-card p-3 text-left transition-all hover:border-primary hover:shadow-sm active:scale-[0.98] relative overflow-hidden"
    >
      {/* Category emoji */}
      <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted text-lg">
        {emoji}
      </div>
      <p className="text-xs font-medium leading-tight line-clamp-2">
        {product.name}
      </p>
      <p className="mt-0.5 text-[10px] text-muted-foreground">{product.category}</p>
      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="text-sm font-bold">{formatCurrency(product.price)}</span>
        <div className="flex items-center gap-1">
          {hasVariants && (
            <Badge variant="outline" className="text-[8px] h-4 px-1">
              {product.variants!.length} opts
            </Badge>
          )}
          <Badge
            variant={product.stock <= product.minStock ? "secondary" : "outline"}
            className="text-[9px]"
          >
            {product.stock}
          </Badge>
        </div>
      </div>
    </button>
  )

  if (!hasVariants) return card

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>{card}</PopoverTrigger>
      <PopoverContent className="w-56 p-1.5" align="start" side="right" sideOffset={4}>
        <p className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Choose variant
        </p>
        <div className="space-y-0.5">
          {product.variants!.map((variant) => {
            const variantPrice = product.price + variant.priceAdjustment
            return (
              <button
                key={variant.id}
                onClick={() => handleVariantPick(variant)}
                disabled={variant.stock <= 0}
                className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left transition-colors hover:bg-muted active:bg-muted/70 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div>
                  <span className="text-xs font-medium">{variant.name}</span>
                  <span className="ml-1.5 text-[10px] text-muted-foreground">
                    ({variant.stock} left)
                  </span>
                </div>
                <span className="text-xs font-bold">{formatCurrency(variantPrice)}</span>
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
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
            {cat.id !== "all" && (
              <span className="mr-1">{getEmojiForCategory(cat.id)}</span>
            )}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onAddToCart}
            />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
              <span className="text-4xl mb-2">🔍</span>
              <p className="text-sm">No products found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
