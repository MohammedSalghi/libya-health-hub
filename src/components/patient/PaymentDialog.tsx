// Payment Dialog - Libyan Payment Gateways Integration
import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, Wallet, Banknote, CheckCircle, Loader2, 
  AlertCircle, Building2, Smartphone, Shield
} from "lucide-react";
import { toast } from "sonner";

type PaymentMethod = 'wallet' | 'libyan_pay' | 'ebank' | 'misrbank' | 'cash';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: (method: PaymentMethod, transactionId: string) => void;
  onPaymentFailed: (error: string) => void;
  amount: number;
  serviceName: string;
  walletBalance: number;
  allowCash?: boolean;
  serviceFees?: { label: string; amount: number }[];
}

const paymentMethods = [
  { 
    id: 'wallet' as PaymentMethod, 
    name: 'المحفظة', 
    icon: Wallet, 
    description: 'الدفع من رصيد المحفظة',
    color: 'bg-primary'
  },
  { 
    id: 'libyan_pay' as PaymentMethod, 
    name: 'LibyaPay', 
    icon: Smartphone, 
    description: 'الدفع عبر تطبيق ليبيا باي',
    color: 'bg-green-600'
  },
  { 
    id: 'ebank' as PaymentMethod, 
    name: 'eBank', 
    icon: CreditCard, 
    description: 'الدفع عبر البنك الإلكتروني',
    color: 'bg-blue-600'
  },
  { 
    id: 'misrbank' as PaymentMethod, 
    name: 'مصرف مصر', 
    icon: Building2, 
    description: 'الدفع عبر مصرف مصر أونلاين',
    color: 'bg-purple-600'
  },
];

export const PaymentDialog = ({
  isOpen,
  onClose,
  onPaymentComplete,
  onPaymentFailed,
  amount,
  serviceName,
  walletBalance,
  allowCash = false,
  serviceFees = []
}: PaymentDialogProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'confirm' | 'process' | 'success' | 'error'>('select');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const allMethods = allowCash 
    ? [...paymentMethods, { id: 'cash' as PaymentMethod, name: 'نقداً', icon: Banknote, description: 'الدفع نقداً عند الوصول', color: 'bg-amber-600' }]
    : paymentMethods;

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    
    if (method === 'wallet' && walletBalance < amount) {
      toast.error("رصيد المحفظة غير كافي");
      return;
    }
    
    setStep('confirm');
  };

  const processPayment = async () => {
    if (!selectedMethod) return;

    // Validate phone number for electronic payment
    if (['libyan_pay', 'ebank', 'misrbank'].includes(selectedMethod) && !phoneNumber) {
      toast.error("الرجاء إدخال رقم الهاتف");
      return;
    }

    setStep('process');
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate random success (90% success rate)
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        setStep('success');
        
        setTimeout(() => {
          onPaymentComplete(selectedMethod, transactionId);
          resetDialog();
        }, 1500);
      } else {
        throw new Error('فشل في معالجة الدفع، يرجى المحاولة مرة أخرى');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'حدث خطأ غير متوقع');
      setStep('error');
      onPaymentFailed(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetDialog = () => {
    setSelectedMethod(null);
    setStep('select');
    setPhoneNumber('');
    setErrorMessage('');
    onClose();
  };

  const handleRetry = () => {
    setStep('confirm');
    setErrorMessage('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {step === 'select' && 'اختر طريقة الدفع'}
            {step === 'confirm' && 'تأكيد الدفع'}
            {step === 'process' && 'جاري معالجة الدفع'}
            {step === 'success' && 'تم الدفع بنجاح'}
            {step === 'error' && 'فشل الدفع'}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {/* Payment Summary */}
          <Card className="p-4 mb-4 bg-muted/50">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">الخدمة</span>
                <span className="font-medium">{serviceName}</span>
              </div>
              {serviceFees.map((fee, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{fee.label}</span>
                  <span>{fee.amount} د.ل</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>الإجمالي</span>
                  <span className="text-primary">{amount} د.ل</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Step: Select Payment Method */}
          {step === 'select' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {allMethods.map((method) => {
                const isDisabled = method.id === 'wallet' && walletBalance < amount;
                
                return (
                  <Card
                    key={method.id}
                    className={`p-4 cursor-pointer transition-all ${
                      isDisabled 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => !isDisabled && handleMethodSelect(method.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${method.color} flex items-center justify-center`}>
                        <method.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{method.name}</p>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                        {method.id === 'wallet' && (
                          <p className={`text-xs mt-1 ${walletBalance >= amount ? 'text-green-600' : 'text-destructive'}`}>
                            الرصيد: {walletBalance} د.ل
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </motion.div>
          )}

          {/* Step: Confirm Payment */}
          {step === 'confirm' && selectedMethod && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Show phone input for electronic payments */}
              {['libyan_pay', 'ebank', 'misrbank'].includes(selectedMethod) && (
                <div className="space-y-2">
                  <Label>رقم الهاتف المسجل</Label>
                  <Input
                    type="tel"
                    placeholder="09x-xxx-xxxx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="text-center text-lg"
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    سيتم إرسال رمز التأكيد لهذا الرقم
                  </p>
                </div>
              )}

              {selectedMethod === 'cash' && (
                <Card className="p-4 bg-amber-50 border-amber-200">
                  <div className="flex items-start gap-3">
                    <Banknote className="w-6 h-6 text-amber-600" />
                    <div>
                      <p className="font-medium text-amber-800">الدفع نقداً</p>
                      <p className="text-sm text-amber-600">
                        سيتم تحصيل المبلغ عند وصولك للموعد
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                <Shield className="w-4 h-4" />
                <span>معاملاتك آمنة ومشفرة</span>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('select')} className="flex-1">
                  رجوع
                </Button>
                <Button onClick={processPayment} className="flex-1">
                  تأكيد الدفع
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step: Processing */}
          {step === 'process' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center"
            >
              <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin mb-4" />
              <p className="text-lg font-medium text-foreground">جاري معالجة الدفع...</p>
              <p className="text-sm text-muted-foreground">يرجى عدم إغلاق هذه النافذة</p>
            </motion.div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center"
            >
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-xl font-bold text-green-600">تم الدفع بنجاح!</p>
              <p className="text-sm text-muted-foreground mt-2">جاري تأكيد الحجز...</p>
            </motion.div>
          )}

          {/* Step: Error */}
          {step === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center"
            >
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
              <p className="text-xl font-bold text-destructive">فشل الدفع</p>
              <p className="text-sm text-muted-foreground mt-2">{errorMessage}</p>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={resetDialog} className="flex-1">
                  إلغاء
                </Button>
                <Button onClick={handleRetry} className="flex-1">
                  إعادة المحاولة
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
