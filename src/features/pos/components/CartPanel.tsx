import { useState } from "react"
import { Trash, Plus, Minus } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PromoCodeInput } from "@/features/pos/components/PromoCodeInput"
import { useStoreSettings } from "@/contexts/StoreSettingsContext"
import type { CartItem, PaymentMethod, Promotion } from "@/lib/types"

interface CartPanelProps {
  items: CartItem[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
  onClearCart: () => void
  onProcessOrder: (data: {
    customerName: string
    paymentMethod: PaymentMethod
    amountPaid: number
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

export function CartPanel({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProcessOrder,
}: CartPanelProps) {
  const { settings } = useStoreSettings()
  const [customerName, setCustomerName] = useState("Walk-in Customer")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")
  const [discountAmount, setDiscountAmount] = useState(0)
  const [amountPaid, setAmountPaid] = useState(0)
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null)
  const [promoDiscount, setPromoDiscount] = useState(0)

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity - item.discount,
    0
  )
  const totalDiscount = promoDiscount + discountAmount
  const afterDiscount = Math.max(0, subtotal - totalDiscount)
  const tax = settings.taxEnabled ? Math.round(afterDiscount * settings.taxRate) : 0
  const total = afterDiscount + tax
  const change = paymentMethod === "cash" ? Math.max(0, amountPaid - total) : 0

  const canProcess =
    items.length > 0 &&
    (paymentMethod !== "cash" || amountPaid >= total)

  const cartCategoryIds = [...new Set(items.map((i) => i.product.categoryId))]

  const handleProcess = () => {
    onProcessOrder({
      customerName,
      paymentMethod,
      amountPaid: paymentMethod === "cash" ? amountPaid : total,
      discount: totalDiscount,
      subtotal,
      tax,
      total,
    })
    setCustomerName("Walk-in Customer")
    setDiscountAmount(0)
    setAmountPaid(0)
    setAppliedPromo(null)
    setPromoDiscount(0)
  }

  const paymentMethods: { value: PaymentMethod; label: string }[] = [
    { value: "cash", label: "Cash" },
    { value: "debit_card", label: "Debit" },
    { value: "qris", label: "QRIS" },
  ]

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

      {/* Promo Code */}
      <div className="mb-3">
        <PromoCodeInput
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
            <p className="text-xs">No items in cart</p>
            <p className="text-[10px]">Click products to add</p>
          </div>
        ) : (
          <div className="space-y-2 pr-2">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-start gap-2 rounded-md border p-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium leading-tight line-clamp-1">
                    {item.product.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatCurrency(item.product.price)} each
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-6"
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
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
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                  >
                    <Plus size={12} />
                  </Button>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="mt-0.5 text-destructive/60 hover:text-destructive"
                  >
                    <Trash size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Order Summary */}
      <div className="mt-3 space-y-3 border-t pt-3">
        {/* Manual Discount */}
        <div className="flex items-center gap-2">
          <Label className="text-xs shrink-0">Discount</Label>
          <Input
            type="number"
            value={discountAmount || ""}
            onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
            placeholder="0"
            className="text-xs text-right"
          />
        </div>

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
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Discount</span>
              <span>-{formatCurrency(discountAmount)}</span>
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

        {/* Payment Method */}
        <div className="grid grid-cols-3 gap-1.5">
          {paymentMethods.map((pm) => (
            <button
              key={pm.value}
              onClick={() => setPaymentMethod(pm.value)}
              className={`rounded-md border px-2 py-2 text-xs font-medium transition-colors ${
                paymentMethod === pm.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {pm.label}
            </button>
          ))}
        </div>

        {/* Cash Input */}
        {paymentMethod === "cash" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-xs shrink-0">Paid</Label>
              <Input
                type="number"
                value={amountPaid || ""}
                onChange={(e) => setAmountPaid(Number(e.target.value) || 0)}
                placeholder="Amount received"
                className="text-xs text-right"
              />
            </div>
            {amountPaid > 0 && (
              <div className="flex justify-between rounded-md bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                <span>Change</span>
                <span>{formatCurrency(change)}</span>
              </div>
            )}
          </div>
        )}

        {/* Process Button */}
        <Button
          className="w-full"
          size="lg"
          disabled={!canProcess}
          onClick={handleProcess}
        >
          Process Order — {formatCurrency(total)}
        </Button>
      </div>
    </div>
  )
}
