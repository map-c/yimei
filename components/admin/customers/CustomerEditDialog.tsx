'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { User, AlertTriangle } from 'lucide-react'

interface CustomerEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: {
    customerName: string
    customerPhone: string
    customerEmail?: string
    customerAge?: string
  }
  onUpdateSuccess: () => void
}

export function CustomerEditDialog({ 
  open, 
  onOpenChange, 
  customer, 
  onUpdateSuccess 
}: CustomerEditDialogProps) {
  const [formData, setFormData] = useState({
    customerName: customer.customerName,
    customerEmail: customer.customerEmail || '',
    customerAge: customer.customerAge || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 验证必填字段
      if (!formData.customerName.trim()) {
        setError('客户姓名不能为空')
        return
      }

      // 验证邮箱格式
      if (formData.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
        setError('邮箱格式不正确')
        return
      }

      const response = await fetch(`/api/admin/customers/${encodeURIComponent(customer.customerPhone)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail || undefined,
          customerAge: formData.customerAge || undefined,
        }),
      })

      const result = await response.json()

      if (result.success) {
        onUpdateSuccess()
        onOpenChange(false)
        // 重置表单
        setFormData({
          customerName: customer.customerName,
          customerEmail: customer.customerEmail || '',
          customerAge: customer.customerAge || '',
        })
      } else {
        setError(result.error || '更新客户信息失败')
      }
    } catch (error) {
      console.error('Update customer error:', error)
      setError('更新失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary" />
            <span>编辑客户信息</span>
          </DialogTitle>
          <DialogDescription>
            修改客户的基本信息
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* 客户姓名 */}
          <div className="space-y-2">
            <Label htmlFor="customerName">客户姓名 *</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              placeholder="请输入客户姓名"
              required
            />
          </div>

          {/* 手机号（只读） */}
          <div className="space-y-2">
            <Label htmlFor="customerPhone">手机号</Label>
            <Input
              id="customerPhone"
              value={customer.customerPhone}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              手机号不可修改
            </p>
          </div>

          {/* 邮箱 */}
          <div className="space-y-2">
            <Label htmlFor="customerEmail">邮箱</Label>
            <Input
              id="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => handleInputChange('customerEmail', e.target.value)}
              placeholder="请输入邮箱地址"
            />
          </div>

          {/* 年龄 */}
          <div className="space-y-2">
            <Label htmlFor="customerAge">年龄</Label>
            <Input
              id="customerAge"
              value={formData.customerAge}
              onChange={(e) => handleInputChange('customerAge', e.target.value)}
              placeholder="请输入年龄"
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? '保存中...' : '保存'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
