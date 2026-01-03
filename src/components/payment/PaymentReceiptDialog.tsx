// =====================================================
// مكون الإيصال الإلكتروني
// Payment Receipt Component
// =====================================================

import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Receipt, Download, Share2, CheckCircle, 
  Clock, XCircle, Banknote, Copy
} from "lucide-react";
import { PaymentReceipt as ReceiptType, TransactionStatus } from "@/types/payment";
import { toast } from "sonner";

interface PaymentReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: ReceiptType | null;
}

const statusConfig: Record<TransactionStatus, { label: string; color: string; icon: any }> = {
  pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  processing: { label: 'قيد المعالجة', color: 'bg-blue-100 text-blue-800', icon: Clock },
  completed: { label: 'مكتمل', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  failed: { label: 'فاشل', color: 'bg-red-100 text-red-800', icon: XCircle },
  refunded: { label: 'مسترد', color: 'bg-purple-100 text-purple-800', icon: Banknote },
  cancelled: { label: 'ملغي', color: 'bg-gray-100 text-gray-800', icon: XCircle },
};

export const PaymentReceiptDialog = ({
  isOpen,
  onClose,
  receipt,
}: PaymentReceiptProps) => {
  if (!receipt) return null;

  const status = statusConfig[receipt.paymentStatus];
  const StatusIcon = status.icon;

  const copyReceiptNumber = () => {
    navigator.clipboard.writeText(receipt.receiptNumber);
    toast.success("تم نسخ رقم الإيصال");
  };

  const shareReceipt = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'إيصال الدفع',
          text: `إيصال رقم: ${receipt.receiptNumber}\nالمبلغ: ${receipt.total} د.ل\nالخدمة: ${receipt.serviceName}`,
        });
      } catch {
        // User cancelled sharing
      }
    } else {
      copyReceiptNumber();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <Receipt className="w-5 h-5" />
            إيصال الدفع
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* رأس الإيصال */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <StatusIcon className={`w-8 h-8 ${receipt.paymentStatus === 'completed' ? 'text-green-600' : 'text-muted-foreground'}`} />
            </div>
            <Badge className={status.color}>{status.label}</Badge>
          </div>

          {/* رقم الإيصال */}
          <Card className="p-4 text-center bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">رقم الإيصال</p>
            <div className="flex items-center justify-center gap-2">
              <p className="font-mono font-bold text-lg">{receipt.receiptNumber}</p>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyReceiptNumber}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {receipt.date} - {receipt.time}
            </p>
          </Card>

          {/* تفاصيل الخدمة */}
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">الخدمة</span>
                <span className="font-medium">{receipt.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">مقدم الخدمة</span>
                <span>{receipt.providerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">طريقة الدفع</span>
                <span>{receipt.paymentMethod}</span>
              </div>
            </div>
          </Card>

          {/* تفاصيل المبلغ */}
          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">المبلغ الأساسي</span>
                <span>{receipt.subtotal} د.ل</span>
              </div>
              {receipt.fees.map((fee, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{fee.label}</span>
                  <span>{fee.amount} د.ل</span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>الإجمالي</span>
                <span className="text-primary">{receipt.total} د.ل</span>
              </div>
            </div>
          </Card>

          {/* أزرار الإجراءات */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={shareReceipt} className="flex-1">
              <Share2 className="w-4 h-4 ml-2" />
              مشاركة
            </Button>
            <Button onClick={onClose} className="flex-1">
              <Download className="w-4 h-4 ml-2" />
              حفظ
            </Button>
          </div>

          {/* ملاحظة */}
          <p className="text-xs text-center text-muted-foreground">
            احتفظ بهذا الإيصال كمرجع لمعاملتك
          </p>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentReceiptDialog;
