import { mockShifts } from "@/lib/mock-data"
import type { Shift } from "@/lib/types"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getShiftHistory(): Promise<Shift[]> {
  await delay(300)
  return [...mockShifts].sort((a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime())
}

export async function getCurrentShift(): Promise<Shift | null> {
  await delay(100)
  return mockShifts.find((s) => s.status === "open") || null
}

export async function openShift(openingBalance: number, staffId: string, staffName: string): Promise<Shift> {
  await delay(300)
  const shift: Shift = {
    id: `SHF-${String(Date.now()).slice(-3)}`,
    staffId,
    staffName,
    status: "open",
    openedAt: new Date().toISOString(),
    openingBalance,
    cashSales: 0,
    cardSales: 0,
    qrisSales: 0,
    totalOrders: 0,
    totalRevenue: 0,
  }
  mockShifts.push(shift)
  return shift
}

export async function closeShift(
  shiftId: string,
  closingBalance: number,
  notes?: string
): Promise<Shift | null> {
  await delay(300)
  const idx = mockShifts.findIndex((s) => s.id === shiftId)
  if (idx === -1) return null
  const shift = mockShifts[idx]
  shift.status = "closed"
  shift.closedAt = new Date().toISOString()
  shift.closingBalance = closingBalance
  shift.expectedBalance = shift.openingBalance + shift.cashSales
  if (notes) shift.notes = notes
  return shift
}
