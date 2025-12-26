import { motion } from "framer-motion";
import { FileText, TestTube, Pill, Activity, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HealthRecordStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function HealthRecordStep({ onNext, onBack }: HealthRecordStepProps) {
  const features = [
    { Icon: FileText, label: "السجل الطبي" },
    { Icon: TestTube, label: "نتائج التحاليل" },
    { Icon: Pill, label: "الوصفات الإلكترونية" },
    { Icon: Activity, label: "متابعة الأمراض المزمنة" },
    { Icon: Clock, label: "التاريخ المرضي" },
    { Icon: Download, label: "تحميل ومشاركة" },
  ];

  return (
    <div className="flex-1 flex flex-col px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-bold text-foreground mb-2">
          سجلك الصحي الموحد
        </h2>
        <p className="text-muted-foreground">
          جميع بياناتك الصحية في مكان واحد آمن
        </p>
      </motion.div>

      {/* Animated Health Record Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative mx-auto mb-6"
      >
        <div className="w-72 h-96 rounded-3xl gradient-card shadow-elevated border border-border/50 p-6 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">م</span>
            </div>
            <div>
              <div className="font-semibold text-foreground">محمد أحمد</div>
              <div className="text-sm text-muted-foreground">معرف: LH-2024-XXXX</div>
            </div>
          </div>

          {/* Timeline Items */}
          <div className="space-y-4">
            {[
              { date: "اليوم", title: "زيارة طبيب عام", type: "visit" },
              { date: "أمس", title: "نتائج تحليل الدم", type: "lab" },
              { date: "3 أيام", title: "وصفة طبية جديدة", type: "prescription" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.15 }}
                className="flex items-center gap-3"
              >
                <div className={`w-2 h-2 rounded-full ${
                  item.type === "visit" ? "bg-primary" :
                  item.type === "lab" ? "bg-secondary" : "bg-teal-400"
                }`} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.date}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Floating Elements */}
          <motion.div
            className="absolute -left-4 bottom-20 p-3 rounded-xl bg-card shadow-elevated"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <TestTube className="w-5 h-5 text-secondary" />
          </motion.div>
          <motion.div
            className="absolute -right-4 bottom-32 p-3 rounded-xl bg-card shadow-elevated"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <Pill className="w-5 h-5 text-primary" />
          </motion.div>
        </div>
      </motion.div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-2">
        {features.map(({ Icon, label }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.05 }}
            className="text-center p-2"
          >
            <div className="inline-flex p-2 rounded-lg bg-accent mb-1">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
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
