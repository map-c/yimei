'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar,
  User,
  Activity,
  AlertTriangle,
  RefreshCw,
  Download
} from 'lucide-react'

interface AdminLog {
  id: string
  action: string
  resourceType: string
  resourceId: string
  details: string
  ipAddress: string
  createdAt: string
  admin: {
    id: string
    username: string
    email: string
    role: string
  }
}

interface LogStats {
  actionStats: Array<{
    action: string
    _count: { action: number }
  }>
  adminStats: Array<{
    adminId: string
    _count: { adminId: number }
    admin: {
      id: string
      username: string
    }
  }>
  dailyStats: Array<{
    date: string
    count: number
  }>
}

export default function LogsPage() {
  const [logs, setLogs] = useState<AdminLog[]>([])
  const [stats, setStats] = useState<LogStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [adminFilter, setAdminFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchLogs()
    fetchStats()
  }, [searchTerm, actionFilter, adminFilter, startDate, endDate, currentPage])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      })
      
      if (searchTerm) params.append('search', searchTerm)
      if (actionFilter) params.append('action', actionFilter)
      if (adminFilter) params.append('adminId', adminFilter)
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await fetch(`/api/admin/logs?${params}`)
      const result = await response.json()
      if (result.success) {
        setLogs(result.data.items)
        setTotalPages(Math.ceil(result.data.total / result.data.limit))
      } else {
        setMessage({ type: 'error', text: result.error || '获取日志失败' })
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
      setMessage({ type: 'error', text: '网络错误，请重试' })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    setStatsLoading(true)
    try {
      const response = await fetch('/api/admin/logs?stats=true&days=7')
      const result = await response.json()
      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  const getActionLabel = (action: string) => {
    const actionLabels: Record<string, string> = {
      'LOGIN': '登录',
      'LOGOUT': '登出',
      'CREATE_BOOKING': '创建预约',
      'UPDATE_BOOKING': '更新预约',
      'DELETE_BOOKING': '删除预约',
      'CREATE_ORDER': '创建订单',
      'UPDATE_ORDER': '更新订单',
      'REFUND_ORDER': '退款订单',
      'CREATE_CUSTOMER': '创建客户',
      'UPDATE_CUSTOMER': '更新客户',
      'DELETE_CUSTOMER': '删除客户',
      'CREATE_ADMIN': '创建管理员',
      'UPDATE_ADMIN': '更新管理员',
      'DELETE_ADMIN': '删除管理员',
      'UPDATE_SETTINGS': '更新设置',
    }
    return actionLabels[action] || action
  }

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('DELETE') || action.includes('REFUND')) {
      return 'destructive'
    }
    if (action.includes('CREATE')) {
      return 'default'
    }
    if (action.includes('UPDATE')) {
      return 'secondary'
    }
    return 'outline'
  }

  const clearFilters = () => {
    setSearchTerm('')
    setActionFilter('')
    setAdminFilter('')
    setStartDate('')
    setEndDate('')
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">操作日志</h1>
            <p className="text-muted-foreground">查看系统操作记录和统计信息</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchLogs} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日操作</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <div className="w-16 h-8 bg-muted animate-pulse rounded" />
              ) : (
                stats?.dailyStats?.[0]?.count || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              系统操作次数
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃管理员</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <div className="w-16 h-8 bg-muted animate-pulse rounded" />
              ) : (
                stats?.adminStats?.length || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              近7天有操作的管理员
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">操作类型</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <div className="w-16 h-8 bg-muted animate-pulse rounded" />
              ) : (
                stats?.actionStats?.length || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              不同类型的操作
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">搜索</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="搜索操作或详情..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="action">操作类型</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="全部操作" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">全部操作</SelectItem>
                  <SelectItem value="LOGIN">登录</SelectItem>
                  <SelectItem value="CREATE_BOOKING">创建预约</SelectItem>
                  <SelectItem value="UPDATE_BOOKING">更新预约</SelectItem>
                  <SelectItem value="CREATE_ORDER">创建订单</SelectItem>
                  <SelectItem value="UPDATE_ORDER">更新订单</SelectItem>
                  <SelectItem value="REFUND_ORDER">退款订单</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">开始日期</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">结束日期</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button variant="outline" onClick={clearFilters} className="w-full">
                清除筛选
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <Card>
        <CardHeader>
          <CardTitle>操作记录</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-16 h-6 bg-muted animate-pulse rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="w-48 h-4 bg-muted animate-pulse rounded" />
                    <div className="w-32 h-3 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="w-24 h-3 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无操作记录
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-start space-x-4">
                    <Badge variant={getActionBadgeVariant(log.action)}>
                      {getActionLabel(log.action)}
                    </Badge>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{log.admin.username}</span>
                        <Badge variant="outline" className="text-xs">
                          {log.admin.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {log.details}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                        <span>资源: {log.resourceType}</span>
                        <span>IP: {log.ipAddress}</span>
                        <span>时间: {new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                第 {currentPage} 页，共 {totalPages} 页
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  上一页
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  下一页
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
