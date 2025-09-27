'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { AdminPayload } from '@/lib/admin/auth'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [admin, setAdmin] = useState<AdminPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // 检查是否是登录页面
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) {
      setIsLoading(false)
      return
    }

    // 检查管理员认证状态
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth/me')
        const result = await response.json()

        if (result.success && result.admin) {
          setAdmin(result.admin)
        } else {
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/admin/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [isLoginPage, router])

  // 登录页面直接渲染
  if (isLoginPage) {
    return <>{children}</>
  }

  // 加载中状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  // 未认证状态
  if (!admin) {
    return null // 会被重定向到登录页
  }

  // 管理后台布局
  return (
    <div className="flex h-screen bg-background">
      {/* 侧边栏 */}
      <AdminSidebar admin={admin} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航 */}
        <AdminHeader admin={admin} onLogout={() => setAdmin(null)} />
        
        {/* 主内容区 */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
