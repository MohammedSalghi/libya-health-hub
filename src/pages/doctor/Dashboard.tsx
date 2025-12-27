import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, Clock, Users, TrendingUp, Video, Check, X,
  Bell, Settings, ChevronLeft, FileText, Star
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const todayAppointments = [
  { id: 1, patient: "محمد أحمد", time: "09:00", type: "فحص", status: "confirmed" },
  { id: 2, patient: "فاطمة علي", time: "10:30", type: "متابعة", status: "pending" },
  { id: 3, patient: "أحمد محمود", time: "11:00", type: "استشارة فيديو", status: "confirmed", isVideo: true },
  { id: 4, patient: "سارة خالد", time: "14:00", type: "فحص", status: "pending" },
];

const stats = [
  { label: "مرضى اليوم", value: "12", icon: Users, trend: "+3" },
  { label: "إجمالي المرضى", value: "1,234", icon: Users },
  { label: "التقييم", value: "4.9", icon: Star },
  { label: "الإيرادات", value: "5,400", icon: TrendingUp, suffix: "د.ل" },
];

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("today");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-white/20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>د.أ</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm opacity-80">مرحباً،</p>
              <h1 className="text-lg font-bold">د. أحمد محمد</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-white">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          {stats.slice(0, 2).map((stat) => (
            <Card key={stat.label} className="bg-white/10 border-0">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {stat.value}{stat.suffix}
                    {stat.trend && <span className="text-sm text-green-300 mr-1">{stat.trend}</span>}
                  </div>
                  <div className="text-xs text-white/70">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 -mt-4 space-y-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                جدول اليوم
              </CardTitle>
              <Button variant="ghost" size="sm">
                عرض الكل
                <ChevronLeft className="h-4 w-4 mr-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="today">اليوم</TabsTrigger>
                <TabsTrigger value="pending">معلقة</TabsTrigger>
                <TabsTrigger value="completed">مكتملة</TabsTrigger>
              </TabsList>

              <TabsContent value="today" className="mt-4 space-y-3">
                {todayAppointments.map((apt, index) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {apt.patient[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{apt.patient}</div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {apt.time}
                                <span>•</span>
                                {apt.type}
                                {apt.isVideo && <Video className="h-3 w-3 text-primary" />}
                              </div>
                            </div>
                          </div>
                          {apt.status === "pending" ? (
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600">
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                              مؤكد
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="pending" className="mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  لا توجد مواعيد معلقة
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  لا توجد مواعيد مكتملة اليوم
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate("/doctor/schedule")}>
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <div className="p-3 bg-primary/10 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <span className="font-medium text-sm">إدارة الجدول</span>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate("/doctor/patients")}>
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <span className="font-medium text-sm">المرضى</span>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate("/doctor/prescriptions")}>
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <div className="p-3 bg-primary/10 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <span className="font-medium text-sm">الوصفات</span>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate("/doctor/video-call")}>
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <div className="p-3 bg-primary/10 rounded-full">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <span className="font-medium text-sm">استشارة فيديو</span>
            </CardContent>
          </Card>
        </div>

        {/* Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">الأداء الشهري</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {stats.slice(2).map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {stat.value}{stat.suffix && <span className="text-sm mr-1">{stat.suffix}</span>}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;
