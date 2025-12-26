import { motion } from "framer-motion";
import { 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  Ambulance, 
  Video, 
  FileText,
  Home,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: Stethoscope,
    title: "حجز مواعيد الأطباء",
    description: "احجز موعدك مع أفضل الأطباء في جميع التخصصات بسهولة وسرعة",
    color: "bg-teal-100 text-teal-600",
  },
  {
    icon: Video,
    title: "استشارات عن بُعد",
    description: "تحدث مع طبيبك عبر الفيديو أو الدردشة من أي مكان",
    color: "bg-coral-100 text-coral-500",
  },
  {
    icon: FlaskConical,
    title: "الفحوصات المخبرية",
    description: "احجز فحوصاتك في المختبر أو اطلب سحب العينات للمنزل",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Pill,
    title: "طلب الأدوية",
    description: "اطلب أدويتك من أقرب صيدلية مع خدمة التوصيل للمنزل",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Home,
    title: "زيارة طبيب منزلية",
    description: "اطلب زيارة طبيب لمنزلك في الحالات التي تستدعي ذلك",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: FileText,
    title: "السجل الطبي الموحد",
    description: "جميع سجلاتك الطبية في مكان واحد آمن ومشفر",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Calendar,
    title: "تذكير المواعيد",
    description: "إشعارات ذكية لتذكيرك بمواعيدك وأدويتك",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: Ambulance,
    title: "طلب إسعاف",
    description: "خدمة طلب الإسعاف في حالات الطوارئ مع تتبع مباشر",
    color: "bg-red-100 text-red-600",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            خدماتنا
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            كل ما تحتاجه في <span className="text-gradient-primary">تطبيق واحد</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            منصة متكاملة توفر لك جميع الخدمات الصحية بسهولة وأمان
          </p>
        </motion.div>

        {/* Services grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Card variant="feature" className="h-full group cursor-pointer">
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
