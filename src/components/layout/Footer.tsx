import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  services: [
    { label: "حجز المواعيد", href: "#" },
    { label: "استشارات عن بُعد", href: "#" },
    { label: "الفحوصات المخبرية", href: "#" },
    { label: "طلب الأدوية", href: "#" },
    { label: "زيارة منزلية", href: "#" },
  ],
  support: [
    { label: "مركز المساعدة", href: "#" },
    { label: "الأسئلة الشائعة", href: "#" },
    { label: "تواصل معنا", href: "#" },
    { label: "الشكاوى والاقتراحات", href: "#" },
  ],
  legal: [
    { label: "سياسة الخصوصية", href: "#" },
    { label: "شروط الاستخدام", href: "#" },
    { label: "سياسة الاسترجاع", href: "#" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="bg-foreground/[0.03] border-t border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">صحتي ليبيا</span>
                <span className="text-xs text-muted-foreground">منصة الرعاية الصحية المتكاملة</span>
              </div>
            </a>
            <p className="text-muted-foreground mb-6 max-w-sm">
              منصة صحية متكاملة تهدف لتوفير رعاية صحية عالية الجودة 
              لجميع المواطنين الليبيين في أي مكان وزمان.
            </p>
            
            {/* Contact info */}
            <div className="space-y-3">
              <a href="tel:+218000000000" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-5 h-5" />
                <span>+218 00 000 0000</span>
              </a>
              <a href="mailto:support@sihatilibya.ly" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
                <span>support@sihatilibya.ly</span>
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span>طرابلس، ليبيا</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-foreground mb-6">خدماتنا</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-6">الدعم</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-6">قانوني</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} صحتي ليبيا. جميع الحقوق محفوظة.
          </p>
          
          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
