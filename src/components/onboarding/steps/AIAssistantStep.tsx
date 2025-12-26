import { motion } from "framer-motion";
import { Bot, MessageCircle, Pill, Apple, Activity, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIAssistantStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function AIAssistantStep({ onNext, onBack }: AIAssistantStepProps) {
  const capabilities = [
    { Icon: MessageCircle, title: "فحص الأعراض", description: "تحليل ذكي لأعراضك" },
    { Icon: Activity, title: "توصيات التخصص", description: "اقتراح الطبيب المناسب" },
    { Icon: Pill, title: "تذكير الأدوية", description: "لا تنسَ جرعاتك" },
    { Icon: Apple, title: "نصائح غذائية", description: "تغذية مخصصة لك" },
  ];

  const chatMessages = [
    { type: "user", text: "أشعر بصداع ودوخة منذ يومين" },
    { type: "ai", text: "فهمت. هل لديك ارتفاع في ضغط الدم أو تاريخ مرضي؟" },
    { type: "user", text: "نعم، ضغط مرتفع" },
    { type: "ai", text: "أنصحك بزيارة طبيب باطني. هل تريد حجز موعد الآن؟" },
  ];

  return (
    <div className="flex-1 flex flex-col px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <motion.div 
          className="inline-flex p-4 rounded-2xl gradient-secondary mb-4"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Bot className="w-8 h-8 text-secondary-foreground" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          مساعدك الصحي الذكي
        </h2>
        <p className="text-muted-foreground">
          ذكاء اصطناعي لرعايتك على مدار الساعة
        </p>
      </motion.div>

      {/* Chat Demo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl shadow-card border border-border/50 p-4 mb-6"
      >
        <div className="space-y-3">
          {chatMessages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.2 }}
              className={`flex ${msg.type === "user" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                  msg.type === "user"
                    ? "bg-muted text-foreground rounded-tr-sm"
                    : "gradient-primary text-primary-foreground rounded-tl-sm"
                }`}
              >
                {msg.type === "ai" && (
                  <Sparkles className="w-3 h-3 inline-block ml-1 mb-0.5" />
                )}
                {msg.text}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Capabilities */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {capabilities.map(({ Icon, title, description }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="p-4 rounded-2xl bg-accent/50 text-center"
          >
            <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="font-semibold text-foreground text-sm">{title}</div>
            <div className="text-xs text-muted-foreground">{description}</div>
          </motion.div>
        ))}
      </div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
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
