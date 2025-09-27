# 后台管理系统需求文档

## 项目概述

为美丽诊所医美应用开发一个完整的后台管理系统，用于管理员登录、查看和管理用户预约信息、订单数据等核心业务功能。该系统将提供安全的管理员认证、直观的数据展示界面和高效的业务管理工具。

## 功能需求

### 需求 1: 管理员认证系统

**用户故事:** 作为系统管理员，我希望能够安全地登录后台管理系统，以便管理诊所的业务数据。

#### 验收标准

1. WHEN 管理员访问后台登录页面 THEN 系统 SHALL 显示包含用户名和密码字段的登录表单
2. WHEN 管理员输入正确的凭据并提交 THEN 系统 SHALL 验证凭据并重定向到管理仪表板
3. WHEN 管理员输入错误的凭据 THEN 系统 SHALL 显示错误消息并保持在登录页面
4. WHEN 管理员成功登录 THEN 系统 SHALL 创建安全会话并存储认证状态
5. WHEN 未认证用户尝试访问管理页面 THEN 系统 SHALL 重定向到登录页面
6. WHEN 管理员选择退出登录 THEN 系统 SHALL 清除会话并重定向到登录页面
7. WHEN 管理员会话超时 THEN 系统 SHALL 自动注销并要求重新登录

### 需求 2: 管理仪表板

**用户故事:** 作为管理员，我希望看到一个概览仪表板，以便快速了解诊所的运营状况。

#### 验收标准

1. WHEN 管理员登录成功 THEN 系统 SHALL 显示包含关键指标的仪表板页面
2. WHEN 仪表板加载 THEN 系统 SHALL 显示今日预约数量、本月收入、待处理订单数等关键数据
3. WHEN 仪表板显示数据 THEN 系统 SHALL 提供图表形式的数据可视化
4. WHEN 管理员查看仪表板 THEN 系统 SHALL 显示最近的预约列表和订单状态
5. WHEN 数据更新 THEN 系统 SHALL 实时或定期刷新仪表板数据

### 需求 3: 预约管理系统

**用户故事:** 作为管理员，我希望能够查看、搜索和管理所有用户预约，以便有效安排诊所资源。

#### 验收标准

1. WHEN 管理员访问预约管理页面 THEN 系统 SHALL 显示所有预约的列表视图
2. WHEN 显示预约列表 THEN 系统 SHALL 包含预约ID、客户姓名、项目、医师、时间、状态等信息
3. WHEN 管理员使用搜索功能 THEN 系统 SHALL 支持按客户姓名、手机号、预约日期等条件筛选
4. WHEN 管理员选择特定预约 THEN 系统 SHALL 显示完整的预约详情页面
5. WHEN 管理员修改预约状态 THEN 系统 SHALL 更新预约状态并记录操作日志
6. WHEN 管理员取消预约 THEN 系统 SHALL 更新状态并发送通知给客户
7. WHEN 预约时间冲突 THEN 系统 SHALL 显示警告并建议替代时间
8. WHEN 管理员导出预约数据 THEN 系统 SHALL 生成Excel或CSV格式的报表

### 需求 4: 订单管理系统

**用户故事:** 作为管理员，我希望能够查看和管理所有订单信息，以便跟踪支付状态和财务数据。

#### 验收标准

1. WHEN 管理员访问订单管理页面 THEN 系统 SHALL 显示所有订单的列表
2. WHEN 显示订单列表 THEN 系统 SHALL 包含订单号、客户信息、项目、金额、支付状态、创建时间等
3. WHEN 管理员筛选订单 THEN 系统 SHALL 支持按支付状态、日期范围、金额范围等条件过滤
4. WHEN 管理员查看订单详情 THEN 系统 SHALL 显示完整的订单信息和支付记录
5. WHEN 管理员更新支付状态 THEN 系统 SHALL 记录状态变更和操作时间
6. WHEN 管理员处理退款 THEN 系统 SHALL 更新订单状态并记录退款信息
7. WHEN 生成财务报表 THEN 系统 SHALL 提供按日、周、月的收入统计

### 需求 5: 客户管理系统

**用户故事:** 作为管理员，我希望能够查看和管理客户信息，以便提供更好的服务。

#### 验收标准

1. WHEN 管理员访问客户管理页面 THEN 系统 SHALL 显示所有注册客户的列表
2. WHEN 显示客户列表 THEN 系统 SHALL 包含姓名、手机号、邮箱、注册时间、预约次数等信息
3. WHEN 管理员搜索客户 THEN 系统 SHALL 支持按姓名、手机号、邮箱等条件查找
4. WHEN 管理员查看客户详情 THEN 系统 SHALL 显示客户的完整信息和历史记录
5. WHEN 管理员编辑客户信息 THEN 系统 SHALL 允许更新客户资料并记录修改日志
6. WHEN 客户有多次预约 THEN 系统 SHALL 显示客户的预约历史和偏好分析

### 需求 6: 系统设置和权限管理

**用户故事:** 作为超级管理员，我希望能够管理系统设置和用户权限，以便控制系统访问和配置。

#### 验收标准

1. WHEN 超级管理员访问设置页面 THEN 系统 SHALL 显示系统配置选项
2. WHEN 管理系统设置 THEN 系统 SHALL 允许配置诊所信息、营业时间、服务项目等
3. WHEN 添加新管理员 THEN 系统 SHALL 支持创建新的管理员账户并分配权限
4. WHEN 管理权限 THEN 系统 SHALL 支持不同级别的访问控制（查看、编辑、删除）
5. WHEN 修改系统设置 THEN 系统 SHALL 记录所有配置变更和操作者信息

## 技术需求

### 安全性要求

1. 所有管理员密码必须加密存储
2. 实施会话管理和超时机制
3. 记录所有管理操作的审计日志
4. 实施角色基础的访问控制（RBAC）
5. 防止SQL注入和XSS攻击

### 性能要求

1. 页面加载时间不超过3秒
2. 支持分页显示大量数据
3. 实施数据缓存机制
4. 支持并发用户访问

### 兼容性要求

1. 支持现代浏览器（Chrome、Firefox、Safari、Edge）
2. 响应式设计，支持桌面和平板设备
3. 与现有前端应用保持一致的设计风格

## 数据模型需求

### 管理员表 (Admin)
- id: 主键
- username: 用户名
- password: 加密密码
- email: 邮箱
- role: 角色（super_admin, admin, operator）
- created_at: 创建时间
- last_login: 最后登录时间
- status: 状态（active, inactive）

### 预约表 (Booking)
- id: 主键
- customer_name: 客户姓名
- customer_phone: 客户手机
- customer_email: 客户邮箱
- service_id: 服务项目ID
- doctor_id: 医师ID
- appointment_date: 预约日期
- appointment_time: 预约时间
- status: 状态（pending, confirmed, completed, cancelled）
- notes: 备注
- created_at: 创建时间
- updated_at: 更新时间

### 订单表 (Order)
- id: 主键
- booking_id: 预约ID（外键）
- order_number: 订单号
- total_amount: 总金额
- paid_amount: 已支付金额
- payment_method: 支付方式
- payment_status: 支付状态（pending, paid, refunded）
- created_at: 创建时间
- updated_at: 更新时间

### 操作日志表 (AdminLog)
- id: 主键
- admin_id: 管理员ID
- action: 操作类型
- target_type: 目标类型（booking, order, customer）
- target_id: 目标ID
- details: 操作详情
- ip_address: IP地址
- created_at: 操作时间

## 用户界面要求

### 设计原则
1. 保持与前端应用一致的视觉风格
2. 使用相同的颜色主题（软粉色主色调）
3. 简洁直观的管理界面
4. 清晰的导航结构
5. 响应式布局设计

### 页面结构
1. 侧边栏导航菜单
2. 顶部状态栏（显示管理员信息、退出按钮）
3. 主内容区域
4. 面包屑导航
5. 数据表格和筛选器

## 部署和维护要求

1. 管理系统应部署在安全的内网环境
2. 定期备份管理数据
3. 实施监控和日志记录
4. 提供系统维护和更新机制

---

**注意事项:**
- 本系统仅供内部管理使用，不对外开放
- 所有敏感数据必须加密处理
- 需要定期进行安全审计
- 遵循数据保护和隐私法规
