import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Calendar, DollarSign, Eye } from 'lucide-react'
import Link from 'next/link'

interface CustomerDetailProps {
  customer: {
    customerPhone: string
    recentBookings: any[]
    recentOrders: any[]
  }
}

export function CustomerDetail({ customer }: CustomerDetailProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'PENDING': 'outline',
      'CONFIRMED': 'default',
      'IN_PROGRESS': 'secondary',
      'COMPLETED': 'secondary',
      'CANCELLED': 'destructive',
      'NO_SHOW': 'destructive',
    }

    const labels: Record<string, string> = {
      'PENDING': '待确认',
      'CONFIRMED': '已确认',
      'IN_PROGRESS': '进行中',
      'COMPLETED': '已完成',
      'CANCELLED': '已取消',
      'NO_SHOW': '未到场',
    }

    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status}
      </Badge>
    )
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 预约历史 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>预约历史</span>
          </CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/bookings?search=${customer.customerPhone}`}>
              查看全部
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>服务项目</TableHead>
                  <TableHead>医师</TableHead>
                  <TableHead>预约时间</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.recentBookings.slice(0, 5).map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="font-medium">{booking.serviceName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{booking.doctorName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(booking.appointmentDate)} {booking.appointmentTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(booking.status)}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/bookings/${booking.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {customer.recentBookings.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>暂无预约记录</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 订单历史 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <span>订单历史</span>
          </CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/orders?search=${customer.customerPhone}`}>
              查看全部
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>订单号</TableHead>
                  <TableHead>服务项目</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.recentOrders.slice(0, 5).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium text-sm">{order.orderNumber}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{order.booking.serviceName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {formatCurrency(order.paidAmount)} / {formatCurrency(order.totalAmount)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/orders/${order.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {customer.recentOrders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>暂无订单记录</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
