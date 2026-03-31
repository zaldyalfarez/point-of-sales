import { useState, useMemo } from "react"
import { MagnifyingGlass, NotePencil } from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { mockProducts, mockCategories } from "@/lib/mock-data"
import type { Product, ProductVariant } from "@/lib/types"

interface ProductGridProps {
  onAddToCart: (product: Product, variant?: ProductVariant, notes?: string) => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

const categoryEmojis: Record<string, string> = {
  "CAT-001": "☕",
  "CAT-002": "🍵",
  "CAT-003": "🥛",
  "CAT-004": "🧴",
  "CAT-005": "🥐",
  "CAT-006": "📦",
}

function getEmojiForCategory(categoryId: string) {
  return categoryEmojis[categoryId] || "📦"
}

/** Modal for selecting variant + adding notes */
function ProductDetailDialog({
  product,
  open,
  onClose,
  onConfirm,
}: {
  product: Product | null
  open: boolean
  onClose: () => void
  onConfirm: (product: Product, variant?: ProductVariant, notes?: string) => void
}) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [notes, setNotes] = useState("")

  if (!product) return null

  const hasVariants = product.variants && product.variants.length > 0
  const emoji = getEmojiForCategory(product.categoryId)
  const activePrice = hasVariants && selectedVariant
    ? product.price + selectedVariant.priceAdjustment
    : product.price
  const activeStock = hasVariants && selectedVariant
    ? selectedVariant.stock
    : product.stock

  const canAdd = hasVariants ? selectedVariant !== null && activeStock > 0 : activeStock > 0

  const handleAdd = () => {
    if (!canAdd) return
    onConfirm(product, selectedVariant ?? undefined, notes.trim() || undefined)
    setSelectedVariant(null)
    setNotes("")
    onClose()
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedVariant(null)
      setNotes("")
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm gap-0 p-0 overflow-hidden">
        <DialogHeader className="p-5 pb-3">
          <div className="flex items-start gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">
              {emoji}
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base leading-tight">{product.name}</DialogTitle>
              <DialogDescription className="mt-0.5 text-xs">
                {product.category} · {product.sku}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-5 pb-4 space-y-4">
          {/* Description */}
          {product.description && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Variant Selection */}
          {hasVariants && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Choose Variant
              </p>
              <div className="grid gap-1.5">
                {product.variants!.map((variant) => {
                  const variantPrice = product.price + variant.priceAdjustment
                  const isSelected = selectedVariant?.id === variant.id
                  const isDisabled = variant.stock <= 0
                  return (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={isDisabled}
                      className={`flex items-center justify-between rounded-lg border-2 px-3 py-2.5 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : isDisabled
                            ? "opacity-40 cursor-not-allowed border-transparent"
                            : "border-transparent hover:border-muted-foreground/20 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {/* Radio indicator */}
                        <div className={`flex size-4 items-center justify-center rounded-full border-2 transition-colors ${
                          isSelected ? "border-primary" : "border-muted-foreground/30"
                        }`}>
                          {isSelected && (
                            <div className="size-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <div>
                          <span className="text-xs font-medium">{variant.name}</span>
                          <span className="ml-1.5 text-[10px] text-muted-foreground">
                            ({variant.stock} left)
                          </span>
                        </div>
                      </div>
                      <span className={`text-xs font-bold ${isSelected ? "text-primary" : ""}`}>
                        {formatCurrency(variantPrice)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Price & Stock (non-variant) */}
          {!hasVariants && (
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
              <span className="text-xs text-muted-foreground">
                Stock: <span className="font-medium text-foreground">{product.stock}</span>
              </span>
              <span className="text-sm font-bold">{formatCurrency(product.price)}</span>
            </div>
          )}

          <Separator />

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <NotePencil size={13} />
              Notes (optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. less sugar, extra hot, no ice..."
              rows={2}
              className="text-xs resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 border-t bg-muted/30 p-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={!canAdd}
            onClick={handleAdd}
          >
            Add to Cart — {formatCurrency(activePrice)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ProductCard({
  product,
  onClick,
}: {
  product: Product
  onClick: (product: Product) => void
}) {
  const hasVariants = product.variants && product.variants.length > 0
  const emoji = getEmojiForCategory(product.categoryId)

  return (
    <button
      onClick={() => onClick(product)}
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
}

export function ProductGrid({ onAddToCart }: ProductGridProps) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

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

  const handleProductClick = (product: Product) => {
    // All products open the dialog (variant picker + notes)
    setSelectedProduct(product)
  }

  const handleConfirm = (product: Product, variant?: ProductVariant, notes?: string) => {
    onAddToCart(product, variant, notes)
  }

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
              onClick={handleProductClick}
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

      {/* Product Detail / Variant + Notes Dialog */}
      <ProductDetailDialog
        product={selectedProduct}
        open={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
