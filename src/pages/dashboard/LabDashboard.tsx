import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TestTube, Upload, Calendar, Clock, CheckCircle,
  Truck, FileText, Settings, Bell, Search
} from "lucide-react";
import { motion } from "framer-motion";

const testRequests = [
  { id: 1, patient: "محمد أحمد", test: "تحليل دم شامل", date: "اليوم", time: "10:00", type: "مختبر", status: "pending" },
  { id: 2, patient: "فاطمة علي", test: "وظائف الكلى", date: "اليوم", time: "11:30", type: "منزلي", status: "collected" },
  { id: 3, patient: "أحمد محمود", test: "سكر صائم", date: "أمس", time: "09:00", type: "مختبر", status: "completed" },
];

const LabDashboard = () => {
  const [activeTab, setActiveTab] = useState("requests");

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-700" };
      case "collected":
        return { label: "تم الجمع", color: "bg-blue-100 text-blue-700" };
      case "completed":
        return { label: "مكتمل", color: "bg-green-100 text-green-700" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-700" };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-xl font-bold">مختبرات الأمل</h1>
            <p className="text-sm text-muted-foreground">لوحة تحكم المختبر</p>
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
            { label: "طلبات اليوم", value: "18", icon: TestTube, color: "bg-blue-500" },
            { label: "زيارات منزلية", value: "5", icon: Truck, color: "bg-green-500" },
            { label: "نتائج جاهزة", value: "12", icon: CheckCircle, color: "bg-purple-500" },
            { label: "قيد المعالجة", value: "6", icon: Clock, color: "bg-orange-500" },
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
                    <div className="text-2xl font-bold">{stat.value}</div>
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
            <TabsTrigger value="requests">طلبات التحاليل</TabsTrigger>
            <TabsTrigger value="home">زيارات منزلية</TabsTrigger>
            <TabsTrigger value="results">رفع النتائج</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>طلبات التحاليل الواردة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {testRequests.map((request, index) => {
                  const statusInfo = getStatusInfo(request.status);
                  return (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <TestTube className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{request.patient}</div>
                          <div className="text-sm text-muted-foreground">{request.test}</div>
                          <div className="text-sm text-muted-foreground">
                            {request.date} • {request.time} • {request.type}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        {request.status === "collected" && (
                          <Button size="sm">
                            <Upload className="h-4 w-4 ml-2" />
                            رفع النتيجة
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="home" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>جدول الزيارات المنزلية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testRequests.filter(r => r.type === "منزلي").map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{request.patient}</div>
                        <div className="text-sm text-muted-foreground">{request.test}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {request.date} - {request.time}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Truck className="h-4 w-4 ml-2" />
                          بدء الرحلة
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>رفع نتائج التحاليل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-12 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">رفع ملف PDF</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    اسحب الملف هنا أو اضغط للاختيار
                  </p>
                  <Button>
                    <FileText className="h-4 w-4 ml-2" />
                    اختيار ملف
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default LabDashboard;
