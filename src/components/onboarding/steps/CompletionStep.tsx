import { motion } from "framer-motion";
import { CheckCircle, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompletionStepProps {
  onComplete: () => void;
}

export function CompletionStep({ onComplete }: CompletionStepProps) {
  const features = [
    "حجز المواعيد بسهولة",
    "استشارات عن بُعد",
    "السجل الصحي الموحد",
    "مساعد ذكي بالذكاء الاصطناعي",
    "طلب الأدوية والتوصيل",
    "تذكير الأدوية والمواعيد",
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
        className="relative mb-8"
      >
        {/* Confetti particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              background: i % 3 === 0 ? "hsl(var(--primary))" : i % 3 === 1 ? "hsl(var(--secondary))" : "hsl(173, 55%, 50%)",
            }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: Math.cos(i * 30 * Math.PI / 180) * 100,
              y: Math.sin(i * 30 * Math.PI / 180) * 100,
              opacity: [0, 1, 0],
            }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
          />
        ))}

        {/* Main circle */}
        <motion.div
          className="w-32 h-32 rounded-full gradient-primary shadow-glow flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <CheckCircle className="w-16 h-16 text-primary-foreground" />
          </motion.div>
        </motion.div>

        {/* Sparkles */}
        <motion.div
          className="absolute -top-4 -right-4"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Sparkles className="w-8 h-8 text-secondary" />
        </motion.div>
        <motion.div
          className="absolute -bottom-2 -left-6"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <Sparkles className="w-6 h-6 text-primary" />
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-4 mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground">
          أنت جاهز!
        </h1>
        <p className="text-muted-foreground text-lg">
          مرحباً بك في عائلة صحة ليبيا
        </p>
      </motion.div>

      {/* Features Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-card rounded-2xl shadow-card border border-border/50 p-6 w-full max-w-sm mb-8"
      >
        <h3 className="font-semibold text-foreground mb-4">يمكنك الآن:</h3>
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="flex items-center gap-2 text-sm"
            >
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="w-full max-w-sm"
      >
        <Button 
          variant="hero" 
          className="w-full group"
          onClick={onComplete}
        >
          <span>ابدأ استخدام التطبيق</span>
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        </Button>
      </motion.div>
    </div>
  );
}
