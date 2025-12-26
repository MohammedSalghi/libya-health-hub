import { motion } from "framer-motion";
import { ArrowLeft, Play, Smartphone, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: Smartphone, label: "تطبيق سهل الاستخدام", value: "100%" },
  { icon: Shield, label: "بيانات مشفرة وآمنة", value: "256-bit" },
  { icon: Clock, label: "دعم على مدار الساعة", value: "24/7" },
];

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-right"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-accent-foreground/10 text-accent-foreground text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              منصة الرعاية الصحية الأولى في ليبيا
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
            >
              <span className="text-foreground">صحتك في </span>
              <span className="text-gradient-primary">متناول يدك</span>
              <br />
              <span className="text-foreground">أينما كنت</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 lg:mr-0"
            >
              احجز موعدك مع أفضل الأطباء، اطلب فحوصاتك المخبرية، وأدر سجلك الطبي 
              الموحد من مكان واحد. كل ما تحتاجه للعناية بصحتك وصحة عائلتك.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button variant="hero" size="lg" className="gap-3">
                حمّل التطبيق الآن
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Button variant="hero-outline" size="lg" className="gap-3">
                <Play className="w-5 h-5" />
                شاهد كيف يعمل
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border/50"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-right">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                    <stat.icon className="w-5 h-5 text-primary" />
                    <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Phone mockup */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-72 h-[580px] bg-foreground/90 rounded-[3rem] p-3 shadow-2xl">
                  <div className="w-full h-full bg-card rounded-[2.5rem] overflow-hidden relative">
                    {/* Phone screen content */}
                    <div className="absolute inset-0 gradient-primary opacity-10" />
                    <div className="p-6 relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-8 h-8 rounded-full bg-primary/20" />
                        <div className="w-20 h-2 rounded-full bg-foreground/20" />
                        <div className="w-8 h-8 rounded-full bg-muted" />
                      </div>
                      <div className="text-right mb-6">
                        <div className="w-32 h-3 rounded-full bg-foreground/20 mb-2 mr-auto" />
                        <div className="w-48 h-5 rounded-full bg-primary/30" />
                      </div>
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-muted/50 rounded-2xl p-4 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary/20" />
                            <div className="flex-1">
                              <div className="w-20 h-2 rounded-full bg-foreground/30 mb-2" />
                              <div className="w-32 h-2 rounded-full bg-muted-foreground/30" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-4 -right-4 glass-card rounded-2xl p-4 shadow-elevated"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground">بياناتك آمنة</div>
                    <div className="text-xs text-muted-foreground">تشفير كامل</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 glass-card rounded-2xl p-4 shadow-elevated"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-secondary flex items-center justify-center">
                    <Clock className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground">احجز الآن</div>
                    <div className="text-xs text-muted-foreground">مواعيد متاحة</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
