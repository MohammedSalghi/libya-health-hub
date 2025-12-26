import { motion } from "framer-motion";
import { Globe, Check, Moon, Sun, Bell, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface LanguageSetupStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function LanguageSetupStep({ onNext, onBack }: LanguageSetupStepProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("ar");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);

  const languages = [
    { code: "ar", name: "العربية", native: "العربية", flag: "🇱🇾" },
    { code: "en", name: "English", native: "الإنجليزية", flag: "🇬🇧" },
  ];

  const preferences = [
    {
      id: "darkMode",
      Icon: darkMode ? Moon : Sun,
      title: "الوضع الداكن",
      description: "تفعيل المظهر الداكن",
      value: darkMode,
      onChange: () => setDarkMode(!darkMode),
    },
    {
      id: "notifications",
      Icon: Bell,
      title: "الإشعارات",
      description: "تلقي تنبيهات المواعيد",
      value: notifications,
      onChange: () => setNotifications(!notifications),
    },
    {
      id: "location",
      Icon: MapPin,
      title: "الموقع",
      description: "اكتشاف الخدمات القريبة",
      value: location,
      onChange: () => setLocation(!location),
    },
  ];

  return (
    <div className="flex-1 flex flex-col px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="inline-flex p-4 rounded-2xl bg-accent mb-4">
          <Globe className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          إعداد التجربة
        </h2>
        <p className="text-muted-foreground">
          اختر لغتك وتفضيلاتك
        </p>
      </motion.div>

      {/* Language Selection */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <label className="text-sm font-medium text-foreground mb-3 block">
          اللغة المفضلة
        </label>
        <div className="grid grid-cols-2 gap-3">
          {languages.map(({ code, name, native, flag }) => (
            <button
              key={code}
              onClick={() => setSelectedLanguage(code)}
              className={`p-4 rounded-2xl border-2 transition-all text-center ${
                selectedLanguage === code
                  ? "border-primary bg-accent"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <span className="text-2xl mb-2 block">{flag}</span>
              <span className="font-semibold text-foreground block">{name}</span>
              <span className="text-xs text-muted-foreground">{native}</span>
              {selectedLanguage === code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 left-2"
                >
                  <Check className="w-5 h-5 text-primary" />
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex-1 space-y-3"
      >
        <label className="text-sm font-medium text-foreground mb-3 block">
          التفضيلات
        </label>
        {preferences.map(({ id, Icon, title, description, value, onChange }, index) => (
          <motion.button
            key={id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            onClick={onChange}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card shadow-card border border-border/50 text-right"
          >
            <div className={`p-3 rounded-xl ${value ? "gradient-primary" : "bg-muted"}`}>
              <Icon className={`w-5 h-5 ${value ? "text-primary-foreground" : "text-muted-foreground"}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className={`w-12 h-7 rounded-full relative transition-colors ${
              value ? "gradient-primary" : "bg-muted"
            }`}>
              <motion.div
                className="absolute top-1 w-5 h-5 rounded-full bg-card shadow-soft"
                animate={{ left: value ? "auto" : "4px", right: value ? "4px" : "auto" }}
              />
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex gap-3 mt-6"
      >
        <Button variant="outline" className="flex-1" onClick={onBack}>
          السابق
        </Button>
        <Button variant="hero" className="flex-1" onClick={onNext}>
          التالي
        </Button>
      </motion.div>
    </div>
  );
}
