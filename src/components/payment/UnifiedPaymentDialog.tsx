// =====================================================
// نظام الدفع الموحد - مكون الدفع الرئيسي
// Unified Payment System - Main Payment Dialog
// =====================================================

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Wallet, Banknote, CheckCircle, Loader2, 
  AlertCircle, Building2, Smartphone, Shield,
  QrCode, Truck, CreditCard, Landmark,
  ChevronRight, Receipt, Copy, Download
} from "lucide-react";
import { toast } from "sonner";
import { usePaymentStore, LIBYAN_PAYMENT_METHODS } from "@/stores/paymentStore";
import { 
  PaymentMethodType, 
  PaymentRequest, 
  PaymentResult,
  ServiceType 
} from "@/types/payment";

// أيقونات وسائل الدفع
const PAYMENT_ICONS: Record<string, any> = {
  wallet: Wallet,
  mobicash: Smartphone,
  aman_pay: Shield,
  jumhuriya_pay: Building2,
  wahda_bank: Landmark,
  sadad: CreditCard,
  madar_wallet: Smartphone,
  libyana_wallet: Smartphone,
  bank_wallet: Wallet,
  qr_code: QrCode,
  cash_visit: Banknote,
  cash_delivery: Truck,
};

interface UnifiedPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: (result: PaymentResult) => void;
  onPaymentFailed: (error: string) => void;
  paymentRequest: PaymentRequest;
}

export const UnifiedPaymentDialog = ({
  isOpen,
  onClose,
  onPaymentComplete,
  onPaymentFailed,
  paymentRequest,
}: UnifiedPaymentDialogProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'confirm' | 'otp' | 'process' | 'success' | 'error'>('select');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [transactionResult, setTransactionResult] = useState<PaymentResult | null>(null);

  const {
    userWallet,
    getActivePaymentMethods,
    createTransaction,
    updateTransactionStatus,
    deductFromWallet,
    addToProviderWallet,
    calculateCommission,
    addPaymentNotification,
  } = usePaymentStore();

  // حساب الرسوم والعمولة
  const feeBreakdown = useMemo(() => {
    if (!selectedMethod) return null;
    return calculateCommission(
      paymentRequest.amount,
      paymentRequest.serviceType,
      selectedMethod
    );
  }, [selectedMethod, paymentRequest.amount, paymentRequest.serviceType, calculateCommission]);

  // الحصول على وسائل الدفع المتاحة
  const availableMethods = useMemo(() => {
    const methods = getActivePaymentMethods(paymentRequest.allowCash);
    
    // فلترة حسب الوسائل المسموح بها
    if (paymentRequest.allowedMethods?.length) {
      return methods.filter((m) => paymentRequest.allowedMethods!.includes(m.id));
    }
    
    return methods;
  }, [paymentRequest.allowCash, paymentRequest.allowedMethods, getActivePaymentMethods]);

  // إجمالي المبلغ
  const totalAmount = useMemo(() => {
    let total = paymentRequest.amount;
    if (paymentRequest.fees) {
      total += paymentRequest.fees.reduce((sum, fee) => sum + fee.amount, 0);
    }
    return total;
  }, [paymentRequest]);

  const handleMethodSelect = (methodId: PaymentMethodType) => {
    const method = availableMethods.find((m) => m.id === methodId);
    if (!method) return;

    // التحقق من رصيد المحفظة
    if (methodId === 'wallet' && userWallet.balance < totalAmount) {
      toast.error("رصيد المحفظة غير كافي");
      return;
    }

    setSelectedMethod(methodId);
    setStep('confirm');
  };

  const handleConfirm = () => {
    const method = availableMethods.find((m) => m.id === selectedMethod);
    if (!method) return;

    // التحقق من رقم الهاتف
    if (method.requiresPhone && !phoneNumber) {
      toast.error("الرجاء إدخال رقم الهاتف");
      return;
    }

    // إذا تطلب OTP
    if (method.requiresOtp) {
      setStep('otp');
      // محاكاة إرسال OTP
      toast.success("تم إرسال رمز التأكيد لهاتفك");
    } else {
      processPayment();
    }
  };

  const handleOtpVerify = () => {
    if (otpCode.length !== 4) {
      toast.error("الرجاء إدخال رمز التأكيد");
      return;
    }
    processPayment();
  };

  const processPayment = async () => {
    if (!selectedMethod) return;

    setStep('process');
    setIsProcessing(true);

    try {
      // محاكاة معالجة الدفع
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // نسبة نجاح 95%
      const isSuccess = Math.random() > 0.05;

      if (!isSuccess) {
        throw new Error('فشل في معالجة الدفع، يرجى المحاولة مرة أخرى');
      }

      const fees = feeBreakdown || { platformFee: 0, providerAmount: totalAmount, paymentFee: 0 };

      // خصم من المحفظة إذا كان الدفع عبر المحفظة
      if (selectedMethod === 'wallet') {
        const success = deductFromWallet(totalAmount);
        if (!success) {
          throw new Error('رصيد المحفظة غير كافي');
        }
      }

      // إنشاء المعاملة
      const transaction = createTransaction({
        userId: userWallet.userId,
        serviceType: paymentRequest.serviceType,
        serviceId: paymentRequest.serviceId,
        serviceName: paymentRequest.serviceName,
        amount: totalAmount,
        serviceFee: paymentRequest.fees?.reduce((sum, f) => sum + f.amount, 0) || 0,
        platformFee: fees.platformFee,
        providerAmount: fees.providerAmount,
        paymentMethod: selectedMethod,
        status: selectedMethod.startsWith('cash') ? 'pending' : 'completed',
        cashStatus: selectedMethod.startsWith('cash') ? 'pending_collection' : undefined,
        providerId: paymentRequest.providerId,
        providerName: paymentRequest.providerName,
        providerType: paymentRequest.providerType,
        phoneNumber,
        otpVerified: otpCode.length === 4,
      });

      // إضافة الرصيد لمقدم الخدمة (للدفع الإلكتروني فقط)
      if (!selectedMethod.startsWith('cash')) {
        addToProviderWallet(
          paymentRequest.providerId,
          fees.providerAmount,
          paymentRequest.providerName,
          paymentRequest.providerType
        );
      }

      // إرسال إشعارات
      addPaymentNotification({
        transactionId: transaction.id,
        recipientType: 'user',
        recipientId: userWallet.userId,
        type: 'payment_success',
        title: 'تم الدفع بنجاح',
        message: `تم دفع ${totalAmount} د.ل لـ ${paymentRequest.serviceName}`,
        isRead: false,
      });

      addPaymentNotification({
        transactionId: transaction.id,
        recipientType: 'provider',
        recipientId: paymentRequest.providerId,
        type: 'payment_success',
        title: 'مدفوعات جديدة',
        message: `تم استلام ${fees.providerAmount} د.ل من حجز جديد`,
        isRead: false,
      });

      const result: PaymentResult = {
        success: true,
        transactionId: transaction.id,
        receiptNumber: transaction.receiptNumber,
        paymentMethod: selectedMethod,
        status: transaction.status,
      };

      setTransactionResult(result);
      setStep('success');

      // إغلاق بعد 2 ثانية
      setTimeout(() => {
        onPaymentComplete(result);
        resetDialog();
      }, 2000);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      setErrorMessage(message);
      setStep('error');
      onPaymentFailed(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetDialog = () => {
    setSelectedMethod(null);
    setStep('select');
    setPhoneNumber('');
    setOtpCode('');
    setErrorMessage('');
    setTransactionResult(null);
    onClose();
  };

  const handleRetry = () => {
    setStep('confirm');
    setErrorMessage('');
  };

  const copyReceiptNumber = () => {
    if (transactionResult?.receiptNumber) {
      navigator.clipboard.writeText(transactionResult.receiptNumber);
      toast.success("تم نسخ رقم الإيصال");
    }
  };

  const selectedMethodInfo = selectedMethod 
    ? availableMethods.find((m) => m.id === selectedMethod) 
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={resetDialog}>
      <DialogContent className="max-w-md max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-center text-xl">
            {step === 'select' && 'اختر طريقة الدفع'}
            {step === 'confirm' && 'تأكيد الدفع'}
            {step === 'otp' && 'رمز التأكيد'}
            {step === 'process' && 'جاري معالجة الدفع'}
            {step === 'success' && 'تم الدفع بنجاح'}
            {step === 'error' && 'فشل الدفع'}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-4">
          {/* ملخص الدفع */}
          <Card className="p-4 mb-4 bg-muted/50">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">الخدمة</span>
                <span className="font-medium">{paymentRequest.serviceName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">مقدم الخدمة</span>
                <span>{paymentRequest.providerName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">المبلغ</span>
                <span>{paymentRequest.amount} د.ل</span>
              </div>
              {paymentRequest.fees?.map((fee, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{fee.label}</span>
                  <span>{fee.amount} د.ل</span>
                </div>
              ))}
              {feeBreakdown && step !== 'select' && (
                <>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>عمولة المنصة</span>
                    <span>{feeBreakdown.platformFee} د.ل</span>
                  </div>
                </>
              )}
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>الإجمالي</span>
                  <span className="text-primary">{totalAmount} د.ل</span>
                </div>
              </div>
            </div>
          </Card>

          <AnimatePresence mode="wait">
            {/* اختيار طريقة الدفع */}
            {step === 'select' && (
              <motion.div
                key="select"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ScrollArea className="h-[350px] pr-3">
                  <div className="space-y-2">
                    {/* الوسائل الإلكترونية */}
                    <p className="text-sm font-medium text-muted-foreground mb-2">الدفع الإلكتروني</p>
                    {availableMethods
                      .filter((m) => m.type === 'electronic')
                      .map((method) => {
                        const Icon = PAYMENT_ICONS[method.id] || CreditCard;
                        const isWalletDisabled = method.id === 'wallet' && userWallet.balance < totalAmount;

                        return (
                          <Card
                            key={method.id}
                            className={`p-3 cursor-pointer transition-all ${
                              isWalletDisabled
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-muted hover:border-primary'
                            }`}
                            onClick={() => !isWalletDisabled && handleMethodSelect(method.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg ${method.color} flex items-center justify-center shrink-0`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-foreground truncate">{method.name}</p>
                                  {method.id === 'wallet' && (
                                    <Badge variant={userWallet.balance >= totalAmount ? "default" : "destructive"} className="text-xs">
                                      {userWallet.balance} د.ل
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{method.description}</p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                            </div>
                          </Card>
                        );
                      })}

                    {/* الوسائل النقدية */}
                    {paymentRequest.allowCash && (
                      <>
                        <p className="text-sm font-medium text-muted-foreground mt-4 mb-2">الدفع النقدي</p>
                        {availableMethods
                          .filter((m) => m.type === 'cash')
                          .map((method) => {
                            const Icon = PAYMENT_ICONS[method.id] || Banknote;

                            return (
                              <Card
                                key={method.id}
                                className="p-3 cursor-pointer transition-all hover:bg-muted hover:border-primary"
                                onClick={() => handleMethodSelect(method.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-lg ${method.color} flex items-center justify-center shrink-0`}>
                                    <Icon className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-foreground">{method.name}</p>
                                    <p className="text-xs text-muted-foreground">{method.description}</p>
                                  </div>
                                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                                </div>
                              </Card>
                            );
                          })}
                      </>
                    )}
                  </div>
                </ScrollArea>
              </motion.div>
            )}

            {/* تأكيد الدفع */}
            {step === 'confirm' && selectedMethodInfo && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* وسيلة الدفع المختارة */}
                <Card className="p-4 border-primary">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const Icon = PAYMENT_ICONS[selectedMethodInfo.id] || CreditCard;
                      return (
                        <div className={`w-12 h-12 rounded-xl ${selectedMethodInfo.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      );
                    })()}
                    <div>
                      <p className="font-semibold">{selectedMethodInfo.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedMethodInfo.processingTime}</p>
                    </div>
                  </div>
                </Card>

                {/* إدخال رقم الهاتف */}
                {selectedMethodInfo.requiresPhone && (
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
                      {selectedMethodInfo.requiresOtp && 'سيتم إرسال رمز التأكيد لهذا الرقم'}
                    </p>
                  </div>
                )}

                {/* رسالة الدفع النقدي */}
                {selectedMethodInfo.type === 'cash' && (
                  <Card className="p-4 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
                    <div className="flex items-start gap-3">
                      <Banknote className="w-6 h-6 text-amber-600 shrink-0" />
                      <div>
                        <p className="font-medium text-amber-800 dark:text-amber-200">
                          {selectedMethodInfo.id === 'cash_visit' ? 'الدفع نقداً عند الزيارة' : 'الدفع نقداً عند الاستلام'}
                        </p>
                        <p className="text-sm text-amber-600 dark:text-amber-400">
                          سيتم تحصيل المبلغ {selectedMethodInfo.id === 'cash_visit' ? 'عند وصولك للموعد' : 'عند استلام الطلب'}
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
                  <Button onClick={handleConfirm} className="flex-1">
                    {selectedMethodInfo.type === 'cash' ? 'تأكيد الحجز' : 'متابعة'}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* إدخال OTP */}
            {step === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <p className="text-muted-foreground">
                    تم إرسال رمز التأكيد إلى
                  </p>
                  <p className="font-semibold" dir="ltr">{phoneNumber}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-center block">رمز التأكيد</Label>
                  <Input
                    type="text"
                    placeholder="0000"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="text-center text-2xl tracking-widest"
                    maxLength={4}
                    dir="ltr"
                  />
                </div>

                <Button
                  variant="link"
                  className="w-full text-muted-foreground"
                  onClick={() => toast.success("تم إعادة إرسال الرمز")}
                >
                  إعادة إرسال الرمز
                </Button>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep('confirm')} className="flex-1">
                    رجوع
                  </Button>
                  <Button onClick={handleOtpVerify} className="flex-1" disabled={otpCode.length !== 4}>
                    تأكيد الدفع
                  </Button>
                </div>
              </motion.div>
            )}

            {/* جاري المعالجة */}
            {step === 'process' && (
              <motion.div
                key="process"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 text-center"
              >
                <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin mb-4" />
                <p className="text-lg font-medium text-foreground">جاري معالجة الدفع...</p>
                <p className="text-sm text-muted-foreground">يرجى عدم إغلاق هذه النافذة</p>
              </motion.div>
            )}

            {/* نجاح الدفع */}
            {step === 'success' && transactionResult && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-6 text-center"
              >
                <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-xl font-bold text-green-600 mb-2">تم الدفع بنجاح!</p>
                
                {transactionResult.receiptNumber && (
                  <div className="bg-muted rounded-lg p-3 mt-4">
                    <p className="text-sm text-muted-foreground mb-1">رقم الإيصال</p>
                    <div className="flex items-center justify-center gap-2">
                      <p className="font-mono font-bold">{transactionResult.receiptNumber}</p>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyReceiptNumber}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <p className="text-sm text-muted-foreground mt-4">جاري تأكيد الحجز...</p>
              </motion.div>
            )}

            {/* فشل الدفع */}
            {step === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 text-center"
              >
                <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
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
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnifiedPaymentDialog;
