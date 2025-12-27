import { useState } from "react";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, MapPin, Upload, ShoppingCart, Truck, 
  Package, Clock, CheckCircle, Star, Plus
} from "lucide-react";
import { motion } from "framer-motion";

const pharmacies = [
  { id: 1, name: "صيدلية الشفاء", distance: "500م", rating: 4.8, isOpen: true },
  { id: 2, name: "صيدلية الأمل", distance: "1.2كم", rating: 4.5, isOpen: true },
  { id: 3, name: "صيدلية النور", distance: "2كم", rating: 4.7, isOpen: false },
];

const medications = [
  { id: 1, name: "باراسيتامول 500mg", price: 15, inStock: true },
  { id: 2, name: "إيبوبروفين 400mg", price: 20, inStock: true },
  { id: 3, name: "أوميبرازول 20mg", price: 35, inStock: false },
];

const orders = [
  { id: 1, items: 3, total: 85, status: "delivered", date: "اليوم" },
  { id: 2, items: 2, total: 50, status: "shipping", date: "أمس" },
  { id: 3, items: 1, total: 25, status: "pending", date: "منذ 3 أيام" },
];

const PharmacyPage = () => {
  const [activeTab, setActiveTab] = useState("pharmacies");
  const [cart, setCart] = useState<number[]>([]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "delivered":
        return { label: "تم التوصيل", color: "bg-green-100 text-green-700", icon: CheckCircle };
      case "shipping":
        return { label: "جاري التوصيل", color: "bg-blue-100 text-blue-700", icon: Truck };
      default:
        return { label: "قيد المعالجة", color: "bg-yellow-100 text-yellow-700", icon: Clock };
    }
  };

  return (
    <PatientLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">الصيدلية</h1>
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="ابحث عن دواء..." 
            className="pr-10"
          />
        </div>

        {/* Upload Prescription */}
        <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <Button variant="ghost" className="w-full flex flex-col gap-2 h-auto py-4">
              <Upload className="h-8 w-8 text-primary" />
              <span className="text-primary font-medium">رفع وصفة طبية</span>
              <span className="text-sm text-muted-foreground">اضغط لرفع صورة الوصفة</span>
            </Button>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="pharmacies">الصيدليات</TabsTrigger>
            <TabsTrigger value="medications">الأدوية</TabsTrigger>
            <TabsTrigger value="orders">طلباتي</TabsTrigger>
          </TabsList>

          <TabsContent value="pharmacies" className="space-y-4 mt-4">
            {pharmacies.map((pharmacy, index) => (
              <motion.div
                key={pharmacy.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{pharmacy.name}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {pharmacy.distance}
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {pharmacy.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        pharmacy.isOpen 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {pharmacy.isOpen ? "مفتوح" : "مغلق"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="medications" className="space-y-4 mt-4">
            {medications.map((med, index) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{med.name}</div>
                      <div className="text-primary font-bold">{med.price} د.ل</div>
                    </div>
                    {med.inStock ? (
                      <Button 
                        size="sm"
                        onClick={() => setCart([...cart, med.id])}
                      >
                        <Plus className="h-4 w-4 ml-1" />
                        أضف
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">غير متوفر</span>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4 mt-4">
            {orders.map((order, index) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">طلب #{order.id}</div>
                        <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${statusInfo.color}`}>
                          <statusInfo.icon className="h-3 w-3" />
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{order.items} منتجات • {order.total} د.ل</span>
                        <span>{order.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </PatientLayout>
  );
};

export default PharmacyPage;
