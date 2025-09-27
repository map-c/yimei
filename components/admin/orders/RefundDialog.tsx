'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, DollarSign } from 'lucide-react'

interface RefundDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: {
    id: string
    orderNumber: string
    totalAmount: number
    paidAmount: number
    paymentStatus: string
  }
  onRefundSuccess: () => void
}

export function RefundDialog({ open, onOpenChange, order, onRefundSuccess }: RefundDialogProps) {
  const [formData, setFormData] = useState({
    refundAmount: order.paidAmount,
    refundReason: '',
    refundMethod: 'original',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 验证退款金额
      if (formData.refundAmount <= 0) {
        setError('退款金额必须大于0')
        return
      }

      if (formData.refundAmount > order.paidAmount) {
        setError('退款金额不能超过已支付金额')
        return
      }

      if (!formData.refundReason.trim()) {
        setError('请填写退款原因')
        return
      }

      const response = await fetch(`/api/admin/orders/${order.id}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        onRefundSuccess()
        onOpenChange(false)
        // 重置表单
        setFormData({
          refundAmount: order.paidAmount,
          refundReason: '',
          refundMethod: 'original',
        })
      } else {
        setError(result.error || '退款处理失败')
      }
    } catch (error) {
      console.error('Refund error:', error)
      setError('退款处理失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <span>申请退款</span>
          </DialogTitle>
          <DialogDescription>
            订单号: {order.orderNumber}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* 订单金额信息 */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">订单总额:</span>
              <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">已支付金额:</span>
              <span className="font-medium text-primary">{formatCurrency(order.paidAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">可退款金额:</span>
              <span className="font-medium text-green-600">{formatCurrency(order.paidAmount)}</span>
            </div>
          </div>

          {/* 退款金额 */}
          <div className="space-y-2">
            <Label htmlFor="refundAmount">退款金额 *</Label>
            <Input
              id="refundAmount"
              type="number"
              min="0"
              max={order.paidAmount}
              step="0.01"
              value={formData.refundAmount}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                refundAmount: parseFloat(e.target.value) || 0 
              }))}
              placeholder="请输入退款金额"
              required
            />
            <p className="text-xs text-muted-foreground">
              最大可退款金额: {formatCurrency(order.paidAmount)}
            </p>
          </div>

          {/* 退款原因 */}
          <div className="space-y-2">
            <Label htmlFor="refundReason">退款原因 *</Label>
            <Textarea
              id="refundReason"
              value={formData.refundReason}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                refundReason: e.target.value 
              }))}
              placeholder="请详细说明退款原因"
              rows={3}
              required
            />
          </div>

          {/* 退款方式 */}
          <div className="space-y-2">
            <Label>退款方式</Label>
            <Select
              value={formData.refundMethod}
              onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                refundMethod: value 
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="original">原路退回</SelectItem>
                <SelectItem value="cash">现金退款</SelectItem>
                <SelectItem value="transfer">银行转账</SelectItem>
              </SelectContent>
            </Select>
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
              variant="destructive"
              disabled={loading}
            >
              {loading ? '处理中...' : '确认退款'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
