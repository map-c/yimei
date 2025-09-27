'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { AdminPayload } from '@/lib/admin/auth'
import { hasPermission, Permission } from '@/lib/admin/permissions'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Calendar,
  ShoppingCart,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Heart,
  FileText,
  UserCog,
  Home
} from 'lucide-react'

interface AdminSidebarProps {
  admin: AdminPayload
}

interface MenuItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  permission?: Permission
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    title: '首页',
    href: '/admin',
    icon: Home,
  },
  {
    title: '仪表板',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    permission: Permission.VIEW_DASHBOARD,
  },
  {
    title: '预约管理',
    href: '/admin/bookings',
    icon: Calendar,
    permission: Permission.VIEW_BOOKINGS,
  },
  {
    title: '订单管理',
    href: '/admin/orders',
    icon: ShoppingCart,
    permission: Permission.VIEW_ORDERS,
  },
  {
    title: '客户管理',
    href: '/admin/customers',
    icon: Users,
    permission: Permission.VIEW_CUSTOMERS,
  },
  {
    title: '系统设置',
    href: '/admin/settings',
    icon: Settings,
    permission: Permission.MANAGE_SETTINGS,
    children: [
      {
        title: '基本设置',
        href: '/admin/settings',
        icon: Settings,
        permission: Permission.MANAGE_SETTINGS,
      },
      {
        title: '管理员管理',
        href: '/admin/settings/admins',
        icon: UserCog,
        permission: Permission.MANAGE_ADMINS,
      },
      {
        title: '操作日志',
        href: '/admin/logs',
        icon: FileText,
        permission: Permission.VIEW_LOGS,
      },
    ],
  },
]

export function AdminSidebar({ admin }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  // 过滤菜单项基于权限
  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items.filter(item => {
      if (item.permission && !hasPermission(admin.role, item.permission)) {
        return false
      }
      if (item.children) {
        item.children = filterMenuItems(item.children)
      }
      return true
    })
  }

  const filteredMenuItems = filterMenuItems(menuItems)

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href
    }
    if (href === '/admin/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className={cn(
      "bg-card border-r border-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Heart className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">美丽诊所</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {filteredMenuItems.map((item) => (
          <div key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>

            {/* Sub-menu items */}
            {!isCollapsed && item.children && item.children.length > 0 && (
              <div className="ml-6 mt-2 space-y-1">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive(child.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <child.icon className="h-3 w-3 flex-shrink-0" />
                    <span>{child.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Info (collapsed state) */}
      {isCollapsed && (
        <div className="absolute bottom-4 left-4">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-primary-foreground">
              {admin.username.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
