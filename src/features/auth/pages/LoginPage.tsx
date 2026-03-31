import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  Storefront,
  EnvelopeSimple,
  Lock,
  Eye,
  EyeSlash,
  SignIn,
  Numpad,
  Backspace,
  ArrowLeft,
  Phone,
  WhatsappLogo,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { mockStaff } from "@/lib/mock-data"
import type { Staff } from "@/lib/types"

// Mock PINs for demo
const staffPins: Record<string, string> = {
  "STF-001": "1234",
  "STF-002": "5678",
  "STF-003": "9012",
  "STF-004": "3456",
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const avatarColors = [
  "from-violet-500 to-purple-600",
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
]

function getAvatarColor(index: number) {
  return avatarColors[index % avatarColors.length]
}

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  cashier: "Cashier",
  manager: "Manager",
}

/** PIN Entry Dialog */
function PinDialog({
  staff,
  open,
  onClose,
  onSuccess,
}: {
  staff: Staff | null
  open: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [shake, setShake] = useState(false)
  const [success, setSuccess] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  const staffId = staff?.id

  const doLogin = useCallback(() => {
    if (!staff) return
    setSuccess(true)
    localStorage.setItem("auth_token", "mock-token")
    localStorage.setItem(
      "auth_user",
      JSON.stringify({
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
      })
    )
    setTimeout(() => {
      setSuccess(false)
      onSuccess()
    }, 400)
  }, [staff, onSuccess])

  const doError = useCallback(() => {
    setError("Incorrect PIN")
    setShake(true)
    setTimeout(() => {
      setShake(false)
      setPin("")
    }, 500)
  }, [])

  // Auto-submit when PIN reaches 4 digits
  useEffect(() => {
    if (pin.length === 4 && staffId) {
      const correctPin = staffPins[staffId]
      const frameId = requestAnimationFrame(() => {
        if (pin === correctPin) {
          doLogin()
        } else {
          doError()
        }
      })
      return () => cancelAnimationFrame(frameId)
    }
  }, [pin, staffId, doLogin, doError])

  // Keyboard support
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (success) return
      if (e.key >= "0" && e.key <= "9" && pin.length < 4) {
        setPin((s) => s + e.key)
        setError("")
      } else if (e.key === "Backspace") {
        setPin((s) => s.slice(0, -1))
        setError("")
      } else if (e.key === "Escape") {
        setPin("")
        setError("")
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, pin, success, onClose])

  if (!staff) return null

  const handleNumpadKey = (key: string) => {
    if (success) return
    if (key === "backspace") {
      setPin((s) => s.slice(0, -1))
      setError("")
    } else if (key === "clear") {
      setPin("")
      setError("")
    } else if (pin.length < 4) {
      setPin((s) => s + key)
      setError("")
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setPin("")
      setError("")
      setSuccess(false)
      onClose()
    }
  }

  const staffIndex = mockStaff.findIndex((s) => s.id === staff.id)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        ref={dialogRef}
        className="max-w-xs gap-0 overflow-hidden p-0"
      >
        <DialogHeader className="p-6 pb-4 text-center">
          <div className="mx-auto mb-3">
            <div
              className={`flex size-16 items-center justify-center rounded-full bg-linear-to-br ${getAvatarColor(staffIndex)} text-xl font-bold text-white shadow-lg transition-transform ${success ? "scale-110" : ""}`}
            >
              {success ? "✓" : getInitials(staff.name)}
            </div>
          </div>
          <DialogTitle className="text-base">{staff.name}</DialogTitle>
          <DialogDescription className="text-xs">
            {success ? "Welcome back!" : "Enter your 4-digit PIN"}
          </DialogDescription>
        </DialogHeader>

        {/* PIN dots */}
        <div className="px-6 pb-4">
          <div
            className={`mb-2 flex justify-center gap-3 ${shake ? "animate-shake" : ""}`}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`size-3.5 rounded-full border-2 transition-all duration-200 ${
                  success
                    ? "scale-110 border-emerald-500 bg-emerald-500"
                    : i < pin.length
                      ? "scale-110 border-primary bg-primary"
                      : "border-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          {error && (
            <p className="mt-1 text-center text-[10px] font-medium text-red-500">
              {error}
            </p>
          )}
          <p className="mt-2 text-center text-[10px] text-muted-foreground/50">
            You can also type using your keyboard
          </p>
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-px bg-border">
          {[
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "clear",
            "0",
            "backspace",
          ].map((key) => (
            <button
              key={key}
              onClick={() => handleNumpadKey(key)}
              disabled={success}
              className={`flex h-14 items-center justify-center bg-card text-lg font-semibold transition-colors hover:bg-muted active:bg-muted/70 disabled:opacity-50 ${
                key === "clear" ? "text-xs text-muted-foreground" : ""
              }`}
            >
              {key === "backspace" ? (
                <Backspace size={20} />
              ) : key === "clear" ? (
                "Clear"
              ) : (
                key
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function LoginPage() {
  const navigate = useNavigate()

  // Login form state
  const [email, setEmail] = useState("ahmad.rizal@akpos.com")
  const [password, setPassword] = useState("password")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  // PIN login state
  const [showPinLogin, setShowPinLogin] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [pinDialogOpen, setPinDialogOpen] = useState(false)

  // Check if there were previous sessions
  const activeStaff = mockStaff.filter((s) => s.status === "active")
  const hasPreviousSession = activeStaff.length > 0

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError("")

    await new Promise((r) => setTimeout(r, 800))

    // Mock validation
    const staff = mockStaff.find((s) => s.email === email)
    if (staff) {
      localStorage.setItem("auth_token", "mock-token")
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          id: staff.id,
          name: staff.name,
          email: staff.email,
          role: staff.role,
        })
      )
      setIsLoading(false)
      navigate("/dashboard")
    } else {
      setLoginError("Invalid email or password. Please try again.")
      setIsLoading(false)
    }
  }

  const handlePinSuccess = () => {
    setPinDialogOpen(false)
    setSelectedStaff(null)
    navigate("/dashboard")
  }

  const handleStaffSelect = (staff: Staff) => {
    setSelectedStaff(staff)
    setPinDialogOpen(true)
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/30 p-6">
      {/* Logo */}
      <div className="mb-6 flex items-center gap-2.5">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Storefront size={22} weight="bold" />
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight">Arsitek Kode</span>
          <p className="-mt-0.5 text-[10px] text-muted-foreground">
            Point of Sale System
          </p>
        </div>
      </div>

      <Card className="w-full max-w-sm shadow-sm">
        {!showPinLogin ? (
          <>
            <CardHeader className="pb-2 text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <EnvelopeSimple
                      size={16}
                      className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@akpos.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setLoginError("")
                      }}
                      required
                      disabled={isLoading}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setLoginError("")
                      }}
                      required
                      disabled={isLoading}
                      className="pr-10 pl-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeSlash size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {loginError}
                  </div>
                )}

                <Button
                  type="submit"
                  className="h-10 w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </div>
                  ) : (
                    <>
                      <SignIn size={16} className="mr-1.5" />
                      Sign in
                    </>
                  )}
                </Button>
              </form>

              {/* PIN Login Option */}
              {hasPreviousSession && (
                <>
                  <div className="relative mt-6 mb-5">
                    <Separator />
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                      or
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    className="h-10 w-full gap-2"
                    onClick={() => setShowPinLogin(true)}
                  >
                    <Numpad size={16} weight="duotone" />
                    Sign in with PIN
                  </Button>
                </>
              )}
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="pb-2">
              <button
                onClick={() => setShowPinLogin(false)}
                className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft size={14} />
                Back to email login
              </button>
              <CardTitle className="text-xl">Quick Login</CardTitle>
              <CardDescription>
                Select your account and enter your PIN
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activeStaff.map((staff, index) => (
                  <button
                    key={staff.id}
                    onClick={() => handleStaffSelect(staff)}
                    className="flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm active:scale-[0.98]"
                  >
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${getAvatarColor(index)} text-sm font-bold text-white shadow-sm`}
                    >
                      {getInitials(staff.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {staff.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {roleLabels[staff.role]}
                      </p>
                    </div>
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Numpad size={14} className="text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </>
        )}

        {/* ── Footer ───────────────────────────────── */}
        <div className="mt-auto w-full max-w-sm">
          <div className="space-y-2 text-center">
            <p className="text-[11px] text-muted-foreground">
              Forgot your password or PIN?
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="tel:+6281234567890"
                className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone size={12} weight="duotone" />
                Call Owner
              </a>
              <span className="text-muted-foreground/40">|</span>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <WhatsappLogo size={12} weight="duotone" />
                WhatsApp Owner
              </a>
            </div>
            <p className="pt-1 text-[10px] text-muted-foreground/60">
              © {new Date().getFullYear()} Arsitek Kode
            </p>
          </div>
        </div>
      </Card>

      {/* PIN Dialog */}
      <PinDialog
        staff={selectedStaff}
        open={pinDialogOpen}
        onClose={() => {
          setPinDialogOpen(false)
          setSelectedStaff(null)
        }}
        onSuccess={handlePinSuccess}
      />
    </div>
  )
}
