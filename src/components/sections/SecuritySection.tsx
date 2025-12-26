import { motion } from "framer-motion";
import { Shield, Lock, Fingerprint, Eye, Server, FileCheck } from "lucide-react";

const securityFeatures = [
  {
    icon: Lock,
    title: "تشفير 256-bit",
    description: "جميع بياناتك مشفرة بأعلى معايير الأمان",
  },
  {
    icon: Fingerprint,
    title: "تحقق بصمة الإصبع",
    description: "دخول آمن ببصمتك أو التعرف على الوجه",
  },
  {
    icon: Eye,
    title: "خصوصية تامة",
    description: "أنت فقط من يتحكم في من يرى بياناتك",
  },
  {
    icon: Server,
    title: "خوادم آمنة",
    description: "بياناتك محفوظة في مراكز بيانات موثوقة",
  },
  {
    icon: FileCheck,
    title: "معايير صحية",
    description: "متوافق مع معايير الخصوصية الصحية الدولية",
  },
];

export function SecuritySection() {
  return (
    <section id="security" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-muted/50 to-background" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative max-w-md mx-auto">
              {/* Central shield */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 flex items-center justify-center"
              >
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary to-teal-700 flex items-center justify-center shadow-2xl">
                  <div className="w-40 h-40 rounded-full bg-card flex items-center justify-center">
                    <Shield className="w-20 h-20 text-primary" />
                  </div>
                </div>
              </motion.div>

              {/* Orbiting icons */}
              {securityFeatures.slice(0, 4).map((feature, index) => (
                <motion.div
                  key={index}
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 5,
                  }}
                  className="absolute inset-0"
                  style={{ transformOrigin: "center center" }}
                >
                  <div 
                    className="absolute glass-card w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      top: index === 0 ? "-10%" : index === 2 ? "85%" : "40%",
                      left: index === 1 ? "-10%" : index === 3 ? "85%" : "40%",
                    }}
                  >
                    <motion.div
                      animate={{ rotate: [0, -360] }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                        delay: index * 5,
                      }}
                    >
                      <feature.icon className="w-6 h-6 text-primary" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}

              {/* Background glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-pulse-soft" />
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-right"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              الأمان والخصوصية
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              بياناتك في <span className="text-gradient-primary">أمان تام</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 lg:mr-0">
              نلتزم بأعلى معايير الأمان والخصوصية لحماية بياناتك الصحية. 
              خصوصيتك أولويتنا القصوى.
            </p>

            {/* Features list */}
            <div className="space-y-4">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:shadow-soft transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-right flex-1">
                    <h4 className="font-bold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
