import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { 
  MoreHorizontal, 
  Eye, 
  CreditCard, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Undo2
} from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  totalAmount: number
  paidAmount: number
  paymentStatus: string
  paymentMethod?: string
  paymentType: string
  createdAt: string
  booking: {
    id: string
    customerName: string
    customerPhone: string
    serviceName: string
    doctorName: string
    appointmentDate: string
    appointmentTime: string
    status: string
  }
}

interface OrderListProps {
  orders: Order[]
  loading: boolean
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  onPageChange: (page: number) => void
  onRefresh: () => void
}

export function OrderList({ 
  orders, 
  loading, 
  pagination, 
  onPageChange, 
  onRefresh 
}: OrderListProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [refundDialog, setRefundDialog] = useState<{ open: boolean; orderId: string | null }>({
    open: false,
    orderId: null,
  })

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

  const getPaymentTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      'DEPOSIT': '定金',
      'FULL_PAYMENT': '全款',
    }

    return (
      <Badge variant="outline" className="text-xs">
        {labels[type] || type}
      </Badge>
    )
  }

  const getPaymentMethodText = (method?: string) => {
    const methods: Record<string, string> = {
      'wechat': '微信支付',
      'alipay': '支付宝',
      'card': '信用卡',
    }

    return method ? methods[method] || method : '-'
  }

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`
  }

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN')
  }

  const handleUpdatePaymentStatus = async (orderId: string, status: string) => {
    setActionLoading(orderId)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: status }),
      })

      if (response.ok) {
        onRefresh()
      } else {
        const result = await response.json()
        alert(result.error || '操作失败')
      }
    } catch (error) {
      console.error('Update payment status error:', error)
      alert('操作失败，请重试')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRefund = (orderId: string) => {
    setRefundDialog({ open: true, orderId })
  }

  const confirmRefund = async () => {
    if (!refundDialog.orderId) return

    setActionLoading(refundDialog.orderId)
    try {
      // 这里应该打开退款对话框，收集退款信息
      // 暂时使用简单的确认
      const order = orders.find(o => o.id === refundDialog.orderId)
      if (!order) return

      const response = await fetch(`/api/admin/orders/${refundDialog.orderId}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refundAmount: order.paidAmount,
          refundReason: '管理员操作退款',
          refundMethod: 'original',
        }),
      })

      if (response.ok) {
        onRefresh()
        setRefundDialog({ open: false, orderId: null })
      } else {
        const result = await response.json()
        alert(result.error || '退款失败')
      }
    } catch (error) {
      console.error('Refund error:', error)
      alert('退款失败，请重试')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>订单列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>订单列表 ({pagination.total})</CardTitle>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>暂无订单记录</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>订单信息</TableHead>
                      <TableHead>客户信息</TableHead>
                      <TableHead>服务项目</TableHead>
                      <TableHead>金额</TableHead>
                      <TableHead>支付状态</TableHead>
                      <TableHead>支付方式</TableHead>
                      <TableHead>创建时间</TableHead>
                      <TableHead className="w-[100px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{order.orderNumber}</div>
                            <div className="flex items-center space-x-2">
                              {getPaymentTypeBadge(order.paymentType)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{order.booking.customerName}</div>
                            <div className="text-sm text-muted-foreground">
                              {order.booking.customerPhone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{order.booking.serviceName}</div>
                            <div className="text-sm text-muted-foreground">
                              {order.booking.doctorName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {formatCurrency(order.paidAmount)} / {formatCurrency(order.totalAmount)}
                            </div>
                            {order.paidAmount < order.totalAmount && (
                              <div className="text-xs text-muted-foreground">
                                余额: {formatCurrency(order.totalAmount - order.paidAmount)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getPaymentStatusBadge(order.paymentStatus)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {getPaymentMethodText(order.paymentMethod)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {formatDateTime(order.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                disabled={actionLoading === order.id}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/orders/${order.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  查看详情
                                </Link>
                              </DropdownMenuItem>
                              {order.paymentStatus === 'PENDING' && (
                                <DropdownMenuItem 
                                  onClick={() => handleUpdatePaymentStatus(order.id, 'PAID')}
                                >
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  标记已支付
                                </DropdownMenuItem>
                              )}
                              {(order.paymentStatus === 'PAID' || order.paymentStatus === 'PARTIAL') && (
                                <DropdownMenuItem 
                                  onClick={() => handleRefund(order.id)}
                                  className="text-destructive"
                                >
                                  <Undo2 className="mr-2 h-4 w-4" />
                                  申请退款
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    显示 {((pagination.page - 1) * pagination.limit) + 1} 到{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} 条，
                    共 {pagination.total} 条记录
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      上一页
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const page = i + 1
                        return (
                          <Button
                            key={page}
                            variant={page === pagination.page ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPageChange(page)}
                          >
                            {page}
                          </Button>
                        )
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                    >
                      下一页
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Refund Confirmation Dialog */}
      <AlertDialog open={refundDialog.open} onOpenChange={(open) => setRefundDialog({ open, orderId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认退款</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要为此订单申请退款吗？此操作将退还已支付的金额并取消相关预约。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRefund} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              确认退款
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
