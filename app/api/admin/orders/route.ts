import { NextRequest } from 'next/server'
import { withPermissions, createSuccessResponse, createErrorResponse, createPaginatedResponse, getCurrentAdmin } from '@/lib/admin/middleware'
import { createPermissionCheck, Permission } from '@/lib/admin/permissions'
import { logAdminAction } from '@/lib/admin/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 查询参数验证
const querySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  search: z.string().optional(),
  paymentStatus: z.string().optional(),
  paymentMethod: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  amountMin: z.string().optional(),
  amountMax: z.string().optional(),
})

async function getOrders(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))
    
    const page = parseInt(query.page)
    const limit = parseInt(query.limit)
    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}

    // 搜索条件 - 通过关联的预约信息搜索
    if (query.search) {
      where.booking = {
        OR: [
          { customerName: { contains: query.search, mode: 'insensitive' } },
          { customerPhone: { contains: query.search } },
          { customerEmail: { contains: query.search, mode: 'insensitive' } },
        ]
      }
    }

    // 支付状态筛选
    if (query.paymentStatus) {
      where.paymentStatus = query.paymentStatus
    }

    // 支付方式筛选
    if (query.paymentMethod) {
      where.paymentMethod = query.paymentMethod
    }

    // 日期范围筛选
    if (query.dateFrom || query.dateTo) {
      where.createdAt = {}
      if (query.dateFrom) {
        where.createdAt.gte = new Date(query.dateFrom)
      }
      if (query.dateTo) {
        const endDate = new Date(query.dateTo)
        endDate.setHours(23, 59, 59, 999)
        where.createdAt.lte = endDate
      }
    }

    // 金额范围筛选
    if (query.amountMin || query.amountMax) {
      where.totalAmount = {}
      if (query.amountMin) {
        where.totalAmount.gte = parseFloat(query.amountMin)
      }
      if (query.amountMax) {
        where.totalAmount.lte = parseFloat(query.amountMax)
      }
    }

    // 获取总数
    const total = await prisma.order.count({ where })

    // 获取订单列表
    const orders = await prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        booking: {
          select: {
            id: true,
            customerName: true,
            customerPhone: true,
            customerEmail: true,
            serviceName: true,
            doctorName: true,
            appointmentDate: true,
            appointmentTime: true,
            status: true,
          },
        },
      },
    })

    // 格式化数据
    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      paidAmount: order.paidAmount,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      paymentType: order.paymentType,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      booking: order.booking,
    }))

    return createPaginatedResponse(
      formattedOrders,
      { page, limit, total }
    )
  } catch (error) {
    console.error('Get orders error:', error)
    return createErrorResponse('获取订单列表失败', 500)
  }
}

export const GET = withPermissions(
  createPermissionCheck(Permission.VIEW_ORDERS),
  getOrders
)
