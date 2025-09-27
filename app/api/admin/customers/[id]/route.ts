import { NextRequest } from 'next/server'
import { withPermissions, createSuccessResponse, createErrorResponse, getCurrentAdmin } from '@/lib/admin/middleware'
import { createPermissionCheck, Permission } from '@/lib/admin/permissions'
import { logAdminAction } from '@/lib/admin/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 获取客户详情（使用手机号作为ID）
async function getCustomer(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customerPhone = decodeURIComponent(params.id)

    // 获取该客户的所有预约
    const bookings = await prisma.booking.findMany({
      where: { customerPhone },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (bookings.length === 0) {
      return createErrorResponse('客户不存在', 404)
    }

    // 聚合客户信息
    const firstBooking = bookings[bookings.length - 1]
    const lastBooking = bookings[0]
    
    let totalSpent = 0
    let totalOrders = 0
    let paidOrders = 0
    const services = new Set<string>()
    const doctors = new Set<string>()
    const paymentMethods = new Set<string>()

    bookings.forEach(booking => {
      services.add(booking.serviceName)
      doctors.add(booking.doctorName)
      
      booking.orders.forEach(order => {
        totalOrders += 1
        if (order.paymentStatus === 'PAID') {
          totalSpent += order.paidAmount
          paidOrders += 1
          if (order.paymentMethod) {
            paymentMethods.add(order.paymentMethod)
          }
        }
      })
    })

    // 计算客户统计信息
    const customerStats = {
      totalBookings: bookings.length,
      totalSpent,
      totalOrders,
      paidOrders,
      averageOrderValue: paidOrders > 0 ? totalSpent / paidOrders : 0,
      conversionRate: totalOrders > 0 ? (paidOrders / totalOrders) * 100 : 0,
      customerLevel: getCustomerLevel(totalSpent, bookings.length),
      membershipDuration: calculateMembershipDuration(firstBooking.createdAt),
      favoriteServices: Array.from(services),
      preferredDoctors: Array.from(doctors),
      paymentMethods: Array.from(paymentMethods),
    }

    // 按月统计消费趋势
    const monthlySpending = calculateMonthlySpending(bookings)

    // 最近的预约和订单
    const recentBookings = bookings.slice(0, 10)
    const recentOrders = bookings
      .flatMap(booking => booking.orders.map(order => ({ ...order, booking })))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)

    const customerDetail = {
      // 基本信息
      customerName: firstBooking.customerName,
      customerPhone: firstBooking.customerPhone,
      customerEmail: firstBooking.customerEmail,
      customerAge: firstBooking.customerAge,
      
      // 统计信息
      stats: customerStats,
      
      // 趋势数据
      monthlySpending,
      
      // 历史记录
      recentBookings,
      recentOrders,
      
      // 时间信息
      firstBookingDate: firstBooking.createdAt,
      lastBookingDate: lastBooking.createdAt,
    }

    return createSuccessResponse(customerDetail)
  } catch (error) {
    console.error('Get customer error:', error)
    return createErrorResponse('获取客户详情失败', 500)
  }
}

// 更新客户信息
const updateCustomerSchema = z.object({
  customerName: z.string().min(1).optional(),
  customerEmail: z.string().email().optional(),
  customerAge: z.string().optional(),
  notes: z.string().optional(),
})

async function updateCustomer(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) {
      return createErrorResponse('未认证', 401)
    }

    const customerPhone = decodeURIComponent(params.id)
    const body = await request.json()
    const validation = updateCustomerSchema.safeParse(body)
    
    if (!validation.success) {
      return createErrorResponse('请求数据格式错误', 400)
    }

    const data = validation.data

    // 检查客户是否存在
    const existingBooking = await prisma.booking.findFirst({
      where: { customerPhone }
    })

    if (!existingBooking) {
      return createErrorResponse('客户不存在', 404)
    }

    // 更新该客户的所有预约记录中的信息
    const updateData: any = {}
    if (data.customerName) updateData.customerName = data.customerName
    if (data.customerEmail !== undefined) updateData.customerEmail = data.customerEmail
    if (data.customerAge) updateData.customerAge = data.customerAge

    if (Object.keys(updateData).length > 0) {
      await prisma.booking.updateMany({
        where: { customerPhone },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
      })
    }

    // 记录操作日志
    const changes = Object.keys(data).map(key => `${key}: ${data[key as keyof typeof data]}`).join(', ')
    await logAdminAction(
      admin.id,
      'UPDATE_CUSTOMER',
      'customer',
      customerPhone,
      `更新客户信息: ${changes}`,
      request.headers.get('x-forwarded-for') || 'unknown'
    )

    // 返回更新后的客户信息
    return getCustomer(request, { params })
  } catch (error) {
    console.error('Update customer error:', error)
    return createErrorResponse('更新客户信息失败', 500)
  }
}

// 计算客户等级
function getCustomerLevel(totalSpent: number, bookingCount: number) {
  if (totalSpent >= 50000 || bookingCount >= 10) {
    return 'VIP'
  } else if (totalSpent >= 20000 || bookingCount >= 5) {
    return 'Gold'
  } else if (totalSpent >= 5000 || bookingCount >= 2) {
    return 'Silver'
  } else {
    return 'Bronze'
  }
}

// 计算会员时长
function calculateMembershipDuration(firstBookingDate: string | Date) {
  const start = new Date(firstBookingDate)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 30) {
    return `${diffDays}天`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months}个月`
  } else {
    const years = Math.floor(diffDays / 365)
    const months = Math.floor((diffDays % 365) / 30)
    return months > 0 ? `${years}年${months}个月` : `${years}年`
  }
}

// 计算月度消费趋势
function calculateMonthlySpending(bookings: any[]) {
  const monthlyMap = new Map<string, { month: string; spending: number; bookings: number }>()

  bookings.forEach(booking => {
    booking.orders.forEach((order: any) => {
      if (order.paymentStatus === 'PAID') {
        const date = new Date(order.createdAt)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        
        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, { month: monthKey, spending: 0, bookings: 0 })
        }
        
        const monthData = monthlyMap.get(monthKey)!
        monthData.spending += order.paidAmount
        monthData.bookings += 1
      }
    })
  })

  return Array.from(monthlyMap.values())
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12) // 最近12个月
}

export const GET = withPermissions(
  createPermissionCheck(Permission.VIEW_CUSTOMERS),
  getCustomer
)

export const PUT = withPermissions(
  createPermissionCheck(Permission.EDIT_CUSTOMERS),
  updateCustomer
)
