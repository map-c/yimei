import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from './auth'
import { hasPermission, hasAnyPermission, hasAllPermissions, Permission, PermissionCheck } from './permissions'

/**
 * 认证中间件 - 检查管理员是否已登录
 */
export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  const admin = await getAdminFromRequest(request)
  
  if (!admin) {
    return NextResponse.json(
      { success: false, error: '未认证，请先登录' },
      { status: 401 }
    )
  }
  
  return null // 认证通过，返回null表示继续处理
}

/**
 * 权限检查中间件
 */
export async function requirePermissions(
  request: NextRequest,
  permissionCheck: PermissionCheck
): Promise<NextResponse | null> {
  const admin = await getAdminFromRequest(request)
  
  if (!admin) {
    return NextResponse.json(
      { success: false, error: '未认证，请先登录' },
      { status: 401 }
    )
  }

  const { required, mode } = permissionCheck
  let hasRequiredPermissions = false

  if (mode === 'all') {
    hasRequiredPermissions = hasAllPermissions(admin.role, required)
  } else {
    hasRequiredPermissions = hasAnyPermission(admin.role, required)
  }

  if (!hasRequiredPermissions) {
    return NextResponse.json(
      { success: false, error: '权限不足' },
      { status: 403 }
    )
  }

  return null // 权限检查通过
}

/**
 * API路由权限装饰器
 */
export function withAuth(handler: Function) {
  return async function (request: NextRequest, ...args: any[]) {
    const authError = await requireAuth(request)
    if (authError) return authError
    
    return handler(request, ...args)
  }
}

/**
 * API路由权限装饰器（带权限检查）
 */
export function withPermissions(permissionCheck: PermissionCheck, handler: Function) {
  return async function (request: NextRequest, ...args: any[]) {
    const authError = await requireAuth(request)
    if (authError) return authError
    
    const permissionError = await requirePermissions(request, permissionCheck)
    if (permissionError) return permissionError
    
    return handler(request, ...args)
  }
}

/**
 * 获取当前请求的管理员信息（用于API处理函数内部）
 */
export async function getCurrentAdmin(request: NextRequest) {
  return await getAdminFromRequest(request)
}

/**
 * API响应格式化工具
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function createSuccessResponse<T>(data: T, message?: string): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    message,
  })
}

export function createErrorResponse(error: string, status: number = 400): NextResponse {
  return NextResponse.json({
    success: false,
    error,
  }, { status })
}

export function createPaginatedResponse<T>(
  data: T[],
  pagination: { page: number; limit: number; total: number },
  message?: string
): NextResponse {
  const totalPages = Math.ceil(pagination.total / pagination.limit)
  
  return NextResponse.json({
    success: true,
    data,
    message,
    pagination: {
      ...pagination,
      totalPages,
    },
  })
}
