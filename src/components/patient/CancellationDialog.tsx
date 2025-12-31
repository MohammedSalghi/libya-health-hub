// Cancellation Dialog with confirmation and notifications
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CancellationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  serviceName: string;
  refundAmount?: number;
}

const cancellationReasons = [
  { id: 'schedule', label: 'تغيير في الجدول' },
  { id: 'found_other', label: 'وجدت طبيب/خدمة أخرى' },
  { id: 'health_improved', label: 'تحسنت صحتي' },
  { id: 'financial', label: 'أسباب مالية' },
  { id: 'other', label: 'سبب آخر' },
];

export const CancellationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  serviceName,
  refundAmount = 0
}: CancellationDialogProps) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [otherReason, setOtherReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    if (!selectedReason) {
      toast.error("الرجاء اختيار سبب الإلغاء");
      return;
    }

    setIsProcessing(true);

    try {
      const reason = selectedReason === 'other' ? otherReason : 
        cancellationReasons.find(r => r.id === selectedReason)?.label || '';
      
      await onConfirm(reason);
      toast.success("تم إلغاء الموعد بنجاح");
      onClose();
    } catch (error) {
      toast.error("حدث خطأ أثناء الإلغاء");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <AlertTriangle className="w-6 h-6 text-destructive" />
            تأكيد الإلغاء
          </DialogTitle>
          <DialogDescription className="text-center">
            هل أنت متأكد من إلغاء الموعد؟
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Service Info */}
          <div className="bg-muted/50 p-3 rounded-lg text-center">
            <p className="font-medium text-foreground">{serviceName}</p>
          </div>

          {/* Refund Info */}
          {refundAmount > 0 && (
            <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
              <p className="text-sm text-green-700 text-center">
                سيتم استرداد <span className="font-bold">{refundAmount} د.ل</span> إلى محفظتك
              </p>
            </div>
          )}

          {/* Cancellation Reasons */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">سبب الإلغاء:</p>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              {cancellationReasons.map((reason) => (
                <div key={reason.id} className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value={reason.id} id={reason.id} />
                  <Label htmlFor={reason.id} className="cursor-pointer">
                    {reason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {selectedReason === 'other' && (
              <Textarea
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="اكتب السبب..."
                className="min-h-[80px]"
                dir="rtl"
              />
            )}
          </div>

          {/* Warning */}
          <div className="bg-destructive/10 border border-destructive/30 p-3 rounded-lg">
            <p className="text-xs text-destructive text-center">
              تنبيه: الإلغاء المتكرر قد يؤثر على حسابك
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={isProcessing}
            >
              تراجع
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirm} 
              className="flex-1"
              disabled={!selectedReason || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري الإلغاء...
                </>
              ) : (
                'تأكيد الإلغاء'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancellationDialog;
