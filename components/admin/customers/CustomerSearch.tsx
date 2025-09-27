import { Button } from '@/components/ui/button'
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

interface CustomerSearchProps {
  filters: {
    search: string
    sortBy: string
    sortOrder: string
  }
  onFilterChange: (filters: any) => void
  onApply: () => void
}

export function CustomerSearch({ filters, onFilterChange, onApply }: CustomerSearchProps) {
  const [showFilters, setShowFilters] = useState(false)

  const sortByOptions = [
    { value: 'name', label: '按姓名' },
    { value: 'phone', label: '按手机号' },
    { value: 'totalSpent', label: '按消费金额' },
    { value: 'bookingCount', label: '按预约次数' },
    { value: 'lastBooking', label: '按最后预约时间' },
  ]

  const sortOrderOptions = [
    { value: 'asc', label: '升序' },
    { value: 'desc', label: '降序' },
  ]

  const clearFilters = () => {
    onFilterChange({
      search: '',
      sortBy: 'lastBooking',
      sortOrder: 'desc',
    })
  }

  const hasActiveFilters = filters.sortBy !== 'lastBooking' || filters.sortOrder !== 'desc'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>排序筛选</span>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs">
              1
            </span>
          )}
        </Button>
        
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
            <X className="mr-2 h-4 w-4" />
            重置排序
          </Button>
        )}
      </div>

      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">排序设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 排序字段 */}
              <div className="space-y-2">
                <Label>排序字段</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => onFilterChange({ sortBy: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择排序字段" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortByOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 排序方向 */}
              <div className="space-y-2">
                <Label>排序方向</Label>
                <Select
                  value={filters.sortOrder}
                  onValueChange={(value) => onFilterChange({ sortOrder: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择排序方向" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOrderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Button onClick={onApply}>应用排序</Button>
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
