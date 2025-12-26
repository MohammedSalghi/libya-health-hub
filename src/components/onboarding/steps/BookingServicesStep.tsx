import { motion } from "framer-motion";
import { Calendar, Video, Home, Ambulance, TestTube, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingServicesStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function BookingServicesStep({ onNext, onBack }: BookingServicesStepProps) {
  const services = [
    {
      Icon: Calendar,
      title: "حجز المواعيد",
      description: "احجز موعد مع أي طبيب بسهولة",
    },
    {
      Icon: Video,
      title: "استشارات عن بُعد",
      description: "استشر طبيبك عبر الفيديو من أي مكان",
    },
    {
      Icon: Home,
      title: "طبيب للمنزل",
      description: "اطلب زيارة طبيب لمنزلك",
    },
    {
      Icon: TestTube,
      title: "تحاليل مخبرية",
      description: "اطلب تحاليلك في المختبر أو المنزل",
    },
    {
      Icon: Ambulance,
      title: "طوارئ وإسعاف",
      description: "اطلب سيارة إسعاف فوراً",
    },
    {
      Icon: MapPin,
      title: "خدمات قريبة منك",
      description: "اكتشف الخدمات الصحية حولك",
    },
  ];

  return (
    <div className="flex-1 flex flex-col px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="inline-flex p-4 rounded-2xl gradient-primary mb-4">
          <Calendar className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          احجز واحصل على الرعاية
        </h2>
        <p className="text-muted-foreground">
          كل الخدمات الصحية في مكان واحد
        </p>
      </motion.div>

      {/* Services Grid */}
      <div className="flex-1 grid grid-cols-2 gap-3">
        {services.map(({ Icon, title, description }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 }}
            className="p-4 rounded-2xl bg-card shadow-card border border-border/50 text-center"
          >
            <div className="inline-flex p-3 rounded-xl bg-accent mb-3">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-sm mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          </motion.div>
        ))}
      </div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-3 mt-6"
      >
        <Button variant="outline" className="flex-1" onClick={onBack}>
          السابق
        </Button>
        <Button variant="hero" className="flex-1" onClick={onNext}>
          التالي
        </Button>
      </motion.div>
    </div>
  );
}
