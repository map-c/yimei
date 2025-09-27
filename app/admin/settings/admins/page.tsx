'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldCheck, 
  Crown,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react'

interface Admin {
  id: string
  username: string
  email: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR'
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

interface CreateAdminData {
  username: string
  email: string
  password: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR'
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  // 创建管理员相关状态
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [createData, setCreateData] = useState<CreateAdminData>({
    username: '',
    email: '',
    password: '',
    role: 'OPERATOR'
  })

  useEffect(() => {
    fetchAdmins()
  }, [searchTerm, roleFilter, statusFilter])

  const fetchAdmins = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (roleFilter) params.append('role', roleFilter)
      if (statusFilter) params.append('status', statusFilter)

      const response = await fetch(`/api/admin/settings/admins?${params}`)
      const result = await response.json()
      if (result.success) {
        setAdmins(result.data.items)
      } else {
        setMessage({ type: 'error', text: result.error || '获取管理员列表失败' })
      }
    } catch (error) {
      console.error('Error fetching admins:', error)
      setMessage({ type: 'error', text: '网络错误，请重试' })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAdmin = async () => {
    if (!createData.username || !createData.email || !createData.password) {
      setMessage({ type: 'error', text: '请填写所有必填字段' })
      return
    }

    setCreateLoading(true)
    try {
      const response = await fetch('/api/admin/settings/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createData),
      })
      const result = await response.json()
      if (result.success) {
        setMessage({ type: 'success', text: '管理员创建成功' })
        setShowCreateDialog(false)
        setCreateData({ username: '', email: '', password: '', role: 'OPERATOR' })
        fetchAdmins()
      } else {
        setMessage({ type: 'error', text: result.error || '创建失败' })
      }
    } catch (error) {
      console.error('Error creating admin:', error)
      setMessage({ type: 'error', text: '网络错误，请重试' })
    } finally {
      setCreateLoading(false)
    }
  }

  const handleDeleteAdmin = async (adminId: string) => {
    try {
      const response = await fetch(`/api/admin/settings/admins/${adminId}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      if (result.success) {
        setMessage({ type: 'success', text: '管理员删除成功' })
        fetchAdmins()
      } else {
        setMessage({ type: 'error', text: result.error || '删除失败' })
      }
    } catch (error) {
      console.error('Error deleting admin:', error)
      setMessage({ type: 'error', text: '网络错误，请重试' })
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Crown className="h-4 w-4" />
      case 'ADMIN':
        return <ShieldCheck className="h-4 w-4" />
      case 'OPERATOR':
        return <Shield className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return '超级管理员'
      case 'ADMIN':
        return '管理员'
      case 'OPERATOR':
        return '操作员'
      default:
        return role
    }
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === 'ACTIVE' ? 'default' : 'secondary'}>
        {status === 'ACTIVE' ? '活跃' : '禁用'}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Users className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">管理员管理</h1>
            <p className="text-muted-foreground">管理系统管理员账户和权限</p>
          </div>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              添加管理员
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建新管理员</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  value={createData.username}
                  onChange={(e) => setCreateData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="请输入用户名"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={createData.email}
                  onChange={(e) => setCreateData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="请输入邮箱地址"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={createData.password}
                    onChange={(e) => setCreateData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="请输入密码"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">角色</Label>
                <Select value={createData.role} onValueChange={(value: any) => setCreateData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPERATOR">操作员</SelectItem>
                    <SelectItem value="ADMIN">管理员</SelectItem>
                    <SelectItem value="SUPER_ADMIN">超级管理员</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateAdmin} disabled={createLoading}>
                  {createLoading ? '创建中...' : '创建'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Message */}
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          {message.type === 'error' ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索用户名或邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="筛选角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部角色</SelectItem>
                <SelectItem value="SUPER_ADMIN">超级管理员</SelectItem>
                <SelectItem value="ADMIN">管理员</SelectItem>
                <SelectItem value="OPERATOR">操作员</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="筛选状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部状态</SelectItem>
                <SelectItem value="ACTIVE">活跃</SelectItem>
                <SelectItem value="INACTIVE">禁用</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Admins List */}
      <Card>
        <CardHeader>
          <CardTitle>管理员列表</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-10 h-10 bg-muted animate-pulse rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="w-32 h-4 bg-muted animate-pulse rounded" />
                    <div className="w-48 h-3 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="w-20 h-6 bg-muted animate-pulse rounded" />
                  <div className="w-16 h-6 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无管理员数据
            </div>
          ) : (
            <div className="space-y-4">
              {admins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      {getRoleIcon(admin.role)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{admin.username}</h3>
                        <Badge variant="outline" className="text-xs">
                          {getRoleLabel(admin.role)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{admin.email}</p>
                      <p className="text-xs text-muted-foreground">
                        创建时间: {new Date(admin.createdAt).toLocaleDateString()}
                        {admin.lastLogin && (
                          <span className="ml-2">
                            最后登录: {new Date(admin.lastLogin).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(admin.status)}
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认删除</AlertDialogTitle>
                          <AlertDialogDescription>
                            确定要删除管理员 "{admin.username}" 吗？此操作不可撤销。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteAdmin(admin.id)}>
                            删除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
