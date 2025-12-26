import { motion } from "framer-motion";
import { Shield, Lock, Fingerprint, Eye, Server, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SecurityStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function SecurityStep({ onNext, onBack }: SecurityStepProps) {
  const features = [
    { Icon: Lock, title: "تشفير كامل", description: "جميع البيانات مشفرة بأعلى المعايير" },
    { Icon: Fingerprint, title: "تحقق متعدد", description: "OTP وبصمة للدخول الآمن" },
    { Icon: Eye, title: "خصوصية تامة", description: "بياناتك لك وحدك" },
    { Icon: Server, title: "خوادم آمنة", description: "تخزين محلي موثوق" },
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
          آمن وموثوق
        </h2>
        <p className="text-muted-foreground">
          نحمي بياناتك الصحية بأعلى معايير الأمان
        </p>
      </motion.div>

      {/* Shield Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="relative mx-auto mb-8"
      >
        <div className="w-40 h-40 relative">
          {/* Outer rings */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-primary/20"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border-4 border-primary/30"
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.3, 0.6] }}
            transition={{ duration: 3, delay: 0.5, repeat: Infinity }}
          />
          
          {/* Center shield */}
          <div className="absolute inset-8 rounded-full gradient-primary shadow-glow flex items-center justify-center">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Shield className="w-12 h-12 text-primary-foreground" />
            </motion.div>
          </div>

          {/* Floating checkmarks */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute p-2 rounded-full bg-card shadow-elevated"
              style={{
                top: `${20 + i * 30}%`,
                right: i % 2 === 0 ? "-10%" : undefined,
                left: i % 2 !== 0 ? "-10%" : undefined,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.2 }}
            >
              <CheckCircle className="w-4 h-4 text-primary" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Security Features */}
      <div className="space-y-3 flex-1">
        {features.map(({ Icon, title, description }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-card shadow-card border border-border/50"
          >
            <div className="p-3 rounded-xl bg-accent">
              <Icon className="w-5 h-5 text-primary" />
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
        transition={{ delay: 1 }}
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
