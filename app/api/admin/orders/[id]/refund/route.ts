import { NextRequest } from 'next/server'
import { withPermissions, createSuccessResponse, createErrorResponse, getCurrentAdmin } from '@/lib/admin/middleware'
import { createPermissionCheck, Permission } from '@/lib/admin/permissions'
import { logAdminAction } from '@/lib/admin/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 退款请求验证
const refundSchema = z.object({
  refundAmount: z.number().min(0, '退款金额必须大于0'),
  refundReason: z.string().min(1, '退款原因不能为空'),
  refundMethod: z.enum(['original', 'cash', 'transfer']).default('original'),
})

async function processRefund(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) {
      return createErrorResponse('未认证', 401)
    }

    const body = await request.json()
    const validation = refundSchema.safeParse(body)
    
    if (!validation.success) {
      return createErrorResponse('请求数据格式错误', 400)
    }

    const { refundAmount, refundReason, refundMethod } = validation.data

    // 检查订单是否存在
    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: { booking: true }
    })

    if (!existingOrder) {
      return createErrorResponse('订单不存在', 404)
    }

    // 检查订单状态
    if (existingOrder.paymentStatus !== 'PAID' && existingOrder.paymentStatus !== 'PARTIAL') {
      return createErrorResponse('只能对已支付或部分支付的订单进行退款', 400)
    }

    // 检查退款金额
    if (refundAmount > existingOrder.paidAmount) {
      return createErrorResponse('退款金额不能超过已支付金额', 400)
    }

    // 计算退款后的状态
    const newPaidAmount = existingOrder.paidAmount - refundAmount
    let newPaymentStatus: string

    if (newPaidAmount === 0) {
      newPaymentStatus = 'REFUNDED'
    } else if (newPaidAmount < existingOrder.totalAmount) {
      newPaymentStatus = 'PARTIAL'
    } else {
      newPaymentStatus = 'PAID'
    }

    // 执行退款操作
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // 更新订单状态
      const order = await tx.order.update({
        where: { id: params.id },
        data: {
          paidAmount: newPaidAmount,
          paymentStatus: newPaymentStatus as any,
          updatedAt: new Date(),
        },
        include: { booking: true },
      })

      // 如果完全退款，可能需要更新预约状态
      if (newPaymentStatus === 'REFUNDED') {
        await tx.booking.update({
          where: { id: order.bookingId },
          data: {
            status: 'CANCELLED',
            updatedAt: new Date(),
          },
        })
      }

      return order
    })

    // 记录操作日志
    await logAdminAction(
      admin.id,
      'PROCESS_REFUND',
      'order',
      params.id,
      `处理退款: 金额¥${refundAmount}, 原因: ${refundReason}, 方式: ${refundMethod}`,
      request.headers.get('x-forwarded-for') || 'unknown'
    )

    // 这里可以集成实际的支付网关退款API
    // 例如：微信支付、支付宝退款接口
    
    return createSuccessResponse({
      order: updatedOrder,
      refund: {
        amount: refundAmount,
        reason: refundReason,
        method: refundMethod,
        processedAt: new Date(),
        processedBy: admin.username,
      }
    }, '退款处理成功')
  } catch (error) {
    console.error('Process refund error:', error)
    return createErrorResponse('退款处理失败', 500)
  }
}

export const POST = withPermissions(
  createPermissionCheck(Permission.PROCESS_REFUNDS),
  processRefund
)
