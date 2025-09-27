import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: string | number
    type: 'increase' | 'decrease'
  }
  icon?: React.ComponentType<{ className?: string }>
  loading?: boolean
}

export function StatsCard({ title, value, change, icon: Icon, loading }: StatsCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-20" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      // 如果是金额（大于1000的数字），格式化为货币
      if (val >= 1000) {
        return val.toLocaleString()
      }
      return val.toString()
    }
    return val
  }

  const formatChange = (changeValue: string | number) => {
    if (typeof changeValue === 'number') {
      return changeValue > 0 ? `+${changeValue}` : changeValue.toString()
    }
    return changeValue
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">
          {formatValue(value)}
        </div>
        {change && (
          <div className="flex items-center space-x-1 text-xs">
            {change.type === 'increase' ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={cn(
              "font-medium",
              change.type === 'increase' ? 'text-green-500' : 'text-red-500'
            )}>
              {formatChange(change.value)}
            </span>
            <span className="text-muted-foreground">较上期</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
