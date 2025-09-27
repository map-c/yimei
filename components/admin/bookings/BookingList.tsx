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
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Phone, 
  Mail,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react'

interface Booking {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  serviceName: string
  doctorName: string
  appointmentDate: string
  appointmentTime: string
  status: string
  createdAt: string
  order?: {
    id: string
    orderNumber: string
    totalAmount: number
    paidAmount: number
    paymentStatus: string
    paymentMethod?: string
  }
}

interface BookingListProps {
  bookings: Booking[]
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

export function BookingList({ 
  bookings, 
  loading, 
  pagination, 
  onPageChange, 
  onRefresh 
}: BookingListProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)

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

  const getPaymentStatusBadge = (status?: string) => {
    if (!status) return null

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
      <Badge variant={variants[status] || 'outline'} className="text-xs">
        {labels[status] || status}
      </Badge>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN')
  }

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN')
  }

  const handleAction = async (action: string, bookingId: string) => {
    setActionLoading(bookingId)
    try {
      // 这里处理各种操作
      switch (action) {
        case 'confirm':
          await updateBookingStatus(bookingId, 'CONFIRMED')
          break
        case 'cancel':
          await updateBookingStatus(bookingId, 'CANCELLED')
          break
        case 'complete':
          await updateBookingStatus(bookingId, 'COMPLETED')
          break
        default:
          break
      }
      onRefresh()
    } catch (error) {
      console.error('Action error:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const updateBookingStatus = async (bookingId: string, status: string) => {
    const response = await fetch(`/api/admin/bookings/${bookingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      throw new Error('Failed to update booking status')
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>预约列表</CardTitle>
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>预约列表 ({pagination.total})</CardTitle>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          刷新
        </Button>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>暂无预约记录</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>客户信息</TableHead>
                    <TableHead>服务项目</TableHead>
                    <TableHead>医师</TableHead>
                    <TableHead>预约时间</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>支付状态</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{booking.customerName}</div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{booking.customerPhone}</span>
                          </div>
                          {booking.customerEmail && (
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span>{booking.customerEmail}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{booking.serviceName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{booking.doctorName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div>{formatDate(booking.appointmentDate)}</div>
                          <div className="text-sm text-muted-foreground">
                            {booking.appointmentTime}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(booking.status)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getPaymentStatusBadge(booking.order?.paymentStatus)}
                          {booking.order && (
                            <div className="text-xs text-muted-foreground">
                              ¥{booking.order.paidAmount.toLocaleString()} / ¥{booking.order.totalAmount.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {formatDateTime(booking.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              disabled={actionLoading === booking.id}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/bookings/${booking.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                查看详情
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/bookings/${booking.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                编辑
                              </Link>
                            </DropdownMenuItem>
                            {booking.status === 'PENDING' && (
                              <DropdownMenuItem 
                                onClick={() => handleAction('confirm', booking.id)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                确认预约
                              </DropdownMenuItem>
                            )}
                            {booking.status === 'CONFIRMED' && (
                              <DropdownMenuItem 
                                onClick={() => handleAction('complete', booking.id)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                标记完成
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => handleAction('cancel', booking.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              取消预约
                            </DropdownMenuItem>
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
  )
}
