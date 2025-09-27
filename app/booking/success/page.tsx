import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Phone, Mail, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">预约成功！</h1>
            <p className="text-lg text-muted-foreground">您的预约已成功提交，我们将尽快与您联系确认详细信息。</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>预约信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">预约编号:</span>
                <span className="font-medium">MB2024{Math.random().toString().slice(2, 8)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">项目:</span>
                <span className="font-medium">双眼皮手术</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">医师:</span>
                <span className="font-medium">李美华 主任医师</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">预约时间:</span>
                <span className="font-medium">2024年12月20日 14:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">支付状态:</span>
                <span className="font-medium text-green-600">已支付定金</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">通知确认</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center space-y-2">
                  <Phone className="mx-auto h-8 w-8 text-primary" />
                  <h3 className="font-medium">短信通知</h3>
                  <p className="text-sm text-muted-foreground">预约确认短信已发送至您的手机</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center space-y-2">
                  <Mail className="mx-auto h-8 w-8 text-primary" />
                  <h3 className="font-medium">邮件通知</h3>
                  <p className="text-sm text-muted-foreground">详细预约信息已发送至您的邮箱</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center space-y-2">
                  <MessageCircle className="mx-auto h-8 w-8 text-primary" />
                  <h3 className="font-medium">微信通知</h3>
                  <p className="text-sm text-muted-foreground">关注公众号获取预约提醒</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">需要帮助？</h2>
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

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-medium text-foreground mb-2">温馨提示</h3>
            <ul className="text-sm text-muted-foreground space-y-1 text-left">
              <li>• 请在预约时间前30分钟到达诊所</li>
              <li>• 如需改期或取消，请提前24小时联系我们</li>
              <li>• 请携带身份证和相关病历资料</li>
              <li>• 术前请避免饮酒和服用抗凝药物</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
