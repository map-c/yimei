'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface RevenueChartProps {
  data?: Array<{
    date: string
    revenue: number
    bookings: number
  }>
  loading?: boolean
}

// 模拟数据 - 后续会从API获取
const mockData = [
  { date: '12-01', revenue: 12500, bookings: 8 },
  { date: '12-02', revenue: 15200, bookings: 12 },
  { date: '12-03', revenue: 8900, bookings: 6 },
  { date: '12-04', revenue: 18600, bookings: 15 },
  { date: '12-05', revenue: 22100, bookings: 18 },
  { date: '12-06', revenue: 16800, bookings: 13 },
  { date: '12-07', revenue: 19500, bookings: 16 },
  { date: '12-08', revenue: 14200, bookings: 11 },
  { date: '12-09', revenue: 25800, bookings: 21 },
  { date: '12-10', revenue: 20300, bookings: 17 },
  { date: '12-11', revenue: 17900, bookings: 14 },
  { date: '12-12', revenue: 23400, bookings: 19 },
  { date: '12-13', revenue: 18700, bookings: 15 },
  { date: '12-14', revenue: 21600, bookings: 18 },
]

export function RevenueChart({ data = mockData, loading }: RevenueChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>收入趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) => {
    return `¥${(value / 1000).toFixed(1)}k`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{`日期: ${label}`}</p>
          <p className="text-sm text-primary">
            {`收入: ¥${payload[0].value.toLocaleString()}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {`预约数: ${payload[0].payload.bookings}`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>收入趋势</CardTitle>
        <p className="text-sm text-muted-foreground">最近14天的收入变化</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
