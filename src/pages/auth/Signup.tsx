import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Phone, Mail, Eye, EyeOff, ArrowLeft, User, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: "",
    fullName: "",
    agreeTerms: false,
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Navigate to OTP verification
      navigate("/auth/verify-otp", { state: { phone: formData.phone, isSignup: true } });
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : navigate("/auth/login")}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{step > 1 ? "السابق" : "العودة"}</span>
        </button>
        <div className="flex gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`w-8 h-1.5 rounded-full transition-colors ${
                s <= step ? "gradient-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="w-20 h-20 rounded-2xl gradient-primary shadow-glow flex items-center justify-center mb-6"
        >
          <span className="text-primary-foreground text-3xl font-bold">صحة</span>
        </motion.div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {step === 1 ? "إنشاء حساب جديد" : "معلوماتك الشخصية"}
          </h1>
          <p className="text-muted-foreground">
            {step === 1 ? "انضم إلى صحة ليبيا اليوم" : "أخبرنا المزيد عنك"}
          </p>
        </motion.div>

        {/* Signup Form */}
        <motion.div
          key={`form-${step}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="09X-XXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="text-left ltr pl-20 pr-10"
                      dir="ltr"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      +218
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      dir="ltr"
                      className="text-left pr-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="8 أحرف على الأقل"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      dir="ltr"
                      className="text-left pl-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Password strength indicators */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          formData.password.length >= i * 2
                            ? i <= 2
                              ? "bg-destructive"
                              : "bg-primary"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">الاسم الكامل</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="أدخل اسمك الكامل"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="pr-10"
                    />
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/50">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, agreeTerms: checked as boolean })
                    }
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                    أوافق على{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      شروط الاستخدام
                    </Link>{" "}
                    و{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      سياسة الخصوصية
                    </Link>
                  </label>
                </div>

                {/* Summary */}
                <div className="p-4 rounded-xl bg-card border border-border/50 space-y-2">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    ملخص البيانات
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>الهاتف: {formData.phone || "—"}</p>
                    <p>البريد: {formData.email || "لم يُحدد"}</p>
                    <p>الاسم: {formData.fullName || "—"}</p>
                  </div>
                </div>
              </>
            )}

            <Button
              type="submit"
              variant="hero"
              className="w-full"
              disabled={step === 2 && !formData.agreeTerms}
            >
              {step === 1 ? "التالي" : "إنشاء الحساب"}
            </Button>
          </form>

          {step === 1 && (
            <p className="text-center mt-8 text-muted-foreground">
              لديك حساب بالفعل؟{" "}
              <Link to="/auth/login" className="text-primary font-semibold hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
