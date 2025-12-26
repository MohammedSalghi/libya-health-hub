import { motion } from "framer-motion";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { QuickActions } from "@/components/patient/QuickActions";
import { UpcomingAppointments } from "@/components/patient/UpcomingAppointments";
import { NearbyProviders } from "@/components/patient/NearbyProviders";
import { Bell, MapPin, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PatientDashboard = () => {
  const userName = "محمد"; // This would come from auth context
  const location = "طرابلس، ليبيا";

  return (
    <PatientLayout>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-primary p-4 pt-8 pb-6 rounded-b-3xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-foreground/80 text-sm">صباح الخير</p>
            <h1 className="text-xl font-bold text-primary-foreground">{userName} 👋</h1>
          </div>
          <Link to="/patient/notifications">
            <Button variant="glass" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full text-[10px] flex items-center justify-center text-white">
                3
              </span>
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 text-primary-foreground/80 text-sm mb-4">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>

        {/* Search Bar */}
        <Link to="/patient/search">
          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-3 hover:bg-white/30 transition-colors">
            <Search className="w-5 h-5 text-primary-foreground/70" />
            <span className="text-primary-foreground/70">ابحث عن طبيب، تخصص، أو خدمة...</span>
          </div>
        </Link>
      </motion.header>

      <div className="px-4 py-6 space-y-6">
        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold mb-4 text-foreground">خدمات سريعة</h2>
          <QuickActions />
        </motion.section>

        {/* Upcoming Appointments */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">المواعيد القادمة</h2>
          </div>
          <UpcomingAppointments />
        </motion.section>

        {/* Nearby Providers */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">الأقرب إليك</h2>
            <Link to="/patient/search" className="text-sm text-primary font-medium hover:underline">
              عرض الكل
            </Link>
          </div>
          <NearbyProviders />
        </motion.section>
      </div>
    </PatientLayout>
  );
};

export default PatientDashboard;
