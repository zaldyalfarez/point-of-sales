import { useState } from "react"
import { Tag, X, CheckCircle, WarningCircle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Promotion } from "@/lib/types"
import {
  validatePromoCode,
  calculatePromoDiscount,
} from "@/features/dashboard/services/promotion-service"

interface PromoCodeInputProps {
  subtotal: number
  cartCategoryIds: string[]
  appliedPromo: Promotion | null
  promoDiscount: number
  onApplyPromo: (promo: Promotion, discount: number) => void
  onRemovePromo: () => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function PromoCodeInput({
  subtotal,
  cartCategoryIds,
  appliedPromo,
  promoDiscount,
  onApplyPromo,
  onRemovePromo,
}: PromoCodeInputProps) {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")

  const handleApply = () => {
    if (!code.trim()) return
    const result = validatePromoCode(code.trim(), subtotal, cartCategoryIds)
    if (result.valid && result.promo) {
      const discount = calculatePromoDiscount(result.promo, subtotal)
      onApplyPromo(result.promo, discount)
      setCode("")
      setError("")
    } else {
      setError(result.error || "Invalid code")
    }
  }

  if (appliedPromo) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50/60 px-2.5 py-1.5 dark:border-emerald-800 dark:bg-emerald-900/20">
        <CheckCircle size={14} weight="fill" className="shrink-0 text-emerald-500" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 truncate">
            {appliedPromo.code} — {appliedPromo.name}
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-500">
            -{formatCurrency(promoDiscount)}
          </p>
        </div>
        <button
          onClick={onRemovePromo}
          className="shrink-0 text-emerald-500 hover:text-red-500 transition-colors"
        >
          <X size={12} weight="bold" />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex gap-1.5">
        <div className="relative flex-1">
          <Tag size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase())
              setError("")
            }}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder="Promo code"
            className="h-7 pl-6 text-[10px] font-mono uppercase"
          />
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-2.5 text-[10px]"
          onClick={handleApply}
          disabled={!code.trim()}
        >
          Apply
        </Button>
      </div>
      {error && (
        <p className="flex items-center gap-1 text-[10px] text-red-500">
          <WarningCircle size={10} weight="fill" />
          {error}
        </p>
      )}
    </div>
  )
}
