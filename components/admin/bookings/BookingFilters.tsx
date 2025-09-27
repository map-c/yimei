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

interface BookingFiltersProps {
  filters: {
    search: string
    status: string
    dateFrom: string
    dateTo: string
    doctorId: string
    serviceId: string
  }
  onFilterChange: (filters: any) => void
  onApply: () => void
}

export function BookingFilters({ filters, onFilterChange, onApply }: BookingFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const statusOptions = [
    { value: '', label: '全部状态' },
    { value: 'PENDING', label: '待确认' },
    { value: 'CONFIRMED', label: '已确认' },
    { value: 'IN_PROGRESS', label: '进行中' },
    { value: 'COMPLETED', label: '已完成' },
    { value: 'CANCELLED', label: '已取消' },
    { value: 'NO_SHOW', label: '未到场' },
  ]

  const doctorOptions = [
    { value: '', label: '全部医师' },
    { value: 'dr-li', label: '李美华' },
    { value: 'dr-wang', label: '王志强' },
    { value: 'dr-zhang', label: '张雅琳' },
  ]

  const serviceOptions = [
    { value: '', label: '全部项目' },
    { value: 'double-eyelid', label: '双眼皮手术' },
    { value: 'botox', label: '肉毒素注射' },
    { value: 'hyaluronic-acid', label: '玻尿酸填充' },
    { value: 'laser-skin', label: '激光美肤' },
    { value: 'thread-lift', label: '线雕提升' },
    { value: 'skin-management', label: '深层皮肤管理' },
  ]

  const clearFilters = () => {
    onFilterChange({
      search: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      doctorId: '',
      serviceId: '',
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
              {/* 状态筛选 */}
              <div className="space-y-2">
                <Label>预约状态</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => onFilterChange({ status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 医师筛选 */}
              <div className="space-y-2">
                <Label>医师</Label>
                <Select
                  value={filters.doctorId}
                  onValueChange={(value) => onFilterChange({ doctorId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择医师" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 服务项目筛选 */}
              <div className="space-y-2">
                <Label>服务项目</Label>
                <Select
                  value={filters.serviceId}
                  onValueChange={(value) => onFilterChange({ serviceId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择项目" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceOptions.map((option) => (
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
