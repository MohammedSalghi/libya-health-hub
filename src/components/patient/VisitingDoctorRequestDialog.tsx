// Visiting/International Doctor Request Dialog
import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Globe, Clock, CheckCircle, Loader2, 
  AlertCircle, Calendar, User
} from "lucide-react";
import { Doctor } from "@/types/healthcare";

type RequestStatus = 'idle' | 'submitting' | 'pending' | 'approved' | 'rejected';

interface VisitingDoctorRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSubmitted: (requestId: string) => void;
  onRequestApproved: () => void;
  doctor: Doctor;
  date: string;
  time: string;
}

export const VisitingDoctorRequestDialog = ({
  isOpen,
  onClose,
  onRequestSubmitted,
  onRequestApproved,
  doctor,
  date,
  time
}: VisitingDoctorRequestDialogProps) => {
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [notes, setNotes] = useState('');
  const [requestId, setRequestId] = useState('');

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-LY', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleSubmitRequest = async () => {
    setStatus('submitting');

    // Simulate request submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newRequestId = `VDR-${Date.now()}`;
    setRequestId(newRequestId);
    setStatus('pending');
    onRequestSubmitted(newRequestId);

    // Simulate admin approval after 5 seconds (for demo)
    setTimeout(() => {
      // 80% approval rate for demo
      if (Math.random() > 0.2) {
        setStatus('approved');
        setTimeout(() => {
          onRequestApproved();
        }, 1500);
      } else {
        setStatus('rejected');
      }
    }, 5000);
  };

  const handleClose = () => {
    if (status !== 'submitting') {
      setStatus('idle');
      setNotes('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl flex items-center justify-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            طبيب زائر / دولي
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Doctor Info */}
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                {doctor.name.charAt(3)}
              </div>
              <div>
                <p className="font-semibold text-foreground">{doctor.name}</p>
                <p className="text-sm text-primary">{doctor.specialty}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {doctor.title.includes('زائر') ? doctor.title : `طبيب زائر - ${doctor.title}`}
                </p>
              </div>
            </div>
          </Card>

          {/* Status: Idle - Submit Form */}
          {status === 'idle' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <Card className="p-4 bg-amber-50 border-amber-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700">
                    هذا الطبيب زائر ويتطلب موافقة مسبقة على الحجز. 
                    سيتم مراجعة طلبك وإشعارك بالنتيجة.
                  </p>
                </div>
              </Card>

              {/* Appointment Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">التاريخ:</span>
                  <span className="font-medium">{formatDate(date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">الوقت:</span>
                  <span className="font-medium">{time}</span>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium">ملاحظات إضافية (اختياري)</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="اكتب سبب الزيارة أو أي ملاحظات مهمة..."
                  rows={3}
                />
              </div>

              <Button onClick={handleSubmitRequest} className="w-full">
                إرسال طلب الحجز
              </Button>
            </motion.div>
          )}

          {/* Status: Submitting */}
          {status === 'submitting' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center"
            >
              <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin mb-4" />
              <p className="text-lg font-medium text-foreground">جاري إرسال الطلب...</p>
            </motion.div>
          )}

          {/* Status: Pending */}
          {status === 'pending' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-6 text-center space-y-4"
            >
              <div className="w-20 h-20 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="w-10 h-10 text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-amber-600">قيد المراجعة</p>
                <p className="text-sm text-muted-foreground mt-2">
                  تم إرسال طلبك بنجاح وهو الآن قيد المراجعة
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  رقم الطلب: {requestId}
                </p>
              </div>
              <Card className="p-3 bg-muted">
                <p className="text-sm text-muted-foreground">
                  ستتلقى إشعاراً عند الموافقة أو الرفض
                </p>
              </Card>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري مراجعة الطلب...</span>
              </div>
            </motion.div>
          )}

          {/* Status: Approved */}
          {status === 'approved' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center"
            >
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-xl font-bold text-green-600">تمت الموافقة!</p>
              <p className="text-sm text-muted-foreground mt-2">
                يمكنك الآن إكمال الحجز والدفع
              </p>
            </motion.div>
          )}

          {/* Status: Rejected */}
          {status === 'rejected' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center space-y-4"
            >
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
              <div>
                <p className="text-xl font-bold text-destructive">تم رفض الطلب</p>
                <p className="text-sm text-muted-foreground mt-2">
                  عذراً، لم تتم الموافقة على طلب الحجز في هذا الموعد.
                  يمكنك اختيار موعد آخر أو التواصل مع الدعم.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  إغلاق
                </Button>
                <Button onClick={() => setStatus('idle')} className="flex-1">
                  اختيار موعد آخر
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VisitingDoctorRequestDialog;
