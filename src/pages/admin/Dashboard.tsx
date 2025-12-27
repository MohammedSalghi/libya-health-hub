import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, Building2, TestTube, Pill, Ambulance, 
  TrendingUp, Calendar, DollarSign, BarChart3,
  Settings, Bell, Search, Menu, ChevronLeft
} from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "المستخدمين", value: "12,345", change: "+12%", icon: Users, color: "bg-blue-500" },
  { label: "الأطباء", value: "456", change: "+8%", icon: Users, color: "bg-green-500" },
  { label: "المستشفيات", value: "23", change: "+2", icon: Building2, color: "bg-purple-500" },
  { label: "الحجوزات اليوم", value: "234", change: "+15%", icon: Calendar, color: "bg-orange-500" },
];

const recentBookings = [
  { id: 1, patient: "محمد أحمد", doctor: "د. سارة", type: "فحص", time: "10:00", status: "confirmed" },
  { id: 2, patient: "فاطمة علي", doctor: "د. أحمد", type: "استشارة", time: "11:30", status: "pending" },
  { id: 3, patient: "أحمد محمود", doctor: "د. خالد", type: "متابعة", time: "14:00", status: "completed" },
];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const menuItems = [
    { icon: BarChart3, label: "نظرة عامة", id: "overview" },
    { icon: Users, label: "المستخدمين", id: "users" },
    { icon: Users, label: "الأطباء", id: "doctors" },
    { icon: Building2, label: "المستشفيات", id: "hospitals" },
    { icon: TestTube, label: "المختبرات", id: "labs" },
    { icon: Pill, label: "الصيدليات", id: "pharmacies" },
    { icon: Ambulance, label: "الإسعاف", id: "ambulance" },
    { icon: Calendar, label: "الحجوزات", id: "bookings" },
    { icon: DollarSign, label: "المدفوعات", id: "payments" },
    { icon: Settings, label: "الإعدادات", id: "settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-card border-l transition-all duration-300 fixed h-full`}>
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">ص</span>
            </div>
            {sidebarOpen && <span className="font-bold">صحتي ليبيا</span>}
          </div>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={`w-full justify-start gap-3 ${!sidebarOpen && "justify-center px-2"}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="h-5 w-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </Button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? "mr-64" : "mr-20"} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-card border-b p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold">لوحة التحكم</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                        <span className="text-sm text-green-600">{stat.change}</span>
                      </div>
                      <div className={`p-3 rounded-full ${stat.color}`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts & Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>الحجوزات الأخيرة</CardTitle>
                  <Button variant="ghost" size="sm">
                    عرض الكل
                    <ChevronLeft className="h-4 w-4 mr-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{booking.patient}</div>
                        <div className="text-sm text-muted-foreground">
                          {booking.doctor} • {booking.type} • {booking.time}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                        booking.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {booking.status === "confirmed" ? "مؤكد" :
                         booking.status === "pending" ? "معلق" : "مكتمل"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Specialties */}
            <Card>
              <CardHeader>
                <CardTitle>التخصصات الأكثر طلباً</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "باطنية", count: 234, percent: 85 },
                    { name: "عظام", count: 189, percent: 70 },
                    { name: "قلب", count: 156, percent: 58 },
                    { name: "أسنان", count: 134, percent: 50 },
                    { name: "عيون", count: 98, percent: 36 },
                  ].map((specialty) => (
                    <div key={specialty.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{specialty.name}</span>
                        <span className="text-muted-foreground">{specialty.count} حجز</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${specialty.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                الإيرادات الشهرية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">رسم بياني للإيرادات</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
