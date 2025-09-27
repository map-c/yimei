import { NextRequest } from 'next/server'
import { withPermissions, createSuccessResponse, createErrorResponse, createPaginatedResponse } from '@/lib/admin/middleware'
import { createPermissionCheck, Permission } from '@/lib/admin/permissions'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 查询参数验证
const querySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'phone', 'totalSpent', 'bookingCount', 'lastBooking']).optional().default('lastBooking'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

async function getCustomers(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))
    
    const page = parseInt(query.page)
    const limit = parseInt(query.limit)
    const skip = (page - 1) * limit

    // 构建搜索条件
    const where: any = {}
    if (query.search) {
      where.OR = [
        { customerName: { contains: query.search, mode: 'insensitive' } },
        { customerPhone: { contains: query.search } },
        { customerEmail: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    // 获取所有预约数据用于聚合客户信息
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        orders: {
          select: {
            totalAmount: true,
            paidAmount: true,
            paymentStatus: true,
          },
        },
      },
    })

    // 按客户聚合数据
    const customerMap = new Map<string, any>()

    bookings.forEach(booking => {
      const key = booking.customerPhone // 使用手机号作为唯一标识
      
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          customerName: booking.customerName,
          customerPhone: booking.customerPhone,
          customerEmail: booking.customerEmail,
          customerAge: booking.customerAge,
          bookings: [],
          totalSpent: 0,
          bookingCount: 0,
          lastBooking: null,
          firstBooking: null,
          services: new Set(),
          doctors: new Set(),
        })
      }

      const customer = customerMap.get(key)
      customer.bookings.push(booking)
      customer.bookingCount += 1
      customer.services.add(booking.serviceName)
      customer.doctors.add(booking.doctorName)

      // 计算总消费
      booking.orders.forEach(order => {
        if (order.paymentStatus === 'PAID') {
          customer.totalSpent += order.paidAmount
        }
      })

      // 更新最后预约时间
      const bookingDate = new Date(booking.createdAt)
      if (!customer.lastBooking || bookingDate > new Date(customer.lastBooking)) {
        customer.lastBooking = booking.createdAt
      }

      // 更新首次预约时间
      if (!customer.firstBooking || bookingDate < new Date(customer.firstBooking)) {
        customer.firstBooking = booking.createdAt
      }
    })

    // 转换为数组并格式化
    let customers = Array.from(customerMap.values()).map(customer => ({
      customerName: customer.customerName,
      customerPhone: customer.customerPhone,
      customerEmail: customer.customerEmail,
      customerAge: customer.customerAge,
      totalSpent: customer.totalSpent,
      bookingCount: customer.bookingCount,
      lastBooking: customer.lastBooking,
      firstBooking: customer.firstBooking,
      services: Array.from(customer.services),
      doctors: Array.from(customer.doctors),
      // 计算客户价值等级
      customerLevel: getCustomerLevel(customer.totalSpent, customer.bookingCount),
    }))

    // 排序
    customers.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (query.sortBy) {
        case 'name':
          aValue = a.customerName
          bValue = b.customerName
          break
        case 'phone':
          aValue = a.customerPhone
          bValue = b.customerPhone
          break
        case 'totalSpent':
          aValue = a.totalSpent
          bValue = b.totalSpent
          break
        case 'bookingCount':
          aValue = a.bookingCount
          bValue = b.bookingCount
          break
        case 'lastBooking':
          aValue = a.lastBooking ? new Date(a.lastBooking) : new Date(0)
          bValue = b.lastBooking ? new Date(b.lastBooking) : new Date(0)
          break
        default:
          aValue = a.lastBooking ? new Date(a.lastBooking) : new Date(0)
          bValue = b.lastBooking ? new Date(b.lastBooking) : new Date(0)
      }

      if (query.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    // 分页
    const total = customers.length
    const paginatedCustomers = customers.slice(skip, skip + limit)

    return createPaginatedResponse(
      paginatedCustomers,
      { page, limit, total }
    )
  } catch (error) {
    console.error('Get customers error:', error)
    return createErrorResponse('获取客户列表失败', 500)
  }
}

// 根据消费金额和预约次数计算客户等级
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

export const GET = withPermissions(
  createPermissionCheck(Permission.VIEW_CUSTOMERS),
  getCustomers
)
