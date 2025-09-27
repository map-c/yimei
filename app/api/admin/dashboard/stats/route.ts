import { NextRequest } from 'next/server'
import { withAuth, createSuccessResponse, createErrorResponse } from '@/lib/admin/middleware'
import { prisma } from '@/lib/prisma'

async function getStats(request: NextRequest) {
  try {
    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)

    // 今日预约数
    const todayBookings = await prisma.booking.count({
      where: {
        createdAt: {
          gte: startOfToday,
        },
      },
    })

    // 昨日预约数（用于计算变化）
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())
    const endOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() + 1)
    
    const yesterdayBookings = await prisma.booking.count({
      where: {
        createdAt: {
          gte: startOfYesterday,
          lt: endOfYesterday,
        },
      },
    })

    // 本月收入
    const thisMonthOrders = await prisma.order.aggregate({
      where: {
        paymentStatus: 'PAID',
        createdAt: {
          gte: startOfMonth,
        },
      },
      _sum: {
        paidAmount: true,
      },
    })

    // 上月收入（用于计算变化）
    const lastMonthOrders = await prisma.order.aggregate({
      where: {
        paymentStatus: 'PAID',
        createdAt: {
          gte: startOfLastMonth,
          lt: startOfMonth,
        },
      },
      _sum: {
        paidAmount: true,
      },
    })

    // 待处理订单数
    const pendingOrders = await prisma.order.count({
      where: {
        paymentStatus: 'PENDING',
      },
    })

    // 上周待处理订单数
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)
    const lastWeekPendingOrders = await prisma.order.count({
      where: {
        paymentStatus: 'PENDING',
        createdAt: {
          lt: lastWeek,
        },
      },
    })

    // 总客户数（基于预约去重）
    const totalCustomers = await prisma.booking.groupBy({
      by: ['customerPhone'],
    })

    // 上月客户数
    const lastMonthCustomers = await prisma.booking.groupBy({
      by: ['customerPhone'],
      where: {
        createdAt: {
          lt: startOfMonth,
        },
      },
    })

    // 计算变化
    const bookingChange = todayBookings - yesterdayBookings
    const thisMonthRevenue = thisMonthOrders._sum.paidAmount || 0
    const lastMonthRevenue = lastMonthOrders._sum.paidAmount || 0
    const revenueChange = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
      : '0'
    const orderChange = pendingOrders - lastWeekPendingOrders
    const customerChange = totalCustomers.length - lastMonthCustomers.length

    const stats = {
      todayBookings: {
        value: todayBookings,
        change: bookingChange,
        changeType: bookingChange >= 0 ? 'increase' : 'decrease',
      },
      monthlyRevenue: {
        value: thisMonthRevenue,
        change: `${revenueChange}%`,
        changeType: parseFloat(revenueChange) >= 0 ? 'increase' : 'decrease',
      },
      pendingOrders: {
        value: pendingOrders,
        change: orderChange,
        changeType: orderChange <= 0 ? 'increase' : 'decrease', // 待处理订单减少是好事
      },
      totalCustomers: {
        value: totalCustomers.length,
        change: customerChange,
        changeType: customerChange >= 0 ? 'increase' : 'decrease',
      },
    }

    return createSuccessResponse(stats)
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return createErrorResponse('获取统计数据失败', 500)
  }
}

export const GET = withAuth(getStats)
