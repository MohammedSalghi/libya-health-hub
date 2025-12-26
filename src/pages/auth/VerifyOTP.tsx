import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const phone = location.state?.phone || "09XXXXXXXX";
  const isSignup = location.state?.isSignup || false;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    if (newOtp.every((digit) => digit !== "")) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (code: string) => {
    // Simulate verification
    setTimeout(() => {
      setIsVerified(true);
      setTimeout(() => {
        if (isSignup) {
          navigate("/auth/profile-setup");
        } else {
          navigate("/patient");
        }
      }, 1500);
    }, 500);
  };

  const handleResend = () => {
    setCanResend(false);
    setCountdown(60);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Header */}
      <div className="p-6">
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>العودة</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {!isVerified ? (
          <>
            {/* Phone Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-6"
            >
              <span className="text-4xl">📱</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-2xl font-bold text-foreground mb-2">التحقق من الهاتف</h1>
              <p className="text-muted-foreground">
                أدخل رمز التحقق المرسل إلى
              </p>
              <p className="text-foreground font-semibold mt-1 dir-ltr" dir="ltr">
                +218 {phone}
              </p>
            </motion.div>

            {/* OTP Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-sm"
            >
              <div className="flex gap-2 justify-center mb-8" dir="ltr">
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 bg-card transition-all focus:outline-none ${
                      digit
                        ? "border-primary text-foreground"
                        : "border-border text-muted-foreground focus:border-primary"
                    }`}
                  />
                ))}
              </div>

              {/* Resend */}
              <div className="text-center">
                {canResend ? (
                  <Button
                    variant="ghost"
                    className="gap-2"
                    onClick={handleResend}
                  >
                    <RefreshCw className="w-4 h-4" />
                    إعادة إرسال الرمز
                  </Button>
                ) : (
                  <p className="text-muted-foreground">
                    إعادة الإرسال خلال{" "}
                    <span className="text-primary font-semibold">{countdown}</span> ثانية
                  </p>
                )}
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-center"
          >
            <div className="w-24 h-24 rounded-full gradient-primary shadow-glow flex items-center justify-center mb-6 mx-auto">
              <CheckCircle className="w-12 h-12 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">تم التحقق بنجاح!</h2>
            <p className="text-muted-foreground">جاري التحويل...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
