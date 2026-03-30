import { useState, useEffect } from "react"
import {
  Clock,
  Play,
  Stop,
  CashRegister,
  Warning,
  CheckCircle,
  ArrowUp,
  ArrowDown,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Shift } from "@/lib/types"
import {
  getShiftHistory,
  getCurrentShift,
  openShift,
  closeShift,
} from "@/features/dashboard/services/shift-service"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

function formatDuration(start: string, end?: string) {
  const s = new Date(start).getTime()
  const e = end ? new Date(end).getTime() : Date.now()
  const hours = Math.floor((e - s) / 3600000)
  const mins = Math.floor(((e - s) % 3600000) / 60000)
  return `${hours}h ${mins}m`
}

export function ShiftManagementPage() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [currentShift, setCurrentShift] = useState<Shift | null>(null)
  const [openDialogOpen, setOpenDialogOpen] = useState(false)
  const [closeDialogOpen, setCloseDialogOpen] = useState(false)
  const [openingBalance, setOpeningBalance] = useState(500000)
  const [closingBalance, setClosingBalance] = useState(0)
  const [closingNotes, setClosingNotes] = useState("")
  const [expandedShiftId, setExpandedShiftId] = useState<string | null>(null)

  const loadData = async () => {
    const [history, active] = await Promise.all([getShiftHistory(), getCurrentShift()])
    setShifts(history)
    setCurrentShift(active)
  }

  useEffect(() => {
    void (async () => {
      const [history, active] = await Promise.all([getShiftHistory(), getCurrentShift()])
      setShifts(history)
      setCurrentShift(active)
    })()
  }, [])

  const handleOpenShift = async () => {
    await openShift(openingBalance, "STF-002", "Rina Kartini")
    setOpenDialogOpen(false)
    setOpeningBalance(500000)
    await loadData()
  }

  const handleCloseShift = async () => {
    if (!currentShift) return
    await closeShift(currentShift.id, closingBalance, closingNotes || undefined)
    setCloseDialogOpen(false)
    setClosingBalance(0)
    setClosingNotes("")
    await loadData()
  }

  const expectedCash = currentShift ? currentShift.openingBalance + currentShift.cashSales : 0
  const cashDifference = closingBalance - expectedCash

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Shift Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage cash register shifts and reconciliation
        </p>
      </div>

      {/* Current Shift Banner */}
      {currentShift ? (
        <Card className="border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <CashRegister size={16} weight="duotone" className="text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Active Shift</CardTitle>
                  <CardDescription>
                    {currentShift.staffName} — Started {formatDateTime(currentShift.openedAt)} ({formatDuration(currentShift.openedAt)})
                  </CardDescription>
                </div>
              </div>
              <Button variant="destructive" size="sm" onClick={() => {
                setClosingBalance(currentShift.openingBalance + currentShift.cashSales)
                setCloseDialogOpen(true)
              }}>
                <Stop size={14} className="mr-1" />
                Close Shift
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-white/60 dark:bg-white/5 p-3">
                <p className="text-xs text-muted-foreground">Opening Balance</p>
                <p className="text-lg font-bold">{formatCurrency(currentShift.openingBalance)}</p>
              </div>
              <div className="rounded-lg bg-white/60 dark:bg-white/5 p-3">
                <p className="text-xs text-muted-foreground">Cash Sales</p>
                <p className="text-lg font-bold">{formatCurrency(currentShift.cashSales)}</p>
              </div>
              <div className="rounded-lg bg-white/60 dark:bg-white/5 p-3">
                <p className="text-xs text-muted-foreground">Total Orders</p>
                <p className="text-lg font-bold">{currentShift.totalOrders}</p>
              </div>
              <div className="rounded-lg bg-white/60 dark:bg-white/5 p-3">
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-lg font-bold">{formatCurrency(currentShift.totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-3">
              <Clock size={24} weight="thin" className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold">No Active Shift</h3>
            <p className="text-sm text-muted-foreground mb-4">Open a shift to start tracking cash register activity</p>
            <Button onClick={() => setOpenDialogOpen(true)}>
              <Play size={14} className="mr-1" />
              Open Shift
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Shift History */}
      <Card>
        <CardHeader>
          <CardTitle>Shift History</CardTitle>
          <CardDescription>Past cash register shifts and reconciliation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead className="hidden sm:table-cell">Duration</TableHead>
                  <TableHead className="hidden md:table-cell">Opening</TableHead>
                  <TableHead className="hidden md:table-cell">Closing</TableHead>
                  <TableHead className="hidden lg:table-cell">Difference</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.map((shift) => {
                  const diff = shift.closingBalance != null && shift.expectedBalance != null
                    ? shift.closingBalance - shift.expectedBalance
                    : null
                  return (
                    <>
                      <TableRow
                        key={shift.id}
                        className="cursor-pointer"
                        onClick={() => setExpandedShiftId(expandedShiftId === shift.id ? null : shift.id)}
                      >
                        <TableCell className="text-xs font-mono whitespace-nowrap">
                          {formatDateTime(shift.openedAt)}
                        </TableCell>
                        <TableCell className="font-medium text-sm">{shift.staffName}</TableCell>
                        <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                          {formatDuration(shift.openedAt, shift.closedAt)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs">
                          {formatCurrency(shift.openingBalance)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs">
                          {shift.closingBalance != null ? formatCurrency(shift.closingBalance) : "—"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {diff != null ? (
                            <span className={`flex items-center gap-0.5 text-xs font-semibold ${
                              diff === 0 ? "text-muted-foreground" : diff > 0 ? "text-emerald-600" : "text-red-500"
                            }`}>
                              {diff > 0 ? <ArrowUp size={10} /> : diff < 0 ? <ArrowDown size={10} /> : null}
                              {diff === 0 ? "Exact" : formatCurrency(Math.abs(diff))}
                            </span>
                          ) : "—"}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-sm">
                          {formatCurrency(shift.totalRevenue)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={shift.status === "open" ? "default" : "secondary"}
                            className="capitalize text-[10px]"
                          >
                            {shift.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      {expandedShiftId === shift.id && (
                        <TableRow key={`${shift.id}-detail`}>
                          <TableCell colSpan={8} className="bg-muted/30">
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 p-2">
                              <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Cash Sales</p>
                                <p className="text-sm font-semibold">{formatCurrency(shift.cashSales)}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Card Sales</p>
                                <p className="text-sm font-semibold">{formatCurrency(shift.cardSales)}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">QRIS Sales</p>
                                <p className="text-sm font-semibold">{formatCurrency(shift.qrisSales)}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Orders</p>
                                <p className="text-sm font-semibold">{shift.totalOrders}</p>
                              </div>
                              {shift.notes && (
                                <div className="sm:col-span-2 lg:col-span-4">
                                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Notes</p>
                                  <p className="text-sm">{shift.notes}</p>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Open Shift Dialog */}
      <Dialog open={openDialogOpen} onOpenChange={setOpenDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Open New Shift</DialogTitle>
            <DialogDescription>
              Count the cash in the register and enter the opening balance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Opening Cash Balance</Label>
              <Input
                type="number"
                value={openingBalance || ""}
                onChange={(e) => setOpeningBalance(Number(e.target.value))}
                placeholder="500000"
              />
              <p className="text-xs text-muted-foreground">Amount of cash currently in the register</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleOpenShift} disabled={openingBalance <= 0}>
              <Play size={14} className="mr-1" />
              Open Shift
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Close Shift Dialog */}
      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Close Shift</DialogTitle>
            <DialogDescription>
              Count the cash in the register and reconcile
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-lg bg-muted/50 p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Opening Balance</span>
                <span className="font-medium">{formatCurrency(currentShift?.openingBalance ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cash Sales</span>
                <span className="font-medium">+ {formatCurrency(currentShift?.cashSales ?? 0)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Expected Cash</span>
                <span>{formatCurrency(expectedCash)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Counted Cash Amount</Label>
              <Input
                type="number"
                value={closingBalance || ""}
                onChange={(e) => setClosingBalance(Number(e.target.value))}
                placeholder="Enter counted amount"
              />
            </div>

            {closingBalance > 0 && (
              <div className={`flex items-center gap-2 rounded-lg p-3 text-sm font-semibold ${
                cashDifference === 0
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                  : cashDifference > 0
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
              }`}>
                {cashDifference === 0 ? (
                  <><CheckCircle size={16} weight="fill" /> Cash matches exactly</>
                ) : cashDifference > 0 ? (
                  <><ArrowUp size={16} weight="bold" /> Over by {formatCurrency(cashDifference)}</>
                ) : (
                  <><Warning size={16} weight="fill" /> Short by {formatCurrency(Math.abs(cashDifference))}</>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                value={closingNotes}
                onChange={(e) => setClosingNotes(e.target.value)}
                placeholder="Any notes about the shift..."
                rows={2}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCloseDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleCloseShift} disabled={closingBalance <= 0}>
              <Stop size={14} className="mr-1" />
              Close Shift
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
