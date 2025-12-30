import { useState } from "react";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, Calendar, TestTube, Pill, Truck, CheckCircle,
  Clock, Settings, Star, Ambulance, Video
} from "lucide-react";
import { motion } from "framer-motion";
import { useHealthcareStore } from "@/stores/healthcareStore";
import { RatingDialog } from "@/components/patient/RatingDialog";

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [ratingDialog, setRatingDialog] = useState<{
    isOpen: boolean;
    serviceType: 'doctor' | 'clinic' | 'lab' | 'pharmacy' | 'ambulance';
    serviceId: string;
    serviceName: string;
  }>({ isOpen: false, serviceType: 'doctor', serviceId: '', serviceName: '' });

  const { 
    notifications, 
    markNotificationRead, 
    pendingRatings,
    removePendingRating
  } = useHealthcareStore();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  const markAllRead = () => {
    notifications.forEach(n => markNotificationRead(n.id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "appointment": return Calendar;
      case "lab": return TestTube;
      case "medication": return Pill;
      case "order_update": return Truck;
      case "rating_request": return Star;
      case "ambulance": return Ambulance;
      case "video": return Video;
      default: return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "appointment": return "bg-blue-100 text-blue-600";
      case "lab": return "bg-green-100 text-green-600";
      case "medication": return "bg-purple-100 text-purple-600";
      case "order_update": return "bg-orange-100 text-orange-600";
      case "rating_request": return "bg-yellow-100 text-yellow-600";
      case "ambulance": return "bg-red-100 text-red-600";
      case "video": return "bg-cyan-100 text-cyan-600";
      default: return "bg-primary/10 text-primary";
    }
  };

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);

    // Handle rating request notifications
    if (notif.type === 'rating_request' && notif.data) {
      const pending = pendingRatings.find(r => r.serviceId === notif.data?.serviceId);
      if (pending) {
        setRatingDialog({
          isOpen: true,
          serviceType: pending.serviceType as any,
          serviceId: pending.serviceId,
          serviceName: pending.serviceName
        });
      }
    }
  };

  const handleRatingClose = () => {
    setRatingDialog({ ...ratingDialog, isOpen: false });
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

        {/* Pending Ratings Banner */}
        {pendingRatings.length > 0 && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-yellow-800">لديك {pendingRatings.length} تقييمات معلقة</p>
                  <p className="text-sm text-yellow-700">ساعدنا في تحسين الخدمة بتقييم تجربتك</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-yellow-400 text-yellow-700 hover:bg-yellow-100"
                  onClick={() => {
                    const first = pendingRatings[0];
                    if (first) {
                      setRatingDialog({
                        isOpen: true,
                        serviceType: first.serviceType as any,
                        serviceId: first.serviceId,
                        serviceName: first.serviceName
                      });
                    }
                  }}
                >
                  تقييم الآن
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
              getTypeIcon={getTypeIcon}
              onNotificationClick={handleNotificationClick}
            />
          </TabsContent>

          <TabsContent value="unread" className="mt-4">
            <NotificationsList 
              notifications={filteredNotifications} 
              getTypeColor={getTypeColor}
              getTypeIcon={getTypeIcon}
              onNotificationClick={handleNotificationClick}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Rating Dialog */}
      <RatingDialog
        isOpen={ratingDialog.isOpen}
        onClose={handleRatingClose}
        serviceType={ratingDialog.serviceType}
        serviceId={ratingDialog.serviceId}
        serviceName={ratingDialog.serviceName}
      />
    </PatientLayout>
  );
};

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  data?: Record<string, any>;
}

const NotificationsList = ({ 
  notifications, 
  getTypeColor,
  getTypeIcon,
  onNotificationClick
}: { 
  notifications: NotificationItem[];
  getTypeColor: (type: string) => string;
  getTypeIcon: (type: string) => React.ComponentType<{ className?: string }>;
  onNotificationClick: (notif: NotificationItem) => void;
}) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">لا توجد إشعارات</p>
      </div>
    );
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    return date.toLocaleDateString('ar-LY');
  };

  return (
    <div className="space-y-3">
      {notifications.map((notif, index) => {
        const IconComponent = getTypeIcon(notif.type);
        return (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              className={`cursor-pointer transition-colors ${
                !notif.isRead ? "bg-primary/5 border-primary/20" : "hover:bg-accent/50"
              }`}
              onClick={() => onNotificationClick(notif)}
            >
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className={`p-2 rounded-full h-fit ${getTypeColor(notif.type)}`}>
                    <IconComponent className="h-5 w-5" />
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
                      {formatTime(notif.createdAt)}
                    </div>
                    
                    {/* Action button for rating requests */}
                    {notif.type === 'rating_request' && (
                      <Button 
                        size="sm" 
                        className="mt-2 gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNotificationClick(notif);
                        }}
                      >
                        <Star className="h-4 w-4" />
                        تقييم الآن
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default NotificationsPage;
