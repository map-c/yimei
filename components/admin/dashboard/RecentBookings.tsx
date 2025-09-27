import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Phone,
  Calendar,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

interface Booking {
  id: string
  customerName: string
  serviceName: string
  appointmentDate?: string
  appointmentTime: string
  status: string
  customerPhone?: string
  createdAt?: string
}

interface RecentBookingsProps {
  bookings?: Booking[]
  loading?: boolean
  title?: string
  showDate?: boolean
}

export function RecentBookings({ 
  bookings = [], 
  loading, 
  title = "最近预约",
  showDate = false 
}: RecentBookingsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'NO_SHOW':
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return '已确认'
      case 'PENDING':
        return '待确认'
      case 'COMPLETED':
        return '已完成'
      case 'CANCELLED':
        return '已取消'
      case 'NO_SHOW':
        return '未到场'
      case 'IN_PROGRESS':
        return '进行中'
      default:
        return status
    }
  }

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'CONFIRMED':
        return 'default'
      case 'COMPLETED':
        return 'secondary'
      case 'CANCELLED':
      case 'NO_SHOW':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-muted animate-pulse rounded-full" />
                  <div className="space-y-1">
                    <div className="w-20 h-4 bg-muted animate-pulse rounded" />
                    <div className="w-32 h-3 bg-muted animate-pulse rounded" />
                  </div>
                </div>
                <div className="w-16 h-6 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/bookings">
            查看全部
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>暂无预约记录</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(booking.status)}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-foreground truncate">
                        {booking.customerName}
                      </p>
                      {booking.customerPhone && (
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Phone className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {booking.serviceName}
                    </p>
                    {showDate && booking.createdAt && (
                      <p className="text-xs text-muted-foreground">
                        {formatDate(booking.createdAt)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm font-medium">
                    {booking.appointmentTime}
                  </div>
                  <Badge variant={getStatusVariant(booking.status)} className="text-xs">
                    {getStatusText(booking.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
