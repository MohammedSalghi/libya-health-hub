// =====================================================
// صفحة المحفظة الموحدة للمستخدم
// Unified User Wallet Page
// =====================================================

import { useState } from "react";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Wallet, Plus, Gift, ArrowUpRight, ArrowDownLeft,
  CreditCard, History, TrendingUp, Shield, Smartphone
} from "lucide-react";
import { motion } from "framer-motion";
import { usePaymentStore, LIBYAN_PAYMENT_METHODS } from "@/stores/paymentStore";
import { PaymentMethodType } from "@/types/payment";
import PaymentHistory from "@/components/payment/PaymentHistory";
import UnifiedPaymentDialog from "@/components/payment/UnifiedPaymentDialog";
import { toast } from "sonner";

const WalletPage = () => {
  const [showTopup, setShowTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const { userWallet, topupWallet, transactions } = usePaymentStore();

  // الوسائل المتاحة للشحن
  const topupMethods = LIBYAN_PAYMENT_METHODS.filter(
    (m) => m.type === 'electronic' && m.id !== 'wallet'
  );

  // إحصائيات سريعة
  const stats = {
    totalSpent: transactions
      .filter((t) => t.serviceType !== 'wallet_topup' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    totalTopups: transactions
      .filter((t) => t.serviceType === 'wallet_topup' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    transactionCount: transactions.filter((t) => t.status === 'completed').length,
  };

  const handleTopup = (method: PaymentMethodType) => {
    const amount = parseFloat(topupAmount);
    if (!amount || amount < 10) {
      toast.error("الحد الأدنى للشحن 10 د.ل");
      return;
    }

    // محاكاة الشحن
    topupWallet(amount, method);
    toast.success(`تم شحن ${amount} د.ل بنجاح`);
    setTopupAmount("");
    setShowTopup(false);
  };

  return (
    <PatientLayout>
      <div className="p-4 space-y-6">
        {/* العنوان */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">المحفظة</h1>
          <Button variant="outline" size="icon">
            <History className="h-5 w-5" />
          </Button>
        </div>

        {/* بطاقة الرصيد */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden">
            <CardContent className="p-6 relative">
              {/* خلفية زخرفية */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-full">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <span className="text-sm opacity-90">الرصيد المتاح</span>
                </div>
                
                <div className="text-4xl font-bold mb-2">
                  {userWallet.balance.toFixed(2)} د.ل
                </div>
                
                {userWallet.pendingBalance > 0 && (
                  <p className="text-sm opacity-75 mb-4">
                    رصيد معلق: {userWallet.pendingBalance} د.ل
                  </p>
                )}

                <div className="flex gap-3 mt-6">
                  <Button 
                    variant="secondary" 
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0"
                    onClick={() => setShowTopup(!showTopup)}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    شحن المحفظة
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    <CreditCard className="h-4 w-4 ml-2" />
                    البطاقات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* قسم الشحن */}
        {showTopup && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">شحن المحفظة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* مبالغ سريعة */}
                <div className="grid grid-cols-4 gap-2">
                  {[50, 100, 200, 500].map((amount) => (
                    <Button
                      key={amount}
                      variant={topupAmount === String(amount) ? "default" : "outline"}
                      onClick={() => setTopupAmount(String(amount))}
                      className="h-12"
                    >
                      {amount} د.ل
                    </Button>
                  ))}
                </div>

                {/* مبلغ مخصص */}
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="مبلغ آخر (الحد الأدنى 10 د.ل)"
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(e.target.value)}
                    className="flex-1"
                  />
                </div>

                {/* وسائل الشحن */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">اختر طريقة الشحن</p>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {topupMethods.slice(0, 6).map((method) => (
                        <Card
                          key={method.id}
                          className="p-3 cursor-pointer hover:bg-muted transition-colors"
                          onClick={() => handleTopup(method.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${method.color} flex items-center justify-center`}>
                              <Smartphone className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{method.name}</p>
                              <p className="text-xs text-muted-foreground">{method.processingTime}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* نقاط الولاء */}
        <Card className="bg-accent/10 border-accent/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-full">
                <Gift className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <div className="font-medium">نقاط الولاء</div>
                <div className="text-sm text-muted-foreground">{userWallet.loyaltyPoints} نقطة متاحة</div>
              </div>
            </div>
            <Button variant="outline" size="sm">استبدال</Button>
          </CardContent>
        </Card>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <ArrowUpRight className="w-5 h-5 mx-auto text-red-500 mb-1" />
            <p className="text-lg font-bold">{stats.totalSpent}</p>
            <p className="text-xs text-muted-foreground">إجمالي الإنفاق</p>
          </Card>
          <Card className="p-3 text-center">
            <ArrowDownLeft className="w-5 h-5 mx-auto text-green-500 mb-1" />
            <p className="text-lg font-bold">{stats.totalTopups}</p>
            <p className="text-xs text-muted-foreground">إجمالي الشحن</p>
          </Card>
          <Card className="p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold">{stats.transactionCount}</p>
            <p className="text-xs text-muted-foreground">عدد المعاملات</p>
          </Card>
        </div>

        {/* سجل المعاملات */}
        <div>
          <h2 className="text-lg font-semibold mb-4">سجل المدفوعات</h2>
          <PaymentHistory userId={userWallet.userId} showSearch={true} />
        </div>

        {/* ملاحظة الأمان */}
        <Card className="p-4 bg-muted/50">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">معاملاتك آمنة</p>
              <p className="text-xs text-muted-foreground">
                جميع المعاملات مشفرة ومحمية بأعلى معايير الأمان
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PatientLayout>
  );
};

export default WalletPage;
