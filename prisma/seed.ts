import { PrismaClient } from '../lib/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('开始种子数据...')

  // 创建默认管理员账户
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const superAdmin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@beauty-clinic.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  })

  console.log('创建超级管理员:', superAdmin)

  // 创建普通管理员账户
  const adminPassword = await bcrypt.hash('manager123', 12)
  
  const admin = await prisma.admin.upsert({
    where: { username: 'manager' },
    update: {},
    create: {
      username: 'manager',
      email: 'manager@beauty-clinic.com',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  })

  console.log('创建管理员:', admin)

  // 创建操作员账户
  const operatorPassword = await bcrypt.hash('operator123', 12)
  
  const operator = await prisma.admin.upsert({
    where: { username: 'operator' },
    update: {},
    create: {
      username: 'operator',
      email: 'operator@beauty-clinic.com',
      password: operatorPassword,
      role: 'OPERATOR',
      status: 'ACTIVE',
    },
  })

  console.log('创建操作员:', operator)

  // 创建一些测试预约数据
  const booking1 = await prisma.booking.create({
    data: {
      customerName: '张小美',
      customerPhone: '13800138001',
      customerEmail: 'zhang@example.com',
      customerAge: '25',
      serviceId: 'double-eyelid',
      serviceName: '双眼皮手术',
      doctorId: 'dr-li',
      doctorName: '李美华',
      appointmentDate: '2024-12-20',
      appointmentTime: '14:00',
      status: 'CONFIRMED',
      budget: '8000-15000',
      concerns: '希望眼睛更有神',
      expectations: '自然的双眼皮效果',
    },
  })

  console.log('创建测试预约1:', booking1)

  const booking2 = await prisma.booking.create({
    data: {
      customerName: '李小雅',
      customerPhone: '13800138002',
      customerEmail: 'li@example.com',
      customerAge: '28',
      serviceId: 'botox',
      serviceName: '肉毒素注射',
      doctorId: 'dr-wang',
      doctorName: '王志强',
      appointmentDate: '2024-12-21',
      appointmentTime: '10:00',
      status: 'PENDING',
      budget: '1000-3000',
      concerns: '额头皱纹',
      expectations: '减少皱纹，看起来更年轻',
    },
  })

  console.log('创建测试预约2:', booking2)

  // 创建对应的订单
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'MB202412200001',
      bookingId: booking1.id,
      totalAmount: 8800,
      paidAmount: 1760, // 20% 定金
      paymentMethod: 'wechat',
      paymentStatus: 'PAID',
      paymentType: 'DEPOSIT',
    },
  })

  console.log('创建测试订单1:', order1)

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'MB202412210001',
      bookingId: booking2.id,
      totalAmount: 2800,
      paidAmount: 0,
      paymentMethod: null,
      paymentStatus: 'PENDING',
      paymentType: 'DEPOSIT',
    },
  })

  console.log('创建测试订单2:', order2)

  // 创建系统设置
  const settings = [
    {
      key: 'clinic_name',
      value: '美丽诊所',
      type: 'string',
      description: '诊所名称',
    },
    {
      key: 'clinic_phone',
      value: '400-123-4567',
      type: 'string',
      description: '诊所电话',
    },
    {
      key: 'clinic_address',
      value: '北京市朝阳区美丽大街123号',
      type: 'string',
      description: '诊所地址',
    },
    {
      key: 'business_hours',
      value: '周一至周日 9:00-21:00',
      type: 'string',
      description: '营业时间',
    },
    {
      key: 'deposit_rate',
      value: '0.2',
      type: 'number',
      description: '定金比例',
    },
    {
      key: 'full_payment_discount',
      value: '0.95',
      type: 'number',
      description: '全款支付折扣',
    },
  ]

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    })
  }

  console.log('创建系统设置完成')

  console.log('种子数据创建完成!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
