import { useState, useMemo, useRef, useEffect } from "react"
import { Tag, X, CheckCircle, CaretDown, MagnifyingGlass } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import type { Promotion } from "@/lib/types"
import { mockPromotions } from "@/lib/mock-data"
import {
  validatePromoCode,
  calculatePromoDiscount,
} from "@/features/dashboard/services/promotion-service"

interface DiscountSelectorProps {
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

export function DiscountSelector({
  subtotal,
  cartCategoryIds,
  appliedPromo,
  promoDiscount,
  onApplyPromo,
  onRemovePromo,
}: DiscountSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const { eligible, ineligible } = useMemo(() => {
    const active = mockPromotions.filter(
      (p) => p.status === "active"
    )
    const q = search.toLowerCase()
    const filtered = q
      ? active.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.code.toLowerCase().includes(q)
        )
      : active

    const eligible: (Promotion & { discountAmount: number })[] = []
    const ineligible: (Promotion & { reason: string })[] = []

    for (const promo of filtered) {
      const result = validatePromoCode(promo.code, subtotal, cartCategoryIds)
      if (result.valid) {
        const discountAmount = calculatePromoDiscount(promo, subtotal)
        eligible.push({ ...promo, discountAmount })
      } else {
        ineligible.push({ ...promo, reason: result.error || "Not eligible" })
      }
    }

    return { eligible, ineligible }
  }, [search, subtotal, cartCategoryIds])

  const handleSelectPromo = (promo: Promotion & { discountAmount: number }) => {
    onApplyPromo(promo, promo.discountAmount)
    setOpen(false)
    setSearch("")
  }

  // Applied promo chip
  if (appliedPromo) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/60 px-3 py-2 dark:border-emerald-800 dark:bg-emerald-900/20">
        <CheckCircle size={14} weight="fill" className="shrink-0 text-emerald-500" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 truncate">
              {appliedPromo.name}
            </p>
            <Badge variant="outline" className="text-[8px] h-4 px-1 border-emerald-300 text-emerald-600 shrink-0">
              {appliedPromo.code}
            </Badge>
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-medium">
            -{formatCurrency(promoDiscount)} off
          </p>
        </div>
        <button
          onClick={onRemovePromo}
          className="shrink-0 rounded-full p-0.5 text-emerald-500 hover:bg-red-100 hover:text-red-500 transition-colors dark:hover:bg-red-900/20"
        >
          <X size={12} weight="bold" />
        </button>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => {
          setOpen(!open)
          setTimeout(() => inputRef.current?.focus(), 50)
        }}
        className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors hover:bg-muted/50 ${
          open ? "border-primary ring-1 ring-primary/20" : ""
        }`}
      >
        <Tag size={14} weight="duotone" className="shrink-0 text-muted-foreground" />
        <span className="flex-1 text-xs text-muted-foreground">
          Apply discount / promo code
        </span>
        <CaretDown size={12} className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border bg-card shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Search */}
          <div className="relative border-b px-3 py-2">
            <MagnifyingGlass size={12} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search promos or type code..."
              className="w-full bg-transparent pl-5 text-xs outline-none placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Results */}
          <div className="max-h-52 overflow-y-auto p-1.5">
            {eligible.length === 0 && ineligible.length === 0 && (
              <div className="py-4 text-center text-xs text-muted-foreground">
                No promotions found
              </div>
            )}

            {eligible.length > 0 && (
              <div>
                <p className="px-2 py-1 text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Available
                </p>
                {eligible.map((promo) => (
                  <button
                    key={promo.id}
                    onClick={() => handleSelectPromo(promo)}
                    className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-primary/5 active:bg-primary/10"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-900/30">
                      <Tag size={12} weight="bold" className="text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium truncate">{promo.name}</span>
                        <Badge variant="secondary" className="text-[8px] h-3.5 px-1 shrink-0">
                          {promo.code}
                        </Badge>
                      </div>
                      <p className="text-[9px] text-muted-foreground mt-0.5">
                        {promo.type === "percentage" ? `${promo.value}% off` : formatCurrency(promo.value) + " off"}
                        {promo.minOrderAmount > 0 && ` · Min ${formatCurrency(promo.minOrderAmount)}`}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-emerald-600">
                      -{formatCurrency(promo.discountAmount)}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {ineligible.length > 0 && (
              <div className={eligible.length > 0 ? "mt-1 border-t pt-1" : ""}>
                <p className="px-2 py-1 text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Not Eligible
                </p>
                {ineligible.map((promo) => (
                  <div
                    key={promo.id}
                    className="flex items-center gap-2.5 rounded-md px-2.5 py-2 opacity-50"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
                      <Tag size={12} weight="bold" className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium truncate">{promo.name}</span>
                        <Badge variant="outline" className="text-[8px] h-3.5 px-1 shrink-0">
                          {promo.code}
                        </Badge>
                      </div>
                      <p className="text-[9px] text-red-500 mt-0.5">{promo.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
