import { useMemo, useState } from "react"
import { Bell, Warning, Package, X } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { mockProducts } from "@/lib/mock-data"

export function useLowStockProducts() {
  return useMemo(
    () => mockProducts.filter((p) => p.stock <= p.minStock),
    []
  )
}

export function LowStockAlert() {
  const [open, setOpen] = useState(false)
  const lowStockProducts = useLowStockProducts()

  if (lowStockProducts.length === 0) return null

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative size-8"
        onClick={() => setOpen(!open)}
      >
        <Bell size={18} weight={open ? "fill" : "regular"} />
        <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
          {lowStockProducts.length}
        </span>
      </Button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 top-10 z-50 w-80 rounded-lg border bg-card shadow-lg">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <Warning size={14} weight="fill" className="text-amber-500" />
                <span className="text-sm font-semibold">Low Stock Alerts</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            </div>
            <Separator />
            <ScrollArea className="max-h-72">
              <div className="p-2 space-y-1">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                      <Package size={14} weight="duotone" className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{product.name}</p>
                      <p className="text-[10px] text-muted-foreground">{product.category}</p>
                    </div>
                    <Badge
                      variant={product.stock === 0 ? "destructive" : "secondary"}
                      className="text-[9px] shrink-0"
                    >
                      {product.stock === 0 ? "Out" : `${product.stock}/${product.minStock}`}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <div className="p-2">
              <p className="text-center text-[10px] text-muted-foreground">
                {lowStockProducts.length} item{lowStockProducts.length > 1 ? "s" : ""} need restocking
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
