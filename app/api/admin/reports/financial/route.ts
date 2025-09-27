import { NextRequest } from 'next/server'
import { withPermissions, createSuccessResponse, createErrorResponse } from '@/lib/admin/middleware'
import { createPermissionCheck, Permission } from '@/lib/admin/permissions'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 查询参数验证
const querySchema = z.object({
  period: z.enum(['daily', 'weekly', 'monthly']).default('monthly'),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  year: z.string().optional(),
  month: z.string().optional(),
})

async function getFinancialReport(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))
    
    const now = new Date()
    let startDate: Date
    let endDate: Date

    // 根据查询参数确定日期范围
    if (query.dateFrom && query.dateTo) {
      startDate = new Date(query.dateFrom)
      endDate = new Date(query.dateTo)
      endDate.setHours(23, 59, 59, 999)
    } else if (query.year && query.month) {
      startDate = new Date(parseInt(query.year), parseInt(query.month) - 1, 1)
      endDate = new Date(parseInt(query.year), parseInt(query.month), 0, 23, 59, 59, 999)
    } else {
      // 默认当前月
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    }

    // 获取订单数据
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        booking: {
          select: {
            serviceName: true,
            doctorName: true,
            appointmentDate: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    // 根据周期类型聚合数据
    const aggregatedData = aggregateDataByPeriod(orders, query.period, startDate, endDate)

    // 计算总体统计
    const totalRevenue = orders.reduce((sum, order) => 
      order.paymentStatus === 'PAID' ? sum + order.paidAmount : sum, 0
    )
    
    const totalOrders = orders.length
    const paidOrders = orders.filter(order => order.paymentStatus === 'PAID').length
    const pendingAmount = orders.reduce((sum, order) => 
      order.paymentStatus === 'PENDING' ? sum + order.totalAmount : sum, 0
    )
    
    const refundedAmount = orders.reduce((sum, order) => 
      order.paymentStatus === 'REFUNDED' ? sum + order.paidAmount : sum, 0
    )

    // 按服务项目统计
    const serviceStats = aggregateByService(orders)
    
    // 按医师统计
    const doctorStats = aggregateByDoctor(orders)

    // 按支付方式统计
    const paymentMethodStats = aggregateByPaymentMethod(orders)

    return createSuccessResponse({
      period: query.period,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
      summary: {
        totalRevenue,
        totalOrders,
        paidOrders,
        pendingAmount,
        refundedAmount,
        averageOrderValue: totalOrders > 0 ? totalRevenue / paidOrders : 0,
        conversionRate: totalOrders > 0 ? (paidOrders / totalOrders) * 100 : 0,
      },
      chartData: aggregatedData,
      serviceStats,
      doctorStats,
      paymentMethodStats,
    })
  } catch (error) {
    console.error('Financial report error:', error)
    return createErrorResponse('获取财务报表失败', 500)
  }
}

function aggregateDataByPeriod(orders: any[], period: string, startDate: Date, endDate: Date) {
  const data: { [key: string]: { date: string; revenue: number; orders: number; paidOrders: number } } = {}

  // 初始化数据结构
  const current = new Date(startDate)
  while (current <= endDate) {
    let key: string
    
    if (period === 'daily') {
      key = current.toISOString().split('T')[0]
      current.setDate(current.getDate() + 1)
    } else if (period === 'weekly') {
      const weekStart = new Date(current)
      weekStart.setDate(current.getDate() - current.getDay())
      key = weekStart.toISOString().split('T')[0]
      current.setDate(current.getDate() + 7)
    } else {
      key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`
      current.setMonth(current.getMonth() + 1)
    }

    data[key] = { date: key, revenue: 0, orders: 0, paidOrders: 0 }
  }

  // 聚合订单数据
  orders.forEach(order => {
    const orderDate = new Date(order.createdAt)
    let key: string

    if (period === 'daily') {
      key = orderDate.toISOString().split('T')[0]
    } else if (period === 'weekly') {
      const weekStart = new Date(orderDate)
      weekStart.setDate(orderDate.getDate() - orderDate.getDay())
      key = weekStart.toISOString().split('T')[0]
    } else {
      key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`
    }

    if (data[key]) {
      data[key].orders += 1
      if (order.paymentStatus === 'PAID') {
        data[key].revenue += order.paidAmount
        data[key].paidOrders += 1
      }
    }
  })

  return Object.values(data)
}

function aggregateByService(orders: any[]) {
  const serviceMap: { [key: string]: { revenue: number; orders: number; paidOrders: number } } = {}

  orders.forEach(order => {
    const serviceName = order.booking.serviceName
    if (!serviceMap[serviceName]) {
      serviceMap[serviceName] = { revenue: 0, orders: 0, paidOrders: 0 }
    }

    serviceMap[serviceName].orders += 1
    if (order.paymentStatus === 'PAID') {
      serviceMap[serviceName].revenue += order.paidAmount
      serviceMap[serviceName].paidOrders += 1
    }
  })

  return Object.entries(serviceMap)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
}

function aggregateByDoctor(orders: any[]) {
  const doctorMap: { [key: string]: { revenue: number; orders: number; paidOrders: number } } = {}

  orders.forEach(order => {
    const doctorName = order.booking.doctorName
    if (!doctorMap[doctorName]) {
      doctorMap[doctorName] = { revenue: 0, orders: 0, paidOrders: 0 }
    }

    doctorMap[doctorName].orders += 1
    if (order.paymentStatus === 'PAID') {
      doctorMap[doctorName].revenue += order.paidAmount
      doctorMap[doctorName].paidOrders += 1
    }
  })

  return Object.entries(doctorMap)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
}

function aggregateByPaymentMethod(orders: any[]) {
  const methodMap: { [key: string]: { revenue: number; orders: number } } = {}

  orders.forEach(order => {
    if (order.paymentStatus === 'PAID' && order.paymentMethod) {
      const method = order.paymentMethod
      if (!methodMap[method]) {
        methodMap[method] = { revenue: 0, orders: 0 }
      }

      methodMap[method].revenue += order.paidAmount
      methodMap[method].orders += 1
    }
  })

  const methodLabels: { [key: string]: string } = {
    'wechat': '微信支付',
    'alipay': '支付宝',
    'card': '信用卡',
  }

  return Object.entries(methodMap)
    .map(([method, stats]) => ({ 
      method, 
      name: methodLabels[method] || method, 
      ...stats 
    }))
    .sort((a, b) => b.revenue - a.revenue)
}

export const GET = withPermissions(
  createPermissionCheck(Permission.VIEW_ORDERS),
  getFinancialReport
)
