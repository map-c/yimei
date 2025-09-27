'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ServiceStatsChartProps {
  data: Array<{
    name: string
    revenue: number
    orders: number
    paidOrders: number
  }>
}

export function ServiceStatsChart({ data }: ServiceStatsChartProps) {
  const formatCurrency = (value: number) => {
    return `¥${(value / 1000).toFixed(1)}k`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{`项目: ${label}`}</p>
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

  // 只显示前8个项目
  const topServices = data.slice(0, 8)

  return (
    <Card>
      <CardHeader>
        <CardTitle>服务项目收入排行</CardTitle>
        <p className="text-sm text-muted-foreground">按收入排序的热门服务项目</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={topServices} 
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              layout="horizontal"
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                type="number"
                tickFormatter={formatCurrency}
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                type="category"
                dataKey="name" 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="revenue" 
                fill="hsl(var(--primary))" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
