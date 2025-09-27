'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookingList } from '@/components/admin/bookings/BookingList'
import { BookingFilters } from '@/components/admin/bookings/BookingFilters'
import { Plus, Search, Download } from 'lucide-react'

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
  updatedAt: string
  order?: {
    id: string
    orderNumber: string
    totalAmount: number
    paidAmount: number
    paymentStatus: string
    paymentMethod?: string
  }
}

interface BookingFiltersType {
  search: string
  status: string
  dateFrom: string
  dateTo: string
  doctorId: string
  serviceId: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [filters, setFilters] = useState<BookingFiltersType>({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    doctorId: '',
    serviceId: '',
  })

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        ),
      })

      const response = await fetch(`/api/admin/bookings?${params}`)
      const result = await response.json()

      if (result.success) {
        setBookings(result.data)
        setPagination(result.pagination)
      } else {
        console.error('Failed to fetch bookings:', result.error)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [pagination.page, pagination.limit])

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchBookings()
  }

  const handleFilterChange = (newFilters: Partial<BookingFiltersType>) => {
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

      const response = await fetch(`/api/admin/bookings/export?${params}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `bookings-${new Date().toISOString().split('T')[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export error:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">预约管理</h1>
          <p className="text-muted-foreground">管理所有客户预约信息</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新建预约
          </Button>
        </div>
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

        <BookingFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onApply={handleSearch}
        />
      </div>

      {/* Booking List */}
      <BookingList
        bookings={bookings}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRefresh={fetchBookings}
      />
    </div>
  )
}
