import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DollarSign, User, Calendar, Phone, Mail } from 'lucide-react'

interface OrderDetailProps {
  order: {
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
      customerName: string
      customerPhone: string
      customerEmail?: string
      serviceName: string
      doctorName: string
      appointmentDate: string
      appointmentTime: string
      concerns?: string
      expectations?: string
    }
  }
}

export function OrderDetail({ order }: OrderDetailProps) {
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

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`
  }

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN')
  }

  return (
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

      {/* 客户信息 */}
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
  )
}
