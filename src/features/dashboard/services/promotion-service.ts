import { mockPromotions } from "@/lib/mock-data"
import type { Promotion, CreatePromotionRequest } from "@/lib/types"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getPromotions(): Promise<Promotion[]> {
  await delay(300)
  return [...mockPromotions]
}

export async function createPromotion(data: CreatePromotionRequest): Promise<Promotion> {
  await delay(300)
  const promo: Promotion = {
    id: `PRM-${String(Date.now()).slice(-3)}`,
    ...data,
    usedCount: 0,
    status: new Date(data.startDate) > new Date() ? "scheduled" : "active",
    createdAt: new Date().toISOString(),
  }
  mockPromotions.push(promo)
  return promo
}

export async function updatePromotion(id: string, data: Partial<Promotion>): Promise<Promotion | null> {
  await delay(300)
  const idx = mockPromotions.findIndex((p) => p.id === id)
  if (idx === -1) return null
  mockPromotions[idx] = { ...mockPromotions[idx], ...data }
  return mockPromotions[idx]
}

export async function deletePromotion(id: string): Promise<boolean> {
  await delay(300)
  const idx = mockPromotions.findIndex((p) => p.id === id)
  if (idx === -1) return false
  mockPromotions.splice(idx, 1)
  return true
}

export function validatePromoCode(
  code: string,
  subtotal: number,
  cartCategoryIds: string[]
): { valid: boolean; promo?: Promotion; error?: string } {
  const promo = mockPromotions.find((p) => p.code.toUpperCase() === code.toUpperCase())
  if (!promo) return { valid: false, error: "Invalid promo code" }
  if (promo.status !== "active") return { valid: false, error: "This promotion is not currently active" }

  const now = new Date()
  if (new Date(promo.startDate) > now) return { valid: false, error: "Promotion hasn't started yet" }
  if (new Date(promo.endDate) < now) return { valid: false, error: "Promotion has expired" }
  if (promo.usageLimit > 0 && promo.usedCount >= promo.usageLimit)
    return { valid: false, error: "Usage limit reached" }
  if (subtotal < promo.minOrderAmount)
    return { valid: false, error: `Minimum order Rp${promo.minOrderAmount.toLocaleString()} required` }

  if (promo.applicableCategories.length > 0) {
    const hasApplicable = cartCategoryIds.some((cid) => promo.applicableCategories.includes(cid))
    if (!hasApplicable) return { valid: false, error: "No applicable items in cart for this promo" }
  }

  return { valid: true, promo }
}

export function calculatePromoDiscount(promo: Promotion, subtotal: number): number {
  if (promo.type === "fixed") return Math.min(promo.value, subtotal)
  if (promo.type === "percentage") {
    const raw = Math.round(subtotal * (promo.value / 100))
    return promo.maxDiscount > 0 ? Math.min(raw, promo.maxDiscount) : raw
  }
  return 0
}
