import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin, Camera, FileText, Bell, Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Permission {
  id: string;
  icon: typeof MapPin;
  title: string;
  description: string;
  required: boolean;
}

export default function Permissions() {
  const navigate = useNavigate();
  const [grantedPermissions, setGrantedPermissions] = useState<string[]>([]);

  const permissions: Permission[] = [
    {
      id: "location",
      icon: MapPin,
      title: "الموقع",
      description: "للعثور على الخدمات الصحية القريبة منك",
      required: true,
    },
    {
      id: "camera",
      icon: Camera,
      title: "الكاميرا",
      description: "لإجراء استشارات الفيديو وتصوير المستندات",
      required: false,
    },
    {
      id: "files",
      icon: FileText,
      title: "الملفات",
      description: "لرفع الوصفات والتقارير الطبية",
      required: false,
    },
    {
      id: "notifications",
      icon: Bell,
      title: "الإشعارات",
      description: "لتذكيرك بالمواعيد والأدوية",
      required: true,
    },
  ];

  const togglePermission = (id: string) => {
    if (grantedPermissions.includes(id)) {
      setGrantedPermissions(grantedPermissions.filter((p) => p !== id));
    } else {
      setGrantedPermissions([...grantedPermissions, id]);
    }
  };

  const grantAll = () => {
    setGrantedPermissions(permissions.map((p) => p.id));
  };

  const handleContinue = () => {
    // Save permissions state
    localStorage.setItem("permissions", JSON.stringify(grantedPermissions));
    navigate("/patient");
  };

  const requiredGranted = permissions
    .filter((p) => p.required)
    .every((p) => grantedPermissions.includes(p.id));

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-6"
        >
          <Shield className="w-12 h-12 text-primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">
            الأذونات المطلوبة
          </h1>
          <p className="text-muted-foreground">
            نحتاج بعض الأذونات لتقديم تجربة أفضل
          </p>
        </motion.div>

        {/* Permissions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-sm space-y-3 mb-8"
        >
          {permissions.map((permission, index) => (
            <motion.button
              key={permission.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              onClick={() => togglePermission(permission.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-right ${
                grantedPermissions.includes(permission.id)
                  ? "border-primary bg-accent"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div
                className={`p-3 rounded-xl transition-colors ${
                  grantedPermissions.includes(permission.id)
                    ? "gradient-primary"
                    : "bg-muted"
                }`}
              >
                <permission.icon
                  className={`w-5 h-5 ${
                    grantedPermissions.includes(permission.id)
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{permission.title}</h3>
                  {permission.required && (
                    <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">
                      مطلوب
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{permission.description}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  grantedPermissions.includes(permission.id)
                    ? "border-primary bg-primary"
                    : "border-muted"
                }`}
              >
                {grantedPermissions.includes(permission.id) && (
                  <Check className="w-4 h-4 text-primary-foreground" />
                )}
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full max-w-sm space-y-3"
        >
          <Button variant="outline" className="w-full" onClick={grantAll}>
            السماح بالكل
          </Button>
          <Button
            variant="hero"
            className="w-full"
            onClick={handleContinue}
            disabled={!requiredGranted}
          >
            متابعة
          </Button>
          {!requiredGranted && (
            <p className="text-center text-sm text-muted-foreground">
              يرجى السماح بالأذونات المطلوبة للمتابعة
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
