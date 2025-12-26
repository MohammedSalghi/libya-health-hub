import { motion } from "framer-motion";
import { UserPlus, Search, CalendarCheck, HeartPulse } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "١",
    title: "أنشئ حسابك",
    description: "سجّل برقم هاتفك أو بريدك الإلكتروني وأكمل ملفك الصحي",
  },
  {
    icon: Search,
    step: "٢",
    title: "ابحث عن الخدمة",
    description: "اختر التخصص المطلوب أو ابحث عن طبيب أو مستشفى أو مختبر",
  },
  {
    icon: CalendarCheck,
    step: "٣",
    title: "احجز موعدك",
    description: "اختر الوقت المناسب واحجز موعدك حضورياً أو عن بُعد",
  },
  {
    icon: HeartPulse,
    step: "٤",
    title: "احصل على الرعاية",
    description: "استلم تقاريرك ووصفاتك الطبية مباشرة في التطبيق",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-muted/30 to-transparent" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-4">
            كيف يعمل
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            أربع خطوات <span className="text-gradient-primary">بسيطة</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ابدأ رحلتك الصحية معنا في دقائق معدودة
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 right-[12.5%] left-[12.5%] h-0.5 bg-gradient-to-l from-primary via-primary/50 to-primary transform -translate-y-1/2" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Icon container */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center shadow-elevated relative z-10">
                      <step.icon className="w-9 h-9 text-primary-foreground" />
                    </div>
                    {/* Step number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold shadow-soft z-20">
                      {step.step}
                    </div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 w-20 h-20 rounded-3xl bg-primary/30 blur-xl -z-10" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
