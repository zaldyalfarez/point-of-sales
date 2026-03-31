import { useState, useMemo, useEffect } from "react"
import {
  Backspace,
  CurrencyDollar,
  CreditCard,
  QrCode,
  CheckCircle,
  ArrowLeft,
  Coins,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { CartItem, PaymentMethod } from "@/lib/types"

interface PaymentConfirmDialogProps {
  open: boolean
  onClose: () => void
  items: CartItem[]
  subtotal: number
  discount: number
  tax: number
  total: number
  onConfirm: (paymentMethod: PaymentMethod, amountPaid: number) => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function getItemPrice(item: CartItem): number {
  const base = item.product.price
  const adj = item.selectedVariant?.priceAdjustment ?? 0
  return base + adj
}

const paymentOptions: { value: PaymentMethod; label: string; icon: typeof CurrencyDollar }[] = [
  { value: "cash", label: "Cash", icon: Coins },
  { value: "debit_card", label: "Debit Card", icon: CreditCard },
  { value: "qris", label: "QRIS", icon: QrCode },
]

export function PaymentConfirmDialog({
  open,
  onClose,
  items,
  subtotal,
  discount,
  tax,
  total,
  onConfirm,
}: PaymentConfirmDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [amountStr, setAmountStr] = useState("")

  const amountPaid = Number(amountStr) || 0
  const change = Math.max(0, amountPaid - total)
  const canConfirm = paymentMethod
    ? paymentMethod !== "cash" || amountPaid >= total
    : false
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  const quickAmounts = useMemo(() => {
    const base = Math.ceil(total / 1000) * 1000
    const amounts = [base]
    const steps = [5000, 10000, 20000, 50000]
    for (const step of steps) {
      const rounded = Math.ceil(total / step) * step
      if (rounded > base && !amounts.includes(rounded)) amounts.push(rounded)
    }
    // Add a few nice round numbers above total
    for (const nice of [50000, 100000, 200000, 500000]) {
      if (nice >= total && !amounts.includes(nice)) amounts.push(nice)
    }
    return amounts.slice(0, 6).sort((a, b) => a - b)
  }, [total])

  const handleNumpad = (key: string) => {
    if (key === "backspace") {
      setAmountStr((s) => s.slice(0, -1))
    } else if (key === "clear") {
      setAmountStr("")
    } else if (key === "000") {
      setAmountStr((s) => (s.length > 0 ? s + "000" : s))
    } else {
      setAmountStr((s) => {
        if (s === "0" && key === "0") return s
        const next = s + key
        if (Number(next) > 99999999) return s
        return next
      })
    }
  }

  // Keyboard support for cash numpad
  useEffect(() => {
    if (!open || paymentMethod !== "cash") return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleNumpad(e.key)
      } else if (e.key === "Backspace") {
        e.preventDefault()
        handleNumpad("backspace")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  })

  const handleClose = () => {
    setPaymentMethod(null)
    setAmountStr("")
    onClose()
  }

  const handleConfirm = () => {
    if (!paymentMethod) return
    const paid = paymentMethod === "cash" ? amountPaid : total
    onConfirm(paymentMethod, paid)
    setPaymentMethod(null)
    setAmountStr("")
  }

  const handleBack = () => {
    setPaymentMethod(null)
    setAmountStr("")
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        {!paymentMethod ? (
          <>
            {/* Step 1: Choose payment method */}
            <DialogHeader className="p-5 pb-3">
              <DialogTitle>Choose Payment Method</DialogTitle>
              <DialogDescription>
                {itemCount} item{itemCount > 1 ? "s" : ""} — Total: {formatCurrency(total)}
              </DialogDescription>
            </DialogHeader>

            <div className="px-5 pb-2">
              {/* Order summary */}
              <div className="rounded-lg bg-muted/50 p-3 space-y-1 text-xs mb-4">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedVariant?.id ?? ""}`}>
                    <div className="flex justify-between">
                      <span className="truncate mr-2">
                        {item.product.name}
                        {item.selectedVariant && ` (${item.selectedVariant.name})`}
                        {" × "}{item.quantity}
                      </span>
                      <span className="shrink-0 font-medium">
                        {formatCurrency(getItemPrice(item) * item.quantity)}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-[9px] text-amber-600 dark:text-amber-400 italic ml-2">
                        📝 {item.notes}
                      </p>
                    )}
                  </div>
                ))}
                <Separator className="my-1.5" />
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
                {tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                )}
                <Separator className="my-1.5" />
                <div className="flex justify-between text-sm font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Payment buttons */}
            <div className="grid grid-cols-3 gap-3 px-5 pb-5">
              {paymentOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setPaymentMethod(opt.value)
                    setAmountStr("")
                  }}
                  className="flex flex-col items-center gap-2 rounded-xl border-2 bg-card p-4 transition-all hover:border-primary hover:shadow-md active:scale-[0.97]"
                >
                  <div className="flex size-11 items-center justify-center rounded-full bg-primary/10">
                    <opt.icon size={22} weight="duotone" className="text-primary" />
                  </div>
                  <span className="text-xs font-semibold">{opt.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : paymentMethod === "cash" ? (
          <>
            {/* Step 2: Cash numpad */}
            <div className="p-5 pb-3">
              <div className="flex items-center gap-2 mb-3">
                <button onClick={handleBack} className="text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h3 className="text-sm font-semibold">Cash Payment</h3>
                  <p className="text-[10px] text-muted-foreground">Total: {formatCurrency(total)}</p>
                </div>
              </div>

              {/* Amount display */}
              <div className="rounded-lg border-2 bg-muted/30 p-4 text-center mb-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Amount Tendered</p>
                <p className={`text-3xl font-bold font-mono tracking-tight ${amountPaid > 0 ? "" : "text-muted-foreground/40"}`}>
                  {amountPaid > 0 ? formatCurrency(amountPaid) : "Rp0"}
                </p>
                {amountPaid > 0 && amountPaid >= total && (
                  <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Change: {formatCurrency(change)}
                  </div>
                )}
                {amountPaid > 0 && amountPaid < total && (
                  <p className="mt-1 text-[10px] text-red-500 font-medium">
                    Need {formatCurrency(total - amountPaid)} more
                  </p>
                )}
              </div>

              {/* Quick amounts */}
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAmountStr(String(amt))}
                    className={`rounded-lg border px-2 py-2 text-xs font-semibold transition-all hover:bg-primary hover:text-primary-foreground active:scale-[0.96] ${
                      amountPaid === amt ? "bg-primary text-primary-foreground border-primary" : ""
                    }`}
                  >
                    {formatCurrency(amt)}
                  </button>
                ))}
              </div>
            </div>

            {/* Numpad grid */}
            <div className="grid grid-cols-3 gap-px bg-border">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "000", "0", "backspace"].map((key) => (
                <button
                  key={key}
                  onClick={() => handleNumpad(key)}
                  className="flex h-14 items-center justify-center bg-card text-lg font-semibold transition-colors hover:bg-muted active:bg-muted/70"
                >
                  {key === "backspace" ? <Backspace size={22} /> : key}
                </button>
              ))}
            </div>

            {/* Confirm button */}
            <div className="p-4">
              <Button
                className="w-full h-12 text-base"
                size="lg"
                disabled={!canConfirm}
                onClick={handleConfirm}
              >
                <CheckCircle size={18} className="mr-2" />
                Confirm Payment — {formatCurrency(total)}
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Step 2: Card / QRIS confirmation */}
            <div className="p-5 pb-3">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={handleBack} className="text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h3 className="text-sm font-semibold">
                    {paymentMethod === "debit_card" ? "Debit Card" : "QRIS"} Payment
                  </h3>
                  <p className="text-[10px] text-muted-foreground">Confirm to process</p>
                </div>
              </div>

              <div className="flex flex-col items-center py-6">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 mb-3">
                  {paymentMethod === "debit_card" ? (
                    <CreditCard size={32} weight="duotone" className="text-primary" />
                  ) : (
                    <QrCode size={32} weight="duotone" className="text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1">Amount to charge</p>
                <p className="text-3xl font-bold">{formatCurrency(total)}</p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <Button
                className="w-full h-12 text-base"
                size="lg"
                onClick={handleConfirm}
              >
                <CheckCircle size={18} className="mr-2" />
                Confirm Payment
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
