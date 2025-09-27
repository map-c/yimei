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
  status: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  doctorId: z.string().optional(),
  serviceId: z.string().optional(),
})

async function getBookings(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))
    
    const page = parseInt(query.page)
    const limit = parseInt(query.limit)
    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}

    // 搜索条件
    if (query.search) {
      where.OR = [
        { customerName: { contains: query.search, mode: 'insensitive' } },
        { customerPhone: { contains: query.search } },
        { customerEmail: { contains: query.search, mode: 'insensitive' } },
        { serviceName: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    // 状态筛选
    if (query.status) {
      where.status = query.status
    }

    // 日期范围筛选
    if (query.dateFrom || query.dateTo) {
      where.appointmentDate = {}
      if (query.dateFrom) {
        where.appointmentDate.gte = query.dateFrom
      }
      if (query.dateTo) {
        where.appointmentDate.lte = query.dateTo
      }
    }

    // 医师筛选
    if (query.doctorId) {
      where.doctorId = query.doctorId
    }

    // 服务项目筛选
    if (query.serviceId) {
      where.serviceId = query.serviceId
    }

    // 获取总数
    const total = await prisma.booking.count({ where })

    // 获取预约列表
    const bookings = await prisma.booking.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { appointmentDate: 'desc' },
        { appointmentTime: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            totalAmount: true,
            paidAmount: true,
            paymentStatus: true,
            paymentMethod: true,
          },
        },
      },
    })

    // 格式化数据
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      customerEmail: booking.customerEmail,
      serviceName: booking.serviceName,
      doctorName: booking.doctorName,
      appointmentDate: booking.appointmentDate,
      appointmentTime: booking.appointmentTime,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      order: booking.orders[0] || null,
    }))

    return createPaginatedResponse(
      formattedBookings,
      { page, limit, total }
    )
  } catch (error) {
    console.error('Get bookings error:', error)
    return createErrorResponse('获取预约列表失败', 500)
  }
}

// 创建新预约
const createBookingSchema = z.object({
  customerName: z.string().min(1, '客户姓名不能为空'),
  customerPhone: z.string().min(1, '客户手机号不能为空'),
  customerEmail: z.string().email('邮箱格式不正确').optional(),
  serviceId: z.string().min(1, '服务项目不能为空'),
  serviceName: z.string().min(1, '服务名称不能为空'),
  doctorId: z.string().min(1, '医师不能为空'),
  doctorName: z.string().min(1, '医师姓名不能为空'),
  appointmentDate: z.string().min(1, '预约日期不能为空'),
  appointmentTime: z.string().min(1, '预约时间不能为空'),
  budget: z.string().optional(),
  concerns: z.string().optional(),
  expectations: z.string().optional(),
  notes: z.string().optional(),
})

async function createBooking(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) {
      return createErrorResponse('未认证', 401)
    }

    const body = await request.json()
    const validation = createBookingSchema.safeParse(body)
    
    if (!validation.success) {
      return createErrorResponse('请求数据格式错误', 400)
    }

    const data = validation.data

    // 检查时间冲突
    const conflictBooking = await prisma.booking.findFirst({
      where: {
        doctorId: data.doctorId,
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        status: {
          not: 'CANCELLED'
        }
      }
    })

    if (conflictBooking) {
      return createErrorResponse('该时间段已被预约', 400)
    }

    // 创建预约
    const booking = await prisma.booking.create({
      data: {
        ...data,
        status: 'PENDING',
      },
    })

    // 记录操作日志
    await logAdminAction(
      admin.id,
      'CREATE_BOOKING',
      'booking',
      booking.id,
      `创建预约: ${data.customerName} - ${data.serviceName}`,
      request.headers.get('x-forwarded-for') || 'unknown'
    )

    return createSuccessResponse(booking, '预约创建成功')
  } catch (error) {
    console.error('Create booking error:', error)
    return createErrorResponse('创建预约失败', 500)
  }
}

export const GET = withPermissions(
  createPermissionCheck(Permission.VIEW_BOOKINGS),
  getBookings
)

export const POST = withPermissions(
  createPermissionCheck(Permission.EDIT_BOOKINGS),
  createBooking
)
