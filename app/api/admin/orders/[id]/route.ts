import { NextRequest } from 'next/server'
import { withPermissions, createSuccessResponse, createErrorResponse, getCurrentAdmin } from '@/lib/admin/middleware'
import { createPermissionCheck, Permission } from '@/lib/admin/permissions'
import { logAdminAction } from '@/lib/admin/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 获取单个订单详情
async function getOrder(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        booking: {
          include: {
            orders: {
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    })

    if (!order) {
      return createErrorResponse('订单不存在', 404)
    }

    return createSuccessResponse(order)
  } catch (error) {
    console.error('Get order error:', error)
    return createErrorResponse('获取订单详情失败', 500)
  }
}

// 更新订单信息
const updateOrderSchema = z.object({
  paymentStatus: z.enum(['PENDING', 'PAID', 'PARTIAL', 'REFUNDED', 'FAILED']).optional(),
  paymentMethod: z.string().optional(),
  paidAmount: z.number().min(0).optional(),
  notes: z.string().optional(),
})

async function updateOrder(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) {
      return createErrorResponse('未认证', 401)
    }

    const body = await request.json()
    const validation = updateOrderSchema.safeParse(body)
    
    if (!validation.success) {
      return createErrorResponse('请求数据格式错误', 400)
    }

    const data = validation.data

    // 检查订单是否存在
    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: { booking: true }
    })

    if (!existingOrder) {
      return createErrorResponse('订单不存在', 404)
    }

    // 验证支付金额不能超过总金额
    if (data.paidAmount !== undefined && data.paidAmount > existingOrder.totalAmount) {
      return createErrorResponse('支付金额不能超过订单总金额', 400)
    }

    // 更新订单
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        booking: true,
      },
    })

    // 记录操作日志
    const changes = Object.keys(data).map(key => `${key}: ${data[key as keyof typeof data]}`).join(', ')
    await logAdminAction(
      admin.id,
      'UPDATE_ORDER',
      'order',
      params.id,
      `更新订单: ${changes}`,
      request.headers.get('x-forwarded-for') || 'unknown'
    )

    return createSuccessResponse(updatedOrder, '订单更新成功')
  } catch (error) {
    console.error('Update order error:', error)
    return createErrorResponse('更新订单失败', 500)
  }
}

export const GET = withPermissions(
  createPermissionCheck(Permission.VIEW_ORDERS),
  getOrder
)

export const PUT = withPermissions(
  createPermissionCheck(Permission.EDIT_ORDERS),
  updateOrder
)
