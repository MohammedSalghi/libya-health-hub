import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, Calendar, DollarSign, TrendingUp, Plus,
  Settings, Bell, Search, UserPlus, Edit, Trash2
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const doctors = [
  { id: 1, name: "د. أحمد محمد", specialty: "باطنية", patients: 45, status: "available" },
  { id: 2, name: "د. سارة علي", specialty: "أسنان", patients: 38, status: "busy" },
  { id: 3, name: "د. خالد حسن", specialty: "عظام", patients: 52, status: "available" },
];

const todayAppointments = [
  { id: 1, patient: "محمد أحمد", doctor: "د. أحمد", time: "09:00", type: "فحص" },
  { id: 2, patient: "فاطمة علي", doctor: "د. سارة", time: "10:30", type: "متابعة" },
  { id: 3, patient: "أحمد محمود", doctor: "د. خالد", time: "11:00", type: "استشارة" },
];

const ClinicDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-xl font-bold">عيادة النور الطبية</h1>
            <p className="text-sm text-muted-foreground">لوحة التحكم</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "مواعيد اليوم", value: "24", icon: Calendar, color: "bg-blue-500" },
            { label: "الأطباء", value: "8", icon: Users, color: "bg-green-500" },
            { label: "المرضى الشهر", value: "156", icon: Users, color: "bg-purple-500" },
            { label: "الإيرادات", value: "12,500", icon: DollarSign, color: "bg-orange-500", suffix: "د.ل" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {stat.value}{stat.suffix && <span className="text-sm mr-1">{stat.suffix}</span>}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="doctors">الأطباء</TabsTrigger>
            <TabsTrigger value="appointments">المواعيد</TabsTrigger>
            <TabsTrigger value="finance">المالية</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">مواعيد اليوم</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {todayAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{apt.patient}</div>
                        <div className="text-sm text-muted-foreground">
                          {apt.doctor} • {apt.time} • {apt.type}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">تفاصيل</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Doctors Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">حالة الأطباء</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {doctors.map((doctor) => (
                    <div key={doctor.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {doctor.name[2]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{doctor.name}</div>
                          <div className="text-sm text-muted-foreground">{doctor.specialty}</div>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        doctor.status === "available" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {doctor.status === "available" ? "متاح" : "مشغول"}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="doctors" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>إدارة الأطباء</CardTitle>
                  <Button>
                    <UserPlus className="h-4 w-4 ml-2" />
                    إضافة طبيب
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctors.map((doctor) => (
                    <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary text-lg">
                            {doctor.name[2]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{doctor.name}</div>
                          <div className="text-sm text-muted-foreground">{doctor.specialty}</div>
                          <div className="text-sm text-muted-foreground">{doctor.patients} مريض هذا الشهر</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>جميع المواعيد</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  جدول المواعيد الكامل
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>التقارير المالية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  التقارير والفواتير المالية
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ClinicDashboard;
