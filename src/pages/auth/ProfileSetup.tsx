import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  User, Calendar, Ruler, Weight, Heart, ArrowLeft, 
  Camera, MapPin, Check 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    avatar: "",
    birthDate: "",
    gender: "",
    height: "",
    weight: "",
    bloodType: "",
    chronicConditions: [] as string[],
    allergies: "",
  });
  const navigate = useNavigate();

  const genders = [
    { value: "male", label: "ذكر", icon: "👨" },
    { value: "female", label: "أنثى", icon: "👩" },
  ];

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const chronicConditionsList = [
    { id: "diabetes", label: "السكري", icon: "🩸" },
    { id: "hypertension", label: "ضغط الدم", icon: "❤️" },
    { id: "heart", label: "القلب", icon: "💓" },
    { id: "asthma", label: "الربو", icon: "🌬️" },
    { id: "kidney", label: "الكلى", icon: "🫘" },
    { id: "none", label: "لا يوجد", icon: "✅" },
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate("/auth/permissions");
    }
  };

  const toggleCondition = (id: string) => {
    if (id === "none") {
      setProfile({ ...profile, chronicConditions: ["none"] });
    } else {
      const conditions = profile.chronicConditions.filter((c) => c !== "none");
      if (conditions.includes(id)) {
        setProfile({
          ...profile,
          chronicConditions: conditions.filter((c) => c !== id),
        });
      } else {
        setProfile({ ...profile, chronicConditions: [...conditions, id] });
      }
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>السابق</span>
        </button>
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-1.5 rounded-full transition-colors ${
                s <= step ? "gradient-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col px-6 pb-12">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {step === 1 && "المعلومات الأساسية"}
            {step === 2 && "القياسات الجسدية"}
            {step === 3 && "الحالة الصحية"}
          </h1>
          <p className="text-muted-foreground">
            {step === 1 && "أكمل ملفك الشخصي"}
            {step === 2 && "هذه المعلومات تساعد في تقديم رعاية أفضل"}
            {step === 3 && "أخبرنا عن حالتك الصحية"}
          </p>
        </motion.div>

        <motion.div
          key={`form-${step}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 w-full max-w-sm mx-auto"
        >
          {step === 1 && (
            <div className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex justify-center">
                <button className="relative group">
                  <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center overflow-hidden">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-foreground/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-background" />
                  </div>
                </button>
              </div>

              {/* Birth Date */}
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  تاريخ الميلاد
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={profile.birthDate}
                  onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                  className="text-left"
                  dir="ltr"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  الجنس
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {genders.map(({ value, label, icon }) => (
                    <button
                      key={value}
                      onClick={() => setProfile({ ...profile, gender: value })}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        profile.gender === value
                          ? "border-primary bg-accent"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <span className="text-2xl">{icon}</span>
                      <span className="font-medium text-foreground">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Height */}
              <div className="space-y-2">
                <Label htmlFor="height" className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-primary" />
                  الطول (سم)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={profile.height}
                  onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                  dir="ltr"
                  className="text-left"
                />
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center gap-2">
                  <Weight className="w-4 h-4 text-primary" />
                  الوزن (كجم)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={profile.weight}
                  onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                  dir="ltr"
                  className="text-left"
                />
              </div>

              {/* Blood Type */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" />
                  فصيلة الدم
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {bloodTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setProfile({ ...profile, bloodType: type })}
                      className={`p-3 rounded-xl border-2 font-semibold transition-all ${
                        profile.bloodType === type
                          ? "border-primary bg-accent text-primary"
                          : "border-border bg-card text-foreground hover:border-primary/50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              {/* Chronic Conditions */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" />
                  الأمراض المزمنة
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {chronicConditionsList.map(({ id, label, icon }) => (
                    <button
                      key={id}
                      onClick={() => toggleCondition(id)}
                      className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        profile.chronicConditions.includes(id)
                          ? "border-primary bg-accent"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <span className="text-xl">{icon}</span>
                      <span className="font-medium text-foreground text-sm">{label}</span>
                      {profile.chronicConditions.includes(id) && (
                        <Check className="w-4 h-4 text-primary mr-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div className="space-y-2">
                <Label htmlFor="allergies">الحساسية (اختياري)</Label>
                <Input
                  id="allergies"
                  placeholder="مثال: البنسلين، المكسرات..."
                  value={profile.allergies}
                  onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                />
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-sm mx-auto mt-6"
        >
          <Button variant="hero" className="w-full" onClick={handleNext}>
            {step < 3 ? "التالي" : "متابعة"}
          </Button>
          <button
            onClick={() => navigate("/auth/permissions")}
            className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground"
          >
            تخطي الآن
          </button>
        </motion.div>
      </div>
    </div>
  );
}
