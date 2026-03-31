import { useState } from "react"
import { Trash, Plus, Minus } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DiscountSelector } from "@/features/pos/components/DiscountSelector"
import { useStoreSettings } from "@/contexts/StoreSettingsContext"
import type { CartItem, Promotion } from "@/lib/types"

interface CartPanelProps {
  items: CartItem[]
  onUpdateQuantity: (cartKey: string, quantity: number) => void
  onRemoveItem: (cartKey: string) => void
  onClearCart: () => void
  onProcessOrder: (data: {
    customerName: string
    discount: number
    subtotal: number
    tax: number
    total: number
  }) => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function getCartKey(item: CartItem): string {
  return item.selectedVariant
    ? `${item.product.id}-${item.selectedVariant.id}`
    : item.product.id
}

function getItemPrice(item: CartItem): number {
  const base = item.product.price
  const adj = item.selectedVariant?.priceAdjustment ?? 0
  return base + adj
}

function getItemStock(item: CartItem): number {
  return item.selectedVariant?.stock ?? item.product.stock
}

export function CartPanel({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProcessOrder,
}: CartPanelProps) {
  const { settings } = useStoreSettings()
  const [customerName, setCustomerName] = useState("Walk-in Customer")
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null)
  const [promoDiscount, setPromoDiscount] = useState(0)

  const subtotal = items.reduce(
    (sum, item) => sum + getItemPrice(item) * item.quantity,
    0
  )
  const afterDiscount = Math.max(0, subtotal - promoDiscount)
  const tax = settings.taxEnabled ? Math.round(afterDiscount * settings.taxRate) : 0
  const total = afterDiscount + tax

  const cartCategoryIds = [...new Set(items.map((i) => i.product.categoryId))]

  const handleProcess = () => {
    onProcessOrder({
      customerName,
      discount: promoDiscount,
      subtotal,
      tax,
      total,
    })
    setCustomerName("Walk-in Customer")
    setAppliedPromo(null)
    setPromoDiscount(0)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-sm font-semibold">Current Order</h2>
        {items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearCart} className="text-xs text-destructive hover:text-destructive">
            Clear
          </Button>
        )}
      </div>

      {/* Customer */}
      <div className="mb-3">
        <Input
          placeholder="Customer name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="text-xs"
        />
      </div>

      {/* Discount Selector */}
      <div className="mb-3">
        <DiscountSelector
          subtotal={subtotal}
          cartCategoryIds={cartCategoryIds}
          appliedPromo={appliedPromo}
          promoDiscount={promoDiscount}
          onApplyPromo={(promo, discount) => {
            setAppliedPromo(promo)
            setPromoDiscount(discount)
          }}
          onRemovePromo={() => {
            setAppliedPromo(null)
            setPromoDiscount(0)
          }}
        />
      </div>

      {/* Cart Items */}
      <ScrollArea className="flex-1 min-h-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <span className="text-3xl mb-2">🛒</span>
            <p className="text-xs">No items in cart</p>
            <p className="text-[10px]">Click products to add</p>
          </div>
        ) : (
          <div className="space-y-2 pr-2">
            {items.map((item) => {
              const key = getCartKey(item)
              const price = getItemPrice(item)
              const stock = getItemStock(item)
              return (
                <div key={key} className="flex items-start gap-2 rounded-md border p-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium leading-tight line-clamp-1">
                      {item.product.name}
                    </p>
                    {item.selectedVariant && (
                      <p className="text-[10px] text-primary/80 font-medium">
                        {item.selectedVariant.name}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground">
                      {formatCurrency(price)} each
                    </p>
                    {item.notes && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 italic mt-0.5 line-clamp-1" title={item.notes}>
                        📝 {item.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-6"
                      onClick={() => onUpdateQuantity(key, item.quantity - 1)}
                    >
                      <Minus size={12} />
                    </Button>
                    <span className="w-6 text-center text-xs font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-6"
                      onClick={() => onUpdateQuantity(key, item.quantity + 1)}
                      disabled={item.quantity >= stock}
                    >
                      <Plus size={12} />
                    </Button>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold">
                      {formatCurrency(price * item.quantity)}
                    </span>
                    <button
                      onClick={() => onRemoveItem(key)}
                      className="mt-0.5 text-destructive/60 hover:text-destructive"
                    >
                      <Trash size={12} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>

      {/* Order Summary */}
      <div className="mt-3 space-y-3 border-t pt-3">
        {/* Totals */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {promoDiscount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Promo ({appliedPromo?.code})</span>
              <span>-{formatCurrency(promoDiscount)}</span>
            </div>
          )}
          {settings.taxEnabled && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">{settings.taxLabel} ({Math.round(settings.taxRate * 100)}%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Process Button — opens payment dialog */}
        <Button
          className="w-full"
          size="lg"
          disabled={items.length === 0}
          onClick={handleProcess}
        >
          Process Order — {formatCurrency(total)}
        </Button>
      </div>
    </div>
  )
}
