import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest, logAdminAction } from '@/lib/admin/auth'

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    
    if (admin) {
      // 记录退出日志
      const ipAddress = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown'
      
      await logAdminAction(
        admin.id,
        'LOGOUT',
        'admin',
        admin.id,
        '管理员退出登录',
        ipAddress
      )
    }

    // 创建响应并清除cookie
    const response = NextResponse.json({
      success: true,
      message: '退出登录成功'
    })

    // 清除认证cookie
    response.cookies.set('admin-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Logout API error:', error)
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
