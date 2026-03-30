import { CheckCircle, Printer } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useStoreSettings } from "@/contexts/StoreSettingsContext"
import type { CartItem, PaymentMethod } from "@/lib/types"

interface OrderSuccessDialogProps {
  open: boolean
  onClose: () => void
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
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

const paymentLabels: Record<PaymentMethod, string> = {
  cash: "Cash",
  debit_card: "Debit Card",
  qris: "QRIS",
}

export function OrderSuccessDialog({
  open,
  onClose,
  orderId,
  items,
  customerName,
  paymentMethod,
  subtotal,
  discount,
  tax,
  total,
  amountPaid,
  change,
}: OrderSuccessDialogProps) {
  const { settings } = useStoreSettings()

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <CheckCircle size={28} weight="fill" className="text-emerald-600" />
          </div>
          <DialogTitle>Order Complete!</DialogTitle>
          <DialogDescription>
            Order {orderId} has been processed successfully
          </DialogDescription>
        </DialogHeader>

        {/* Receipt */}
        <div className="space-y-3 rounded-lg border bg-muted/30 p-4 text-xs">
          <div className="text-center">
            <p className="font-bold text-sm">{settings.storeName}</p>
            <p className="text-muted-foreground text-[10px]">{settings.storeAddress}</p>
            {settings.storePhone && (
              <p className="text-muted-foreground text-[10px]">{settings.storePhone}</p>
            )}
            {settings.receiptHeader && (
              <p className="mt-1 text-[10px] italic text-muted-foreground">{settings.receiptHeader}</p>
            )}
          </div>

          <Separator />

          <div className="flex justify-between">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-mono">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Customer</span>
            <span>{customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment</span>
            <span>{paymentLabels[paymentMethod]}</span>
          </div>

          <Separator />

          {/* Items */}
          <div className="space-y-1.5">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>{formatCurrency(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            {settings.taxEnabled && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{settings.taxLabel} ({Math.round(settings.taxRate * 100)}%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-sm font-bold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            {paymentMethod === "cash" && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid</span>
                  <span>{formatCurrency(amountPaid)}</span>
                </div>
                <div className="flex justify-between font-semibold text-emerald-600">
                  <span>Change</span>
                  <span>{formatCurrency(change)}</span>
                </div>
              </>
            )}
          </div>

          {settings.receiptFooter && (
            <>
              <Separator />
              <p className="text-center text-[10px] text-muted-foreground italic">
                {settings.receiptFooter}
              </p>
            </>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handlePrint}>
            <Printer size={16} className="mr-1" />
            Print
          </Button>
          <Button className="flex-1" onClick={onClose}>
            New Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
