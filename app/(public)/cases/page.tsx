"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Play, Eye, Heart, Calendar, User, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const caseStudies = [
  {
    id: "case-1",
    title: "双眼皮手术 - 自然大眼蜕变",
    category: "微整形",
    patient: "小雅",
    age: "25岁",
    procedure: "双眼皮手术",
    doctor: "李美华",
    duration: "2小时",
    recovery: "14天",
    satisfaction: 5,
    description: "通过精细的双眼皮手术，让眼睛更加有神，整体面部轮廓更加协调自然。",
    beforeImage: "asian woman before double eyelid surgery natural lighting",
    afterImage: "asian woman after double eyelid surgery beautiful eyes natural lighting",
    results: ["眼睛更加有神明亮", "双眼皮线条自然流畅", "整体面部比例更协调", "恢复快速无明显疤痕"],
    timeline: [
      { day: "手术当天", description: "手术顺利完成，眼部有轻微肿胀" },
      { day: "第3天", description: "肿胀明显减轻，可正常工作" },
      { day: "第7天", description: "拆线，双眼皮形状基本确定" },
      { day: "第14天", description: "完全恢复，效果自然满意" },
    ],
  },
  {
    id: "case-2",
    title: "玻尿酸填充 - 重塑面部轮廓",
    category: "注射美容",
    patient: "美美",
    age: "32岁",
    procedure: "玻尿酸填充",
    doctor: "张雅琳",
    duration: "45分钟",
    recovery: "3天",
    satisfaction: 5,
    description: "通过精准的玻尿酸注射，改善面部凹陷，提升整体轮廓立体感。",
    beforeImage: "asian woman before hyaluronic acid treatment profile view",
    afterImage: "asian woman after hyaluronic acid treatment enhanced facial contour",
    results: ["面部轮廓更加立体", "苹果肌饱满自然", "法令纹明显淡化", "整体年轻化效果显著"],
    timeline: [
      { day: "注射当天", description: "注射完成，有轻微红肿" },
      { day: "第2天", description: "红肿消退，效果初现" },
      { day: "第3天", description: "完全恢复，效果自然" },
      { day: "第7天", description: "效果稳定，满意度极高" },
    ],
  },
  {
    id: "case-3",
    title: "激光美肤 - 焕发肌肤光彩",
    category: "皮肤管理",
    patient: "晓雯",
    age: "28岁",
    procedure: "激光美肤",
    doctor: "王志强",
    duration: "60分钟",
    recovery: "5天",
    satisfaction: 5,
    description: "通过先进的激光技术，改善肌肤质地，淡化色斑，重现年轻光彩。",
    beforeImage: "asian woman before laser skin treatment with skin concerns",
    afterImage: "asian woman after laser skin treatment glowing clear skin",
    results: ["肌肤质地明显改善", "色斑淡化效果显著", "毛孔收缩更细腻", "整体肌肤更加光滑"],
    timeline: [
      { day: "治疗当天", description: "激光治疗完成，皮肤有轻微发红" },
      { day: "第2天", description: "发红消退，开始结痂" },
      { day: "第5天", description: "结痂脱落，新肌肤显现" },
      { day: "第10天", description: "肌肤质地明显改善" },
    ],
  },
  {
    id: "case-4",
    title: "线雕提升 - 重塑年轻轮廓",
    category: "微整形",
    patient: "雅雅",
    age: "38岁",
    procedure: "线雕提升",
    doctor: "李美华",
    duration: "90分钟",
    recovery: "7天",
    satisfaction: 5,
    description: "通过专业的线雕技术，提升面部轮廓，改善松弛下垂，重现年轻状态。",
    beforeImage: "mature asian woman before thread lift treatment",
    afterImage: "mature asian woman after thread lift treatment lifted facial contour",
    results: ["面部轮廓明显提升", "下颌线条更加清晰", "法令纹显著改善", "整体年轻化10岁"],
    timeline: [
      { day: "手术当天", description: "线雕完成，面部有轻微肿胀" },
      { day: "第3天", description: "肿胀减轻，提升效果初现" },
      { day: "第7天", description: "基本恢复，效果明显" },
      { day: "第30天", description: "效果稳定，满意度极高" },
    ],
  },
]

const videoTestimonials = [
  {
    id: "video-1",
    title: "双眼皮手术真实体验分享",
    patient: "小雅",
    procedure: "双眼皮手术",
    duration: "3:24",
    views: 12500,
    thumbnail: "asian woman testimonial video thumbnail double eyelid surgery",
  },
  {
    id: "video-2",
    title: "玻尿酸注射全程记录",
    patient: "美美",
    procedure: "玻尿酸填充",
    duration: "2:18",
    views: 8900,
    thumbnail: "asian woman testimonial video thumbnail hyaluronic acid treatment",
  },
  {
    id: "video-3",
    title: "激光美肤效果对比",
    patient: "晓雯",
    procedure: "激光美肤",
    duration: "4:12",
    views: 15600,
    thumbnail: "asian woman testimonial video thumbnail laser skin treatment",
  },
]

export default function CasesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCase, setSelectedCase] = useState<string | null>(null)

  const filteredCases =
    selectedCategory === "all" ? caseStudies : caseStudies.filter((c) => c.category === selectedCategory)

  const categories = ["all", "微整形", "注射美容", "皮肤管理"]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background via-background to-muted py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                成功案例
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
                真实案例分享
                <br />
                <span className="text-primary">见证美丽蜕变</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl mx-auto">
                每一个成功案例都是我们专业技术的体现，每一次美丽蜕变都是客户信任的见证。
                真实的效果对比，专业的医师团队，让美丽更自然，让自信更持久。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">成功案例</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">客户满意度</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">15年</div>
                <div className="text-sm text-muted-foreground">专业经验</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category === "all" ? "全部案例" : category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCases.map((caseStudy) => (
              <Card key={caseStudy.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="p-0">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="aspect-square rounded-tl-lg overflow-hidden bg-muted relative">
                      <Image
                        src={`/abstract-geometric-shapes.png?height=300&width=300&query=${caseStudy.beforeImage}`}
                        alt="术前"
                        width={300}
                        height={300}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">术前</div>
                    </div>
                    <div className="aspect-square rounded-tr-lg overflow-hidden bg-muted relative">
                      <Image
                        src={`/abstract-geometric-shapes.png?height=300&width=300&query=${caseStudy.afterImage}`}
                        alt="术后"
                        width={300}
                        height={300}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                        术后
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {caseStudy.title}
                      </h3>
                      <Badge variant="secondary">{caseStudy.category}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{caseStudy.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {caseStudy.patient} ({caseStudy.age})
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>恢复期: {caseStudy.recovery}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span>医师: {caseStudy.doctor}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: caseStudy.satisfaction }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                        ))}
                        <span className="ml-1">满意度</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">治疗效果</h4>
                    <ul className="space-y-1">
                      {caseStudy.results.slice(0, 2).map((result, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start space-x-1">
                          <Star className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                          <span>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                    onClick={() => setSelectedCase(caseStudy.id)}
                  >
                    查看详细案例
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-foreground text-balance">客户视频分享</h2>
            <p className="text-muted-foreground text-pretty">真实的声音，真实的体验</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videoTestimonials.map((video) => (
              <Card key={video.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader className="p-0">
                  <div className="aspect-video rounded-t-lg overflow-hidden bg-muted relative">
                    <Image
                      src={`/abstract-geometric-shapes.png?height=200&width=300&query=${video.thumbnail}`}
                      alt={video.title}
                      width={300}
                      height={200}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Play className="h-8 w-8 ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {video.duration}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {video.patient} - {video.procedure}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{video.views.toLocaleString()}</span>
                    </div>
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
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">开始您的美丽之旅</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              专业的团队，成熟的技术，真实的案例。让我们为您定制专属的美丽方案。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/booking">
                  <Calendar className="mr-2 h-5 w-5" />
                  立即预约咨询
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">了解更多案例</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
