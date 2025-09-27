import { NextRequest, NextResponse } from 'next/server'
import { loginAdmin, generateToken } from '@/lib/admin/auth'
import { z } from 'zod'

const loginSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(1, '密码不能为空'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证请求数据
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: '请求数据格式错误',
          details: validation.error.errors 
        },
        { status: 400 }
      )
    }

    const { username, password } = validation.data
    
    // 获取客户端IP地址
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    // 尝试登录
    const result = await loginAdmin(username, password, ipAddress)
    
    if (!result.success || !result.admin) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      )
    }

    // 生成JWT token
    const token = generateToken(result.admin)
    
    // 创建响应
    const response = NextResponse.json({
      success: true,
      message: '登录成功',
      admin: {
        id: result.admin.id,
        username: result.admin.username,
        email: result.admin.email,
        role: result.admin.role,
      }
    })

    // 设置HTTP-only cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
