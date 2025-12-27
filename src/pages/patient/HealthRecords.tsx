import { useState } from "react";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, Download, Share2, Calendar, Pill, TestTube, 
  Heart, Activity, Droplets, ChevronLeft, Plus
} from "lucide-react";
import { motion } from "framer-motion";

const labResults = [
  { id: 1, name: "تحليل دم شامل", date: "2024-01-15", status: "جاهز", doctor: "د. سارة" },
  { id: 2, name: "وظائف الكلى", date: "2024-01-10", status: "جاهز", doctor: "د. أحمد" },
  { id: 3, name: "سكر صائم", date: "2024-01-05", status: "جاهز", doctor: "د. محمد" },
];

const prescriptions = [
  { id: 1, name: "أموكسيسيلين 500mg", dosage: "3 مرات يومياً", duration: "7 أيام", date: "2024-01-20" },
  { id: 2, name: "باراسيتامول 500mg", dosage: "عند اللزوم", duration: "5 أيام", date: "2024-01-18" },
];

const chronicConditions = [
  { name: "ضغط الدم", status: "مستقر", lastCheck: "منذ أسبوع", icon: Activity },
  { name: "السكري", status: "متابعة", lastCheck: "منذ 3 أيام", icon: Droplets },
];

const HealthRecordsPage = () => {
  const [activeTab, setActiveTab] = useState("records");

  return (
    <PatientLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">السجل الصحي</h1>
          <Button variant="outline" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">ملخص السجل</h2>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 ml-2" />
                  تحميل PDF
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground">زيارة</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">8</div>
                  <div className="text-sm text-muted-foreground">تحليل</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">5</div>
                  <div className="text-sm text-muted-foreground">وصفة</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="records">السجل</TabsTrigger>
            <TabsTrigger value="lab">التحاليل</TabsTrigger>
            <TabsTrigger value="prescriptions">الوصفات</TabsTrigger>
            <TabsTrigger value="chronic">المزمنة</TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="space-y-4 mt-4">
            <div className="space-y-3">
              {[1, 2, 3].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">زيارة عيادة القلب</div>
                          <div className="text-sm text-muted-foreground">
                            د. أحمد محمد • 15 يناير 2024
                          </div>
                        </div>
                      </div>
                      <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lab" className="space-y-4 mt-4">
            {labResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <TestTube className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">{result.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {result.doctor} • {result.date}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          {result.status}
                        </span>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-4 mt-4">
            {prescriptions.map((rx, index) => (
              <motion.div
                key={rx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Pill className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{rx.name}</div>
                        <div className="text-sm text-muted-foreground">{rx.date}</div>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-muted-foreground">الجرعة: {rx.dosage}</span>
                      <span className="text-muted-foreground">المدة: {rx.duration}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="chronic" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">الأمراض المزمنة</h3>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 ml-2" />
                إضافة
              </Button>
            </div>
            {chronicConditions.map((condition, index) => (
              <motion.div
                key={condition.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <condition.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{condition.name}</div>
                        <div className="text-sm text-muted-foreground">
                          آخر فحص: {condition.lastCheck}
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      condition.status === "مستقر" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {condition.status}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </PatientLayout>
  );
};

export default HealthRecordsPage;
