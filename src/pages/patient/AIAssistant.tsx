import { useState } from "react";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bot, Send, Stethoscope, Pill, Apple, Activity, 
  ChevronLeft, Sparkles, MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const quickActions = [
  { icon: Stethoscope, label: "فحص الأعراض", color: "bg-blue-100 text-blue-600" },
  { icon: Pill, label: "تذكير الأدوية", color: "bg-green-100 text-green-600" },
  { icon: Apple, label: "نصائح التغذية", color: "bg-orange-100 text-orange-600" },
  { icon: Activity, label: "متابعة المزمنة", color: "bg-purple-100 text-purple-600" },
];

interface Message {
  id: number;
  type: "user" | "bot";
  text: string;
}

const AIAssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, type: "bot", text: "مرحباً! أنا مساعدك الصحي الذكي. كيف يمكنني مساعدتك اليوم؟" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      text: input
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        type: "bot",
        text: "شكراً على سؤالك. بناءً على الأعراض التي وصفتها، أنصحك بزيارة طبيب باطنية. هل تريدني أن أساعدك في حجز موعد؟"
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    const prompts: Record<string, string> = {
      "فحص الأعراض": "أريد فحص بعض الأعراض التي أشعر بها",
      "تذكير الأدوية": "أريد إعداد تذكير لأدويتي",
      "نصائح التغذية": "أريد نصائح غذائية مناسبة لحالتي",
      "متابعة المزمنة": "أريد متابعة حالتي المزمنة"
    };
    setInput(prompts[action] || action);
  };

  return (
    <PatientLayout>
      <div className="flex flex-col h-[calc(100vh-5rem)]">
        {/* Header */}
        <div className="p-4 border-b bg-background">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-full">
              <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">المساعد الصحي الذكي</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                مدعوم بالذكاء الاصطناعي
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b bg-muted/30">
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="justify-start gap-2 h-auto py-3"
                onClick={() => handleQuickAction(action.label)}
              >
                <div className={`p-1.5 rounded-full ${action.color}`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <span className="text-sm">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.type === "user" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted rounded-tl-none"
                  }`}
                >
                  {message.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <div className="bg-muted p-3 rounded-2xl rounded-tl-none">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-100" />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-background">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب رسالتك..."
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend} size="icon">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default AIAssistantPage;
