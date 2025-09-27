'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Settings, 
  Save, 
  RefreshCw,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface SystemSettings {
  [key: string]: {
    value: string
    type: string
    description?: string
    updatedAt: string
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/settings')
      const result = await response.json()
      if (result.success) {
        setSettings(result.data)
      } else {
        setMessage({ type: 'error', text: result.error || '获取设置失败' })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      setMessage({ type: 'error', text: '网络错误，请重试' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const result = await response.json()
      if (result.success) {
        setMessage({ type: 'success', text: '设置保存成功' })
        fetchSettings() // 重新获取设置
      } else {
        setMessage({ type: 'error', text: result.error || '保存失败' })
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: '网络错误，请重试' })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value,
      }
    }))
  }

  const getSetting = (key: string, defaultValue: string = '') => {
    return settings[key]?.value || defaultValue
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-muted animate-pulse rounded" />
          <div className="w-32 h-8 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="w-full h-96 bg-muted animate-pulse rounded" />
          <div className="w-full h-96 bg-muted animate-pulse rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Settings className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">系统设置</h1>
            <p className="text-muted-foreground">管理诊所基本信息和系统配置</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchSettings} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? '保存中...' : '保存设置'}
          </Button>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 诊所基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-primary" />
              <span>诊所基本信息</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clinic_name">诊所名称</Label>
              <Input
                id="clinic_name"
                value={getSetting('clinic_name')}
                onChange={(e) => handleInputChange('clinic_name', e.target.value)}
                placeholder="请输入诊所名称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinic_phone">联系电话</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="clinic_phone"
                  value={getSetting('clinic_phone')}
                  onChange={(e) => handleInputChange('clinic_phone', e.target.value)}
                  placeholder="请输入联系电话"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinic_email">邮箱地址</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="clinic_email"
                  type="email"
                  value={getSetting('clinic_email')}
                  onChange={(e) => handleInputChange('clinic_email', e.target.value)}
                  placeholder="请输入邮箱地址"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinic_address">诊所地址</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="clinic_address"
                  value={getSetting('clinic_address')}
                  onChange={(e) => handleInputChange('clinic_address', e.target.value)}
                  placeholder="请输入诊所地址"
                  className="pl-10"
                  rows={3}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="business_hours">营业时间</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="business_hours"
                  value={getSetting('business_hours')}
                  onChange={(e) => handleInputChange('business_hours', e.target.value)}
                  placeholder="例如：周一至周日 9:00-21:00"
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 业务配置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span>业务配置</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deposit_rate">定金比例</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="deposit_rate"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={getSetting('deposit_rate')}
                  onChange={(e) => handleInputChange('deposit_rate', e.target.value)}
                  placeholder="0.2"
                />
                <span className="text-sm text-muted-foreground">
                  ({(parseFloat(getSetting('deposit_rate', '0.2')) * 100).toFixed(0)}%)
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                客户预约时需要支付的定金比例
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_payment_discount">全款支付折扣</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="full_payment_discount"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={getSetting('full_payment_discount')}
                  onChange={(e) => handleInputChange('full_payment_discount', e.target.value)}
                  placeholder="0.95"
                />
                <span className="text-sm text-muted-foreground">
                  ({(parseFloat(getSetting('full_payment_discount', '0.95')) * 100).toFixed(0)}%折)
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                客户选择全款支付时的折扣比例
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="booking_advance_days">预约提前天数</Label>
              <Input
                id="booking_advance_days"
                type="number"
                min="0"
                value={getSetting('booking_advance_days', '1')}
                onChange={(e) => handleInputChange('booking_advance_days', e.target.value)}
                placeholder="1"
              />
              <p className="text-xs text-muted-foreground">
                客户需要提前多少天预约
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max_bookings_per_day">每日最大预约数</Label>
              <Input
                id="max_bookings_per_day"
                type="number"
                min="1"
                value={getSetting('max_bookings_per_day', '20')}
                onChange={(e) => handleInputChange('max_bookings_per_day', e.target.value)}
                placeholder="20"
              />
              <p className="text-xs text-muted-foreground">
                每天最多接受的预约数量
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cancellation_hours">取消预约时限</Label>
              <Input
                id="cancellation_hours"
                type="number"
                min="1"
                value={getSetting('cancellation_hours', '24')}
                onChange={(e) => handleInputChange('cancellation_hours', e.target.value)}
                placeholder="24"
              />
              <p className="text-xs text-muted-foreground">
                客户可以在预约前多少小时内取消
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 通知设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-primary" />
              <span>通知设置</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notification_email">通知邮箱</Label>
              <Input
                id="notification_email"
                type="email"
                value={getSetting('notification_email')}
                onChange={(e) => handleInputChange('notification_email', e.target.value)}
                placeholder="请输入接收通知的邮箱"
              />
              <p className="text-xs text-muted-foreground">
                系统通知将发送到此邮箱
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sms_api_key">短信API密钥</Label>
              <Input
                id="sms_api_key"
                type="password"
                value={getSetting('sms_api_key')}
                onChange={(e) => handleInputChange('sms_api_key', e.target.value)}
                placeholder="请输入短信服务API密钥"
              />
              <p className="text-xs text-muted-foreground">
                用于发送预约提醒短信
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminder_hours">预约提醒时间</Label>
              <Input
                id="reminder_hours"
                type="number"
                min="1"
                value={getSetting('reminder_hours', '24')}
                onChange={(e) => handleInputChange('reminder_hours', e.target.value)}
                placeholder="24"
              />
              <p className="text-xs text-muted-foreground">
                在预约前多少小时发送提醒
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 其他设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>其他设置</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="system_maintenance">系统维护公告</Label>
              <Textarea
                id="system_maintenance"
                value={getSetting('system_maintenance')}
                onChange={(e) => handleInputChange('system_maintenance', e.target.value)}
                placeholder="系统维护时显示的公告内容"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                系统维护时向用户显示的公告
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="privacy_policy">隐私政策链接</Label>
              <Input
                id="privacy_policy"
                type="url"
                value={getSetting('privacy_policy')}
                onChange={(e) => handleInputChange('privacy_policy', e.target.value)}
                placeholder="https://example.com/privacy"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms_of_service">服务条款链接</Label>
              <Input
                id="terms_of_service"
                type="url"
                value={getSetting('terms_of_service')}
                onChange={(e) => handleInputChange('terms_of_service', e.target.value)}
                placeholder="https://example.com/terms"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
