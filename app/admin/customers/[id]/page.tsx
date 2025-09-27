'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CustomerDetail } from '@/components/admin/customers/CustomerDetail'
import { CustomerEditDialog } from '@/components/admin/customers/CustomerEditDialog'
import { CustomerSpendingChart } from '@/components/admin/customers/CustomerSpendingChart'
import { 
  ArrowLeft, 
  Edit, 
  Phone,
  Mail,
  Calendar,
  User,
  DollarSign,
  TrendingUp,
  Clock
} from 'lucide-react'
import Link from 'next/link'

interface CustomerData {
  customerName: string
  customerPhone: string
  customerEmail?: string
  customerAge?: string
  stats: {
    totalBookings: number
    totalSpent: number
    totalOrders: number
    paidOrders: number
    averageOrderValue: number
    conversionRate: number
    customerLevel: string
    membershipDuration: string
    favoriteServices: string[]
    preferredDoctors: string[]
    paymentMethods: string[]
  }
  monthlySpending: Array<{
    month: string
    spending: number
    bookings: number
  }>
  recentBookings: any[]
  recentOrders: any[]
  firstBookingDate: string
  lastBookingDate: string
}

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchCustomerDetail()
  }, [params.id])

  const fetchCustomerDetail = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/customers/${params.id}`)
      const result = await response.json()

      if (result.success) {
        setCustomer(result.data)
      } else {
        console.error('Failed to fetch customer:', result.error)
      }
    } catch (error) {
      console.error('Error fetching customer:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCustomerLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
      'VIP': 'bg-purple-100 text-purple-800 border-purple-200',
      'Gold': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Silver': 'bg-gray-100 text-gray-800 border-gray-200',
      'Bronze': 'bg-orange-100 text-orange-800 border-orange-200',
    }

    return (
      <Badge className={colors[level] || 'bg-gray-100 text-gray-800'}>
        {level}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN')
  }

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-muted animate-pulse rounded" />
          <div className="w-32 h-8 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="w-full h-96 bg-muted animate-pulse rounded" />
          <div className="w-full h-96 bg-muted animate-pulse rounded" />
          <div className="w-full h-96 bg-muted animate-pulse rounded" />
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">客户不存在</p>
        <Button asChild className="mt-4">
          <Link href="/admin/customers">返回客户列表</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/customers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">客户详情</h1>
            <p className="text-muted-foreground">{customer.customerName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            编辑信息
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/admin/bookings?search=${customer.customerPhone}`}>
              <Calendar className="mr-2 h-4 w-4" />
              查看预约
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/admin/orders?search=${customer.customerPhone}`}>
              <DollarSign className="mr-2 h-4 w-4" />
              查看订单
            </Link>
          </Button>
        </div>
      </div>

      {/* Customer Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span>基本信息</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">客户姓名</p>
              <p className="text-xl font-bold text-foreground">{customer.customerName}</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">手机号</p>
                  <p className="font-medium">{customer.customerPhone}</p>
                </div>
              </div>
              {customer.customerEmail && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">邮箱</p>
                    <p className="font-medium">{customer.customerEmail}</p>
                  </div>
                </div>
              )}
              {customer.customerAge && (
                <div>
                  <p className="text-sm text-muted-foreground">年龄</p>
                  <p className="font-medium">{customer.customerAge}岁</p>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">客户等级</p>
              {getCustomerLevelBadge(customer.stats.customerLevel)}
            </div>

            <div>
              <p className="text-sm text-muted-foreground">会员时长</p>
              <p className="font-medium">{customer.stats.membershipDuration}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">首次预约</p>
                <p className="font-medium">{formatDate(customer.firstBookingDate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">最后预约</p>
                <p className="font-medium">{formatDate(customer.lastBookingDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>消费统计</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">总消费</p>
                <p className="text-xl font-bold text-primary">
                  {formatCurrency(customer.stats.totalSpent)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">预约次数</p>
                <p className="text-xl font-bold text-foreground">
                  {customer.stats.totalBookings}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">平均消费</p>
                <p className="text-lg font-medium text-foreground">
                  {formatCurrency(customer.stats.averageOrderValue)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">转化率</p>
                <p className="text-lg font-medium text-foreground">
                  {customer.stats.conversionRate.toFixed(1)}%
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground mb-2">常用服务</p>
              <div className="flex flex-wrap gap-1">
                {customer.stats.favoriteServices.slice(0, 3).map((service) => (
                  <Badge key={service} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
                {customer.stats.favoriteServices.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{customer.stats.favoriteServices.length - 3}
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">偏好医师</p>
              <div className="flex flex-wrap gap-1">
                {customer.stats.preferredDoctors.map((doctor) => (
                  <Badge key={doctor} variant="secondary" className="text-xs">
                    {doctor}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">支付方式</p>
              <div className="flex flex-wrap gap-1">
                {customer.stats.paymentMethods.map((method) => {
                  const methodNames: Record<string, string> = {
                    'wechat': '微信支付',
                    'alipay': '支付宝',
                    'card': '信用卡',
                  }
                  return (
                    <Badge key={method} variant="outline" className="text-xs">
                      {methodNames[method] || method}
                    </Badge>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>最近活动</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">最近预约</p>
              <div className="space-y-2">
                {customer.recentBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="text-sm p-2 bg-muted rounded">
                    <p className="font-medium">{booking.serviceName}</p>
                    <p className="text-muted-foreground">
                      {booking.doctorName} · {formatDate(booking.appointmentDate)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-foreground mb-2">最近订单</p>
              <div className="space-y-2">
                {customer.recentOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="text-sm p-2 bg-muted rounded">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{order.booking.serviceName}</p>
                      <p className="text-primary font-medium">
                        {formatCurrency(order.paidAmount)}
                      </p>
                    </div>
                    <p className="text-muted-foreground">
                      {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spending Chart */}
      <CustomerSpendingChart data={customer.monthlySpending} />

      {/* Detailed History */}
      <CustomerDetail customer={customer} />

      {/* Edit Dialog */}
      <CustomerEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        customer={customer}
        onUpdateSuccess={fetchCustomerDetail}
      />
    </div>
  )
}
