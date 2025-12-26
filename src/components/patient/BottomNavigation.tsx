import { Home, Calendar, MessageCircle, Wallet, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "الرئيسية", path: "/patient" },
  { icon: Calendar, label: "المواعيد", path: "/patient/appointments" },
  { icon: MessageCircle, label: "الرسائل", path: "/patient/messages" },
  { icon: Wallet, label: "المحفظة", path: "/patient/wallet" },
  { icon: User, label: "حسابي", path: "/patient/profile" },
];

export const BottomNavigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border shadow-elevated">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300",
                isActive
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "scale-110")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
