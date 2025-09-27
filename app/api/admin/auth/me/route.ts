import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/admin/auth'

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    
    if (!admin) {
      return NextResponse.json(
        { success: false, error: '未认证' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      }
    })
  } catch (error) {
    console.error('Get admin info error:', error)
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
