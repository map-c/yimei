"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Clock, User, CreditCard, CheckCircle, ArrowLeft, ArrowRight, Star, Shield, Heart, Phone, Mail, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const services = [
  {
    id: "double-eyelid",
    name: "双眼皮手术",
    category: "微整形",
    price: 8800,
    duration: "2-3小时",
    recovery: "7-14天",
    description: "打造自然双眼皮，让眼睛更有神",
    image: "professional double eyelid surgery procedure",
  },
  {
    id: "botox",
    name: "肉毒素注射",
    category: "注射美容",
    price: 2800,
    duration: "30分钟",
    recovery: "无恢复期",
    description: "去除皱纹，紧致肌肤",
    image: "botox injection aesthetic treatment",
  },
  {
    id: "hyaluronic-acid",
    name: "玻尿酸填充",
    category: "注射美容",
    price: 3800,
    duration: "45分钟",
    recovery: "1-3天",
    description: "丰唇、隆鼻、填充面部凹陷",
    image: "hyaluronic acid dermal filler treatment",
  },
  {
    id: "laser-skin",
    name: "激光美肤",
    category: "皮肤管理",
    price: 1800,
    duration: "60分钟",
    recovery: "3-5天",
    description: "改善肌肤质地，淡化色斑",
    image: "laser skin treatment procedure",
  },
  {
    id: "thread-lift",
    name: "线雕提升",
    category: "微整形",
    price: 12800,
    duration: "1-2小时",
    recovery: "5-7天",
    description: "非手术面部提升，重塑轮廓",
    image: "thread lift facial procedure",
  },
  {
    id: "skin-management",
    name: "深层皮肤管理",
    category: "皮肤管理",
    price: 980,
    duration: "90分钟",
    recovery: "无恢复期",
    description: "深层清洁，补水保湿",
    image: "professional skin care treatment",
  },
]

const doctors = [
  {
    id: "dr-li",
    name: "李美华",
    title: "主任医师",
    specialty: "整形外科",
    experience: "20年",
    rating: 4.9,
    reviews: 1280,
    image: "professional female plastic surgeon portrait",
  },
  {
    id: "dr-wang",
    name: "王志强",
    title: "副主任医师",
    specialty: "皮肤美容科",
    experience: "15年",
    rating: 4.8,
    reviews: 956,
    image: "professional male dermatologist portrait",
  },
  {
    id: "dr-zhang",
    name: "张雅琳",
    title: "主治医师",
    specialty: "微整形科",
    experience: "12年",
    rating: 4.9,
    reviews: 743,
    image: "professional female aesthetic doctor portrait",
  },
]

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
]

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedDoctor, setSelectedDoctor] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    budget: "",
    concerns: "",
    previousTreatments: "",
    allergies: "",
    expectations: "",
  })
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [paymentAmount, setPaymentAmount] = useState<"deposit" | "full">("deposit")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedServiceData = services.find((s) => s.id === selectedService)
  const selectedDoctorData = doctors.find((d) => d.id === selectedDoctor)

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call for booking submission
      const bookingData = {
        service: selectedService,
        doctor: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        formData,
        paymentMethod,
        paymentAmount,
        timestamp: new Date().toISOString(),
      }
      
      console.log("Booking submitted:", bookingData)
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to success page
      window.location.href = '/booking/success'
    } catch (error) {
      console.error("Booking submission failed:", error)
      alert("预约提交失败，请重试")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">选择医美项目</h2>
              <p className="text-muted-foreground">请选择您感兴趣的医美项目</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedService === service.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <CardHeader className="p-0">
                    <div className="aspect-video rounded-t-lg overflow-hidden bg-muted">
                      <Image
                        src={`/abstract-geometric-shapes.png?height=200&width=300&query=${service.image}`}
                        alt={service.name}
                        width={300}
                        height={200}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">{service.name}</h3>
                        <Badge variant="secondary">{service.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">价格:</span>
                        <span className="font-medium text-primary">¥{service.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">时长:</span>
                        <span>{service.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">恢复期:</span>
                        <span>{service.recovery}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">填写预约表单</h2>
              <p className="text-muted-foreground">请填写您的基本信息、预约时间和预算需求</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="请输入您的姓名"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">手机号 *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="请输入手机号"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="请输入邮箱地址"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">年龄</Label>
                  <Input
                    id="age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="请输入年龄"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">预算范围</Label>
                <Select value={formData.budget} onValueChange={(value) => setFormData({ ...formData, budget: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择预算范围" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1000-3000">¥1,000 - ¥3,000</SelectItem>
                    <SelectItem value="3000-8000">¥3,000 - ¥8,000</SelectItem>
                    <SelectItem value="8000-15000">¥8,000 - ¥15,000</SelectItem>
                    <SelectItem value="15000+">¥15,000以上</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="concerns">主要关注问题</Label>
                <Textarea
                  id="concerns"
                  value={formData.concerns}
                  onChange={(e) => setFormData({ ...formData, concerns: e.target.value })}
                  placeholder="请描述您希望改善的问题"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previousTreatments">既往治疗史</Label>
                <Textarea
                  id="previousTreatments"
                  value={formData.previousTreatments}
                  onChange={(e) => setFormData({ ...formData, previousTreatments: e.target.value })}
                  placeholder="请描述之前是否接受过相关治疗"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">过敏史</Label>
                <Input
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  placeholder="请输入过敏史（如无请填写'无'）"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectations">期望效果</Label>
                <Textarea
                  id="expectations"
                  value={formData.expectations}
                  onChange={(e) => setFormData({ ...formData, expectations: e.target.value })}
                  placeholder="请描述您期望达到的效果"
                  rows={3}
                />
              </div>

              {/* 预约时间选择 */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-semibold text-foreground">选择预约时间</h3>
                
                <div className="space-y-4">
                  <Label>选择日期</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                    {Array.from({ length: 14 }, (_, i) => {
                      const date = new Date()
                      date.setDate(date.getDate() + i + 1)
                      const dateStr = date.toISOString().split("T")[0]
                      const dayName = date.toLocaleDateString("zh-CN", { weekday: "short" })
                      const dayNum = date.getDate()

                      return (
                        <Card
                          key={dateStr}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedDate === dateStr ? "ring-2 ring-primary" : ""
                          }`}
                          onClick={() => setSelectedDate(dateStr)}
                        >
                          <CardContent className="p-3 text-center">
                            <div className="text-xs text-muted-foreground">{dayName}</div>
                            <div className="text-lg font-semibold">{dayNum}</div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>

                {selectedDate && (
                  <div className="space-y-4">
                    <Label>选择时间</Label>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          className="h-12"
                          onClick={() => setSelectedTime(time)}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">确认报价 & 医师信息</h2>
              <p className="text-muted-foreground">为您推荐专业医师并确认服务报价</p>
            </div>

            {/* 推荐医师选择 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">推荐医师</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <Card
                    key={doctor.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedDoctor === doctor.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedDoctor(doctor.id)}
                  >
                    <CardHeader className="p-0">
                      <div className="aspect-square rounded-t-lg overflow-hidden bg-muted">
                        <Image
                          src={`/abstract-geometric-shapes.png?height=300&width=300&query=${doctor.image}`}
                          alt={doctor.name}
                          width={300}
                          height={300}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">{doctor.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{doctor.title}</Badge>
                          <Badge variant="outline">{doctor.specialty}</Badge>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{doctor.experience}临床经验</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>
                            {doctor.rating}分 ({doctor.reviews}条评价)
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* 服务报价详情 */}
            {selectedServiceData && selectedDoctorData && (
              <div className="max-w-3xl mx-auto space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-primary" />
                      <span>服务报价详情</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">项目信息</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">项目名称:</span>
                            <span className="font-medium">{selectedServiceData.name}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">项目类别:</span>
                            <Badge variant="secondary">{selectedServiceData.category}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">治疗时长:</span>
                            <span>{selectedServiceData.duration}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">恢复期:</span>
                            <span>{selectedServiceData.recovery}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">医师信息</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">主治医师:</span>
                            <span className="font-medium">{selectedDoctorData.name}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">职称:</span>
                            <span>{selectedDoctorData.title}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">专业领域:</span>
                            <span>{selectedDoctorData.specialty}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">临床经验:</span>
                            <span>{selectedDoctorData.experience}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg">
                        <span className="font-medium text-foreground">服务价格:</span>
                        <span className="text-2xl font-bold text-primary">¥{selectedServiceData.price.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        * 价格包含医师费、材料费、术后护理等全部费用
                      </p>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">服务保障</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 专业医师团队，丰富临床经验</li>
                        <li>• 进口优质材料，安全可靠</li>
                        <li>• 术后跟踪服务，效果保障</li>
                        <li>• 无效果可申请重做或退款</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">提交订单</h2>
              <p className="text-muted-foreground">选择支付方式完成预约</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* 订单摘要 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <span>订单摘要</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedServiceData && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">项目:</span>
                      <span className="font-medium">{selectedServiceData.name}</span>
                    </div>
                  )}
                  {selectedDoctorData && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">医师:</span>
                      <span className="font-medium">
                        {selectedDoctorData.name} {selectedDoctorData.title}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">预约时间:</span>
                    <span className="font-medium">{selectedDate} {selectedTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">联系人:</span>
                    <span className="font-medium">{formData.name} {formData.phone}</span>
                  </div>
                  {selectedServiceData && (
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-lg font-medium text-foreground">服务价格:</span>
                      <span className="text-xl font-bold text-primary">¥{selectedServiceData.price.toLocaleString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 支付方式选择 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span>支付方式</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value="wechat" id="wechat" />
                      <Label htmlFor="wechat" className="flex items-center space-x-2 cursor-pointer flex-1">
                        <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">微</div>
                        <span>微信支付</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value="alipay" id="alipay" />
                      <Label htmlFor="alipay" className="flex items-center space-x-2 cursor-pointer flex-1">
                        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">支</div>
                        <span>支付宝</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer flex-1">
                        <CreditCard className="w-8 h-8 text-muted-foreground" />
                        <span>信用卡支付</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* 支付金额选择 */}
              <Card>
                <CardHeader>
                  <CardTitle>支付金额</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={paymentAmount}
                    onValueChange={(value: "deposit" | "full") => setPaymentAmount(value)}
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value="deposit" id="deposit" />
                      <Label htmlFor="deposit" className="cursor-pointer flex-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">支付定金</div>
                            <div className="text-sm text-muted-foreground">预约成功后支付剩余费用</div>
                          </div>
                          <div className="text-lg font-bold text-primary">
                            ¥{selectedServiceData ? Math.round(selectedServiceData.price * 0.2).toLocaleString() : "0"}
                            <span className="text-sm text-muted-foreground ml-1">(20%)</span>
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value="full" id="full" />
                      <Label htmlFor="full" className="cursor-pointer flex-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">全额支付</div>
                            <div className="text-sm text-muted-foreground">享受9.5折优惠</div>
                          </div>
                          <div className="text-lg font-bold text-primary">
                            ¥{selectedServiceData ? Math.round(selectedServiceData.price * 0.95).toLocaleString() : "0"}
                            <span className="text-sm text-muted-foreground ml-1 line-through">
                              ¥{selectedServiceData?.price.toLocaleString() || "0"}
                            </span>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* 服务条款 */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm">
                    我已阅读并同意 <span className="text-primary cursor-pointer">服务条款</span> 和{" "}
                    <span className="text-primary cursor-pointer">隐私政策</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="notifications" />
                  <Label htmlFor="notifications" className="text-sm">
                    接收预约提醒和优惠信息（短信/邮件/微信）
                  </Label>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">预约提交成功！</h2>
              <p className="text-muted-foreground">您的预约已成功提交，我们将通过以下方式与您联系确认</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* 预约信息确认 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <span>预约信息</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">预约编号:</span>
                    <span className="font-medium">MB2024{Math.random().toString().slice(2, 8)}</span>
                  </div>
                  {selectedServiceData && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">项目:</span>
                      <span className="font-medium">{selectedServiceData.name}</span>
                    </div>
                  )}
                  {selectedDoctorData && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">医师:</span>
                      <span className="font-medium">
                        {selectedDoctorData.name} {selectedDoctorData.title}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">预约时间:</span>
                    <span className="font-medium">{selectedDate} {selectedTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">支付状态:</span>
                    <span className="font-medium text-green-600">
                      {paymentAmount === "deposit" ? "已支付定金" : "已全额支付"}
                    </span>
                  </div>
                  {selectedServiceData && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">支付金额:</span>
                      <span className="font-medium text-primary">
                        ¥{paymentAmount === "deposit" 
                          ? Math.round(selectedServiceData.price * 0.2).toLocaleString()
                          : Math.round(selectedServiceData.price * 0.95).toLocaleString()
                        }
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 通知方式 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">我们将通过以下方式联系您</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center space-y-2">
                      <Phone className="mx-auto h-8 w-8 text-primary" />
                      <h4 className="font-medium">短信通知</h4>
                      <p className="text-sm text-muted-foreground">预约确认短信已发送至 {formData.phone}</p>
                    </CardContent>
                  </Card>
                  {formData.email && (
                    <Card>
                      <CardContent className="p-4 text-center space-y-2">
                        <Mail className="mx-auto h-8 w-8 text-primary" />
                        <h4 className="font-medium">邮件通知</h4>
                        <p className="text-sm text-muted-foreground">详细信息已发送至您的邮箱</p>
                      </CardContent>
                    </Card>
                  )}
                  <Card>
                    <CardContent className="p-4 text-center space-y-2">
                      <MessageCircle className="mx-auto h-8 w-8 text-primary" />
                      <h4 className="font-medium">微信通知</h4>
                      <p className="text-sm text-muted-foreground">关注公众号获取预约提醒</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* 接下来的步骤 */}
              <Card>
                <CardHeader>
                  <CardTitle>接下来的步骤</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">1</div>
                      <div>
                        <h4 className="font-medium">电话确认</h4>
                        <p className="text-sm text-muted-foreground">我们将在2小时内致电确认预约详情</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">2</div>
                      <div>
                        <h4 className="font-medium">术前准备</h4>
                        <p className="text-sm text-muted-foreground">医师助理将指导您进行术前准备</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">3</div>
                      <div>
                        <h4 className="font-medium">到院治疗</h4>
                        <p className="text-sm text-muted-foreground">请提前30分钟到达诊所</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 温馨提示 */}
              <div className="bg-muted p-6 rounded-lg">
                <h4 className="font-medium text-foreground mb-3">温馨提示</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• 如需改期或取消，请提前24小时联系我们</li>
                  <li>• 请携带身份证和相关病历资料</li>
                  <li>• 术前请避免饮酒和服用抗凝药物</li>
                  <li>• 如有疑问，可随时联系客服：400-123-4567</li>
                </ul>
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/contact">
                    <Phone className="mr-2 h-4 w-4" />
                    联系客服
                  </Link>
                </Button>
                <Button variant="outline">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  微信咨询
                </Button>
                <Button asChild>
                  <Link href="/">返回首页</Link>
                </Button>
              </div>
            </div>
          </div>
        )



      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                {step < 5 && <div className={`w-16 h-1 mx-2 ${step < currentStep ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>选择项目</span>
            <span>填写表单</span>
            <span>确认报价</span>
            <span>提交订单</span>
            <span>完成预约</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">{renderStepContent()}</div>

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="max-w-4xl mx-auto mt-8 flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              上一步
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !selectedService) ||
                  (currentStep === 2 && (!formData.name || !formData.phone || !selectedDate || !selectedTime)) ||
                  (currentStep === 3 && !selectedDoctor)
                }
              >
                下一步
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={!paymentMethod || isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    处理中...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    确认支付
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
