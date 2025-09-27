import { AdminRole } from '../generated/prisma'

// 权限枚举
export enum Permission {
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
  
  // 仪表板
  VIEW_DASHBOARD = 'view_dashboard',
}

// 角色权限映射
export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  [AdminRole.OPERATOR]: [
    Permission.VIEW_BOOKINGS,
    Permission.EDIT_BOOKINGS,
    Permission.VIEW_ORDERS,
    Permission.VIEW_CUSTOMERS,
    Permission.VIEW_DASHBOARD,
  ],
  [AdminRole.ADMIN]: [
    Permission.VIEW_BOOKINGS,
    Permission.EDIT_BOOKINGS,
    Permission.DELETE_BOOKINGS,
    Permission.VIEW_ORDERS,
    Permission.EDIT_ORDERS,
    Permission.PROCESS_REFUNDS,
    Permission.VIEW_CUSTOMERS,
    Permission.EDIT_CUSTOMERS,
    Permission.VIEW_DASHBOARD,
  ],
  [AdminRole.SUPER_ADMIN]: [
    Permission.VIEW_BOOKINGS,
    Permission.EDIT_BOOKINGS,
    Permission.DELETE_BOOKINGS,
    Permission.VIEW_ORDERS,
    Permission.EDIT_ORDERS,
    Permission.PROCESS_REFUNDS,
    Permission.VIEW_CUSTOMERS,
    Permission.EDIT_CUSTOMERS,
    Permission.MANAGE_ADMINS,
    Permission.MANAGE_SETTINGS,
    Permission.VIEW_LOGS,
    Permission.VIEW_DASHBOARD,
  ],
}

/**
 * 检查管理员是否有特定权限
 */
export function hasPermission(role: AdminRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role]
  return permissions.includes(permission)
}

/**
 * 检查管理员是否有任一权限
 */
export function hasAnyPermission(role: AdminRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission))
}

/**
 * 检查管理员是否有所有权限
 */
export function hasAllPermissions(role: AdminRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission))
}

/**
 * 获取角色的所有权限
 */
export function getRolePermissions(role: AdminRole): Permission[] {
  return ROLE_PERMISSIONS[role] || []
}

/**
 * 权限装饰器 - 用于API路由
 */
export function requirePermission(permission: Permission) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    
    descriptor.value = async function (...args: any[]) {
      const request = args[0] // 假设第一个参数是 NextRequest
      // 这里需要在实际使用时添加权限检查逻辑
      return originalMethod.apply(this, args)
    }
    
    return descriptor
  }
}

/**
 * 权限检查中间件数据
 */
export interface PermissionCheck {
  required: Permission[]
  mode: 'any' | 'all' // 需要任一权限还是所有权限
}

/**
 * 创建权限检查配置
 */
export function createPermissionCheck(
  permissions: Permission | Permission[],
  mode: 'any' | 'all' = 'any'
): PermissionCheck {
  const required = Array.isArray(permissions) ? permissions : [permissions]
  return { required, mode }
}
