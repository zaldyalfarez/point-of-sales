import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { MagnifyingGlass, Plus } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { mockStaff } from "@/lib/mock-data"

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

const roleVariant: Record<string, "default" | "secondary" | "outline"> = {
  admin: "default",
  manager: "secondary",
  cashier: "outline",
}

const statusVariant: Record<string, "default" | "destructive"> = {
  active: "default",
  inactive: "destructive",
}

export function StaffPage() {
  const [search, setSearch] = useState("")

  const filteredStaff = useMemo(() => {
    if (!search) return mockStaff
    const q = search.toLowerCase()
    return mockStaff.filter(
      (s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Staff</h1>
        <p className="text-sm text-muted-foreground">Manage staff accounts and roles</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Staff</CardTitle>
              <CardDescription>{filteredStaff.length} staff members</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-full sm:w-56">
                <MagnifyingGlass size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search staff..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button size="sm" asChild>
                <Link to="/dashboard/staff/new">
                  <Plus size={16} className="mr-1" /> Add Staff
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{staff.email}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{staff.phone}</TableCell>
                    <TableCell>
                      <Badge variant={roleVariant[staff.role]} className="capitalize">{staff.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[staff.status]} className="capitalize">{staff.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">
                      {formatDate(staff.lastActiveAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
