import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Phone, Mail, Fingerprint, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handlePhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to OTP verification
    navigate("/auth/verify-otp", { state: { phone } });
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to patient dashboard
    navigate("/patient");
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Header */}
      <div className="p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>العودة</span>
        </Link>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">تسجيل الدخول</h1>
          <p className="text-muted-foreground">مرحباً بعودتك! سجل دخولك للمتابعة</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-sm"
        >
          <Tabs defaultValue="phone" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="phone" className="gap-2">
                <Phone className="w-4 h-4" />
                رقم الهاتف
              </TabsTrigger>
              <TabsTrigger value="email" className="gap-2">
                <Mail className="w-4 h-4" />
                البريد الإلكتروني
              </TabsTrigger>
            </TabsList>

            <TabsContent value="phone">
              <form onSubmit={handlePhoneLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="09X-XXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="text-left ltr pl-20"
                      dir="ltr"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      +218
                    </span>
                  </div>
                </div>

                <Button type="submit" variant="hero" className="w-full">
                  إرسال رمز التحقق
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    dir="ltr"
                    className="text-left"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                </div>

                <div className="text-left">
                  <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline">
                    نسيت كلمة المرور؟
                  </Link>
                </div>

                <Button type="submit" variant="hero" className="w-full">
                  تسجيل الدخول
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Biometric Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">أو</span>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-6 gap-2">
              <Fingerprint className="w-5 h-5" />
              الدخول بالبصمة
            </Button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center mt-8 text-muted-foreground">
            ليس لديك حساب؟{" "}
            <Link to="/auth/signup" className="text-primary font-semibold hover:underline">
              إنشاء حساب جديد
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
