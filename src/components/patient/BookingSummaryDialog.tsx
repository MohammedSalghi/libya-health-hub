// Booking Summary Dialog - Shows full summary before payment
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Calendar, Clock, MapPin, User, Building2, 
  CreditCard, Video, CheckCircle, AlertTriangle
} from "lucide-react";
import { Doctor, Clinic } from "@/types/healthcare";

interface BookingSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  doctor: Doctor;
  clinic: Clinic;
  date: string;
  time: string;
  bookingType: 'in_person' | 'video' | 'home_visit';
  fees: { label: string; amount: number }[];
  totalAmount: number;
  isVisitingDoctor?: boolean;
}

export const BookingSummaryDialog = ({
  isOpen,
  onClose,
  onConfirm,
  doctor,
  clinic,
  date,
  time,
  bookingType,
  fees,
  totalAmount,
  isVisitingDoctor = false
}: BookingSummaryDialogProps) => {
  const getBookingTypeLabel = () => {
    switch (bookingType) {
      case 'video': return 'استشارة فيديو';
      case 'home_visit': return 'زيارة منزلية';
      default: return 'زيارة عيادة';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-LY', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            ملخص الحجز
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Visiting Doctor Warning */}
          {isVisitingDoctor && (
            <Card className="p-3 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-800 text-sm">طبيب زائر / دولي</p>
                  <p className="text-xs text-amber-600">
                    سيتم إرسال طلب الحجز للمراجعة. ستتلقى إشعاراً بالموافقة أو الرفض.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Doctor Info */}
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                {doctor.name.charAt(3)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                  {doctor.isVerified && (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  )}
                </div>
                <p className="text-sm text-primary">{doctor.specialty}</p>
                <p className="text-xs text-muted-foreground">{doctor.title}</p>
              </div>
            </div>
          </Card>

          {/* Booking Details */}
          <Card className="p-4 space-y-3">
            <h4 className="font-semibold text-foreground">تفاصيل الموعد</h4>
            
            {/* Booking Type */}
            <div className="flex items-center gap-3">
              {bookingType === 'video' ? (
                <Video className="w-5 h-5 text-teal-600" />
              ) : (
                <User className="w-5 h-5 text-primary" />
              )}
              <span className="text-foreground">{getBookingTypeLabel()}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-foreground">{formatDate(date)}</span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-foreground">{time}</span>
            </div>

            {/* Clinic (for in-person) */}
            {bookingType !== 'video' && (
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-foreground">{clinic.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {clinic.location.address}
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Fees Breakdown */}
          <Card className="p-4">
            <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              تفاصيل الرسوم
            </h4>
            <div className="space-y-2">
              {fees.map((fee, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{fee.label}</span>
                  <span className="text-foreground">{fee.amount} د.ل</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>الإجمالي</span>
                  <span className="text-primary">{totalAmount} د.ل</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Terms Notice */}
          <p className="text-xs text-center text-muted-foreground">
            بالضغط على "تأكيد والدفع" أنت توافق على شروط الخدمة وسياسة الإلغاء
          </p>

          {/* Actions */}
          <div className="flex gap-3 sticky bottom-0 bg-background pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              تعديل
            </Button>
            <Button onClick={onConfirm} className="flex-1">
              تأكيد والدفع
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingSummaryDialog;
