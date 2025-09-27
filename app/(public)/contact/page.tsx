"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  Navigation,
  Calendar,
  Star,
  Shield,
  Heart,
} from "lucide-react"
import Image from "next/image"

const locations = [
  {
    id: "main",
    name: "总院",
    address: "北京市朝阳区建国门外大街1号",
    phone: "400-888-0001",
    email: "main@beautymedical.com",
    hours: {
      weekday: "09:00 - 18:00",
      weekend: "09:00 - 17:00",
    },
    services: ["全科医美", "整形外科", "皮肤美容", "注射美容"],
    transportation: ["地铁1号线建国门站A出口步行5分钟", "公交1路、4路、52路建国门站下车", "提供免费停车位"],
    image: "modern medical beauty clinic exterior building",
    featured: true,
  },
  {
    id: "branch1",
    name: "三里屯分院",
    address: "北京市朝阳区三里屯路19号",
    phone: "400-888-0002",
    email: "sanlitun@beautymedical.com",
    hours: {
      weekday: "10:00 - 19:00",
      weekend: "10:00 - 18:00",
    },
    services: ["皮肤管理", "注射美容", "激光美肤"],
    transportation: ["地铁10号线团结湖站B出口步行8分钟", "公交113路、115路三里屯站下车", "周边有多个付费停车场"],
    image: "modern medical beauty clinic branch location",
    featured: false,
  },
  {
    id: "branch2",
    name: "国贸分院",
    address: "北京市朝阳区国贸中心3期B座",
    phone: "400-888-0003",
    email: "guomao@beautymedical.com",
    hours: {
      weekday: "09:30 - 18:30",
      weekend: "10:00 - 17:00",
    },
    services: ["微整形", "皮肤管理", "医美咨询"],
    transportation: ["地铁1号线、10号线国贸站C出口直达", "公交1路、4路、37路国贸站下车", "国贸中心地下停车场"],
    image: "upscale medical beauty clinic in business district",
    featured: false,
  },
]

const contactMethods = [
  {
    icon: Phone,
    title: "电话咨询",
    description: "专业客服24小时在线",
    contact: "400-888-0001",
    action: "立即拨打",
  },
  {
    icon: MessageCircle,
    title: "微信咨询",
    description: "扫码添加专属顾问",
    contact: "BeautyMedical2024",
    action: "添加微信",
  },
  {
    icon: Mail,
    title: "邮件咨询",
    description: "详细咨询请发送邮件",
    contact: "info@beautymedical.com",
    action: "发送邮件",
  },
]

export default function ContactPage() {
  const [selectedLocation, setSelectedLocation] = useState("main")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
    preferredContact: "",
    appointmentDate: "",
  })

  const selectedLocationData = locations.find((loc) => loc.id === selectedLocation)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Contact form submitted:", formData)
    // Show success message or redirect
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background via-background to-muted py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                联系我们
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
                随时为您服务
                <br />
                <span className="text-primary">专业咨询团队</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl mx-auto">
                我们的专业团队随时为您提供咨询服务，无论是项目了解、预约安排还是术后护理， 都有专业人员为您详细解答。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">24小时</div>
                <div className="text-sm text-muted-foreground">在线咨询</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">3家</div>
                <div className="text-sm text-muted-foreground">分院地址</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">15分钟</div>
                <div className="text-sm text-muted-foreground">快速响应</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-foreground text-balance">多种联系方式</h2>
            <p className="text-muted-foreground text-pretty">选择最适合您的沟通方式</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <method.icon className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">{method.title}</h3>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                    <p className="font-medium text-primary">{method.contact}</p>
                  </div>
                  <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground text-balance">在线咨询</h2>
                <p className="text-muted-foreground text-pretty">填写下方表单，我们将在24小时内与您联系</p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">姓名 *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="请输入您的姓名"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">手机号 *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="请输入手机号"
                          required
                        />
                      </div>
                    </div>

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
                      <Label htmlFor="subject">咨询主题</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) => setFormData({ ...formData, subject: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="请选择咨询主题" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consultation">项目咨询</SelectItem>
                          <SelectItem value="appointment">预约安排</SelectItem>
                          <SelectItem value="pricing">价格了解</SelectItem>
                          <SelectItem value="aftercare">术后护理</SelectItem>
                          <SelectItem value="complaint">投诉建议</SelectItem>
                          <SelectItem value="other">其他问题</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="preferredContact">首选联系方式</Label>
                      <Select
                        value={formData.preferredContact}
                        onValueChange={(value) => setFormData({ ...formData, preferredContact: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="请选择联系方式" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phone">电话</SelectItem>
                          <SelectItem value="wechat">微信</SelectItem>
                          <SelectItem value="email">邮件</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="appointmentDate">期望预约时间</Label>
                      <Input
                        id="appointmentDate"
                        type="date"
                        value={formData.appointmentDate}
                        onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">详细描述</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="请详细描述您的需求或问题"
                        rows={4}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      <Send className="mr-2 h-4 w-4" />
                      提交咨询
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Location Info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground text-balance">诊所地址</h2>
                <p className="text-muted-foreground text-pretty">我们在北京设有3家分院，为您提供便利的就诊选择</p>
              </div>

              {/* Location Selector */}
              <div className="flex flex-wrap gap-2">
                {locations.map((location) => (
                  <Button
                    key={location.id}
                    variant={selectedLocation === location.id ? "default" : "outline"}
                    onClick={() => setSelectedLocation(location.id)}
                    className="rounded-full"
                  >
                    {location.name}
                    {location.featured && <Star className="ml-1 h-3 w-3" />}
                  </Button>
                ))}
              </div>

              {/* Selected Location Details */}
              {selectedLocationData && (
                <Card>
                  <CardHeader className="p-0">
                    <div className="aspect-video rounded-t-lg overflow-hidden bg-muted">
                      <Image
                        src={`/abstract-geometric-shapes.png?height=200&width=400&query=${selectedLocationData.image}`}
                        alt={selectedLocationData.name}
                        width={400}
                        height={200}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-foreground">{selectedLocationData.name}</h3>
                        {selectedLocationData.featured && (
                          <Badge variant="default" className="bg-primary text-primary-foreground">
                            <Star className="mr-1 h-3 w-3" />
                            总院
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">地址</p>
                          <p className="text-sm text-muted-foreground">{selectedLocationData.address}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">电话</p>
                          <p className="text-sm text-muted-foreground">{selectedLocationData.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">邮箱</p>
                          <p className="text-sm text-muted-foreground">{selectedLocationData.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">营业时间</p>
                          <p className="text-sm text-muted-foreground">工作日: {selectedLocationData.hours.weekday}</p>
                          <p className="text-sm text-muted-foreground">周末: {selectedLocationData.hours.weekend}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">主要服务</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedLocationData.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">交通指南</h4>
                      <ul className="space-y-1">
                        {selectedLocationData.transportation.map((transport, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                            <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span>{transport}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Navigation className="mr-2 h-4 w-4" />
                        导航
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Calendar className="mr-2 h-4 w-4" />
                        预约参观
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-foreground text-balance">常见问题</h2>
            <p className="text-muted-foreground text-pretty">快速了解常见咨询问题</p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <CardContent className="space-y-3">
                <h3 className="font-semibold text-foreground">如何预约咨询？</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  您可以通过电话、微信、在线表单或直接到院等多种方式预约。我们建议提前1-2天预约，以确保能为您安排合适的时间。
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-3">
                <h3 className="font-semibold text-foreground">初次咨询需要带什么？</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  请携带身份证，如有相关病历或检查报告也请一并带来。初次咨询我们会为您进行详细的面诊和肌肤检测。
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-3">
                <h3 className="font-semibold text-foreground">咨询是否收费？</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  我们提供免费的初次咨询服务，包括专业医师面诊、肌肤检测和个性化方案设计。详细的检查项目可能会产生相应费用。
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-3">
                <h3 className="font-semibold text-foreground">如何选择合适的分院？</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  总院提供全科医美服务，分院各有特色。您可以根据项目需求、地理位置和交通便利性来选择最适合的分院。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-foreground text-balance">为什么选择我们</h2>
            <p className="text-muted-foreground text-pretty">专业、安全、贴心的服务保障</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">安全保障</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    严格的医疗标准，完善的安全体系，为每一位客户的安全负责
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Star className="h-8 w-8 text-secondary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">专业团队</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    资深医师团队，丰富的临床经验，为您提供专业的医美服务
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">贴心服务</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    从咨询到术后，全程贴心服务，让您的美丽之旅更加安心
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
