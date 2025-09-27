'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { OrderDetail } from '@/components/admin/orders/OrderDetail'
import { RefundDialog } from '@/components/admin/orders/RefundDialog'
import { 
  ArrowLeft, 
  CreditCard, 
  Undo2, 
  Eye,
  Phone,
  Mail,
  Calendar,
  User,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'

interface OrderData {
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
    concerns?: string
    expectations?: string
    notes?: string
    orders: any[]
  }
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchOrderDetail()
  }, [params.id])

  const fetchOrderDetail = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`)
      const result = await response.json()

      if (result.success) {
        setOrder(result.data)
      } else {
        console.error('Failed to fetch order:', result.error)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePaymentStatus = async (status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: status }),
      })

      if (response.ok) {
        fetchOrderDetail()
      } else {
        const result = await response.json()
        alert(result.error || '操作失败')
      }
    } catch (error) {
      console.error('Update payment status error:', error)
      alert('操作失败，请重试')
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'PENDING': 'outline',
      'PAID': 'default',
      'PARTIAL': 'secondary',
      'REFUNDED': 'destructive',
      'FAILED': 'destructive',
    }

    const labels: Record<string, string> = {
      'PENDING': '待支付',
      'PAID': '已支付',
      'PARTIAL': '部分支付',
      'REFUNDED': '已退款',
      'FAILED': '支付失败',
    }

    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status}
      </Badge>
    )
  }

  const getPaymentMethodText = (method?: string) => {
    const methods: Record<string, string> = {
      'wechat': '微信支付',
      'alipay': '支付宝',
      'card': '信用卡',
    }

    return method ? methods[method] || method : '未选择'
  }

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="w-full h-96 bg-muted animate-pulse rounded" />
          <div className="w-full h-96 bg-muted animate-pulse rounded" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">订单不存在</p>
        <Button asChild className="mt-4">
          <Link href="/admin/orders">返回订单列表</Link>
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
            <Link href="/admin/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">订单详情</h1>
            <p className="text-muted-foreground">{order.orderNumber}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {order.paymentStatus === 'PENDING' && (
            <Button onClick={() => handleUpdatePaymentStatus('PAID')}>
              <CreditCard className="mr-2 h-4 w-4" />
              标记已支付
            </Button>
          )}
          {(order.paymentStatus === 'PAID' || order.paymentStatus === 'PARTIAL') && (
            <Button 
              variant="destructive" 
              onClick={() => setRefundDialogOpen(true)}
            >
              <Undo2 className="mr-2 h-4 w-4" />
              申请退款
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href={`/admin/bookings/${order.booking.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              查看预约
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 订单信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span>订单信息</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">订单号</p>
                <p className="font-medium">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">支付状态</p>
                <div className="mt-1">
                  {getPaymentStatusBadge(order.paymentStatus)}
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">订单总额</p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">已支付金额</p>
                <p className="text-xl font-bold text-primary">
                  {formatCurrency(order.paidAmount)}
                </p>
              </div>
            </div>

            {order.paidAmount < order.totalAmount && (
              <div>
                <p className="text-sm text-muted-foreground">待支付金额</p>
                <p className="text-lg font-medium text-orange-600">
                  {formatCurrency(order.totalAmount - order.paidAmount)}
                </p>
              </div>
            )}

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">支付方式</p>
                <p className="font-medium">{getPaymentMethodText(order.paymentMethod)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">支付类型</p>
                <p className="font-medium">
                  {order.paymentType === 'DEPOSIT' ? '定金' : '全款'}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">创建时间</p>
                <p className="font-medium">{formatDateTime(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">更新时间</p>
                <p className="font-medium">{formatDateTime(order.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 客户和预约信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span>客户信息</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">客户姓名</p>
              <p className="text-xl font-bold text-foreground">{order.booking.customerName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">手机号</p>
                  <p className="font-medium">{order.booking.customerPhone}</p>
                </div>
              </div>
              {order.booking.customerEmail && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">邮箱</p>
                    <p className="font-medium">{order.booking.customerEmail}</p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">服务项目</p>
              <p className="text-lg font-bold text-foreground">{order.booking.serviceName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">主治医师</p>
                <p className="font-medium">{order.booking.doctorName}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">预约时间</p>
                  <p className="font-medium">
                    {order.booking.appointmentDate} {order.booking.appointmentTime}
                  </p>
                </div>
              </div>
            </div>

            {order.booking.concerns && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">关注问题</p>
                  <p className="text-sm bg-muted p-3 rounded-md mt-1">
                    {order.booking.concerns}
                  </p>
                </div>
              </>
            )}

            {order.booking.expectations && (
              <div>
                <p className="text-sm text-muted-foreground">期望效果</p>
                <p className="text-sm bg-muted p-3 rounded-md mt-1">
                  {order.booking.expectations}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 退款对话框 */}
      <RefundDialog
        open={refundDialogOpen}
        onOpenChange={setRefundDialogOpen}
        order={order}
        onRefundSuccess={fetchOrderDetail}
      />
    </div>
  )
}
