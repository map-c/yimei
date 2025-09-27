import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Users, Shield, CheckCircle, AlertCircle, Calendar, Phone, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

// Service data (in a real app, this would come from a database)
const serviceData: Record<string, any> = {
  "double-eyelid": {
    title: "双眼皮手术",
    category: "微整形",
    description:
      "采用先进的微创技术，为您打造自然双眼皮，让眼睛更有神采。我们的专业医师团队拥有丰富经验，确保手术安全和效果自然。",
    price: "¥8,800起",
    originalPrice: "¥12,800",
    duration: "1-2小时",
    recovery: "7-14天",
    rating: 4.9,
    reviews: 1250,
    popular: true,
    beforeAfterImages: ["double eyelid surgery before result", "double eyelid surgery after result"],
    suitableFor: [
      "单眼皮想要双眼皮的人群",
      "双眼皮不明显需要加深的人群",
      "眼皮松弛下垂的人群",
      "希望眼睛看起来更大更有神的人群",
    ],
    contraindications: [
      "眼部有炎症或感染",
      "严重的眼部疾病",
      "凝血功能异常",
      "妊娠期和哺乳期女性",
      "心理期望过高或不切实际",
    ],
    process: [
      {
        step: 1,
        title: "专业咨询",
        description: "医师详细了解您的需求，进行眼部检查，设计个性化方案",
      },
      {
        step: 2,
        title: "方案设计",
        description: "根据您的眼部特点和期望效果，制定最适合的手术方案",
      },
      {
        step: 3,
        title: "手术实施",
        description: "在无菌环境下进行手术，采用精细技术确保效果自然",
      },
      {
        step: 4,
        title: "术后护理",
        description: "提供详细的术后护理指导，定期复查确保恢复效果",
      },
    ],
    packages: [
      {
        name: "基础套餐",
        price: "¥8,800",
        originalPrice: "¥12,800",
        features: ["双眼皮成形手术", "术前详细检查", "术后基础护理", "7天内免费复查"],
      },
      {
        name: "精品套餐",
        price: "¥12,800",
        originalPrice: "¥18,800",
        features: ["双眼皮成形手术", "术前详细检查", "高级缝合技术", "术后专业护理", "30天内免费复查", "术后护理产品"],
        popular: true,
      },
      {
        name: "VIP套餐",
        price: "¥18,800",
        originalPrice: "¥25,800",
        features: [
          "双眼皮成形手术",
          "术前详细检查",
          "顶级缝合技术",
          "VIP术后护理",
          "90天内免费复查",
          "术后护理产品套装",
          "专属客服跟踪",
        ],
      },
    ],
  },
  hydrafacial: {
    title: "海菲秀深层清洁",
    category: "皮肤管理",
    description: "海菲秀是一项革命性的皮肤护理技术，通过专利的涡旋技术深层清洁毛孔，同时补水保湿，让肌肤即刻焕发光彩。",
    price: "¥1,200起",
    originalPrice: "¥1,800",
    duration: "60分钟",
    recovery: "无恢复期",
    rating: 4.9,
    reviews: 2100,
    popular: true,
    beforeAfterImages: ["hydrafacial treatment before skin", "hydrafacial treatment after glowing skin"],
    suitableFor: [
      "毛孔粗大、黑头较多的人群",
      "肌肤暗沉、缺乏光泽的人群",
      "油性肌肤需要深层清洁的人群",
      "希望改善肌肤质感的人群",
    ],
    contraindications: ["面部有开放性伤口", "严重的皮肤炎症", "对治疗成分过敏", "妊娠期女性需谨慎"],
    process: [
      {
        step: 1,
        title: "肌肤分析",
        description: "专业肌肤检测，了解您的肌肤状况和需求",
      },
      {
        step: 2,
        title: "深层清洁",
        description: "使用专利涡旋技术，温和去除老化角质和毛孔污垢",
      },
      {
        step: 3,
        title: "精华导入",
        description: "根据肌肤需求，导入相应的营养精华",
      },
      {
        step: 4,
        title: "保湿护理",
        description: "深层补水保湿，让肌肤水润饱满",
      },
    ],
    packages: [
      {
        name: "单次体验",
        price: "¥1,200",
        originalPrice: "¥1,800",
        features: ["海菲秀深层清洁", "基础精华导入", "保湿面膜", "术后护理指导"],
      },
      {
        name: "3次套餐",
        price: "¥3,200",
        originalPrice: "¥5,400",
        features: ["3次海菲秀治疗", "个性化精华配方", "专业护肤建议", "护肤产品优惠"],
        popular: true,
      },
      {
        name: "6次套餐",
        price: "¥5,800",
        originalPrice: "¥10,800",
        features: ["6次海菲秀治疗", "定制化护理方案", "高端精华产品", "专属护肤顾问", "免费肌肤检测"],
      },
    ],
  },
}

interface ServiceDetailPageProps {
  params: {
    id: string
  }
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const service = serviceData[params.id]

  if (!service) {
    notFound()
  }

  return (
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <section className="bg-muted py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary">
              首页
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/services" className="text-muted-foreground hover:text-primary">
              服务项目
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{service.title}</span>
          </div>
        </div>
      </section>

      {/* Service Header */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">{service.category}</Badge>
                  {service.popular && <Badge className="bg-primary text-primary-foreground">热门项目</Badge>}
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground text-balance">{service.title}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed text-pretty">{service.description}</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-sm font-medium text-foreground">{service.duration}</div>
                  <div className="text-xs text-muted-foreground">治疗时长</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-sm font-medium text-foreground">{service.recovery}</div>
                  <div className="text-xs text-muted-foreground">恢复时间</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Star className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-sm font-medium text-foreground">{service.rating}</div>
                  <div className="text-xs text-muted-foreground">客户评分</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-sm font-medium text-foreground">{service.reviews}</div>
                  <div className="text-xs text-muted-foreground">成功案例</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Calendar className="mr-2 h-5 w-5" />
                  立即预约
                </Button>
                <Button variant="outline" size="lg">
                  <Phone className="mr-2 h-5 w-5" />
                  电话咨询
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {service.beforeAfterImages.map((image: string, index: number) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={`/abstract-geometric-shapes.png?height=300&width=300&query=${image}`}
                      alt={`${service.title} ${index === 0 ? "治疗前" : "治疗后"}`}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">治疗前后对比效果</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Suitable For */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span>适用人群</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {service.suitableFor.map((item: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Contraindications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <span>禁忌说明</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {service.contraindications.map((item: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-foreground text-balance">服务流程</h2>
            <p className="text-muted-foreground text-pretty">专业流程，确保最佳效果</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.process.map((step: any, index: number) => (
              <Card key={index} className="text-center relative">
                <CardContent className="p-6 space-y-4">
                  <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {step.step}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </CardContent>
                {index < service.process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border"></div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-foreground text-balance">价格套餐</h2>
            <p className="text-muted-foreground text-pretty">多种套餐选择，满足不同需求</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {service.packages.map((pkg: any, index: number) => (
              <Card key={index} className={`relative ${pkg.popular ? "border-primary shadow-lg" : ""}`}>
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    推荐套餐
                  </Badge>
                )}
                <CardHeader className="text-center space-y-4">
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-primary">{pkg.price}</div>
                    {pkg.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">{pkg.originalPrice}</div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {pkg.features.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${pkg.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                    variant={pkg.popular ? "default" : "outline"}
                  >
                    选择套餐
                  </Button>
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
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">准备开始您的美丽蜕变？</h2>
            <p className="text-lg text-muted-foreground text-pretty">专业医师为您提供免费咨询，制定个性化治疗方案。</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Calendar className="mr-2 h-5 w-5" />
                立即预约咨询
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/services">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  返回服务列表
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
