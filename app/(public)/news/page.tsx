import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Eye, ArrowRight, TrendingUp, Award, Zap } from "lucide-react"
import Image from "next/image"

const featuredNews = {
  id: "featured-1",
  title: "2024年医美行业新趋势：个性化定制成为主流",
  excerpt: "随着技术的不断进步，个性化定制医美方案正在成为行业新标准，为每位客户提供更精准的美丽解决方案。",
  category: "行业趋势",
  date: "2024-12-15",
  author: "医美研究院",
  views: 2580,
  image: "modern medical beauty technology trends 2024",
  featured: true,
}

const newsArticles = [
  {
    id: "news-1",
    title: "新一代激光美肤技术正式引入",
    excerpt: "我们引入了最新的皮秒激光技术，为客户提供更安全、更有效的美肤治疗方案。",
    category: "技术更新",
    date: "2024-12-12",
    author: "技术部",
    views: 1240,
    image: "advanced laser skin treatment technology",
  },
  {
    id: "news-2",
    title: "冬季护肤指南：医美项目最佳时机",
    excerpt: "冬季是进行医美项目的最佳时机，温度适宜，紫外线较弱，有利于术后恢复。",
    category: "护肤指南",
    date: "2024-12-10",
    author: "王志强医师",
    views: 1890,
    image: "winter skincare medical beauty treatments",
  },
  {
    id: "news-3",
    title: "我院荣获年度最佳医美机构称号",
    excerpt: "在2024年度医美行业评选中，我院凭借专业的技术和优质的服务荣获多项殊荣。",
    category: "机构荣誉",
    date: "2024-12-08",
    author: "行政部",
    views: 3200,
    image: "medical beauty clinic award ceremony",
  },
  {
    id: "news-4",
    title: "玻尿酸注射：安全性与效果并重",
    excerpt: "详解玻尿酸注射的安全标准和预期效果，帮助客户做出明智的选择。",
    category: "项目介绍",
    date: "2024-12-05",
    author: "张雅琳医师",
    views: 1560,
    image: "hyaluronic acid injection safety procedures",
  },
  {
    id: "news-5",
    title: "医美术后护理的重要性",
    excerpt: "正确的术后护理是确保医美效果的关键，我们为您提供专业的护理指导。",
    category: "护理指南",
    date: "2024-12-03",
    author: "护理团队",
    views: 2100,
    image: "post treatment care medical beauty",
  },
  {
    id: "news-6",
    title: "双眼皮手术：自然美的艺术",
    excerpt: "探讨如何通过精细的双眼皮手术技术，创造自然协调的眼部美感。",
    category: "手术技术",
    date: "2024-12-01",
    author: "李美华医师",
    views: 1780,
    image: "natural double eyelid surgery techniques",
  },
]

const promotions = [
  {
    id: "promo-1",
    title: "年末美丽盛典",
    description: "多项医美项目限时优惠，最高可享7折优惠",
    discount: "最高7折",
    validUntil: "2024-12-31",
    image: "year end beauty promotion medical aesthetics",
  },
  {
    id: "promo-2",
    title: "新客户专享",
    description: "首次到院客户可享受免费专业咨询和肌肤检测",
    discount: "免费咨询",
    validUntil: "长期有效",
    image: "new customer consultation medical beauty",
  },
  {
    id: "promo-3",
    title: "组合套餐优惠",
    description: "多项目组合治疗，享受更优惠的价格和更好的效果",
    discount: "套餐优惠",
    validUntil: "2024-12-25",
    image: "combination treatment packages medical beauty",
  },
]

export default function NewsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background via-background to-muted py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                新闻资讯
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
                医美资讯中心
                <br />
                <span className="text-primary">掌握行业动态</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl mx-auto">
                及时了解医美行业最新动态，掌握前沿技术资讯，获取专业护理指导， 让您在美丽路上走得更加从容自信。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="aspect-video lg:aspect-square overflow-hidden bg-muted">
                  <Image
                    src={`/abstract-geometric-shapes.png?height=400&width=600&query=${featuredNews.image}`}
                    alt={featuredNews.title}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Badge variant="default" className="bg-primary text-primary-foreground">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        热门
                      </Badge>
                      <Badge variant="secondary">{featuredNews.category}</Badge>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight text-balance">
                      {featuredNews.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-pretty">{featuredNews.excerpt}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{featuredNews.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{featuredNews.author}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{featuredNews.views.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button size="lg" className="w-fit">
                    阅读全文
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-foreground text-balance">最新资讯</h2>
            <p className="text-muted-foreground text-pretty">了解医美行业最新动态和专业知识</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsArticles.map((article) => (
              <Card key={article.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="p-0">
                  <div className="aspect-video rounded-t-lg overflow-hidden bg-muted">
                    <Image
                      src={`/abstract-geometric-shapes.png?height=200&width=300&query=${article.image}`}
                      alt={article.title}
                      width={300}
                      height={200}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Badge variant="outline">{article.category}</Badge>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{article.excerpt}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{article.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{article.author}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{article.views.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    阅读更多
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              查看更多资讯
            </Button>
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-foreground text-balance">优惠活动</h2>
            <p className="text-muted-foreground text-pretty">限时优惠，不容错过</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <Card
                key={promo.id}
                className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 z-10">
                  <Badge variant="default" className="bg-red-500 text-white">
                    <Zap className="mr-1 h-3 w-3" />
                    {promo.discount}
                  </Badge>
                </div>
                <CardHeader className="p-0">
                  <div className="aspect-video rounded-t-lg overflow-hidden bg-muted">
                    <Image
                      src={`/abstract-geometric-shapes.png?height=200&width=300&query=${promo.image}`}
                      alt={promo.title}
                      width={300}
                      height={200}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {promo.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{promo.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">有效期至:</span>
                    <span className="font-medium text-red-600">{promo.validUntil}</span>
                  </div>

                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    立即了解
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground text-balance">订阅我们的资讯</h2>
              <p className="text-muted-foreground text-pretty">第一时间获取最新的医美资讯、优惠活动和专业护理建议</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="请输入您的邮箱地址"
                className="flex-1 px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">订阅</Button>
            </div>

            <p className="text-xs text-muted-foreground">我们承诺保护您的隐私，不会向第三方分享您的信息</p>
          </div>
        </div>
      </section>
    </div>
  )
}
