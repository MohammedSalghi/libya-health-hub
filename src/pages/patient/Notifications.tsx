import { useState } from "react";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, Calendar, TestTube, Pill, Truck, CheckCircle,
  Clock, Settings, Trash2
} from "lucide-react";
import { motion } from "framer-motion";

const notifications = [
  {
    id: 1,
    type: "appointment",
    title: "تذكير بالموعد",
    message: "موعدك مع د. أحمد محمد غداً الساعة 10:00 صباحاً",
    time: "منذ ساعة",
    isRead: false,
    icon: Calendar
  },
  {
    id: 2,
    type: "lab",
    title: "نتائج التحاليل جاهزة",
    message: "نتائج تحليل الدم الشامل متاحة الآن للعرض",
    time: "منذ 3 ساعات",
    isRead: false,
    icon: TestTube
  },
  {
    id: 3,
    type: "medication",
    title: "تذكير الدواء",
    message: "حان وقت تناول دواء الضغط",
    time: "منذ 5 ساعات",
    isRead: true,
    icon: Pill
  },
  {
    id: 4,
    type: "delivery",
    title: "طلبك في الطريق",
    message: "مندوب الصيدلية في طريقه إليك - الوقت المتوقع 15 دقيقة",
    time: "أمس",
    isRead: true,
    icon: Truck
  },
  {
    id: 5,
    type: "general",
    title: "تم تأكيد الموعد",
    message: "تم تأكيد حجزك مع د. سارة يوم الأحد",
    time: "منذ يومين",
    isRead: true,
    icon: CheckCircle
  },
];

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [notifs, setNotifs] = useState(notifications);

  const unreadCount = notifs.filter(n => !n.isRead).length;

  const filteredNotifications = activeTab === "all" 
    ? notifs 
    : notifs.filter(n => !n.isRead);

  const markAllRead = () => {
    setNotifs(notifs.map(n => ({ ...n, isRead: true })));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "appointment": return "bg-blue-100 text-blue-600";
      case "lab": return "bg-green-100 text-green-600";
      case "medication": return "bg-purple-100 text-purple-600";
      case "delivery": return "bg-orange-100 text-orange-600";
      default: return "bg-primary/10 text-primary";
    }
  };

  return (
    <PatientLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">الإشعارات</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">{unreadCount} إشعارات غير مقروءة</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="unread">
                غير مقروءة
                {unreadCount > 0 && (
                  <span className="mr-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllRead}>
                تحديد الكل كمقروء
              </Button>
            )}
          </div>

          <TabsContent value="all" className="mt-4">
            <NotificationsList 
              notifications={filteredNotifications} 
              getTypeColor={getTypeColor}
            />
          </TabsContent>

          <TabsContent value="unread" className="mt-4">
            <NotificationsList 
              notifications={filteredNotifications} 
              getTypeColor={getTypeColor}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PatientLayout>
  );
};

interface NotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

const NotificationsList = ({ 
  notifications, 
  getTypeColor 
}: { 
  notifications: NotificationItem[];
  getTypeColor: (type: string) => string;
}) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">لا توجد إشعارات</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notif, index) => (
        <motion.div
          key={notif.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className={`cursor-pointer transition-colors ${
            !notif.isRead ? "bg-primary/5 border-primary/20" : "hover:bg-accent/50"
          }`}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className={`p-2 rounded-full h-fit ${getTypeColor(notif.type)}`}>
                  <notif.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="font-medium">{notif.title}</div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {notif.time}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default NotificationsPage;
