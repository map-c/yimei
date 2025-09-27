# 后台管理系统设计文档

## 系统架构概览

### 技术栈选择
- **前端框架**: Next.js 14 (App Router)
- **UI组件库**: 继续使用现有的 shadcn/ui 组件
- **状态管理**: React Context + useState/useReducer
- **认证方案**: NextAuth.js 或 JWT + HTTP-only cookies
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **ORM**: Prisma
- **样式**: Tailwind CSS (与现有应用保持一致)

### 项目结构设计

```
app/
├── admin/                          # 管理后台路由组
│   ├── layout.tsx                  # 管理后台布局
│   ├── login/                      # 登录页面
│   │   └── page.tsx
│   ├── dashboard/                  # 仪表板
│   │   └── page.tsx
│   ├── bookings/                   # 预约管理
│   │   ├── page.tsx               # 预约列表
│   │   └── [id]/                  # 预约详情
│   │       └── page.tsx
│   ├── orders/                     # 订单管理
│   │   ├── page.tsx               # 订单列表
│   │   └── [id]/                  # 订单详情
│   │       └── page.tsx
│   ├── customers/                  # 客户管理
│   │   ├── page.tsx               # 客户列表
│   │   └── [id]/                  # 客户详情
│   │       └── page.tsx
│   └── settings/                   # 系统设置
│       ├── page.tsx               # 基本设置
│       ├── admins/                # 管理员管理
│       │   └── page.tsx
│       └── services/              # 服务项目管理
│           └── page.tsx
├── api/                           # API路由
│   ├── admin/                     # 管理后台API
│   │   ├── auth/                  # 认证相关
│   │   ├── bookings/              # 预约管理API
│   │   ├── orders/                # 订单管理API
│   │   ├── customers/             # 客户管理API
│   │   └── dashboard/             # 仪表板数据API
│   └── booking/                   # 现有预约API (保持不变)
components/
├── admin/                         # 管理后台专用组件
│   ├── layout/                    # 布局组件
│   │   ├── AdminSidebar.tsx
│   │   ├── AdminHeader.tsx
│   │   └── AdminLayout.tsx
│   ├── dashboard/                 # 仪表板组件
│   │   ├── StatsCard.tsx
│   │   ├── RecentBookings.tsx
│   │   └── RevenueChart.tsx
│   ├── bookings/                  # 预约管理组件
│   │   ├── BookingList.tsx
│   │   ├── BookingDetail.tsx
│   │   └── BookingFilters.tsx
│   ├── orders/                    # 订单管理组件
│   │   ├── OrderList.tsx
│   │   ├── OrderDetail.tsx
│   │   └── OrderFilters.tsx
│   ├── customers/                 # 客户管理组件
│   │   ├── CustomerList.tsx
│   │   ├── CustomerDetail.tsx
│   │   └── CustomerSearch.tsx
│   └── common/                    # 通用管理组件
│       ├── DataTable.tsx
│       ├── SearchInput.tsx
│       ├── StatusBadge.tsx
│       └── ExportButton.tsx
lib/
├── admin/                         # 管理后台工具函数
│   ├── auth.ts                    # 认证工具
│   ├── permissions.ts             # 权限控制
│   └── api.ts                     # API客户端
├── db/                           # 数据库相关
│   ├── schema.prisma             # 数据库模式
│   └── seed.ts                   # 初始数据
└── utils/                        # 工具函数 (现有)
```

## 数据库设计

### Prisma Schema 设计

```prisma
// 管理员表
model Admin {
  id        String   @id @default(cuid())
  username  String   @unique
  email     String   @unique
  password  String   // 加密存储
  role      AdminRole @default(ADMIN)
  status    AdminStatus @default(ACTIVE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  lastLogin DateTime?
  
  // 关联操作日志
  logs      AdminLog[]
  
  @@map("admins")
}

enum AdminRole {
  SUPER_ADMIN
  ADMIN
  OPERATOR
}

enum AdminStatus {
  ACTIVE
  INACTIVE
}

// 预约表 (扩展现有结构)
model Booking {
  id              String   @id @default(cuid())
  customerName    String
  customerPhone   String
  customerEmail   String?
  customerAge     String?
  serviceId       String
  serviceName     String
  doctorId        String
  doctorName      String
  appointmentDate String
  appointmentTime String
  status          BookingStatus @default(PENDING)
  budget          String?
  concerns        String?
  previousTreatments String?
  allergies       String?
  expectations    String?
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // 关联订单
  orders          Order[]
  
  @@map("bookings")
}

enum BookingStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW
}

// 订单表
model Order {
  id            String   @id @default(cuid())
  orderNumber   String   @unique
  bookingId     String
  totalAmount   Float
  paidAmount    Float    @default(0)
  paymentMethod String?
  paymentStatus PaymentStatus @default(PENDING)
  paymentType   PaymentType   @default(DEPOSIT)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // 关联预约
  booking       Booking  @relation(fields: [bookingId], references: [id])
  
  @@map("orders")
}

enum PaymentStatus {
  PENDING
  PAID
  PARTIAL
  REFUNDED
  FAILED
}

enum PaymentType {
  DEPOSIT
  FULL_PAYMENT
}

// 操作日志表
model AdminLog {
  id         String   @id @default(cuid())
  adminId    String
  action     String
  targetType String
  targetId   String?
  details    String?
  ipAddress  String?
  userAgent  String?
  createdAt  DateTime @default(now())
  
  // 关联管理员
  admin      Admin    @relation(fields: [adminId], references: [id])
  
  @@map("admin_logs")
}

// 系统设置表
model SystemSetting {
  id    String @id @default(cuid())
  key   String @unique
  value String
  type  String @default("string")
  description String?
  updatedAt DateTime @updatedAt
  
  @@map("system_settings")
}
```

## 认证和权限设计

### 认证流程
1. **登录验证**: 用户名/密码验证
2. **JWT Token**: 生成包含用户信息和权限的JWT
3. **会话管理**: 使用HTTP-only cookies存储token
4. **自动刷新**: Token过期前自动刷新
5. **安全退出**: 清除所有认证信息

### 权限控制
```typescript
// 权限级别定义
enum Permission {
  // 预约管理
  VIEW_BOOKINGS = 'view_bookings',
  EDIT_BOOKINGS = 'edit_bookings',
  DELETE_BOOKINGS = 'delete_bookings',
  
  // 订单管理
  VIEW_ORDERS = 'view_orders',
  EDIT_ORDERS = 'edit_orders',
  PROCESS_REFUNDS = 'process_refunds',
  
  // 客户管理
  VIEW_CUSTOMERS = 'view_customers',
  EDIT_CUSTOMERS = 'edit_customers',
  
  // 系统管理
  MANAGE_ADMINS = 'manage_admins',
  MANAGE_SETTINGS = 'manage_settings',
  VIEW_LOGS = 'view_logs',
}

// 角色权限映射
const ROLE_PERMISSIONS = {
  [AdminRole.OPERATOR]: [
    Permission.VIEW_BOOKINGS,
    Permission.EDIT_BOOKINGS,
    Permission.VIEW_ORDERS,
    Permission.VIEW_CUSTOMERS,
  ],
  [AdminRole.ADMIN]: [
    ...ROLE_PERMISSIONS[AdminRole.OPERATOR],
    Permission.DELETE_BOOKINGS,
    Permission.EDIT_ORDERS,
    Permission.PROCESS_REFUNDS,
    Permission.EDIT_CUSTOMERS,
  ],
  [AdminRole.SUPER_ADMIN]: [
    ...ROLE_PERMISSIONS[AdminRole.ADMIN],
    Permission.MANAGE_ADMINS,
    Permission.MANAGE_SETTINGS,
    Permission.VIEW_LOGS,
  ],
}
```

## 用户界面设计

### 设计系统
继承现有应用的设计风格：
- **主色调**: 软粉色 `oklch(0.85 0.05 340)`
- **辅助色**: 软绿色 `oklch(0.88 0.05 150)`
- **字体**: GeistSans
- **圆角**: 0.5rem
- **组件**: shadcn/ui

### 布局结构
```typescript
// 管理后台布局组件
const AdminLayout = ({ children }) => (
  <div className="flex h-screen bg-background">
    {/* 侧边栏 */}
    <AdminSidebar />
    
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 顶部导航 */}
      <AdminHeader />
      
      {/* 主内容区 */}
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  </div>
)
```

### 关键组件设计

#### 1. 数据表格组件
```typescript
interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  searchable?: boolean
  filterable?: boolean
  exportable?: boolean
  pagination?: boolean
}
```

#### 2. 状态徽章组件
```typescript
interface StatusBadgeProps {
  status: BookingStatus | PaymentStatus
  variant?: 'default' | 'outline'
}
```

#### 3. 统计卡片组件
```typescript
interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon?: React.ReactNode
}
```

## API设计

### RESTful API 结构
```
GET    /api/admin/auth/me              # 获取当前用户信息
POST   /api/admin/auth/login           # 管理员登录
POST   /api/admin/auth/logout          # 管理员退出

GET    /api/admin/dashboard/stats      # 仪表板统计数据
GET    /api/admin/dashboard/recent     # 最近活动

GET    /api/admin/bookings             # 获取预约列表
GET    /api/admin/bookings/[id]        # 获取预约详情
PUT    /api/admin/bookings/[id]        # 更新预约信息
DELETE /api/admin/bookings/[id]        # 删除预约

GET    /api/admin/orders               # 获取订单列表
GET    /api/admin/orders/[id]          # 获取订单详情
PUT    /api/admin/orders/[id]          # 更新订单状态
POST   /api/admin/orders/[id]/refund   # 处理退款

GET    /api/admin/customers            # 获取客户列表
GET    /api/admin/customers/[id]       # 获取客户详情
PUT    /api/admin/customers/[id]       # 更新客户信息

GET    /api/admin/settings             # 获取系统设置
PUT    /api/admin/settings             # 更新系统设置
GET    /api/admin/admins               # 获取管理员列表
POST   /api/admin/admins               # 创建管理员
PUT    /api/admin/admins/[id]          # 更新管理员
DELETE /api/admin/admins/[id]          # 删除管理员

GET    /api/admin/logs                 # 获取操作日志
```

### API响应格式
```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

## 安全考虑

### 1. 认证安全
- 密码使用bcrypt加密存储
- JWT token设置合理的过期时间
- 实施账户锁定机制（多次失败登录）
- 记录所有登录尝试

### 2. 授权安全
- 基于角色的访问控制（RBAC）
- API级别的权限验证
- 前端路由保护
- 敏感操作二次确认

### 3. 数据安全
- 输入验证和清理
- SQL注入防护（Prisma ORM）
- XSS攻击防护
- CSRF保护

### 4. 审计日志
- 记录所有管理操作
- 包含操作者、时间、IP地址等信息
- 定期备份日志数据
- 日志查询和分析功能

## 性能优化

### 1. 前端优化
- 组件懒加载
- 数据分页加载
- 虚拟滚动（大数据量）
- 缓存常用数据

### 2. 后端优化
- 数据库索引优化
- 查询优化
- Redis缓存（可选）
- API响应压缩

### 3. 用户体验
- 加载状态指示
- 错误处理和提示
- 操作确认对话框
- 快捷键支持

## 部署和监控

### 1. 部署策略
- 环境变量配置
- 数据库迁移脚本
- 静态资源优化
- 容器化部署（Docker）

### 2. 监控和日志
- 应用性能监控
- 错误日志收集
- 用户行为分析
- 系统健康检查

### 3. 备份和恢复
- 定期数据库备份
- 配置文件备份
- 灾难恢复计划
- 数据迁移工具

---

**技术实现优先级:**
1. 基础认证和权限系统
2. 核心数据管理功能（预约、订单）
3. 仪表板和统计功能
4. 高级功能（导出、批量操作）
5. 系统设置和管理员管理
