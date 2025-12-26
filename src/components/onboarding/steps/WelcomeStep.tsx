import { motion } from "framer-motion";
import { Heart, Stethoscope, Activity, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const floatingIcons = [
    { Icon: Heart, color: "text-secondary", delay: 0 },
    { Icon: Stethoscope, color: "text-primary", delay: 0.2 },
    { Icon: Activity, color: "text-teal-400", delay: 0.4 },
    { Icon: Shield, color: "text-coral-400", delay: 0.6 },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      {/* Floating Icons */}
      <div className="relative w-64 h-64 mb-8">
        <motion.div
          className="absolute inset-0 rounded-full gradient-primary opacity-10"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-8 rounded-full bg-accent opacity-30"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {floatingIcons.map(({ Icon, color, delay }, index) => (
          <motion.div
            key={index}
            className={`absolute ${color}`}
            style={{
              top: `${20 + Math.sin(index * 1.5) * 30}%`,
              left: `${20 + Math.cos(index * 1.5) * 30}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -10, 0],
            }}
            transition={{ 
              delay,
              y: { duration: 3, repeat: Infinity, delay }
            }}
          >
            <div className="p-4 rounded-2xl glass-card shadow-elevated">
              <Icon className="w-8 h-8" />
            </div>
          </motion.div>
        ))}

        {/* Center Logo */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        >
          <div className="w-24 h-24 rounded-3xl gradient-primary shadow-glow flex items-center justify-center">
            <span className="text-primary-foreground text-4xl font-bold">صحة</span>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-4"
      >
        <h1 className="text-3xl font-bold text-foreground">
          مرحباً بك في
          <span className="block text-gradient-primary text-4xl mt-2">صحة ليبيا</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-sm">
          منصة الرعاية الصحية المتكاملة الأولى في ليبيا
          <br />
          صحتك في أمان معنا
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-12 w-full max-w-sm"
      >
        <Button 
          variant="hero" 
          className="w-full"
          onClick={onNext}
        >
          ابدأ الآن
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">
          بالمتابعة، أنت توافق على سياسة الخصوصية وشروط الاستخدام
        </p>
      </motion.div>
    </div>
  );
}
