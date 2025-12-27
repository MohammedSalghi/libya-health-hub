import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Pill, Package, Truck, DollarSign, Plus,
  Settings, Bell, Search, CheckCircle, Clock, Upload
} from "lucide-react";
import { motion } from "framer-motion";

const orders = [
  { id: 1, customer: "محمد أحمد", items: 3, total: 85, status: "pending", address: "طرابلس، شارع النصر" },
  { id: 2, customer: "فاطمة علي", items: 2, total: 50, status: "preparing", address: "طرابلس، حي الأندلس" },
  { id: 3, customer: "أحمد محمود", items: 1, total: 25, status: "delivering", address: "طرابلس، السياحية" },
];

const inventory = [
  { id: 1, name: "باراسيتامول 500mg", stock: 150, price: 15, lowStock: false },
  { id: 2, name: "إيبوبروفين 400mg", stock: 8, price: 20, lowStock: true },
  { id: 3, name: "أوميبرازول 20mg", stock: 45, price: 35, lowStock: false },
];

const PharmacyDashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "جديد", color: "bg-yellow-100 text-yellow-700", icon: Clock };
      case "preparing":
        return { label: "قيد التجهيز", color: "bg-blue-100 text-blue-700", icon: Package };
      case "delivering":
        return { label: "جاري التوصيل", color: "bg-purple-100 text-purple-700", icon: Truck };
      case "completed":
        return { label: "مكتمل", color: "bg-green-100 text-green-700", icon: CheckCircle };
      default:
        return { label: status, color: "bg-gray-100 text-gray-700", icon: Clock };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-xl font-bold">صيدلية النور</h1>
            <p className="text-sm text-muted-foreground">لوحة تحكم الصيدلية</p>
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
            { label: "طلبات اليوم", value: "24", icon: Package, color: "bg-blue-500" },
            { label: "قيد التوصيل", value: "8", icon: Truck, color: "bg-purple-500" },
            { label: "المنتجات", value: "456", icon: Pill, color: "bg-green-500" },
            { label: "الإيرادات", value: "3,200", icon: DollarSign, color: "bg-orange-500", suffix: "د.ل" },
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
            <TabsTrigger value="orders">الطلبات</TabsTrigger>
            <TabsTrigger value="inventory">المخزون</TabsTrigger>
            <TabsTrigger value="delivery">التوصيل</TabsTrigger>
            <TabsTrigger value="finance">المالية</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>طلبات الأدوية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orders.map((order, index) => {
                  const statusInfo = getStatusInfo(order.status);
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">طلب #{order.id} - {order.customer}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.items} منتجات • {order.total} د.ل
                        </div>
                        <div className="text-sm text-muted-foreground">{order.address}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${statusInfo.color}`}>
                          <statusInfo.icon className="h-3 w-3" />
                          {statusInfo.label}
                        </span>
                        <Button size="sm" variant="outline">تفاصيل</Button>
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>إدارة المخزون</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة منتج
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input placeholder="ابحث عن منتج..." className="max-w-sm" />
                </div>
                <div className="space-y-4">
                  {inventory.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Pill className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.price} د.ل</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`text-sm ${item.lowStock ? "text-red-600" : "text-green-600"}`}>
                          {item.stock} في المخزون
                          {item.lowStock && " ⚠️"}
                        </div>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 ml-2" />
                          تحديث
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delivery" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>تتبع التوصيل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  خريطة تتبع طلبات التوصيل
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
                  الفواتير والتقارير المالية
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PharmacyDashboard;
