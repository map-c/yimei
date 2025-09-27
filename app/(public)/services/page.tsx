import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Clock, Users, Shield, ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const serviceCategories = {
  microsurgery: {
    title: "微整形",
    description: "无创或微创美容项目，恢复快，效果自然",
    services: [
      {
        id: "double-eyelid",
        title: "双眼皮手术",
        description: "打造自然双眼皮，让眼睛更有神采",
        price: "¥8,800起",
        duration: "1-2小时",
        recovery: "7-14天",
        rating: 4.9,
        reviews: 1250,
        popular: true,
        image: "natural double eyelid surgery result",
      },
      {
        id: "nose-job",
        title: "鼻部整形",
        description: "精细雕琢，打造完美鼻型",
        price: "¥15,800起",
        duration: "2-3小时",
        recovery: "14-21天",
        rating: 4.8,
        reviews: 890,
        popular: false,
        image: "elegant nose reshaping result",
      },
      {
        id: "chin-augmentation",
        title: "下颌角整形",
        description: "改善脸型轮廓，塑造精致V脸",
        price: "¥25,800起",
        duration: "3-4小时",
        recovery: "21-30天",
        rating: 4.7,
        reviews: 456,
        popular: false,
        image: "facial contouring jawline result",
      },
    ],
  },
  skincare: {
    title: "皮肤管理",
    description: "专业皮肤护理，焕发肌肤自然光彩",
    services: [
      {
        id: "hydrafacial",
        title: "海菲秀深层清洁",
        description: "深层清洁毛孔，补水保湿，即刻焕肤",
        price: "¥1,200起",
        duration: "60分钟",
        recovery: "无恢复期",
        rating: 4.9,
        reviews: 2100,
        popular: true,
        image: "professional hydrafacial treatment",
      },
      {
        id: "laser-treatment",
        title: "激光美肤",
        description: "改善色斑、细纹，提亮肤色",
        price: "¥2,800起",
        duration: "30-45分钟",
        recovery: "3-7天",
        rating: 4.8,
        reviews: 1680,
        popular: true,
        image: "laser skin treatment session",
      },
      {
        id: "rf-tightening",
        title: "射频紧肤",
        description: "刺激胶原蛋白再生，紧致肌肤",
        price: "¥3,500起",
        duration: "45-60分钟",
        recovery: "无恢复期",
        rating: 4.7,
        reviews: 920,
        popular: false,
        image: "radiofrequency skin tightening",
      },
    ],
  },
  injection: {
    title: "注射美容",
    description: "安全注射填充，自然抗衰老",
    services: [
      {
        id: "botox",
        title: "肉毒素除皱",
        description: "减少动态皱纹，保持年轻状态",
        price: "¥2,800起",
        duration: "15-30分钟",
        recovery: "无恢复期",
        rating: 4.9,
        reviews: 1890,
        popular: true,
        image: "botox anti-aging treatment",
      },
      {
        id: "hyaluronic-acid",
        title: "玻尿酸填充",
        description: "自然填充，塑造立体轮廓",
        price: "¥4,500起",
        duration: "30-45分钟",
        recovery: "3-5天",
        rating: 4.8,
        reviews: 1560,
        popular: true,
        image: "hyaluronic acid dermal filler",
      },
      {
        id: "thread-lift",
        title: "线雕提升",
        description: "无创拉皮，重塑面部轮廓",
        price: "¥8,800起",
        duration: "60-90分钟",
        recovery: "7-14天",
        rating: 4.7,
        reviews: 780,
        popular: false,
        image: "thread lift facial contouring",
      },
    ],
  },
  repair: {
    title: "修复类项目",
    description: "专业修复，重塑自然美丽",
    services: [
      {
        id: "scar-removal",
        title: "疤痕修复",
        description: "淡化疤痕，恢复肌肤平滑",
        price: "¥3,200起",
        duration: "45-60分钟",
        recovery: "7-14天",
        rating: 4.6,
        reviews: 340,
        popular: false,
        image: "scar removal treatment result",
      },
      {
        id: "revision-surgery",
        title: "修复手术",
        description: "专业修复，重获自信美丽",
        price: "¥15,000起",
        duration: "2-4小时",
        recovery: "14-30天",
        rating: 4.8,
        reviews: 180,
        popular: false,
        image: "revision surgery consultation",
      },
    ],
  },
}

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background via-background to-muted py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground text-balance">专业医美服务</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              我们提供全方位的医美服务，从微整形到皮肤管理，每一项服务都经过精心设计，确保安全有效的美丽蜕变。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Calendar className="mr-2 h-5 w-5" />
                立即预约咨询
              </Button>
              <Button variant="outline" size="lg">
                查看价格表
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Categories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="microsurgery" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-12">
              {Object.entries(serviceCategories).map(([key, category]) => (
                <TabsTrigger key={key} value={key} className="text-sm">
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(serviceCategories).map(([key, category]) => (
              <TabsContent key={key} value={key} className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-foreground">{category.title}</h2>
                  <p className="text-muted-foreground text-pretty max-w-2xl mx-auto">{category.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.services.map((service) => (
                    <Card key={service.id} className="group hover:shadow-lg transition-all duration-300">
                      <CardHeader className="p-0">
                        <div className="aspect-video rounded-t-lg overflow-hidden bg-muted relative">
                          <Image
                            src={`/abstract-geometric-shapes.png?height=200&width=300&query=${service.image}`}
                            alt={service.title}
                            width={300}
                            height={200}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                          {service.popular && (
                            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">热门</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                          <CardTitle className="text-xl">{service.title}</CardTitle>
                          <CardDescription className="text-sm leading-relaxed">{service.description}</CardDescription>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{service.duration}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{service.recovery}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-primary text-primary" />
                              <span className="text-sm font-medium">{service.rating}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">({service.reviews})</span>
                          </div>
                          <span className="text-lg font-semibold text-primary">{service.price}</span>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                            <Link href={`/services/${service.id}`}>了解详情</Link>
                          </Button>
                          <Button size="sm" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                            立即预约
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-foreground text-balance">为什么选择我们</h2>
            <p className="text-muted-foreground text-pretty">专业团队，先进设备，贴心服务</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "安全保障",
                description: "严格遵循医疗安全标准，使用正品材料",
              },
              {
                icon: Users,
                title: "专业团队",
                description: "资深医师团队，平均15年临床经验",
              },
              {
                icon: Star,
                title: "个性定制",
                description: "根据个人特点，量身定制美丽方案",
              },
              {
                icon: Clock,
                title: "贴心服务",
                description: "全程跟踪服务，术后护理指导",
              },
            ].map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-md transition-shadow">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">准备开始您的美丽之旅？</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              专业咨询师为您提供免费咨询，制定个性化美丽方案。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Calendar className="mr-2 h-5 w-5" />
                预约免费咨询
              </Button>
              <Button variant="outline" size="lg">
                查看更多案例
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
