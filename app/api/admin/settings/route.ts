import { NextRequest } from 'next/server'
import { withPermissions, createSuccessResponse, createErrorResponse, getCurrentAdmin } from '@/lib/admin/middleware'
import { createPermissionCheck, Permission } from '@/lib/admin/permissions'
import { logAdminAction } from '@/lib/admin/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 获取系统设置
async function getSettings(request: NextRequest) {
  try {
    const settings = await prisma.systemSetting.findMany({
      orderBy: { key: 'asc' },
    })

    // 将设置转换为键值对格式
    const settingsMap = settings.reduce((acc, setting) => {
      let value: any = setting.value
      
      // 根据类型转换值
      if (setting.type === 'number') {
        value = parseFloat(setting.value)
      } else if (setting.type === 'boolean') {
        value = setting.value === 'true'
      } else if (setting.type === 'json') {
        try {
          value = JSON.parse(setting.value)
        } catch {
          value = setting.value
        }
      }

      acc[setting.key] = {
        value,
        type: setting.type,
        description: setting.description,
        updatedAt: setting.updatedAt,
      }
      
      return acc
    }, {} as Record<string, any>)

    return createSuccessResponse(settingsMap)
  } catch (error) {
    console.error('Get settings error:', error)
    return createErrorResponse('获取系统设置失败', 500)
  }
}

// 更新系统设置
const updateSettingsSchema = z.record(z.object({
  value: z.any(),
  type: z.enum(['string', 'number', 'boolean', 'json']).optional(),
  description: z.string().optional(),
}))

async function updateSettings(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)
    if (!admin) {
      return createErrorResponse('未认证', 401)
    }

    const body = await request.json()
    const validation = updateSettingsSchema.safeParse(body)
    
    if (!validation.success) {
      return createErrorResponse('请求数据格式错误', 400)
    }

    const settings = validation.data
    const updatedSettings = []

    // 批量更新设置
    for (const [key, setting] of Object.entries(settings)) {
      let stringValue: string

      // 根据类型转换为字符串存储
      if (setting.type === 'number') {
        stringValue = setting.value.toString()
      } else if (setting.type === 'boolean') {
        stringValue = setting.value ? 'true' : 'false'
      } else if (setting.type === 'json') {
        stringValue = JSON.stringify(setting.value)
      } else {
        stringValue = setting.value.toString()
      }

      const updatedSetting = await prisma.systemSetting.upsert({
        where: { key },
        update: {
          value: stringValue,
          type: setting.type || 'string',
          description: setting.description,
          updatedAt: new Date(),
        },
        create: {
          key,
          value: stringValue,
          type: setting.type || 'string',
          description: setting.description,
        },
      })

      updatedSettings.push(updatedSetting)
    }

    // 记录操作日志
    const changedKeys = Object.keys(settings)
    await logAdminAction(
      admin.id,
      'UPDATE_SETTINGS',
      'system',
      'settings',
      `更新系统设置: ${changedKeys.join(', ')}`,
      request.headers.get('x-forwarded-for') || 'unknown'
    )

    return createSuccessResponse(updatedSettings, '系统设置更新成功')
  } catch (error) {
    console.error('Update settings error:', error)
    return createErrorResponse('更新系统设置失败', 500)
  }
}

export const GET = withPermissions(
  createPermissionCheck(Permission.MANAGE_SETTINGS),
  getSettings
)

export const PUT = withPermissions(
  createPermissionCheck(Permission.MANAGE_SETTINGS),
  updateSettings
)
