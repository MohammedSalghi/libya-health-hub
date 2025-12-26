import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const appointments = [
  {
    id: 1,
    doctor: "د. أحمد محمد",
    specialty: "طب القلب",
    date: "اليوم",
    time: "10:30 ص",
    type: "video",
    avatar: "أ",
  },
  {
    id: 2,
    doctor: "د. فاطمة علي",
    specialty: "طب الأطفال",
    date: "غداً",
    time: "2:00 م",
    type: "in-person",
    location: "مستشفى طرابلس المركزي",
    avatar: "ف",
  },
];

export const UpcomingAppointments = () => {
  if (appointments.length === 0) {
    return (
      <Card variant="elevated" className="p-6 text-center">
        <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground mb-4">لا توجد مواعيد قادمة</p>
        <Button asChild>
          <Link to="/patient/search">احجز موعدك الآن</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {appointments.map((apt, index) => (
        <motion.div
          key={apt.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card variant="elevated" className="p-4">
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                {apt.avatar}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{apt.doctor}</h4>
                <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {apt.date}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {apt.time}
                  </span>
                </div>
                {apt.type === "video" ? (
                  <div className="flex items-center gap-1 text-primary text-sm mt-1">
                    <Video className="w-4 h-4" />
                    استشارة فيديو
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                    <MapPin className="w-4 h-4" />
                    {apt.location}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              {apt.type === "video" && (
                <Button size="sm" className="flex-1">
                  <Video className="w-4 h-4 ml-2" />
                  انضم للمكالمة
                </Button>
              )}
              <Button size="sm" variant="outline" className="flex-1">
                تفاصيل
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}
      <Link
        to="/patient/appointments"
        className="block text-center text-primary text-sm font-medium mt-2 hover:underline"
      >
        عرض جميع المواعيد
      </Link>
    </div>
  );
};
