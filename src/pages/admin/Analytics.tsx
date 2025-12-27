import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, TrendingDown, Users, Calendar, DollarSign,
  Activity, Download, Filter
} from "lucide-react";
import { motion } from "framer-motion";

const kpis = [
  { label: "إجمالي الحجوزات", value: "45,678", change: "+12.5%", trend: "up", icon: Calendar },
  { label: "الإيرادات الشهرية", value: "125,000 د.ل", change: "+8.3%", trend: "up", icon: DollarSign },
  { label: "المستخدمين الجدد", value: "1,234", change: "+15.2%", trend: "up", icon: Users },
  { label: "معدل الإلغاء", value: "4.2%", change: "-2.1%", trend: "down", icon: Activity },
];

const topDoctors = [
  { name: "د. أحمد محمد", specialty: "باطنية", bookings: 234, revenue: 11700 },
  { name: "د. سارة علي", specialty: "أسنان", bookings: 189, revenue: 9450 },
  { name: "د. خالد حسن", specialty: "قلب", bookings: 156, revenue: 15600 },
  { name: "د. فاطمة أحمد", specialty: "أطفال", bookings: 134, revenue: 6700 },
];

const AdminAnalytics = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">التحليلات والتقارير</h1>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 ml-2" />
            تصفية
          </Button>
          <Button>
            <Download className="h-4 w-4 ml-2" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                    <h3 className="text-2xl font-bold mt-1">{kpi.value}</h3>
                    <div className={`flex items-center gap-1 text-sm mt-1 ${
                      kpi.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}>
                      {kpi.trend === "up" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {kpi.change}
                    </div>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <kpi.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings">الحجوزات</TabsTrigger>
          <TabsTrigger value="revenue">الإيرادات</TabsTrigger>
          <TabsTrigger value="users">المستخدمين</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>الحجوزات اليومية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">رسم بياني للحجوزات اليومية</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>الإيرادات الشهرية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">رسم بياني للإيرادات الشهرية</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>نمو المستخدمين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">رسم بياني لنمو المستخدمين</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Doctors */}
        <Card>
          <CardHeader>
            <CardTitle>الأطباء الأكثر حجزاً</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDoctors.map((doctor, index) => (
                <div key={doctor.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{doctor.name}</div>
                      <div className="text-sm text-muted-foreground">{doctor.specialty}</div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{doctor.bookings} حجز</div>
                    <div className="text-sm text-muted-foreground">{doctor.revenue} د.ل</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Specialties Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع التخصصات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">رسم دائري للتخصصات</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Behavior */}
      <Card>
        <CardHeader>
          <CardTitle>سلوك المستخدمين</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-primary">8.5</div>
              <div className="text-sm text-muted-foreground">متوسط الجلسة (دقائق)</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-primary">3.2</div>
              <div className="text-sm text-muted-foreground">الصفحات لكل جلسة</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-primary">45%</div>
              <div className="text-sm text-muted-foreground">معدل التحويل</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-primary">78%</div>
              <div className="text-sm text-muted-foreground">معدل العودة</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
