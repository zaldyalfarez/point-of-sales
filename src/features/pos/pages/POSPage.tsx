import { useState, useCallback } from "react"
import { ShoppingCart } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { ProductGrid } from "@/features/pos/components/ProductGrid"
import { CartPanel } from "@/features/pos/components/CartPanel"
import { OrderSuccessDialog } from "@/features/pos/components/OrderSuccessDialog"
import type { CartItem, Product, PaymentMethod } from "@/lib/types"

export function POSPage() {
  const isMobile = useIsMobile()
  const [cart, setCart] = useState<CartItem[]>([])
  const [mobileCartOpen, setMobileCartOpen] = useState(false)
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

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        if (existing.quantity >= product.stock) return prev
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1, discount: 0 }]
    })
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId))
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      )
    }
  }, [])

  const removeItem = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const processOrder = useCallback(
    (data: {
      customerName: string
      paymentMethod: PaymentMethod
      amountPaid: number
      discount: number
      subtotal: number
      tax: number
      total: number
    }) => {
      const orderId = `TXN-${String(Date.now()).slice(-6)}`
      const change = data.paymentMethod === "cash" ? Math.max(0, data.amountPaid - data.total) : 0

      setOrderSuccess({
        orderId,
        items: [...cart],
        customerName: data.customerName,
        paymentMethod: data.paymentMethod,
        subtotal: data.subtotal,
        discount: data.discount,
        tax: data.tax,
        total: data.total,
        amountPaid: data.amountPaid,
        change,
      })

      setCart([])
      setMobileCartOpen(false)
    },
    [cart]
  )

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const cartPanel = (
    <CartPanel
      items={cart}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={removeItem}
      onClearCart={clearCart}
      onProcessOrder={processOrder}
    />
  )

  return (
    <div className="flex h-svh flex-col">
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

      {/* Order Success Dialog */}
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
