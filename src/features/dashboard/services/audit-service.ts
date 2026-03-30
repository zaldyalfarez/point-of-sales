import { mockAuditLog } from "@/lib/mock-data"
import type { AuditLogEntry, AuditAction } from "@/lib/types"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export interface AuditLogFilters {
  action?: AuditAction
  staffId?: string
  startDate?: string
  endDate?: string
}

export async function getAuditLog(filters?: AuditLogFilters): Promise<AuditLogEntry[]> {
  await delay(300)
  let results = [...mockAuditLog]

  if (filters?.action) {
    results = results.filter((e) => e.action === filters.action)
  }
  if (filters?.staffId) {
    results = results.filter((e) => e.staffId === filters.staffId)
  }
  if (filters?.startDate) {
    results = results.filter((e) => new Date(e.createdAt) >= new Date(filters.startDate!))
  }
  if (filters?.endDate) {
    results = results.filter((e) => new Date(e.createdAt) <= new Date(filters.endDate!))
  }

  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function logAction(
  action: AuditAction,
  description: string,
  staffId: string,
  staffName: string,
  metadata?: Record<string, string | number>
): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: `AUD-${String(Date.now()).slice(-3)}`,
    action,
    description,
    staffId,
    staffName,
    metadata,
    createdAt: new Date().toISOString(),
  }
  mockAuditLog.unshift(entry)
  return entry
}
