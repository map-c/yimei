'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatsCard } from '@/components/admin/dashboard/StatsCard'
import { RecentBookings } from '@/components/admin/dashboard/RecentBookings'
import { RevenueChart } from '@/components/admin/dashboard/RevenueChart'
import { 
  Calendar, 
  ShoppingCart, 
  Users, 
  DollarSign,
  Plus,
  FileText
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  todayBookings: {
    value: number
    change: number
    changeType: 'increase' | 'decrease'
  }
  monthlyRevenue: {
    value: number
    change: string
    changeType: 'increase' | 'decrease'
  }
  pendingOrders: {
    value: number
    change: number
    changeType: 'increase' | 'decrease'
  }
  totalCustomers: {
    value: number
    change: number
    changeType: 'increase' | 'decrease'
  }
}

interface RecentActivity {
  recentBookings: any[]
  recentOrders: any[]
  todayBookings: any[]
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, recentResponse] = await Promise.all([
          fetch('/api/admin/dashboard/stats'),
          fetch('/api/admin/dashboard/recent')
        ])

        if (statsResponse.ok) {
          const statsResult = await statsResponse.json()
          setStats(statsResult.data)
        }

        if (recentResponse.ok) {
          const recentResult = await recentResponse.json()
          setRecentActivity(recentResult.data)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">仪表板</h1>
          <p className="text-muted-foreground">欢迎回到美丽诊所管理后台</p>
        </div>
        <Button asChild>
          <Link href="/admin/bookings">
            <Plus className="mr-2 h-4 w-4" />
            新建预约
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="今日预约"
          value={stats?.todayBookings.value || 0}
          change={stats ? {
            value: stats.todayBookings.change,
            type: stats.todayBookings.changeType
          } : undefined}
          icon={Calendar}
          loading={loading}
        />
        <StatsCard
          title="本月收入"
          value={stats ? formatCurrency(stats.monthlyRevenue.value) : '¥0'}
          change={stats ? {
            value: stats.monthlyRevenue.change,
            type: stats.monthlyRevenue.changeType
          } : undefined}
          icon={DollarSign}
          loading={loading}
        />
        <StatsCard
          title="待处理订单"
          value={stats?.pendingOrders.value || 0}
          change={stats ? {
            value: stats.pendingOrders.change,
            type: stats.pendingOrders.changeType
          } : undefined}
          icon={ShoppingCart}
          loading={loading}
        />
        <StatsCard
          title="总客户数"
          value={stats?.totalCustomers.value || 0}
          change={stats ? {
            value: stats.totalCustomers.change,
            type: stats.totalCustomers.changeType
          } : undefined}
          icon={Users}
          loading={loading}
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <RevenueChart loading={loading} />
        </div>

        {/* Today's Bookings */}
        <div>
          <RecentBookings
            title="今日预约"
            bookings={recentActivity?.todayBookings || []}
            loading={loading}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <RecentBookings
          title="最近预约"
          bookings={recentActivity?.recentBookings || []}
          loading={loading}
          showDate={true}
        />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-auto p-4" asChild>
                <Link href="/admin/bookings">
                  <Calendar className="mr-3 h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">预约管理</p>
                    <p className="text-sm text-muted-foreground">查看和管理所有预约</p>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start h-auto p-4" asChild>
                <Link href="/admin/customers">
                  <Users className="mr-3 h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">客户管理</p>
                    <p className="text-sm text-muted-foreground">查看和管理客户信息</p>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start h-auto p-4" asChild>
                <Link href="/admin/orders">
                  <ShoppingCart className="mr-3 h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">订单处理</p>
                    <p className="text-sm text-muted-foreground">处理待付款订单</p>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start h-auto p-4" asChild>
                <Link href="/admin/settings/logs">
                  <FileText className="mr-3 h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">操作日志</p>
                    <p className="text-sm text-muted-foreground">查看系统操作记录</p>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
