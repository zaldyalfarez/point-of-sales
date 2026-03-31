import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { ShoppingCart, ArrowLeft, Storefront, CalendarDots } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useIsMobile } from "@/hooks/use-mobile"
import { useStoreSettings } from "@/contexts/StoreSettingsContext"
import { ProductGrid } from "@/features/pos/components/ProductGrid"
import { CartPanel } from "@/features/pos/components/CartPanel"
import { PaymentConfirmDialog } from "@/features/pos/components/PaymentConfirmDialog"
import { OrderSuccessDialog } from "@/features/pos/components/OrderSuccessDialog"
import type { CartItem, Product, ProductVariant, PaymentMethod } from "@/lib/types"

function getCartKey(product: Product, variant?: ProductVariant): string {
  return variant ? `${product.id}-${variant.id}` : product.id
}


export function POSPage() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { settings } = useStoreSettings()
  const [cart, setCart] = useState<CartItem[]>([])
  const [mobileCartOpen, setMobileCartOpen] = useState(false)

  // Payment flow state
  const [pendingOrder, setPendingOrder] = useState<{
    customerName: string
    discount: number
    subtotal: number
    tax: number
    total: number
  } | null>(null)

  const [orderSuccess, setOrderSuccess] = useState<{
    orderId: string
    items: CartItem[]
    customerName: string
    paymentMethod: PaymentMethod
    subtotal: number
    discount: number
    tax: number
    total: number
    amountPaid: number
    change: number
  } | null>(null)

  const addToCart = useCallback((product: Product, variant?: ProductVariant, notes?: string) => {
    setCart((prev) => {
      const key = getCartKey(product, variant)
      const existing = prev.find(
        (item) =>
          item.product.id === product.id &&
          item.selectedVariant?.id === variant?.id
      )
      if (existing) {
        const maxStock = variant?.stock ?? product.stock
        if (existing.quantity >= maxStock) return prev
        return prev.map((item) => {
          const itemKey = getCartKey(item.product, item.selectedVariant)
          return itemKey === key
            ? { ...item, quantity: item.quantity + 1, notes: notes || item.notes }
            : item
        })
      }
      return [...prev, { product, selectedVariant: variant, quantity: 1, discount: 0, notes }]
    })
  }, [])

  const updateQuantity = useCallback((cartKey: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) =>
        prev.filter(
          (item) => getCartKey(item.product, item.selectedVariant) !== cartKey
        )
      )
    } else {
      setCart((prev) =>
        prev.map((item) =>
          getCartKey(item.product, item.selectedVariant) === cartKey
            ? { ...item, quantity }
            : item
        )
      )
    }
  }, [])

  const removeItem = useCallback((cartKey: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => getCartKey(item.product, item.selectedVariant) !== cartKey
      )
    )
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  // Step 1: Cart triggers processOrder → opens payment dialog
  const handleProcessOrder = useCallback(
    (data: {
      customerName: string
      discount: number
      subtotal: number
      tax: number
      total: number
    }) => {
      setPendingOrder(data)
      setMobileCartOpen(false)
    },
    []
  )

  // Step 2: Payment dialog confirms → creates order → shows receipt
  const handlePaymentConfirm = useCallback(
    (paymentMethod: PaymentMethod, amountPaid: number) => {
      if (!pendingOrder) return
      const orderId = `TXN-${String(Date.now()).slice(-6)}`
      const change = paymentMethod === "cash" ? Math.max(0, amountPaid - pendingOrder.total) : 0

      setOrderSuccess({
        orderId,
        items: [...cart],
        customerName: pendingOrder.customerName,
        paymentMethod,
        subtotal: pendingOrder.subtotal,
        discount: pendingOrder.discount,
        tax: pendingOrder.tax,
        total: pendingOrder.total,
        amountPaid,
        change,
      })

      setCart([])
      setPendingOrder(null)
    },
    [cart, pendingOrder]
  )

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const now = new Date()
  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  const timeStr = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const cartPanel = (
    <CartPanel
      items={cart}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={removeItem}
      onClearCart={clearCart}
      onProcessOrder={handleProcessOrder}
    />
  )

  return (
    <div className="flex h-svh flex-col">
      {/* ── POS Header ───────────────────────────────────────── */}
      <header className="flex h-12 shrink-0 items-center gap-3 border-b bg-card px-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 -ml-1 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline text-xs">Dashboard</span>
        </Button>

        <Separator orientation="vertical" className="h-5" />

        <div className="flex items-center gap-1.5">
          <Storefront size={16} weight="duotone" className="text-primary" />
          <span className="text-sm font-semibold">{settings.storeName}</span>
        </div>

        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDots size={14} />
          <span className="hidden sm:inline">{dateStr}</span>
          <span>{timeStr}</span>
        </div>
      </header>

      {/* Mobile Cart FAB */}
      {isMobile && cart.length > 0 && (
        <Sheet open={mobileCartOpen} onOpenChange={setMobileCartOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="fixed bottom-4 right-4 z-50 size-14 rounded-full shadow-lg"
            >
              <ShoppingCart size={24} weight="bold" />
              <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                {cartItemCount}
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
            <SheetHeader className="sr-only">
              <SheetTitle>Shopping Cart</SheetTitle>
              <SheetDescription>Your current order items</SheetDescription>
            </SheetHeader>
            {cartPanel}
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Product Grid - Left */}
        <div className="flex-1 overflow-hidden p-4">
          <ProductGrid onAddToCart={addToCart} />
        </div>

        {/* Cart Panel - Right (desktop only) */}
        {!isMobile && (
          <div className="w-80 shrink-0 border-l bg-card p-4 xl:w-96">
            {cartPanel}
          </div>
        )}
      </div>

      {/* Payment Confirm Dialog */}
      {pendingOrder && (
        <PaymentConfirmDialog
          open={!!pendingOrder}
          onClose={() => setPendingOrder(null)}
          items={cart}
          subtotal={pendingOrder.subtotal}
          discount={pendingOrder.discount}
          tax={pendingOrder.tax}
          total={pendingOrder.total}
          onConfirm={handlePaymentConfirm}
        />
      )}

      {/* Order Success / Receipt Dialog */}
      {orderSuccess && (
        <OrderSuccessDialog
          open={!!orderSuccess}
          onClose={() => setOrderSuccess(null)}
          {...orderSuccess}
        />
      )}
    </div>
  )
}
