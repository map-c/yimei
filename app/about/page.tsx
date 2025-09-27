import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Award, Users, Shield, Heart, Target, Eye, Calendar, MapPin, GraduationCap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const doctors = [
  {
    name: "李美华",
    title: "主任医师",
    specialty: "整形外科",
    experience: "20年",
    education: "北京协和医学院",
    certifications: ["中华医学会整形外科分会委员", "国际美容整形外科学会会员"],
    expertise: ["面部轮廓整形", "眼部整形", "鼻部整形"],
    image: "professional female plastic surgeon portrait",
  },
  {
    name: "王志强",
    title: "副主任医师",
    specialty: "皮肤美容科",
    experience: "15年",
    education: "上海交通大学医学院",
    certifications: ["中国医师协会皮肤科医师分会委员", "激光美容专业认证"],
    expertise: ["激光美肤", "注射美容", "皮肤管理"],
    image: "professional male dermatologist portrait",
  },
  {
    name: "张雅琳",
    title: "主治医师",
    specialty: "微整形科",
    experience: "12年",
    education: "复旦大学医学院",
    certifications: ["国际注射美容认证", "线雕技术专业认证"],
    expertise: ["肉毒素注射", "玻尿酸填充", "线雕提升"],
    image: "professional female aesthetic doctor portrait",
  },
  {
    name: "陈建国",
    title: "主治医师",
    specialty: "修复整形科",
    experience: "18年",
    education: "中山大学医学院",
    certifications: ["中华医学会修复重建外科分会委员", "疤痕修复专业认证"],
    expertise: ["疤痕修复", "修复手术", "重建整形"],
    image: "professional male reconstructive surgeon portrait",
  },
]

const certifications = [
  {
    title: "医疗机构执业许可证",
    issuer: "国家卫生健康委员会",
    year: "2024",
    description: "正规医疗机构资质认证",
  },
  {
    title: "ISO 9001质量管理体系认证",
    issuer: "国际标准化组织",
    year: "2023",
    description: "国际质量管理标准认证",
  },
  {
    title: "医疗美容科诊疗科目",
    issuer: "北京市卫生健康委员会",
    year: "2024",
    description: "医疗美容专业科目许可",
  },
  {
    title: "消毒供应中心认证",
    issuer: "中华医学会",
    year: "2023",
    description: "医疗器械消毒标准认证",
  },
]

const partners = [
  {
    name: "北京协和医院",
    type: "战略合作医院",
    description: "在疑难病例会诊和技术交流方面建立深度合作",
  },
  {
    name: "上海九院整形外科",
    type: "技术合作伙伴",
    description: "共同开展新技术研发和医师培训项目",
  },
  {
    name: "中国医学科学院",
    type: "学术合作机构",
    description: "参与医美行业标准制定和学术研究",
  },
  {
    name: "国际美容整形外科学会",
    type: "国际合作组织",
    description: "与国际先进技术和理念保持同步",
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background via-background to-muted py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                  关于我们
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
                  专业医美机构
                  <br />
                  <span className="text-primary">值得信赖</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                  我们是一家专注于医疗美容的高端机构，致力于为客户提供安全、专业、自然的医美服务。凭借15年的行业经验和专业的医师团队，我们已经帮助超过10,000名客户实现了美丽蜕变。
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">15年</div>
                  <div className="text-sm text-muted-foreground">专业经验</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">10000+</div>
                  <div className="text-sm text-muted-foreground">成功案例</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">客户满意度</div>
                </div>
              </div>

              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Calendar className="mr-2 h-5 w-5" />
                预约参观诊所
              </Button>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
                <Image
                  src="/modern-medical-beauty-clinic-interior-with-profe.jpg"
                  alt="美丽诊所环境"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg border">
                <div className="flex items-center space-x-2">
                  <Award className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-sm font-medium">ISO认证机构</div>
                    <div className="text-xs text-muted-foreground">国际质量标准</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-foreground text-balance">使命与愿景</h2>
            <p className="text-muted-foreground text-pretty">安全、自然、科技医美</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground">我们的使命</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    致力于为每一位客户提供安全、专业、个性化的医美服务，让美丽更自然，让自信更持久。我们相信，真正的美丽来自于内心的自信和外在的和谐统一。
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-6">
                <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Eye className="h-8 w-8 text-secondary" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground">我们的愿景</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    成为中国领先的医疗美容机构，以科技创新为驱动，以客户满意为目标，推动医美行业的健康发展，让更多人享受到安全、有效的医美服务。
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="space-y-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground">核心价值观</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    安全第一、专业至上、诚信服务、持续创新。我们始终坚持以客户为中心，用专业的技术和贴心的服务，为每一位客户创造价值。
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Medical Team */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-foreground text-balance">专业医师团队</h2>
            <p className="text-muted-foreground text-pretty">资深医师，丰富经验，值得信赖</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="p-0">
                  <div className="aspect-square rounded-t-lg overflow-hidden bg-muted relative">
                    <Image
                      src={`/abstract-geometric-shapes.png?height=300&width=300&query=${doctor.image}`}
                      alt={doctor.name}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">{doctor.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{doctor.title}</Badge>
                      <Badge variant="outline">{doctor.specialty}</Badge>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{doctor.education}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{doctor.experience}临床经验</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">专业领域</h4>
                    <div className="flex flex-wrap gap-1">
                      {doctor.expertise.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">专业认证</h4>
                    <ul className="space-y-1">
                      {doctor.certifications.map((cert, certIndex) => (
                        <li key={certIndex} className="text-xs text-muted-foreground flex items-start space-x-1">
                          <Star className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                          <span>{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              查看更多医师
            </Button>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-foreground text-balance">资质证书</h2>
            <p className="text-muted-foreground text-pretty">权威认证，专业保障</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-md transition-shadow">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground text-sm leading-tight">{cert.title}</h3>
                    <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                    <Badge variant="secondary" className="text-xs">
                      {cert.year}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{cert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-foreground text-balance">合作医院与机构</h2>
            <p className="text-muted-foreground text-pretty">强强联合，共同发展</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partners.map((partner, index) => (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                <CardContent className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">{partner.name}</h3>
                      <Badge variant="secondary">{partner.type}</Badge>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{partner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground text-balance">企业文化</h2>
                <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                  我们倡导"以人为本、追求卓越"的企业文化，为员工创造良好的工作环境，为客户提供优质的服务体验。
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">以客户为中心</h3>
                    <p className="text-sm text-muted-foreground">始终将客户的需求和满意度放在首位</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">安全至上</h3>
                    <p className="text-sm text-muted-foreground">严格遵循医疗安全标准，确保每一项服务的安全性</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">持续创新</h3>
                    <p className="text-sm text-muted-foreground">不断引进先进技术，提升服务质量</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src="/professional-medical-team-meeting-in-modern-cli.jpg"
                  alt="团队会议"
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src="/modern-medical-equipment-in-clean-clinic-enviro.jpg"
                  alt="先进设备"
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src="/comfortable-patient-consultation-room-with-soft.jpg"
                  alt="咨询环境"
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src="/professional-medical-staff-training-session.jpg"
                  alt="专业培训"
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance">加入我们的美丽之旅</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              专业的团队，先进的技术，贴心的服务。让我们一起创造属于您的美丽故事。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Calendar className="mr-2 h-5 w-5" />
                预约免费咨询
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">
                  <MapPin className="mr-2 h-5 w-5" />
                  参观我们的诊所
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
