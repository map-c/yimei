'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CustomerList } from '@/components/admin/customers/CustomerList'
import { CustomerSearch } from '@/components/admin/customers/CustomerSearch'
import { Search, Download, Users, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Customer {
  customerName: string
  customerPhone: string
  customerEmail?: string
  customerAge?: string
  totalSpent: number
  bookingCount: number
  lastBooking?: string
  firstBooking?: string
  services: string[]
  doctors: string[]
  customerLevel: string
}

interface CustomerFiltersType {
  search: string
  sortBy: string
  sortOrder: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [filters, setFilters] = useState<CustomerFiltersType>({
    search: '',
    sortBy: 'lastBooking',
    sortOrder: 'desc',
  })
  const [stats, setStats] = useState({
    totalCustomers: 0,
    newCustomersThisMonth: 0,
    vipCustomers: 0,
    averageSpending: 0,
  })

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        ),
      })

      const response = await fetch(`/api/admin/customers?${params}`)
      const result = await response.json()

      if (result.success) {
        setCustomers(result.data)
        setPagination(result.pagination)
        
        // 计算统计数据
        const totalCustomers = result.pagination.total
        const vipCustomers = result.data.filter((c: Customer) => c.customerLevel === 'VIP').length
        const totalSpending = result.data.reduce((sum: number, c: Customer) => sum + c.totalSpent, 0)
        const averageSpending = totalCustomers > 0 ? totalSpending / totalCustomers : 0
        
        // 计算本月新客户（简化计算）
        const thisMonth = new Date().toISOString().slice(0, 7)
        const newCustomersThisMonth = result.data.filter((c: Customer) => 
          c.firstBooking && c.firstBooking.startsWith(thisMonth)
        ).length

        setStats({
          totalCustomers,
          newCustomersThisMonth,
          vipCustomers,
          averageSpending,
        })
      } else {
        console.error('Failed to fetch customers:', result.error)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [pagination.page, pagination.limit])

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchCustomers()
  }

  const handleFilterChange = (newFilters: Partial<CustomerFiltersType>) => {
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

      const response = await fetch(`/api/admin/customers/export?${params}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `customers-${new Date().toISOString().split('T')[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export error:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">客户管理</h1>
          <p className="text-muted-foreground">管理客户信息和消费记录</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
          <Button variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            客户分析
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              总客户数
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalCustomers}
            </div>
            <p className="text-xs text-muted-foreground">
              本月新增: {stats.newCustomersThisMonth}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              VIP客户
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.vipCustomers}
            </div>
            <p className="text-xs text-muted-foreground">
              占比: {stats.totalCustomers > 0 ? ((stats.vipCustomers / stats.totalCustomers) * 100).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              平均消费
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(stats.averageSpending)}
            </div>
            <p className="text-xs text-muted-foreground">每位客户平均</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              客户留存
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {customers.filter(c => c.bookingCount > 1).length}
            </div>
            <p className="text-xs text-muted-foreground">
              复购率: {stats.totalCustomers > 0 ? ((customers.filter(c => c.bookingCount > 1).length / stats.totalCustomers) * 100).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索客户姓名、手机号、邮箱..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="pl-10"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>搜索</Button>
        </div>

        <CustomerSearch
          filters={filters}
          onFilterChange={handleFilterChange}
          onApply={handleSearch}
        />
      </div>

      {/* Customer List */}
      <CustomerList
        customers={customers}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRefresh={fetchCustomers}
      />
    </div>
  )
}
