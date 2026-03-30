import type { Icon } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendUp, TrendDown } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string
  trend: number
  icon: Icon
  className?: string
}

export function StatsCard({ title, value, trend, icon: IconComponent, className }: StatsCardProps) {
  const isPositive = trend >= 0

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <IconComponent size={20} weight="duotone" className="text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className={cn(
          "mt-1 flex items-center gap-1 text-xs",
          isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
        )}>
          {isPositive ? <TrendUp size={14} weight="bold" /> : <TrendDown size={14} weight="bold" />}
          <span>{isPositive ? "+" : ""}{trend}% from last month</span>
        </div>
      </CardContent>
    </Card>
  )
}
