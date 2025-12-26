import { motion } from "framer-motion";
import { 
  Bot, 
  Thermometer, 
  Pill, 
  Apple, 
  Activity,
  MessageCircle,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const capabilities = [
  { icon: Thermometer, label: "تحليل الأعراض" },
  { icon: Activity, label: "متابعة الأمراض المزمنة" },
  { icon: Pill, label: "تذكير الأدوية" },
  { icon: Apple, label: "نصائح غذائية" },
];

export function AIAssistantSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-right order-2 lg:order-1"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 text-violet-600 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              مدعوم بالذكاء الاصطناعي
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              مساعدك الصحي <span className="text-gradient-primary">الذكي</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 lg:mr-0">
              استفد من قوة الذكاء الاصطناعي للحصول على توصيات صحية مخصصة، 
              تحليل أعراضك، ومتابعة حالتك الصحية على مدار الساعة.
            </p>

            {/* Capabilities */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {capabilities.map((cap, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border/50"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <cap.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{cap.label}</span>
                </motion.div>
              ))}
            </div>

            <Button variant="hero" size="lg" className="gap-3">
              جرّب المساعد الآن
              <Bot className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative max-w-md mx-auto">
              {/* Main card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <div className="bg-card rounded-3xl p-6 shadow-elevated border border-border/50">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border/50">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <Bot className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div className="text-right flex-1">
                      <h4 className="font-bold text-foreground">المساعد الذكي</h4>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm text-muted-foreground">متصل الآن</span>
                      </div>
                    </div>
                  </div>

                  {/* Chat messages */}
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <div className="bg-primary/10 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                        <p className="text-foreground text-sm">أشعر بصداع وحرارة منذ يومين</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                        <p className="text-foreground text-sm mb-2">
                          بناءً على أعراضك، أنصحك بـ:
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• الراحة وشرب السوائل</li>
                          <li>• زيارة طبيب باطني</li>
                          <li>• قياس درجة الحرارة</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Input */}
                  <div className="mt-6 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-3 bg-muted/50 rounded-2xl px-4 py-3">
                      <MessageCircle className="w-5 h-5 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm">اكتب سؤالك هنا...</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Background decorations */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
