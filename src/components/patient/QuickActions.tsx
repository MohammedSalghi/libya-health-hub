import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Stethoscope, 
  Video, 
  FlaskConical, 
  Pill, 
  Ambulance, 
  Home as HomeIcon,
  Brain,
  FileText
} from "lucide-react";

const actions = [
  { icon: Stethoscope, label: "حجز طبيب", path: "/patient/search?type=doctor", color: "bg-primary" },
  { icon: Video, label: "استشارة فيديو", path: "/patient/search?type=video", color: "bg-teal-400" },
  { icon: FlaskConical, label: "تحاليل", path: "/patient/search?type=lab", color: "bg-coral-400" },
  { icon: Pill, label: "صيدلية", path: "/patient/pharmacy", color: "bg-secondary" },
  { icon: HomeIcon, label: "زيارة منزلية", path: "/patient/services/home-visit", color: "bg-teal-600" },
  { icon: Ambulance, label: "إسعاف", path: "/patient/services/ambulance", color: "bg-destructive" },
  { icon: Brain, label: "مساعد ذكي", path: "/patient/ai-assistant", color: "bg-teal-500" },
  { icon: FileText, label: "سجلي الطبي", path: "/patient/health-records", color: "bg-teal-700" },
];

export const QuickActions = () => {
  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((action, index) => (
        <motion.div
          key={action.path}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link
            to={action.path}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-card hover:shadow-soft transition-all duration-300 group"
          >
            <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-foreground text-center leading-tight">
              {action.label}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};
