import { NextRequest } from 'next/server'
import { withPermissions, createSuccessResponse, createErrorResponse, createPaginatedResponse } from '@/lib/admin/middleware'
import { createPermissionCheck, Permission } from '@/lib/admin/permissions'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 查询参数验证
const querySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  search: z.string().optional(),
  action: z.string().optional(),
  adminId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

// 获取操作日志列表
async function getLogs(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))
    
    const page = parseInt(query.page)
    const limit = parseInt(query.limit)
    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}
    
    if (query.search) {
      where.OR = [
        { action: { contains: query.search, mode: 'insensitive' } },
        { details: { contains: query.search, mode: 'insensitive' } },
        { admin: { username: { contains: query.search, mode: 'insensitive' } } },
      ]
    }
    
    if (query.action) {
      where.action = query.action
    }
    
    if (query.adminId) {
      where.adminId = query.adminId
    }
    
    if (query.startDate || query.endDate) {
      where.createdAt = {}
      if (query.startDate) {
        where.createdAt.gte = new Date(query.startDate)
      }
      if (query.endDate) {
        where.createdAt.lte = new Date(query.endDate)
      }
    }

    // 获取总数
    const total = await prisma.adminLog.count({ where })

    // 获取日志列表
    const logs = await prisma.adminLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    })

    return createPaginatedResponse(logs, { page, limit, total })
  } catch (error) {
    console.error('Get logs error:', error)
    return createErrorResponse('获取操作日志失败', 500)
  }
}

// 获取操作统计
async function getLogStats(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // 按操作类型统计
    const actionStats = await prisma.adminLog.groupBy({
      by: ['action'],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        action: true,
      },
      orderBy: {
        _count: {
          action: 'desc',
        },
      },
    })

    // 按管理员统计
    const adminStats = await prisma.adminLog.groupBy({
      by: ['adminId'],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        adminId: true,
      },
      orderBy: {
        _count: {
          adminId: 'desc',
        },
      },
      take: 10,
    })

    // 获取管理员信息
    const adminIds = adminStats.map(stat => stat.adminId)
    const admins = await prisma.admin.findMany({
      where: {
        id: { in: adminIds },
      },
      select: {
        id: true,
        username: true,
      },
    })

    const adminStatsWithNames = adminStats.map(stat => ({
      ...stat,
      admin: admins.find(admin => admin.id === stat.adminId),
    }))

    // 按日期统计
    const dailyStats = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM admin_logs 
      WHERE created_at >= ${startDate}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `

    return createSuccessResponse({
      actionStats,
      adminStats: adminStatsWithNames,
      dailyStats,
    })
  } catch (error) {
    console.error('Get log stats error:', error)
    return createErrorResponse('获取统计数据失败', 500)
  }
}

export const GET = withPermissions(
  createPermissionCheck(Permission.VIEW_LOGS),
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url)
    if (searchParams.get('stats') === 'true') {
      return getLogStats(request)
    }
    return getLogs(request)
  }
)
