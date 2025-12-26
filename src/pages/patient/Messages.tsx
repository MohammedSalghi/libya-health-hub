import { useState } from "react";
import { motion } from "framer-motion";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ChevronLeft,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const conversations = [
  {
    id: 1,
    name: "د. أحمد محمد العزابي",
    specialty: "طب القلب",
    lastMessage: "شكراً لك، سأراجع نتائج الفحوصات وأرد عليك",
    time: "10:30 ص",
    unread: 2,
    online: true,
    avatar: "أ",
  },
  {
    id: 2,
    name: "د. فاطمة علي الشريف",
    specialty: "طب الأطفال",
    lastMessage: "تم تأكيد موعدك ليوم غد",
    time: "أمس",
    unread: 0,
    online: false,
    avatar: "ف",
    read: true,
  },
  {
    id: 3,
    name: "مختبر الأمل",
    specialty: "مختبر تحاليل",
    lastMessage: "نتائج التحاليل جاهزة للاستلام",
    time: "أمس",
    unread: 1,
    online: true,
    avatar: "م",
  },
  {
    id: 4,
    name: "صيدلية الشفاء",
    specialty: "صيدلية",
    lastMessage: "طلبك في الطريق إليك",
    time: "منذ يومين",
    unread: 0,
    online: false,
    avatar: "ص",
    read: true,
  },
  {
    id: 5,
    name: "الدعم الفني",
    specialty: "خدمة العملاء",
    lastMessage: "نحن سعداء بمساعدتك، هل لديك أي استفسار آخر؟",
    time: "منذ 3 أيام",
    unread: 0,
    online: true,
    avatar: "د",
    read: true,
  },
];

const Messages = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.includes(searchQuery) || conv.specialty.includes(searchQuery)
  );

  return (
    <PatientLayout>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-xl">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground">الرسائل</h1>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث في المحادثات..."
              className="pr-10 rounded-xl bg-muted border-0"
            />
          </div>
        </div>
      </div>

      <div className="p-4">
        {filteredConversations.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">لا توجد محادثات</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredConversations.map((conv, index) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/patient/chat/${conv.id}`}>
                  <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex gap-3">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                          {conv.avatar}
                        </div>
                        {conv.online && (
                          <span className="absolute bottom-0 left-0 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-foreground truncate">{conv.name}</h4>
                            <p className="text-xs text-muted-foreground">{conv.specialty}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-muted-foreground">{conv.time}</span>
                            {conv.unread > 0 && (
                              <span className="w-5 h-5 bg-primary rounded-full text-primary-foreground text-xs flex items-center justify-center">
                                {conv.unread}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {conv.read && (
                            <CheckCheck className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                          <p className="text-sm text-muted-foreground truncate">
                            {conv.lastMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PatientLayout>
  );
};

export default Messages;
