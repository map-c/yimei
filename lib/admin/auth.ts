import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'
import { prisma } from '../prisma'
import { AdminRole } from '../generated/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface AdminPayload {
  id: string
  username: string
  email: string
  role: AdminRole
}

export interface AuthResult {
  success: boolean
  admin?: AdminPayload
  error?: string
}

/**
 * 生成JWT token
 */
export function generateToken(admin: AdminPayload): string {
  return jwt.sign(admin, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

/**
 * 验证JWT token
 */
export function verifyToken(token: string): AdminPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminPayload
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * 哈希密码
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

/**
 * 验证密码
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

/**
 * 管理员登录
 */
export async function loginAdmin(username: string, password: string, ipAddress?: string): Promise<AuthResult> {
  try {
    // 查找管理员
    const admin = await prisma.admin.findUnique({
      where: { username },
    })

    if (!admin) {
      return { success: false, error: '用户名或密码错误' }
    }

    if (admin.status !== 'ACTIVE') {
      return { success: false, error: '账户已被禁用' }
    }

    // 验证密码
    const isValidPassword = await verifyPassword(password, admin.password)
    if (!isValidPassword) {
      return { success: false, error: '用户名或密码错误' }
    }

    // 更新最后登录时间
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    })

    // 记录登录日志
    await prisma.adminLog.create({
      data: {
        adminId: admin.id,
        action: 'LOGIN',
        targetType: 'admin',
        targetId: admin.id,
        details: '管理员登录',
        ipAddress,
      },
    })

    const adminPayload: AdminPayload = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    }

    return { success: true, admin: adminPayload }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: '登录失败，请重试' }
  }
}

/**
 * 从请求中获取管理员信息
 */
export async function getAdminFromRequest(request: NextRequest): Promise<AdminPayload | null> {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return null
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return null
    }

    // 验证管理员是否仍然存在且活跃
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
    })

    if (!admin || admin.status !== 'ACTIVE') {
      return null
    }

    return decoded
  } catch (error) {
    console.error('Get admin from request error:', error)
    return null
  }
}

/**
 * 记录管理员操作日志
 */
export async function logAdminAction(
  adminId: string,
  action: string,
  targetType: string,
  targetId?: string,
  details?: string,
  ipAddress?: string
) {
  try {
    await prisma.adminLog.create({
      data: {
        adminId,
        action,
        targetType,
        targetId,
        details,
        ipAddress,
      },
    })
  } catch (error) {
    console.error('Log admin action error:', error)
  }
}
