import { useState } from "react";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Globe, Moon, Bell, Shield, Lock, Eye, Fingerprint,
  Smartphone, HelpCircle, FileText, ChevronLeft
} from "lucide-react";
import { motion } from "framer-motion";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    emailNotifications: true,
    smsNotifications: false,
    biometrics: true,
    twoFactor: false,
    shareData: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const settingsGroups = [
    {
      title: "العرض",
      items: [
        { 
          icon: Globe, 
          label: "اللغة", 
          value: "العربية",
          action: "navigate"
        },
        { 
          icon: Moon, 
          label: "الوضع الليلي", 
          key: "darkMode" as const,
          action: "toggle"
        },
      ]
    },
    {
      title: "الإشعارات",
      items: [
        { 
          icon: Bell, 
          label: "إشعارات التطبيق", 
          key: "notifications" as const,
          action: "toggle"
        },
        { 
          icon: Smartphone, 
          label: "إشعارات SMS", 
          key: "smsNotifications" as const,
          action: "toggle"
        },
      ]
    },
    {
      title: "الأمان والخصوصية",
      items: [
        { 
          icon: Fingerprint, 
          label: "الدخول بالبصمة", 
          key: "biometrics" as const,
          action: "toggle"
        },
        { 
          icon: Lock, 
          label: "التحقق بخطوتين", 
          key: "twoFactor" as const,
          action: "toggle"
        },
        { 
          icon: Eye, 
          label: "مشاركة البيانات الصحية", 
          key: "shareData" as const,
          action: "toggle"
        },
        { 
          icon: Shield, 
          label: "تغيير كلمة المرور", 
          action: "navigate"
        },
      ]
    },
    {
      title: "الدعم",
      items: [
        { 
          icon: HelpCircle, 
          label: "مركز المساعدة", 
          action: "navigate"
        },
        { 
          icon: FileText, 
          label: "سياسة الخصوصية", 
          action: "navigate"
        },
        { 
          icon: FileText, 
          label: "شروط الاستخدام", 
          action: "navigate"
        },
      ]
    },
  ];

  return (
    <PatientLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-foreground">الإعدادات</h1>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-muted-foreground">{group.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {group.items.map((item, index) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between py-3 ${
                      index !== group.items.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-full">
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    
                    {item.action === "toggle" && item.key ? (
                      <Switch
                        checked={settings[item.key]}
                        onCheckedChange={() => toggleSetting(item.key!)}
                      />
                    ) : item.value ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>{item.value}</span>
                        <ChevronLeft className="h-5 w-5" />
                      </div>
                    ) : (
                      <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* App Version */}
        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>صحتي ليبيا</p>
          <p>الإصدار 1.0.0</p>
        </div>
      </div>
    </PatientLayout>
  );
};

export default SettingsPage;
