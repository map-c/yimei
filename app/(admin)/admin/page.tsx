'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Calendar,
  ShoppingCart,
  Users,
  Settings,
  ArrowRight,
  Heart,
  TrendingUp,
  Clock,
  Shield
} from 'lucide-react'

export default function AdminIndexPage() {
  const router = useRouter()

  // 自动重定向到仪表板 (可选)
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.push('/admin/dashboard')
  //   }, 3000)
  //   return () => clearTimeout(timer)
  // }, [router])

  const quickActions = [
    {
      title: '仪表板',
      description: '查看业务概览和关键指标',
      icon: LayoutDashboard,
      href: '/admin/dashboard',
      color: 'bg-blue-500',
    },
    {
      title: '预约管理',
      description: '管理客户预约和时间安排',
      icon: Calendar,
      href: '/admin/bookings',
      color: 'bg-green-500',
    },
    {
      title: '订单管理',
      description: '处理订单和支付事务',
      icon: ShoppingCart,
      href: '/admin/orders',
      color: 'bg-purple-500',
    },
    {
      title: '客户管理',
      description: '管理客户信息和档案',
      icon: Users,
      href: '/admin/customers',
      color: 'bg-orange-500',
    },
    {
      title: '系统设置',
      description: '配置系统参数和管理员权限',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500',
    },
  ]

  const stats = [
    { label: '今日预约', value: '12', icon: Calendar, trend: '+8%' },
    { label: '活跃客户', value: '156', icon: Users, trend: '+12%' },
    { label: '本月收入', value: '¥28,500', icon: TrendingUp, trend: '+15%' },
    { label: '系统状态', value: '正常', icon: Shield, trend: '99.9%' },
  ]

  return (
    <div className="space-y-8">
      {/* 欢迎区域 */}
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Heart className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">美丽诊所管理后台</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          欢迎来到管理后台，这里是您管理诊所业务的中心枢纽
        </p>
      </div>

      {/* 快速统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.trend}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 快速操作 */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground">快速操作</h2>
          <p className="text-muted-foreground mt-2">选择您要管理的功能模块</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm mb-4">
                  {action.description}
                </CardDescription>
                <Button
                  onClick={() => router.push(action.href)}
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                  variant="outline"
                >
                  进入管理
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 快速链接 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>快速链接</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="ghost"
              className="h-auto flex-col space-y-2 p-4"
              onClick={() => router.push('/admin/dashboard')}
            >
              <LayoutDashboard className="h-6 w-6" />
              <span className="text-sm">仪表板</span>
            </Button>
            <Button
              variant="ghost"
              className="h-auto flex-col space-y-2 p-4"
              onClick={() => router.push('/admin/bookings')}
            >
              <Calendar className="h-6 w-6" />
              <span className="text-sm">今日预约</span>
            </Button>
            <Button
              variant="ghost"
              className="h-auto flex-col space-y-2 p-4"
              onClick={() => router.push('/admin/reports')}
            >
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">数据报表</span>
            </Button>
            <Button
              variant="ghost"
              className="h-auto flex-col space-y-2 p-4"
              onClick={() => router.push('/admin/settings')}
            >
              <Settings className="h-6 w-6" />
              <span className="text-sm">系统设置</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}