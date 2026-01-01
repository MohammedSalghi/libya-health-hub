import { useState, useMemo } from "react";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, CheckCircle, AlertTriangle, Clock, MessageSquare,
  ThumbsUp, Minus, ThumbsDown, Calendar, User, Stethoscope,
  Bell, ArrowUp, Send, ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEnhancedFeaturesStore } from "@/stores/enhancedFeaturesStore";
import { useHealthcareStore } from "@/stores/healthcareStore";
import { PostVisitFollowUp } from "@/types/enhancedFeatures";
import { toast } from "sonner";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

const FollowUpPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<PostVisitFollowUp | null>(null);
  const [patientNotes, setPatientNotes] = useState("");

  const {
    followUps,
    followUpMessages,
    submitPatientResponse,
    addFollowUpMessage
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
        message: 'تم إرسال تنبيه عاجل للطبيب بشأن حالتك',
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
        message: 'قد يتواصل معك الطبيب لمتابعة حالتك',
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
        message: 'سعداء بتحسن حالتك! نتمنى لك دوام الصحة',
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
        return <Badge className="bg-red-100 text-red-700">يحتاج متابعة</Badge>;
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

  const FollowUpCard = ({ followUp, showAction = false }: { followUp: PostVisitFollowUp; showAction?: boolean }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium">{followUp.doctorName}</div>
              <p className="text-sm text-muted-foreground">
                {format(new Date(followUp.visitDate), 'd MMMM yyyy', { locale: ar })}
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
          <p className="text-sm text-muted-foreground mb-3">
            "{followUp.patientNotes}"
          </p>
        )}

        {followUp.doctorAction && (
          <div className="p-3 bg-primary/5 rounded-lg mb-3">
            <p className="text-sm font-medium mb-1">رد الطبيب:</p>
            <p className="text-sm text-muted-foreground">
              {followUp.doctorAction === 'no_action' && 'لا يلزم إجراء'}
              {followUp.doctorAction === 'message_sent' && 'تم إرسال رسالة'}
              {followUp.doctorAction === 'appointment_scheduled' && 'تم حجز موعد متابعة'}
              {followUp.doctorAction === 'treatment_adjusted' && 'تم تعديل خطة العلاج'}
              {followUp.doctorAction === 'urgent_review' && 'مراجعة عاجلة مطلوبة'}
            </p>
            {followUp.doctorNotes && (
              <p className="text-sm text-muted-foreground mt-2">
                {followUp.doctorNotes}
              </p>
            )}
          </div>
        )}

        {followUp.nextFollowUpDate && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <Calendar className="h-4 w-4" />
            المتابعة القادمة: {format(new Date(followUp.nextFollowUpDate), 'd MMMM yyyy', { locale: ar })}
          </div>
        )}

        {showAction && followUp.status === 'pending_response' && (
          <Button 
            className="w-full mt-3"
            onClick={() => openResponseDialog(followUp)}
          >
            <MessageSquare className="h-4 w-4 ml-2" />
            الإجابة على المتابعة
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <PatientLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">متابعة ما بعد الزيارة</h1>
          </div>
        </div>

        {/* Pending Follow-ups Alert */}
        {categorizedFollowUps.pending.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Bell className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-yellow-800">
                      {categorizedFollowUps.pending.length} متابعة تحتاج ردك
                    </p>
                    <p className="text-sm text-yellow-600">
                      كيف حالتك بعد زيارتك الأخيرة؟
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
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
                  نتابع معك بعد كل زيارة للتأكد من تحسن حالتك الصحية
                </p>
              </div>
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
    </PatientLayout>
  );
};

export default FollowUpPage;