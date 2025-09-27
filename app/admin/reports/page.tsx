'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FinancialChart } from '@/components/admin/reports/FinancialChart'
import { ServiceStatsChart } from '@/components/admin/reports/ServiceStatsChart'
import { DoctorStatsChart } from '@/components/admin/reports/DoctorStatsChart'
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users,
  Download,
  Calendar,
  RefreshCw
} from 'lucide-react'

interface FinancialReport {
  period: string
  dateRange: {
    start: string
    end: string
  }
  summary: {
    totalRevenue: number
    totalOrders: number
    paidOrders: number
    pendingAmount: number
    refundedAmount: number
    averageOrderValue: number
    conversionRate: number
  }
  chartData: Array<{
    date: string
    revenue: number
    orders: number
    paidOrders: number
  }>
  serviceStats: Array<{
    name: string
    revenue: number
    orders: number
    paidOrders: number
  }>
  doctorStats: Array<{
    name: string
    revenue: number
    orders: number
    paidOrders: number
  }>
  paymentMethodStats: Array<{
    method: string
    name: string
    revenue: number
    orders: number
  }>
}

export default function ReportsPage() {
  const [report, setReport] = useState<FinancialReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    period: 'monthly',
    dateFrom: '',
    dateTo: '',
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString(),
  })

  const fetchReport = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      if (filters.period) params.append('period', filters.period)
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
      if (filters.dateTo) params.append('dateTo', filters.dateTo)
      if (filters.year) params.append('year', filters.year)
      if (filters.month) params.append('month', filters.month)

      const response = await fetch(`/api/admin/reports/financial?${params}`)
      const result = await response.json()

      if (result.success) {
        setReport(result.data)
      } else {
        console.error('Failed to fetch report:', result.error)
      }
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">财务报表</h1>
          <p className="text-muted-foreground">查看收入统计和业务分析</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchReport} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出报表
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>报表筛选</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>统计周期</Label>
              <Select
                value={filters.period}
                onValueChange={(value) => handleFilterChange('period', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">按日统计</SelectItem>
                  <SelectItem value="weekly">按周统计</SelectItem>
                  <SelectItem value="monthly">按月统计</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>年份</Label>
              <Select
                value={filters.year}
                onValueChange={(value) => handleFilterChange('year', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - i
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}年
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>月份</Label>
              <Select
                value={filters.month}
                onValueChange={(value) => handleFilterChange('month', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}月
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={fetchReport} disabled={loading}>
                生成报表
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="w-full h-4 bg-muted animate-pulse rounded" />
                  <div className="w-20 h-8 bg-muted animate-pulse rounded" />
                  <div className="w-16 h-4 bg-muted animate-pulse rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : report ? (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  总收入
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(report.summary.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDate(report.dateRange.start)} - {formatDate(report.dateRange.end)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  订单总数
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {report.summary.totalOrders}
                </div>
                <p className="text-xs text-muted-foreground">
                  已支付: {report.summary.paidOrders}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  平均订单价值
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(report.summary.averageOrderValue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  转化率: {formatPercentage(report.summary.conversionRate)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  待收款
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(report.summary.pendingAmount)}
                </div>
                <p className="text-xs text-muted-foreground">
                  退款: {formatCurrency(report.summary.refundedAmount)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FinancialChart data={report.chartData} period={report.period} />
            <ServiceStatsChart data={report.serviceStats} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DoctorStatsChart data={report.doctorStats} />
            
            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>支付方式统计</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report.paymentMethodStats.map((method) => (
                    <div key={method.method} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {method.orders} 笔订单
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(method.revenue)}</p>
                        <p className="text-sm text-muted-foreground">
                          {((method.revenue / report.summary.totalRevenue) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>暂无报表数据</p>
        </div>
      )}
    </div>
  )
}
