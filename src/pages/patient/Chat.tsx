import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft,
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Image,
  Mic,
  Check,
  CheckCheck
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const doctor = {
  name: "د. أحمد محمد العزابي",
  specialty: "طب القلب",
  online: true,
  avatar: "أ",
};

const initialMessages = [
  {
    id: 1,
    text: "السلام عليكم دكتور",
    time: "10:00 ص",
    sent: true,
    read: true,
  },
  {
    id: 2,
    text: "وعليكم السلام، كيف حالك؟",
    time: "10:02 ص",
    sent: false,
  },
  {
    id: 3,
    text: "الحمد لله، أردت الاستفسار عن نتائج الفحوصات",
    time: "10:05 ص",
    sent: true,
    read: true,
  },
  {
    id: 4,
    text: "نعم، رأيت النتائج. كل شيء طبيعي ولله الحمد. فقط هناك ارتفاع طفيف في ضغط الدم، أنصحك بتقليل الملح والمتابعة",
    time: "10:10 ص",
    sent: false,
  },
  {
    id: 5,
    text: "شكراً لك دكتور، هل أحتاج لأي أدوية؟",
    time: "10:15 ص",
    sent: true,
    read: true,
  },
  {
    id: 6,
    text: "شكراً لك، سأراجع نتائج الفحوصات وأرد عليك",
    time: "10:30 ص",
    sent: false,
  },
];

const Chat = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      text: newMessage,
      time: new Date().toLocaleTimeString("ar-LY", { hour: "2-digit", minute: "2-digit" }),
      sent: true,
      read: false,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="p-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-xl">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              {doctor.avatar}
            </div>
            {doctor.online && (
              <span className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-foreground">{doctor.name}</h2>
            <p className="text-xs text-muted-foreground">
              {doctor.online ? "متصل الآن" : "غير متصل"}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-muted rounded-xl">
              <Phone className="w-5 h-5 text-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-xl">
              <Video className="w-5 h-5 text-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-xl">
              <MoreVertical className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex ${message.sent ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.sent
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-muted text-foreground rounded-tl-none"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <div className={`flex items-center gap-1 mt-1 ${message.sent ? "justify-start" : "justify-end"}`}>
                <span className={`text-[10px] ${message.sent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {message.time}
                </span>
                {message.sent && (
                  message.read ? (
                    <CheckCheck className="w-3 h-3 text-primary-foreground/70" />
                  ) : (
                    <Check className="w-3 h-3 text-primary-foreground/70" />
                  )
                )}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-card border-t border-border p-4">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-muted rounded-xl text-muted-foreground">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-muted rounded-xl text-muted-foreground">
            <Image className="w-5 h-5" />
          </button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="اكتب رسالتك..."
            className="flex-1 rounded-xl bg-muted border-0"
          />
          {newMessage.trim() ? (
            <Button size="icon" onClick={handleSend} className="rounded-xl">
              <Send className="w-5 h-5" />
            </Button>
          ) : (
            <button className="p-2 hover:bg-muted rounded-xl text-muted-foreground">
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
