import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Shield, Award, Users, ArrowRight, Phone, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-background to-muted py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                  专业医美机构
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                  让美丽更
                  <span className="text-primary">自然</span>
                  <br />
                  让自信更持久
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                  我们致力于为您提供安全、专业、自然的医美服务。采用先进技术，由资深医师团队为您量身定制美丽方案，让您在安全的环境中重获自信。
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Calendar className="mr-2 h-5 w-5" />
                  立即预约咨询
                </Button>
                <Button variant="outline" size="lg">
                  <Phone className="mr-2 h-5 w-5" />
                  400-123-4567
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">10000+</div>
                  <div className="text-sm text-muted-foreground">成功案例</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">15年</div>
                  <div className="text-sm text-muted-foreground">专业经验</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">98%</div>
                  <div className="text-sm text-muted-foreground">满意度</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
                <Image
                  src="/elegant-medical-beauty-clinic-interior-with-soft-l.jpg"
                  alt="美丽诊所环境"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg border">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-primary border-2 border-white"></div>
                    ))}
                  </div>
                  <div>
                    <div className="text-sm font-medium">专业医师团队</div>
                    <div className="text-xs text-muted-foreground">15+ 年平均经验</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Quick Access */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-foreground text-balance">热门医美项目</h2>
            <p className="text-muted-foreground text-pretty">专业医师团队，为您提供个性化美丽方案</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "双眼皮手术",
                description: "自然双眼皮，让眼睛更有神",
                image: "elegant double eyelid surgery result",
                price: "¥8,800起",
                popular: true,
              },
              {
                title: "皮肤管理",
                description: "深层清洁，焕发肌肤光彩",
                image: "professional skin treatment session",
                price: "¥1,200起",
                popular: false,
              },
              {
                title: "注射美容",
                description: "安全填充，自然年轻态",
                image: "professional injection beauty treatment",
                price: "¥2,800起",
                popular: true,
              },
              {
                title: "面部轮廓",
                description: "精雕细琢，完美脸型",
                image: "facial contouring treatment result",
                price: "¥15,800起",
                popular: false,
              },
            ].map((service, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader className="p-0">
                  <div className="aspect-square rounded-t-lg overflow-hidden bg-muted relative">
                    <Image
                      src={`/abstract-geometric-shapes.png?height=300&width=300&query=${service.image}`}
                      alt={service.title}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    {service.popular && (
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">热门</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription className="text-sm">{service.description}</CardDescription>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-foreground">{service.price}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="group-hover:bg-primary group-hover:text-primary-foreground"
                    >
                      了解更多
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link href="/services">
                查看全部服务
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-foreground text-balance">限时优惠活动</h2>
            <p className="text-muted-foreground text-pretty">专享优惠套餐，让美丽更实惠</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    限时特惠
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground">新客专享套餐</h3>
                  <p className="text-muted-foreground">
                    首次到店享受专业皮肤检测 + 基础护理 + 专家咨询，让您的美丽之旅从这里开始。
                  </p>
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-foreground">¥299</span>
                    <span className="text-lg text-muted-foreground line-through">¥899</span>
                    <Badge variant="destructive">省¥600</Badge>
                  </div>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">立即预约</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/20">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                    组合优惠
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground">美肌焕颜套餐</h3>
                  <p className="text-muted-foreground">深层清洁 + 补水保湿 + 美白提亮，三重护理让肌肤重现光彩。</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-foreground">¥1,999</span>
                    <span className="text-lg text-muted-foreground line-through">¥3,200</span>
                    <Badge variant="destructive">省¥1,201</Badge>
                  </div>
                  <Button className="w-full bg-foreground text-background hover:bg-foreground/90">了解详情</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials & Certifications */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Customer Reviews */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground text-balance">客户好评</h2>
                <p className="text-muted-foreground text-pretty">真实客户分享，见证美丽蜕变</p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    name: "张女士",
                    service: "双眼皮手术",
                    rating: 5,
                    comment:
                      "医生非常专业，手术过程很安全，恢复效果超出预期。现在眼睛看起来很自然，朋友们都说我变漂亮了！",
                  },
                  {
                    name: "李女士",
                    service: "皮肤管理",
                    rating: 5,
                    comment: "定期来做皮肤管理，肌肤状态越来越好。医师很细心，每次都会根据我的肌肤状况调整护理方案。",
                  },
                  {
                    name: "王女士",
                    service: "注射美容",
                    rating: 5,
                    comment: "第一次尝试注射美容，医生很耐心地解释整个过程，效果很自然，看起来年轻了好几岁。",
                  },
                ].map((review, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-foreground">{review.name}</div>
                            <div className="text-sm text-muted-foreground">{review.service}</div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">"{review.comment}"</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground text-balance">权威认证</h2>
                <p className="text-muted-foreground text-pretty">专业资质保障，值得信赖的选择</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    icon: Shield,
                    title: "医疗机构许可证",
                    description: "正规医疗资质",
                  },
                  {
                    icon: Award,
                    title: "ISO质量认证",
                    description: "国际质量标准",
                  },
                  {
                    icon: Users,
                    title: "专业医师团队",
                    description: "15年平均经验",
                  },
                  {
                    icon: Star,
                    title: "行业优秀奖",
                    description: "连续3年获奖",
                  },
                ].map((cert, index) => (
                  <Card key={index} className="text-center p-6 hover:shadow-md transition-shadow">
                    <CardContent className="space-y-4">
                      <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <cert.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">{cert.title}</h3>
                        <p className="text-sm text-muted-foreground">{cert.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                <CardContent className="p-6 text-center space-y-4">
                  <h3 className="text-xl font-bold text-foreground">安全承诺</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    我们承诺使用正品材料，严格遵循医疗安全标准，为每一位客户提供安全、专业的医美服务。您的安全与满意是我们的首要责任。
                  </p>
                  <Button variant="outline" size="sm">
                    查看更多资质
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">开启您的美丽之旅</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              专业咨询，个性化方案，让美丽更自然。立即预约，享受专属优惠。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Calendar className="mr-2 h-5 w-5" />
                立即预约咨询
              </Button>
              <Button variant="outline" size="lg">
                <Phone className="mr-2 h-5 w-5" />
                电话咨询：400-123-4567
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
