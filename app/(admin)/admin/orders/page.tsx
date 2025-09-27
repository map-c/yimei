'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { OrderList } from '@/components/admin/orders/OrderList'
import { OrderFilters } from '@/components/admin/orders/OrderFilters'
import { Search, Download, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Order {
  id: string
  orderNumber: string
  totalAmount: number
  paidAmount: number
  paymentStatus: string
  paymentMethod?: string
  paymentType: string
  createdAt: string
  updatedAt: string
  booking: {
    id: string
    customerName: string
    customerPhone: string
    customerEmail?: string
    serviceName: string
    doctorName: string
    appointmentDate: string
    appointmentTime: string
    status: string
  }
}

interface OrderFiltersType {
  search: string
  paymentStatus: string
  paymentMethod: string
  dateFrom: string
  dateTo: string
  amountMin: string
  amountMax: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [filters, setFilters] = useState<OrderFiltersType>({
    search: '',
    paymentStatus: '',
    paymentMethod: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
  })
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    refundedAmount: 0,
    todayRevenue: 0,
  })

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        ),
      })

      const response = await fetch(`/api/admin/orders?${params}`)
      const result = await response.json()

      if (result.success) {
        setOrders(result.data)
        setPagination(result.pagination)
        
        // 计算统计数据
        const totalRevenue = result.data.reduce((sum: number, order: Order) => 
          order.paymentStatus === 'PAID' ? sum + order.paidAmount : sum, 0
        )
        const pendingAmount = result.data.reduce((sum: number, order: Order) => 
          order.paymentStatus === 'PENDING' ? sum + order.totalAmount : sum, 0
        )
        const refundedAmount = result.data.reduce((sum: number, order: Order) => 
          order.paymentStatus === 'REFUNDED' ? sum + order.paidAmount : sum, 0
        )
        
        setStats(prev => ({
          ...prev,
          totalRevenue,
          pendingAmount,
          refundedAmount,
        }))
      } else {
        console.error('Failed to fetch orders:', result.error)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [pagination.page, pagination.limit])

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchOrders()
  }

  const handleFilterChange = (newFilters: Partial<OrderFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        ),
        export: 'true',
      })

      const response = await fetch(`/api/admin/orders/export?${params}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `orders-${new Date().toISOString().split('T')[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export error:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">订单管理</h1>
          <p className="text-muted-foreground">管理所有订单和支付信息</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
          <Button variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            财务报表
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              总收入
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ¥{stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">已完成支付订单</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              待收款
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ¥{stats.pendingAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">待支付订单金额</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              退款金额
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ¥{stats.refundedAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">已退款订单</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              订单总数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {pagination.total}
            </div>
            <p className="text-xs text-muted-foreground">所有订单数量</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索客户姓名、手机号、订单号..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="pl-10"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>搜索</Button>
        </div>

        <OrderFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onApply={handleSearch}
        />
      </div>

      {/* Order List */}
      <OrderList
        orders={orders}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRefresh={fetchOrders}
      />
    </div>
  )
}
