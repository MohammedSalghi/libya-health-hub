import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  ChevronLeft,
  Phone,
  MessageCircle,
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type TabType = "upcoming" | "past" | "cancelled";

const appointments = {
  upcoming: [
    {
      id: 1,
      doctor: "د. أحمد محمد العزابي",
      specialty: "طب القلب",
      date: "اليوم",
      time: "10:30 ص",
      type: "video",
      status: "confirmed",
      avatar: "أ",
    },
    {
      id: 2,
      doctor: "د. فاطمة علي الشريف",
      specialty: "طب الأطفال",
      date: "غداً",
      time: "2:00 م",
      type: "in-person",
      location: "مستشفى طرابلس المركزي",
      status: "confirmed",
      avatar: "ف",
    },
    {
      id: 3,
      doctor: "د. محمود سالم",
      specialty: "طب العيون",
      date: "28 ديسمبر",
      time: "11:00 ص",
      type: "in-person",
      location: "مركز النور للعيون",
      status: "pending",
      avatar: "م",
    },
  ],
  past: [
    {
      id: 4,
      doctor: "د. سارة أحمد",
      specialty: "طب الجلدية",
      date: "20 ديسمبر",
      time: "9:00 ص",
      type: "video",
      status: "completed",
      avatar: "س",
    },
  ],
  cancelled: [
    {
      id: 5,
      doctor: "د. خالد محمد",
      specialty: "طب العظام",
      date: "15 ديسمبر",
      time: "3:00 م",
      type: "in-person",
      status: "cancelled",
      avatar: "خ",
    },
  ],
};

const Appointments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");

  const tabs: { key: TabType; label: string }[] = [
    { key: "upcoming", label: "القادمة" },
    { key: "past", label: "السابقة" },
    { key: "cancelled", label: "الملغاة" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            مؤكد
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
            <AlertCircle className="w-3 h-3" />
            في الانتظار
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            مكتمل
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
            <X className="w-3 h-3" />
            ملغي
          </span>
        );
    }
  };

  return (
    <PatientLayout>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-xl">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground">مواعيدي</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-muted p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                {tab.label}
                <span className="mr-1 text-xs">
                  ({appointments[tab.key].length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3"
          >
            {appointments[activeTab].length === 0 ? (
              <Card className="p-8 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">لا توجد مواعيد</p>
              </Card>
            ) : (
              appointments[activeTab].map((apt, index) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card variant="elevated" className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-3">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                          {apt.avatar}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{apt.doctor}</h4>
                          <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                        </div>
                      </div>
                      {getStatusBadge(apt.status)}
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {apt.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {apt.time}
                      </span>
                      {apt.type === "video" ? (
                        <span className="flex items-center gap-1 text-primary">
                          <Video className="w-4 h-4" />
                          استشارة فيديو
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {apt.location}
                        </span>
                      )}
                    </div>

                    {activeTab === "upcoming" && (
                      <div className="flex gap-2">
                        {apt.type === "video" && apt.status === "confirmed" && (
                          <Button size="sm" className="flex-1 gap-2">
                            <Video className="w-4 h-4" />
                            انضم للمكالمة
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="flex-1 gap-2">
                          <MessageCircle className="w-4 h-4" />
                          رسالة
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {activeTab === "past" && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          عرض التقرير
                        </Button>
                        <Button size="sm" className="flex-1">
                          إعادة الحجز
                        </Button>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </PatientLayout>
  );
};

export default Appointments;
