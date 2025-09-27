'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface FinancialChartProps {
  data: Array<{
    date: string
    revenue: number
    orders: number
    paidOrders: number
  }>
  period: string
}

export function FinancialChart({ data, period }: FinancialChartProps) {
  const formatCurrency = (value: number) => {
    return `¥${(value / 1000).toFixed(1)}k`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    if (period === 'daily') {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
    } else if (period === 'weekly') {
      return `${date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}`
    } else {
      return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' })
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{`时间: ${formatDate(label)}`}</p>
          <p className="text-sm text-primary">
            {`收入: ¥${payload[0].value.toLocaleString()}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {`订单数: ${payload[0].payload.orders}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {`已支付: ${payload[0].payload.paidOrders}`}
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
        <p className="text-sm text-muted-foreground">
          {period === 'daily' && '每日收入统计'}
          {period === 'weekly' && '每周收入统计'}
          {period === 'monthly' && '每月收入统计'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
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
