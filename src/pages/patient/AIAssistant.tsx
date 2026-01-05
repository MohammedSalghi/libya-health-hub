import { useState, useRef, useEffect } from "react";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Bot, Send, Stethoscope, Pill, Apple, Activity, 
  Sparkles, FileText, AlertTriangle, TrendingUp,
  Heart, Shield, Bell, ChevronDown, ChevronUp,
  TestTube, Calendar, Info, CheckCircle, XCircle,
  Clock, User, Lightbulb, BookOpen, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMedicalAIStore } from "@/stores/medicalAIStore";
import { useEnhancedFeaturesStore } from "@/stores/enhancedFeaturesStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MEDICAL_DISCLAIMERS } from "@/types/medicalAI";

// Quick Actions
const quickActions = [
  { 
    id: 'labs', 
    icon: TestTube, 
    label: "تحليل نتائجي", 
    color: "bg-blue-500/10 text-blue-600",
    prompt: "أريد تحليل نتائج تحاليلي الأخيرة"
  },
  { 
    id: 'symptoms', 
    icon: Stethoscope, 
    label: "فحص أعراض", 
    color: "bg-purple-500/10 text-purple-600",
    prompt: "أشعر ببعض الأعراض وأريد فهمها"
  },
  { 
    id: 'medications', 
    icon: Pill, 
    label: "أدويتي", 
    color: "bg-green-500/10 text-green-600",
    prompt: "أريد مساعدة في إدارة أدويتي"
  },
  { 
    id: 'nutrition', 
    icon: Apple, 
    label: "نصائح غذائية", 
    color: "bg-orange-500/10 text-orange-600",
    prompt: "أريد نصائح غذائية مخصصة لحالتي"
  },
  { 
    id: 'chronic', 
    icon: Activity, 
    label: "متابعة مزمنة", 
    color: "bg-red-500/10 text-red-600",
    prompt: "أريد متابعة حالتي المزمنة"
  },
  { 
    id: 'summary', 
    icon: FileText, 
    label: "ملخص صحي", 
    color: "bg-teal-500/10 text-teal-600",
    prompt: "أريد ملخصاً عن حالتي الصحية"
  },
];

const AIAssistantPage = () => {
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [consentDialogOpen, setConsentDialogOpen] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const {
    currentConversation,
    isProcessing,
    healthAlerts,
    healthRisks,
    labResults,
    lifestyleRecommendations,
    hasUserConsented,
    startNewConversation,
    processUserMessage,
    refreshHealthData,
    dismissAlert,
    setUserConsent
  } = useMedicalAIStore();

  const { chronicConditions, medicationReminders } = useEnhancedFeaturesStore();

  // Initialize conversation and health data
  useEffect(() => {
    if (!currentConversation) {
      startNewConversation();
    }
    
    // Refresh health data
    refreshHealthData(
      chronicConditions.map(c => c.name),
      medicationReminders.map(m => ({
        name: m.medicationName,
        remainingQuantity: m.remainingQuantity,
        refillThreshold: m.refillThreshold
      }))
    );
  }, []);

  // Check consent
  useEffect(() => {
    if (!hasUserConsented) {
      setConsentDialogOpen(true);
    }
  }, [hasUserConsented]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    
    const userMessage = input;
    setInput("");
    setShowQuickActions(false);
    
    await processUserMessage(userMessage);
  };

  const handleQuickAction = async (prompt: string) => {
    setInput("");
    setShowQuickActions(false);
    await processUserMessage(prompt);
  };

  const handleActionButton = (action: string) => {
    switch (action) {
      case 'book_appointment':
      case 'book_doctor':
        navigate('/patient/search');
        break;
      case 'view_all_labs':
        setActiveTab('labs');
        break;
      case 'view_medications':
        navigate('/patient/medication-reminder');
        break;
      case 'set_reminder':
        navigate('/patient/medication-reminder');
        break;
      case 'call_ambulance':
        navigate('/patient/ambulance');
        break;
      default:
        toast.info('سيتم إضافة هذه الميزة قريباً');
    }
  };

  const handleConsent = (accepted: boolean) => {
    setUserConsent(accepted);
    setConsentDialogOpen(false);
    if (!accepted) {
      navigate('/patient');
      toast.info('يمكنك استخدام المساعد لاحقاً بعد الموافقة');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      normal: { color: 'bg-green-500/10 text-green-600', label: 'طبيعي' },
      low: { color: 'bg-yellow-500/10 text-yellow-600', label: 'منخفض' },
      high: { color: 'bg-orange-500/10 text-orange-600', label: 'مرتفع' },
      critical_low: { color: 'bg-red-500/10 text-red-600', label: 'منخفض جداً' },
      critical_high: { color: 'bg-red-500/10 text-red-600', label: 'مرتفع جداً' },
    };
    const config = statusConfig[status] || statusConfig.normal;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getTrendIcon = (trend?: string) => {
    if (trend === 'improving') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'worsening') return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
    return null;
  };

  return (
    <PatientLayout>
      <div className="flex flex-col h-[calc(100vh-5rem)]">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-l from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Bot className="h-6 w-6 text-primary-foreground" />
              </motion.div>
              <div>
                <h1 className="text-lg font-bold text-foreground">المساعد الطبي الذكي</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>مرافقك الصحي الموثوق</span>
                </p>
              </div>
            </div>
            
            {/* Alerts indicator */}
            {healthAlerts.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="relative"
                onClick={() => setActiveTab('alerts')}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {healthAlerts.length}
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-2 grid grid-cols-4">
            <TabsTrigger value="chat" className="text-xs">
              <Bot className="h-4 w-4 ml-1" />
              المحادثة
            </TabsTrigger>
            <TabsTrigger value="labs" className="text-xs">
              <TestTube className="h-4 w-4 ml-1" />
              تحاليلي
            </TabsTrigger>
            <TabsTrigger value="risks" className="text-xs">
              <Shield className="h-4 w-4 ml-1" />
              المخاطر
            </TabsTrigger>
            <TabsTrigger value="alerts" className="text-xs relative">
              <Bell className="h-4 w-4 ml-1" />
              تنبيهات
              {healthAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {healthAlerts.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="flex-1 flex flex-col m-0 p-0">
            {/* Quick Actions */}
            <AnimatePresence>
              {showQuickActions && currentConversation?.messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 border-b bg-muted/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">كيف يمكنني مساعدتك؟</span>
                    <Button variant="ghost" size="sm" onClick={() => setShowQuickActions(false)}>
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        className="justify-start gap-2 h-auto py-3 hover:scale-[1.02] transition-transform"
                        onClick={() => handleQuickAction(action.prompt)}
                      >
                        <div className={`p-2 rounded-xl ${action.color}`}>
                          <action.icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm">{action.label}</span>
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Collapsed Quick Actions Button */}
            {!showQuickActions && (
              <div className="px-4 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground"
                  onClick={() => setShowQuickActions(true)}
                >
                  <ChevronDown className="h-4 w-4 ml-1" />
                  إظهار الإجراءات السريعة
                </Button>
              </div>
            )}

            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {currentConversation?.messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[90%] ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                            : "bg-muted rounded-2xl rounded-tl-sm"
                        }`}
                      >
                        <div className="p-4">
                          {/* Message type indicator */}
                          {message.messageType && message.messageType !== 'text' && message.role === 'assistant' && (
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
                              {message.messageType === 'lab_analysis' && (
                                <>
                                  <TestTube className="h-4 w-4 text-blue-500" />
                                  <span className="text-xs font-medium">تحليل النتائج</span>
                                </>
                              )}
                              {message.messageType === 'risk_assessment' && (
                                <>
                                  <Shield className="h-4 w-4 text-orange-500" />
                                  <span className="text-xs font-medium">تقييم الأعراض</span>
                                </>
                              )}
                              {message.messageType === 'health_tip' && (
                                <>
                                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                                  <span className="text-xs font-medium">نصائح صحية</span>
                                </>
                              )}
                              {message.messageType === 'medication_info' && (
                                <>
                                  <Pill className="h-4 w-4 text-green-500" />
                                  <span className="text-xs font-medium">معلومات الأدوية</span>
                                </>
                              )}
                            </div>
                          )}

                          {/* Message content with formatting */}
                          <div className="text-sm whitespace-pre-wrap leading-relaxed">
                            {message.content.split('\n').map((line, i) => {
                              // Format bold text
                              if (line.includes('**')) {
                                const parts = line.split('**');
                                return (
                                  <p key={i} className="my-1">
                                    {parts.map((part, j) => 
                                      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                                    )}
                                  </p>
                                );
                              }
                              // Format bullet points
                              if (line.startsWith('•') || line.startsWith('-')) {
                                return <p key={i} className="my-0.5 pr-2">{line}</p>;
                              }
                              // Format headers with icons
                              if (line.includes('✅') || line.includes('🟢') || line.includes('🟡') || line.includes('🔴')) {
                                return <p key={i} className="my-2 font-medium">{line}</p>;
                              }
                              return <p key={i} className="my-1">{line}</p>;
                            })}
                          </div>

                          {/* Suggested actions */}
                          {message.suggestedActions && message.suggestedActions.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/50">
                              {message.suggestedActions.map((action, i) => (
                                <Button
                                  key={i}
                                  variant="secondary"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => handleActionButton(action.action)}
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-end"
                  >
                    <div className="bg-muted p-4 rounded-2xl rounded-tl-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs text-muted-foreground">جاري التحليل...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اكتب سؤالك الصحي..."
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  disabled={isProcessing}
                />
                <Button 
                  onClick={handleSend} 
                  size="icon"
                  disabled={isProcessing || !input.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                <Info className="h-3 w-3 inline ml-1" />
                المعلومات للتوعية فقط ولا تُغني عن استشارة الطبيب
              </p>
            </div>
          </TabsContent>

          {/* Labs Tab */}
          <TabsContent value="labs" className="flex-1 m-0 p-4">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                <Alert className="bg-blue-500/10 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    آخر تحديث للتحاليل: 15 يناير 2024
                  </AlertDescription>
                </Alert>

                {/* Lab Results Summary */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">ملخص التحاليل</h3>
                      <div className="flex gap-2">
                        <Badge className="bg-green-500/10 text-green-600">
                          {labResults.filter(l => l.status === 'normal').length} طبيعي
                        </Badge>
                        <Badge className="bg-orange-500/10 text-orange-600">
                          {labResults.filter(l => l.status !== 'normal').length} يحتاج متابعة
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {labResults.map((lab) => (
                        <motion.div
                          key={lab.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              lab.status === 'normal' ? 'bg-green-500/10' : 'bg-orange-500/10'
                            }`}>
                              {lab.status === 'normal' ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-orange-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{lab.nameAr}</p>
                              <p className="text-xs text-muted-foreground">
                                {lab.value} {lab.unit}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(lab.trend)}
                            {getStatusBadge(lab.status)}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Disclaimer */}
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    {MEDICAL_DISCLAIMERS.labResult}
                  </AlertDescription>
                </Alert>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Risks Tab */}
          <TabsContent value="risks" className="flex-1 m-0 p-4">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                {healthRisks.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">لا توجد مخاطر عالية</h3>
                      <p className="text-sm text-muted-foreground">
                        بناءً على نتائجك الحالية، لم يتم تحديد مخاطر صحية تستدعي الاهتمام العاجل
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  healthRisks.map((risk) => (
                    <motion.div
                      key={risk.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className={`border-r-4 ${
                        risk.level === 'high' ? 'border-r-red-500' :
                        risk.level === 'medium' ? 'border-r-orange-500' :
                        'border-r-yellow-500'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Shield className={`h-5 w-5 ${
                                risk.level === 'high' ? 'text-red-500' :
                                risk.level === 'medium' ? 'text-orange-500' :
                                'text-yellow-500'
                              }`} />
                              <h3 className="font-semibold">{risk.title}</h3>
                            </div>
                            <Badge className={
                              risk.level === 'high' ? 'bg-red-500/10 text-red-600' :
                              risk.level === 'medium' ? 'bg-orange-500/10 text-orange-600' :
                              'bg-yellow-500/10 text-yellow-600'
                            }>
                              {risk.level === 'high' ? 'خطورة عالية' :
                               risk.level === 'medium' ? 'خطورة متوسطة' : 'خطورة منخفضة'}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {risk.description}
                          </p>

                          <div className="space-y-2">
                            <p className="text-xs font-medium">التوصيات:</p>
                            <div className="flex flex-wrap gap-2">
                              {risk.recommendations.slice(0, 3).map((rec, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {rec}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {risk.requiresUrgentAttention && (
                            <Alert className="mt-3 bg-red-500/10 border-red-200">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <AlertDescription className="text-red-800 text-xs">
                                يُنصح بمراجعة الطبيب في أقرب وقت
                              </AlertDescription>
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}

                {/* Lifestyle Recommendations */}
                {lifestyleRecommendations.length > 0 && (
                  <>
                    <h3 className="font-semibold mt-6 mb-3 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      نصائح مخصصة لك
                    </h3>
                    {lifestyleRecommendations.slice(0, 3).map((rec) => (
                      <Card key={rec.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {rec.category === 'nutrition' && <Apple className="h-4 w-4 text-green-500" />}
                            {rec.category === 'exercise' && <Activity className="h-4 w-4 text-blue-500" />}
                            {rec.category === 'sleep' && <Clock className="h-4 w-4 text-purple-500" />}
                            <h4 className="font-medium text-sm">{rec.title}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
                          <ul className="text-xs space-y-1">
                            {rec.tips.slice(0, 2).map((tip, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-primary">•</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                )}

                {/* Disclaimer */}
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    {MEDICAL_DISCLAIMERS.general}
                  </AlertDescription>
                </Alert>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="flex-1 m-0 p-4">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                {healthAlerts.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">لا توجد تنبيهات</h3>
                      <p className="text-sm text-muted-foreground">
                        ستظهر هنا أي تنبيهات صحية مهمة
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  healthAlerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Card className={`border-r-4 ${
                        alert.type === 'critical' ? 'border-r-red-500' :
                        alert.type === 'urgent' ? 'border-r-orange-500' :
                        alert.type === 'warning' ? 'border-r-yellow-500' :
                        'border-r-blue-500'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`p-2 rounded-full ${
                                alert.type === 'critical' ? 'bg-red-500/10' :
                                alert.type === 'urgent' ? 'bg-orange-500/10' :
                                alert.type === 'warning' ? 'bg-yellow-500/10' :
                                'bg-blue-500/10'
                              }`}>
                                {alert.type === 'critical' || alert.type === 'urgent' ? (
                                  <AlertTriangle className={`h-5 w-5 ${
                                    alert.type === 'critical' ? 'text-red-600' : 'text-orange-600'
                                  }`} />
                                ) : (
                                  <Info className={`h-5 w-5 ${
                                    alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                                  }`} />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">{alert.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {alert.message}
                                </p>
                                {alert.actionRequired && (
                                  <Badge variant="outline" className="mt-2 text-xs">
                                    {alert.actionRequired}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {alert.dismissible && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => dismissAlert(alert.id)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Consent Dialog */}
      <Dialog open={consentDialogOpen} onOpenChange={setConsentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              موافقتك مطلوبة
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              المساعد الطبي الذكي سيقرأ ملفك الصحي (تحاليل، أدوية، حالات مزمنة) لتقديم نصائح مخصصة لك.
            </p>
            
            <Alert className="bg-blue-500/10 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                <strong>ماذا يفعل المساعد:</strong>
                <ul className="mt-2 space-y-1">
                  <li>• يقرأ بياناتك الصحية (قراءة فقط)</li>
                  <li>• يُحلل النتائج ويشرحها بلغة مبسطة</li>
                  <li>• يُقدم نصائح توعوية عامة</li>
                  <li>• يُذكّرك بأدويتك ومواعيدك</li>
                </ul>
              </AlertDescription>
            </Alert>

            <Alert className="bg-orange-500/10 border-orange-200">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 text-sm">
                <strong>ماذا لا يفعل:</strong>
                <ul className="mt-2 space-y-1">
                  <li>• لا يُشخّص الأمراض</li>
                  <li>• لا يصف أو يُغيّر الأدوية</li>
                  <li>• لا يحل محل الطبيب</li>
                </ul>
              </AlertDescription>
            </Alert>

            <p className="text-xs text-muted-foreground">
              بياناتك مشفرة ومحمية. يمكنك إلغاء الموافقة في أي وقت من الإعدادات.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => handleConsent(false)}>
              لاحقاً
            </Button>
            <Button onClick={() => handleConsent(true)}>
              <CheckCircle className="h-4 w-4 ml-2" />
              أوافق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PatientLayout>
  );
};

export default AIAssistantPage;
