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
  Phone, 
  Mail,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Users,
  Calendar,
  DollarSign
} from 'lucide-react'

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

interface CustomerListProps {
  customers: Customer[]
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

export function CustomerList({ 
  customers, 
  loading, 
  pagination, 
  onPageChange, 
  onRefresh 
}: CustomerListProps) {
  const getCustomerLevelBadge = (level: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'VIP': 'default',
      'Gold': 'secondary',
      'Silver': 'outline',
      'Bronze': 'outline',
    }

    const colors: Record<string, string> = {
      'VIP': 'bg-purple-100 text-purple-800 border-purple-200',
      'Gold': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Silver': 'bg-gray-100 text-gray-800 border-gray-200',
      'Bronze': 'bg-orange-100 text-orange-800 border-orange-200',
    }

    return (
      <Badge variant={variants[level] || 'outline'} className={colors[level]}>
        {level}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN')
  }

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN')
  }

  const getCustomerPhoneEncoded = (phone: string) => {
    return encodeURIComponent(phone)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>客户列表</CardTitle>
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
        <CardTitle>客户列表 ({pagination.total})</CardTitle>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          刷新
        </Button>
      </CardHeader>
      <CardContent>
        {customers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>暂无客户记录</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>客户信息</TableHead>
                    <TableHead>等级</TableHead>
                    <TableHead>消费统计</TableHead>
                    <TableHead>预约统计</TableHead>
                    <TableHead>常用服务</TableHead>
                    <TableHead>最后预约</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.customerPhone}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{customer.customerName}</div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{customer.customerPhone}</span>
                          </div>
                          {customer.customerEmail && (
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span>{customer.customerEmail}</span>
                            </div>
                          )}
                          {customer.customerAge && (
                            <div className="text-sm text-muted-foreground">
                              年龄: {customer.customerAge}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getCustomerLevelBadge(customer.customerLevel)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-primary">
                            {formatCurrency(customer.totalSpent)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            平均: {formatCurrency(customer.bookingCount > 0 ? customer.totalSpent / customer.bookingCount : 0)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">{customer.bookingCount} 次</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            首次: {formatDate(customer.firstBooking)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            {customer.services.slice(0, 2).join(', ')}
                            {customer.services.length > 2 && (
                              <span className="text-muted-foreground">
                                等{customer.services.length}项
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            医师: {customer.doctors.slice(0, 2).join(', ')}
                            {customer.doctors.length > 2 && '等'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {formatDateTime(customer.lastBooking)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/customers/${getCustomerPhoneEncoded(customer.customerPhone)}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                查看详情
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/customers/${getCustomerPhoneEncoded(customer.customerPhone)}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                编辑信息
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/bookings?search=${customer.customerPhone}`}>
                                <Calendar className="mr-2 h-4 w-4" />
                                查看预约
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/orders?search=${customer.customerPhone}`}>
                                <DollarSign className="mr-2 h-4 w-4" />
                                查看订单
                              </Link>
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
