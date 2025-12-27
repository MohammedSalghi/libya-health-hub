import { useState } from "react";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, Heart, Activity, Droplets, Scale, Ruler, Calendar,
  Edit2, ChevronLeft, Shield, Bell, Moon, Globe, LogOut, Trash2
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const healthMetrics = [
    { icon: Ruler, label: "الطول", value: "175 سم" },
    { icon: Scale, label: "الوزن", value: "70 كجم" },
    { icon: Droplets, label: "فصيلة الدم", value: "O+" },
    { icon: Calendar, label: "العمر", value: "32 سنة" },
  ];

  const menuItems = [
    { icon: User, label: "المعلومات الشخصية", path: "/patient/profile/edit" },
    { icon: Heart, label: "الأمراض المزمنة", path: "/patient/health-records" },
    { icon: Activity, label: "السجل الصحي", path: "/patient/health-records" },
    { icon: Bell, label: "الإشعارات", path: "/patient/notifications" },
    { icon: Shield, label: "الخصوصية والأمان", path: "/patient/settings" },
    { icon: Globe, label: "اللغة", value: "العربية" },
    { icon: Moon, label: "الوضع الليلي", toggle: true },
  ];

  return (
    <PatientLayout>
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-4 border-background">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      م
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-1 -left-1 h-8 w-8 rounded-full"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-foreground">محمد أحمد</h1>
                  <p className="text-muted-foreground">mohamed@example.com</p>
                  <p className="text-sm text-muted-foreground">+218 91 234 5678</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Health Metrics */}
        <div>
          <h2 className="text-lg font-semibold mb-3">البيانات الصحية</h2>
          <div className="grid grid-cols-2 gap-3">
            {healthMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <metric.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{metric.label}</div>
                      <div className="font-semibold">{metric.value}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => item.path && navigate(item.path)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-full">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.toggle ? (
                    <Button
                      variant={darkMode ? "default" : "outline"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDarkMode(!darkMode);
                      }}
                    >
                      {darkMode ? "مفعل" : "معطل"}
                    </Button>
                  ) : item.value ? (
                    <span className="text-muted-foreground">{item.value}</span>
                  ) : (
                    <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Logout & Delete */}
        <div className="space-y-3 pt-4">
          <Button variant="outline" className="w-full justify-start gap-3 text-destructive">
            <LogOut className="h-5 w-5" />
            تسجيل الخروج
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive/70">
            <Trash2 className="h-5 w-5" />
            حذف الحساب
          </Button>
        </div>
      </div>
    </PatientLayout>
  );
};

export default ProfilePage;
