// Booking Confirmation Dialog - Full Professional Workflow
import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Calendar, Clock, MapPin, User, CreditCard, 
  CheckCircle, Loader2, Video, Building2, Navigation
} from "lucide-react";
import { toast } from "sonner";

interface BookingConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  bookingDetails: {
    type: 'doctor' | 'video' | 'lab' | 'pharmacy';
    serviceName: string;
    providerName?: string;
    clinicName?: string;
    clinicAddress?: string;
    date: string;
    time: string;
    fees: { label: string; amount: number }[];
    totalAmount: number;
    walletBalance: number;
  };
}

export const BookingConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  bookingDetails
}: BookingConfirmationDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'summary' | 'processing' | 'success'>('summary');

  const insufficientBalance = bookingDetails.walletBalance < bookingDetails.totalAmount;

  const handleConfirm = async () => {
    if (insufficientBalance) {
      toast.error("رصيد المحفظة غير كافي");
      return;
    }

    setIsProcessing(true);
    setStep('processing');

    try {
      await onConfirm();
      setStep('success');
      
      // Auto close after success
      setTimeout(() => {
        setStep('summary');
        onClose();
      }, 2000);
    } catch (error) {
      setStep('summary');
      toast.error("حدث خطأ أثناء الحجز، يرجى المحاولة مرة أخرى");
    } finally {
      setIsProcessing(false);
    }
  };

  const getTypeLabel = () => {
    switch (bookingDetails.type) {
      case 'doctor': return 'حجز موعد';
      case 'video': return 'استشارة فيديو';
      case 'lab': return 'حجز تحاليل';
      case 'pharmacy': return 'طلب أدوية';
      default: return 'حجز';
    }
  };

  const getTypeIcon = () => {
    switch (bookingDetails.type) {
      case 'video': return Video;
      case 'lab': return Building2;
      default: return User;
    }
  };

  const TypeIcon = getTypeIcon();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        {step === 'summary' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl">
                تأكيد {getTypeLabel()}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Service Info */}
              <Card className="p-4 bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TypeIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{bookingDetails.serviceName}</p>
                    {bookingDetails.providerName && (
                      <p className="text-sm text-muted-foreground">{bookingDetails.providerName}</p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Clinic Info */}
              {bookingDetails.clinicName && (
                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{bookingDetails.clinicName}</p>
                      {bookingDetails.clinicAddress && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {bookingDetails.clinicAddress}
                        </p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary">
                      <Navigation className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              )}

              {/* Date & Time */}
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{bookingDetails.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{bookingDetails.time}</span>
                  </div>
                </div>
              </Card>

              {/* Fees Breakdown */}
              <Card className="p-4">
                <h4 className="font-medium mb-3 text-foreground">تفاصيل الرسوم</h4>
                <div className="space-y-2">
                  {bookingDetails.fees.map((fee, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{fee.label}</span>
                      <span className="text-foreground">{fee.amount} د.ل</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span className="text-foreground">المجموع</span>
                      <span className="text-primary">{bookingDetails.totalAmount} د.ل</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Wallet Balance */}
              <Card className={`p-4 ${insufficientBalance ? 'bg-destructive/10 border-destructive/30' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className={`w-5 h-5 ${insufficientBalance ? 'text-destructive' : 'text-green-600'}`} />
                    <span className="text-sm">رصيد المحفظة</span>
                  </div>
                  <span className={`font-bold ${insufficientBalance ? 'text-destructive' : 'text-green-600'}`}>
                    {bookingDetails.walletBalance} د.ل
                  </span>
                </div>
                {insufficientBalance && (
                  <p className="text-xs text-destructive mt-2">
                    الرصيد غير كافي. يرجى شحن المحفظة.
                  </p>
                )}
              </Card>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={onClose} className="flex-1" disabled={isProcessing}>
                  إلغاء
                </Button>
                <Button 
                  onClick={handleConfirm} 
                  className="flex-1"
                  disabled={insufficientBalance || isProcessing}
                >
                  تأكيد الحجز
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'processing' && (
          <div className="py-12 text-center">
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-bold text-foreground mb-2">جاري معالجة الحجز...</h3>
            <p className="text-muted-foreground">يرجى الانتظار</p>
          </div>
        )}

        {step === 'success' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-12 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">تم تأكيد الحجز بنجاح!</h3>
            <p className="text-muted-foreground">سيتم إشعارك بتفاصيل الموعد</p>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmationDialog;
