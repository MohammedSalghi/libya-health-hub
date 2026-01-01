import { useState, useMemo } from "react";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, CheckCircle, AlertTriangle, Clock, MessageSquare,
  ThumbsUp, Minus, ThumbsDown, Calendar, User, Stethoscope,
  Bell, ArrowUp, Send, ChevronLeft, Heart, Thermometer,
  Droplets, Scale, TrendingUp, FileText, TestTube, Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEnhancedFeaturesStore } from "@/stores/enhancedFeaturesStore";
import { useHealthcareStore } from "@/stores/healthcareStore";
import { PostVisitFollowUp } from "@/types/enhancedFeatures";
import { libyanLabs, libyanClinics } from "@/data/libyaHealthcareData";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";
import { ar } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

// القياسات الحيوية
interface VitalReading {
  type: 'blood_pressure' | 'heart_rate' | 'temperature' | 'blood_sugar' | 'weight';
  value: string;
  unit: string;
  date: string;
  isNormal: boolean;
}

const FollowUpPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<PostVisitFollowUp | null>(null);
  const [patientNotes, setPatientNotes] = useState("");
  const [vitalsDialogOpen, setVitalsDialogOpen] = useState(false);
  const [vitalReadings, setVitalReadings] = useState<VitalReading[]>([]);
  const [newVital, setNewVital] = useState({ type: '', value: '' });

  const {
    followUps,
    followUpMessages,
    familyMembers,
    submitPatientResponse,
    addFollowUpMessage,
    createFollowUp
  } = useEnhancedFeaturesStore();

  const { addNotification, userId, appointments } = useHealthcareStore();

  // Categorize follow-ups
  const categorizedFollowUps = useMemo(() => {
    return {
      pending: followUps.filter(f => f.status === 'pending_response'),
      active: followUps.filter(f => ['improved', 'same', 'worsened', 'escalated'].includes(f.status)),
      completed: followUps.filter(f => ['completed', 'no_response'].includes(f.status))
    };
  }, [followUps]);

  // إحصائيات المتابعة
  const followUpStats = useMemo(() => {
    const total = followUps.length;
    const completed = followUps.filter(f => f.status === 'completed').length;
    const improved = followUps.filter(f => f.patientResponse === 'improved').length;
    const worsened = followUps.filter(f => f.patientResponse === 'worsened').length;

    return {
      total,
      completed,
      improved,
      worsened,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      improvementRate: total > 0 ? (improved / total) * 100 : 0
    };
  }, [followUps]);

  // متابعات أفراد العائلة
  const familyFollowUps = useMemo(() => {
    return familyMembers.map(member => ({
      member,
      followUps: followUps.filter(f => f.patientId === member.id),
      pendingCount: followUps.filter(f => f.patientId === member.id && f.status === 'pending_response').length
    })).filter(f => f.followUps.length > 0);
  }, [familyMembers, followUps]);

  const handleResponse = (response: 'improved' | 'same' | 'worsened') => {
    if (!selectedFollowUp) return;

    submitPatientResponse(selectedFollowUp.id, response, patientNotes);

    // Trigger appropriate notifications
    if (response === 'worsened') {
      addNotification({
        id: `notif-${Date.now()}`,
        userId,
        type: 'general',
        title: 'تم تنبيه الطبيب',
        message: `تم إرسال تنبيه عاجل للطبيب ${selectedFollowUp.doctorName} بشأن حالتك. سيتم التواصل معك قريباً.`,
        isRead: false,
        createdAt: new Date().toISOString()
      });
      toast.warning('تم تنبيه الطبيب بشأن حالتك');
    } else if (response === 'same') {
      addNotification({
        id: `notif-${Date.now()}`,
        userId,
        type: 'general',
        title: 'تم تسجيل الحالة',
        message: 'قد يتواصل معك الطبيب لمتابعة حالتك أو اقتراح موعد مراجعة.',
        isRead: false,
        createdAt: new Date().toISOString()
      });
      toast.info('تم تسجيل حالتك');
    } else {
      addNotification({
        id: `notif-${Date.now()}`,
        userId,
        type: 'general',
        title: 'حالتك تتحسن',
        message: 'سعداء بتحسن حالتك! نتمنى لك دوام الصحة والعافية.',
        isRead: false,
        createdAt: new Date().toISOString()
      });
      toast.success('سعداء بتحسن حالتك!');
    }

    setResponseDialogOpen(false);
    setSelectedFollowUp(null);
    setPatientNotes("");
  };

  const openResponseDialog = (followUp: PostVisitFollowUp) => {
    setSelectedFollowUp(followUp);
    setResponseDialogOpen(true);
  };

  const addVitalReading = () => {
    if (!newVital.type || !newVital.value) {
      toast.error('الرجاء إكمال البيانات');
      return;
    }

    const vitalInfo: Record<string, { unit: string; normalRange: [number, number] }> = {
      blood_pressure: { unit: 'mmHg', normalRange: [90, 140] },
      heart_rate: { unit: 'نبضة/دقيقة', normalRange: [60, 100] },
      temperature: { unit: '°C', normalRange: [36, 37.5] },
      blood_sugar: { unit: 'mg/dL', normalRange: [70, 140] },
      weight: { unit: 'كجم', normalRange: [0, 200] }
    };

    const info = vitalInfo[newVital.type];
    const numValue = parseFloat(newVital.value.split('/')[0]);
    const isNormal = numValue >= info.normalRange[0] && numValue <= info.normalRange[1];

    const reading: VitalReading = {
      type: newVital.type as VitalReading['type'],
      value: newVital.value,
      unit: info.unit,
      date: new Date().toISOString(),
      isNormal
    };

    setVitalReadings([reading, ...vitalReadings]);

    if (!isNormal) {
      addNotification({
        id: `notif-${Date.now()}`,
        userId,
        type: 'general',
        title: 'قراءة غير طبيعية',
        message: `القراءة ${newVital.value} ${info.unit} خارج النطاق الطبيعي. يُنصح بمراجعة الطبيب.`,
        isRead: false,
        createdAt: new Date().toISOString()
      });
      toast.warning('القراءة خارج النطاق الطبيعي');
    } else {
      toast.success('تم تسجيل القراءة');
    }

    setNewVital({ type: '', value: '' });
  };

  const getStatusBadge = (status: PostVisitFollowUp['status']) => {
    switch (status) {
      case 'pending_response':
        return <Badge className="bg-yellow-100 text-yellow-700">في انتظار الرد</Badge>;
      case 'improved':
        return <Badge className="bg-green-100 text-green-700">تحسن</Badge>;
      case 'same':
        return <Badge className="bg-blue-100 text-blue-700">مستقر</Badge>;
      case 'worsened':
      case 'escalated':
        return <Badge className="bg-red-100 text-red-700">يحتاج متابعة عاجلة</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-700">مكتمل</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getResponseIcon = (response?: 'improved' | 'same' | 'worsened') => {
    switch (response) {
      case 'improved':
        return <ThumbsUp className="h-5 w-5 text-green-500" />;
      case 'same':
        return <Minus className="h-5 w-5 text-blue-500" />;
      case 'worsened':
        return <ThumbsDown className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getVitalIcon = (type: string) => {
    switch (type) {
      case 'blood_pressure': return Heart;
      case 'heart_rate': return Activity;
      case 'temperature': return Thermometer;
      case 'blood_sugar': return Droplets;
      case 'weight': return Scale;
      default: return Activity;
    }
  };

  const getVitalLabel = (type: string) => {
    const labels: Record<string, string> = {
      blood_pressure: 'ضغط الدم',
      heart_rate: 'نبض القلب',
      temperature: 'درجة الحرارة',
      blood_sugar: 'سكر الدم',
      weight: 'الوزن'
    };
    return labels[type] || type;
  };

  const FollowUpCard = ({ followUp, showAction = false }: { followUp: PostVisitFollowUp; showAction?: boolean }) => {
    const daysSinceVisit = differenceInDays(new Date(), new Date(followUp.visitDate));
    
    return (
      <Card className={followUp.status === 'escalated' ? 'border-red-300 bg-red-50/50' : ''}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                followUp.status === 'escalated' ? 'bg-red-100' : 'bg-primary/10'
              }`}>
                <Stethoscope className={`h-5 w-5 ${
                  followUp.status === 'escalated' ? 'text-red-600' : 'text-primary'
                }`} />
              </div>
              <div>
                <div className="font-medium">{followUp.doctorName}</div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(followUp.visitDate), 'd MMMM yyyy', { locale: ar })}
                  <span className="mx-2">•</span>
                  منذ {daysSinceVisit} يوم
                </p>
              </div>
            </div>
            {getStatusBadge(followUp.status)}
          </div>

          {followUp.patientResponse && (
            <div className="flex items-center gap-2 mb-3 p-2 bg-muted/50 rounded-lg">
              {getResponseIcon(followUp.patientResponse)}
              <span className="text-sm">
                {followUp.patientResponse === 'improved' && 'تحسنت حالتي'}
                {followUp.patientResponse === 'same' && 'حالتي مستقرة'}
                {followUp.patientResponse === 'worsened' && 'ساءت حالتي'}
              </span>
            </div>
          )}

          {followUp.patientNotes && (
            <p className="text-sm text-muted-foreground mb-3 p-2 bg-muted/30 rounded">
              "{followUp.patientNotes}"
            </p>
          )}

          {followUp.doctorAction && (
            <div className="p-3 bg-primary/5 rounded-lg mb-3">
              <p className="text-sm font-medium mb-1 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                رد الطبيب:
              </p>
              <p className="text-sm text-muted-foreground">
                {followUp.doctorAction === 'no_action' && 'لا يلزم إجراء إضافي'}
                {followUp.doctorAction === 'message_sent' && 'تم إرسال رسالة متابعة'}
                {followUp.doctorAction === 'appointment_scheduled' && 'تم حجز موعد متابعة'}
                {followUp.doctorAction === 'treatment_adjusted' && 'تم تعديل خطة العلاج'}
                {followUp.doctorAction === 'urgent_review' && '⚠️ مراجعة عاجلة مطلوبة'}
              </p>
              {followUp.doctorNotes && (
                <p className="text-sm text-muted-foreground mt-2 border-t pt-2">
                  {followUp.doctorNotes}
                </p>
              )}
            </div>
          )}

          {followUp.nextFollowUpDate && (
            <div className="flex items-center gap-2 text-sm text-primary mb-3">
              <Calendar className="h-4 w-4" />
              المتابعة القادمة: {format(new Date(followUp.nextFollowUpDate), 'd MMMM yyyy', { locale: ar })}
            </div>
          )}

          {showAction && followUp.status === 'pending_response' && (
            <Button 
              className="w-full"
              onClick={() => openResponseDialog(followUp)}
            >
              <MessageSquare className="h-4 w-4 ml-2" />
              الإجابة على المتابعة
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <PatientLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">متابعة ما بعد الزيارة</h1>
          </div>
          <Button variant="outline" onClick={() => setVitalsDialogOpen(true)}>
            <Heart className="h-4 w-4 ml-2" />
            القياسات
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-700">نسبة التحسن</span>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {followUpStats.improvementRate.toFixed(0)}%
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-700">متابعات مكتملة</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {followUpStats.completed}/{followUpStats.total}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Follow-ups Alert */}
        {categorizedFollowUps.pending.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert className="border-yellow-200 bg-yellow-50">
              <Bell className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <span className="font-medium">
                  {categorizedFollowUps.pending.length} متابعة تحتاج ردك
                </span>
                <p className="text-sm mt-1">كيف حالتك بعد زيارتك الأخيرة؟ ردك يساعد الطبيب في متابعة حالتك.</p>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Family Follow-ups */}
        {familyFollowUps.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-5 w-5" />
                متابعات أفراد العائلة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {familyFollowUps.map(({ member, pendingCount }) => (
                <div key={member.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {member.name.charAt(0)}
                    </div>
                    <span className="font-medium">{member.name}</span>
                  </div>
                  {pendingCount > 0 && (
                    <Badge className="bg-yellow-100 text-yellow-700">
                      {pendingCount} معلقة
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">متابعة مستمرة لصحتك</h3>
                <p className="text-sm text-muted-foreground">
                  نتابع معك بعد كل زيارة أو فحص مخبري للتأكد من تحسن حالتك. 
                  يمكنك أيضاً تسجيل قياساتك الحيوية لمتابعة أفضل.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Libyan Labs Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              مختبرات شريكة للمتابعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {libyanLabs.slice(0, 4).map(lab => (
                <div key={lab.id} className="flex-shrink-0 p-3 border rounded-lg min-w-[200px]">
                  <p className="font-medium text-sm">{lab.name}</p>
                  <p className="text-xs text-muted-foreground">{lab.city}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-yellow-600">{lab.rating}⭐</span>
                    {lab.offersHomeCollection && (
                      <Badge variant="outline" className="text-xs">سحب منزلي</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="pending" className="relative">
              في الانتظار
              {categorizedFollowUps.pending.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                  {categorizedFollowUps.pending.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="active">نشطة</TabsTrigger>
            <TabsTrigger value="completed">مكتملة</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-4">
            {categorizedFollowUps.pending.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">لا توجد متابعات معلقة</h3>
                  <p className="text-sm text-muted-foreground">
                    ستظهر هنا متابعات ما بعد الزيارة عند اكتمال مواعيدك
                  </p>
                </CardContent>
              </Card>
            ) : (
              <AnimatePresence>
                {categorizedFollowUps.pending.map((followUp, index) => (
                  <motion.div
                    key={followUp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FollowUpCard followUp={followUp} showAction />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4 mt-4">
            {categorizedFollowUps.active.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">لا توجد متابعات نشطة</p>
                </CardContent>
              </Card>
            ) : (
              categorizedFollowUps.active.map((followUp, index) => (
                <motion.div
                  key={followUp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FollowUpCard followUp={followUp} />
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-4">
            {categorizedFollowUps.completed.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">لا توجد متابعات مكتملة</p>
                </CardContent>
              </Card>
            ) : (
              categorizedFollowUps.completed.map((followUp, index) => (
                <motion.div
                  key={followUp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FollowUpCard followUp={followUp} />
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Response Dialog */}
      <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>كيف حالتك بعد الزيارة؟</DialogTitle>
          </DialogHeader>
          
          {selectedFollowUp && (
            <div className="space-y-4">
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">{selectedFollowUp.doctorName}</div>
                      <p className="text-sm text-muted-foreground">
                        الزيارة: {format(new Date(selectedFollowUp.visitDate), 'd MMMM yyyy', { locale: ar })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">اختر ما يصف حالتك الحالية:</p>
                
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-green-50 hover:border-green-300"
                    onClick={() => handleResponse('improved')}
                  >
                    <ThumbsUp className="h-6 w-6 text-green-500" />
                    <span className="text-sm">تحسنت</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-blue-50 hover:border-blue-300"
                    onClick={() => handleResponse('same')}
                  >
                    <Minus className="h-6 w-6 text-blue-500" />
                    <span className="text-sm">كما هي</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-red-50 hover:border-red-300"
                    onClick={() => handleResponse('worsened')}
                  >
                    <ThumbsDown className="h-6 w-6 text-red-500" />
                    <span className="text-sm">ساءت</span>
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">ملاحظات إضافية (اختياري):</p>
                <Textarea
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  placeholder="أخبرنا المزيد عن حالتك..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setResponseDialogOpen(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vitals Dialog */}
      <Dialog open={vitalsDialogOpen} onOpenChange={setVitalsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              القياسات الحيوية
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Add New Reading */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label>إضافة قراءة جديدة</Label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newVital.type}
                    onChange={(e) => setNewVital({ ...newVital, type: e.target.value })}
                  >
                    <option value="">اختر القياس</option>
                    <option value="blood_pressure">ضغط الدم</option>
                    <option value="heart_rate">نبض القلب</option>
                    <option value="temperature">درجة الحرارة</option>
                    <option value="blood_sugar">سكر الدم</option>
                    <option value="weight">الوزن</option>
                  </select>
                  <Input
                    value={newVital.value}
                    onChange={(e) => setNewVital({ ...newVital, value: e.target.value })}
                    placeholder={newVital.type === 'blood_pressure' ? '120/80' : 'القيمة'}
                    dir="ltr"
                  />
                </div>
                <Button className="w-full" onClick={addVitalReading}>
                  <Activity className="h-4 w-4 ml-2" />
                  إضافة القراءة
                </Button>
              </CardContent>
            </Card>

            {/* Previous Readings */}
            {vitalReadings.length > 0 && (
              <div className="space-y-2">
                <Label>القراءات السابقة</Label>
                {vitalReadings.map((reading, i) => {
                  const Icon = getVitalIcon(reading.type);
                  return (
                    <Card key={i} className={!reading.isNormal ? 'border-red-200 bg-red-50' : ''}>
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 ${!reading.isNormal ? 'text-red-500' : 'text-primary'}`} />
                          <div>
                            <p className="font-medium">{getVitalLabel(reading.type)}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(reading.date), 'd MMM, HH:mm', { locale: ar })}
                            </p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className={`font-bold ${!reading.isNormal ? 'text-red-600' : ''}`}>
                            {reading.value}
                          </p>
                          <p className="text-xs text-muted-foreground">{reading.unit}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setVitalsDialogOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PatientLayout>
  );
};

export default FollowUpPage;
