import { LoginForm } from "@/features/auth/components/LoginForm"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Storefront } from "@phosphor-icons/react"

export function LoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Storefront size={24} weight="bold" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AK POS</h1>
            <p className="text-sm text-muted-foreground">
              Point of Sales Management System
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} AK POS. All rights reserved.
        </p>
      </div>
    </div>
  )
}
