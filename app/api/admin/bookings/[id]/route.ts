import { NextRequest } from 'next/server'
import { withPermissions, createSuccessResponse, createErrorResponse, getCurrentAdmin } from '@/lib/admin/middleware'
import { createPermissionCheck, Permission } from '@/lib/admin/permissions'
import { logAdminAction } from '@/lib/admin/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 获取单个预约详情
async function getBooking(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!booking) {
      return createErrorResponse('预约不存在', 404)
    }

    return createSuccessResponse(booking)
  } catch (error) {
    console.error('Get booking error:', error)
    return createErrorResponse('获取预约详情失败', 500)
  }
}

// 更新预约信息
const updateBookingSchema = z.object({
  customerName: z.string().min(1).optional(),
  customerPhone: z.string().min(1).optional(),
  customerEmail: z.string().email().optional(),
  serviceId: z.string().optional(),
  serviceName: z.string().optional(),
  doctorId: z.string().optional(),
  doctorName: z.string().optional(),
  appointmentDate: z.string().optional(),
  appointmentTime: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
  budget: z.string().optional(),
  concerns: z.string().optional(),
  expectations: z.string().optional(),
  notes: z.string().optional(),
})

async function updateBooking(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) {
      return createErrorResponse('未认证', 401)
    }

    const body = await request.json()
    const validation = updateBookingSchema.safeParse(body)
    
    if (!validation.success) {
      return createErrorResponse('请求数据格式错误', 400)
    }

    const data = validation.data

    // 检查预约是否存在
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id }
    })

    if (!existingBooking) {
      return createErrorResponse('预约不存在', 404)
    }

    // 如果更新时间，检查冲突
    if (data.doctorId && data.appointmentDate && data.appointmentTime) {
      const conflictBooking = await prisma.booking.findFirst({
        where: {
          id: { not: params.id },
          doctorId: data.doctorId,
          appointmentDate: data.appointmentDate,
          appointmentTime: data.appointmentTime,
          status: { not: 'CANCELLED' }
        }
      })

      if (conflictBooking) {
        return createErrorResponse('该时间段已被预约', 400)
      }
    }

    // 更新预约
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        orders: true,
      },
    })

    // 记录操作日志
    const changes = Object.keys(data).map(key => `${key}: ${data[key as keyof typeof data]}`).join(', ')
    await logAdminAction(
      admin.id,
      'UPDATE_BOOKING',
      'booking',
      params.id,
      `更新预约: ${changes}`,
      request.headers.get('x-forwarded-for') || 'unknown'
    )

    return createSuccessResponse(updatedBooking, '预约更新成功')
  } catch (error) {
    console.error('Update booking error:', error)
    return createErrorResponse('更新预约失败', 500)
  }
}

// 删除预约
async function deleteBooking(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) {
      return createErrorResponse('未认证', 401)
    }

    // 检查预约是否存在
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { orders: true }
    })

    if (!existingBooking) {
      return createErrorResponse('预约不存在', 404)
    }

    // 检查是否有已支付的订单
    const paidOrders = existingBooking.orders.filter(order => order.paymentStatus === 'PAID')
    if (paidOrders.length > 0) {
      return createErrorResponse('该预约有已支付订单，无法删除', 400)
    }

    // 删除预约（会级联删除相关订单）
    await prisma.booking.delete({
      where: { id: params.id }
    })

    // 记录操作日志
    await logAdminAction(
      admin.id,
      'DELETE_BOOKING',
      'booking',
      params.id,
      `删除预约: ${existingBooking.customerName} - ${existingBooking.serviceName}`,
      request.headers.get('x-forwarded-for') || 'unknown'
    )

    return createSuccessResponse(null, '预约删除成功')
  } catch (error) {
    console.error('Delete booking error:', error)
    return createErrorResponse('删除预约失败', 500)
  }
}

export const GET = withPermissions(
  createPermissionCheck(Permission.VIEW_BOOKINGS),
  getBooking
)

export const PUT = withPermissions(
  createPermissionCheck(Permission.EDIT_BOOKINGS),
  updateBooking
)

export const DELETE = withPermissions(
  createPermissionCheck(Permission.DELETE_BOOKINGS),
  deleteBooking
)
