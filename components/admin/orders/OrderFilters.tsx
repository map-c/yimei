import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Filter, X } from 'lucide-react'
import { useState } from 'react'

interface OrderFiltersProps {
  filters: {
    search: string
    paymentStatus: string
    paymentMethod: string
    dateFrom: string
    dateTo: string
    amountMin: string
    amountMax: string
  }
  onFilterChange: (filters: any) => void
  onApply: () => void
}

export function OrderFilters({ filters, onFilterChange, onApply }: OrderFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const paymentStatusOptions = [
    { value: '', label: '全部状态' },
    { value: 'PENDING', label: '待支付' },
    { value: 'PAID', label: '已支付' },
    { value: 'PARTIAL', label: '部分支付' },
    { value: 'REFUNDED', label: '已退款' },
    { value: 'FAILED', label: '支付失败' },
  ]

  const paymentMethodOptions = [
    { value: '', label: '全部方式' },
    { value: 'wechat', label: '微信支付' },
    { value: 'alipay', label: '支付宝' },
    { value: 'card', label: '信用卡' },
  ]

  const clearFilters = () => {
    onFilterChange({
      search: '',
      paymentStatus: '',
      paymentMethod: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: '',
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>高级筛选</span>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs">
              {Object.values(filters).filter(value => value !== '').length}
            </span>
          )}
        </Button>
        
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
            <X className="mr-2 h-4 w-4" />
            清除筛选
          </Button>
        )}
      </div>

      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">筛选条件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 支付状态筛选 */}
              <div className="space-y-2">
                <Label>支付状态</Label>
                <Select
                  value={filters.paymentStatus}
                  onValueChange={(value) => onFilterChange({ paymentStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择支付状态" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 支付方式筛选 */}
              <div className="space-y-2">
                <Label>支付方式</Label>
                <Select
                  value={filters.paymentMethod}
                  onValueChange={(value) => onFilterChange({ paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择支付方式" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 开始日期 */}
              <div className="space-y-2">
                <Label>开始日期</Label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => onFilterChange({ dateFrom: e.target.value })}
                />
              </div>

              {/* 结束日期 */}
              <div className="space-y-2">
                <Label>结束日期</Label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => onFilterChange({ dateTo: e.target.value })}
                />
              </div>

              {/* 最小金额 */}
              <div className="space-y-2">
                <Label>最小金额</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.amountMin}
                  onChange={(e) => onFilterChange({ amountMin: e.target.value })}
                />
              </div>

              {/* 最大金额 */}
              <div className="space-y-2">
                <Label>最大金额</Label>
                <Input
                  type="number"
                  placeholder="无限制"
                  value={filters.amountMax}
                  onChange={(e) => onFilterChange({ amountMax: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Button onClick={onApply}>应用筛选</Button>
              <Button variant="outline" onClick={clearFilters}>
                重置
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
