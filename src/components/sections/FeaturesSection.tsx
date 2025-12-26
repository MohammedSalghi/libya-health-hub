import { motion } from "framer-motion";
import { 
  Brain, 
  Wallet, 
  Star, 
  MapPin, 
  Bell, 
  Moon,
  Languages,
  Trophy
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "مساعد ذكي بالذكاء الاصطناعي",
    description: "تحليل الأعراض، توصيات التخصصات، وتذكير الأدوية",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Wallet,
    title: "محفظة إلكترونية",
    description: "اشحن رصيدك وادفع بسهولة مع استرداد نقدي",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Star,
    title: "نظام تقييم متكامل",
    description: "قيّم الأطباء والمستشفيات وشاهد آراء المستخدمين",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: MapPin,
    title: "خرائط وملاحة",
    description: "اعثر على أقرب مقدمي الخدمات الصحية مع الاتجاهات",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: Bell,
    title: "إشعارات ذكية",
    description: "تنبيهات للمواعيد والنتائج وجاهزية الأدوية",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    icon: Moon,
    title: "الوضع الليلي",
    description: "واجهة مريحة للعين في جميع الأوقات",
    gradient: "from-slate-500 to-gray-700",
  },
  {
    icon: Languages,
    title: "دعم اللغة العربية",
    description: "واجهة عربية أولاً مع دعم اللغة الإنجليزية",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    icon: Trophy,
    title: "برنامج الولاء",
    description: "اكسب نقاط واستبدلها بخصومات ومكافآت",
    gradient: "from-yellow-500 to-amber-600",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            المميزات
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            مميزات <span className="text-gradient-primary">متقدمة</span> لتجربة أفضل
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            تقنيات حديثة تجعل رحلتك الصحية أسهل وأكثر ذكاءً
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group"
            >
              <div className="h-full p-6 rounded-3xl bg-card border border-border/50 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-2">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
