import { motion } from "framer-motion";
import { ArrowLeft, Apple, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Card */}
          <div className="relative overflow-hidden rounded-[2.5rem] gradient-primary p-12 lg:p-20">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative z-10 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6"
              >
                ابدأ رحلتك الصحية اليوم
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto"
              >
                حمّل التطبيق الآن واحصل على رعاية صحية متكاملة في متناول يدك. 
                انضم لآلاف الليبيين الذين يثقون بصحتي ليبيا.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  size="xl"
                  className="bg-card text-foreground hover:bg-card/90 shadow-elevated gap-3"
                >
                  <Apple className="w-6 h-6" />
                  App Store
                </Button>
                <Button
                  size="xl"
                  className="bg-card text-foreground hover:bg-card/90 shadow-elevated gap-3"
                >
                  <Smartphone className="w-6 h-6" />
                  Google Play
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-10 flex items-center justify-center gap-8 text-primary-foreground/70 text-sm"
              >
                <span>✓ مجاني للتحميل</span>
                <span>✓ بدون إعلانات</span>
                <span>✓ خصوصية تامة</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
