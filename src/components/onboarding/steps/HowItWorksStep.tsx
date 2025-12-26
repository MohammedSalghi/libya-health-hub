import { motion } from "framer-motion";
import { User, UserCog, Building2, FlaskConical, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HowItWorksStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function HowItWorksStep({ onNext, onBack }: HowItWorksStepProps) {
  const userTypes = [
    {
      Icon: User,
      title: "المرضى",
      description: "احجز مواعيد وتابع صحتك",
      color: "from-primary to-teal-600",
    },
    {
      Icon: UserCog,
      title: "الأطباء",
      description: "أدر عيادتك ومواعيدك",
      color: "from-secondary to-coral-600",
    },
    {
      Icon: Building2,
      title: "العيادات والمستشفيات",
      description: "إدارة شاملة للمنشأة",
      color: "from-teal-400 to-teal-600",
    },
    {
      Icon: FlaskConical,
      title: "المختبرات",
      description: "نتائج فورية ومتابعة",
      color: "from-accent-foreground to-teal-700",
    },
    {
      Icon: Pill,
      title: "الصيدليات",
      description: "طلبات وتوصيل الأدوية",
      color: "from-coral-400 to-coral-600",
    },
  ];

  return (
    <div className="flex-1 flex flex-col px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-foreground mb-2">
          كيف يعمل التطبيق؟
        </h2>
        <p className="text-muted-foreground">
          منظومة متكاملة تربط جميع أطراف الرعاية الصحية
        </p>
      </motion.div>

      {/* User Types */}
      <div className="flex-1 space-y-3">
        {userTypes.map(({ Icon, title, description, color }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-card shadow-card border border-border/50"
          >
            <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
              <Icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
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
