import { NextRequest } from 'next/server'
import { withAuth, createSuccessResponse, createErrorResponse } from '@/lib/admin/middleware'
import { prisma } from '@/lib/prisma'

async function getRecentActivity(request: NextRequest) {
  try {
    // 获取最近的预约
    const recentBookings = await prisma.booking.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        orders: {
          select: {
            paymentStatus: true,
            paidAmount: true,
            totalAmount: true,
          },
        },
      },
    })

    // 获取最近的订单
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        booking: {
          select: {
            customerName: true,
            serviceName: true,
          },
        },
      },
    })

    // 获取今日预约
    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

    const todayBookings = await prisma.booking.findMany({
      where: {
        appointmentDate: {
          gte: startOfToday.toISOString().split('T')[0],
          lt: endOfToday.toISOString().split('T')[0],
        },
      },
      orderBy: {
        appointmentTime: 'asc',
      },
      take: 20,
    })

    // 格式化数据
    const formattedRecentBookings = recentBookings.map(booking => ({
      id: booking.id,
      customerName: booking.customerName,
      serviceName: booking.serviceName,
      appointmentDate: booking.appointmentDate,
      appointmentTime: booking.appointmentTime,
      status: booking.status,
      createdAt: booking.createdAt,
      paymentStatus: booking.orders[0]?.paymentStatus || 'PENDING',
    }))

    const formattedRecentOrders = recentOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.booking.customerName,
      serviceName: order.booking.serviceName,
      totalAmount: order.totalAmount,
      paidAmount: order.paidAmount,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
    }))

    const formattedTodayBookings = todayBookings.map(booking => ({
      id: booking.id,
      customerName: booking.customerName,
      serviceName: booking.serviceName,
      appointmentTime: booking.appointmentTime,
      status: booking.status,
      customerPhone: booking.customerPhone,
    }))

    return createSuccessResponse({
      recentBookings: formattedRecentBookings,
      recentOrders: formattedRecentOrders,
      todayBookings: formattedTodayBookings,
    })
  } catch (error) {
    console.error('Dashboard recent activity error:', error)
    return createErrorResponse('获取最近活动失败', 500)
  }
}

export const GET = withAuth(getRecentActivity)
