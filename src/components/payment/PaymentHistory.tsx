// =====================================================
// مكون سجل المدفوعات
// Payment History Component
// =====================================================

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Receipt, Search, Filter, Calendar, 
  CheckCircle, Clock, XCircle, Banknote,
  ArrowUpRight, ArrowDownLeft, Eye
} from "lucide-react";
import { usePaymentStore, LIBYAN_PAYMENT_METHODS } from "@/stores/paymentStore";
import { PaymentTransaction, TransactionStatus } from "@/types/payment";
import PaymentReceiptDialog from "./PaymentReceiptDialog";

const statusConfig: Record<TransactionStatus, { label: string; color: string; icon: any }> = {
  pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock },
  processing: { label: 'قيد المعالجة', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: Clock },
  completed: { label: 'مكتمل', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
  failed: { label: 'فاشل', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: XCircle },
  refunded: { label: 'مسترد', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: Banknote },
  cancelled: { label: 'ملغي', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200', icon: XCircle },
};

interface PaymentHistoryProps {
  userId?: string;
  showSearch?: boolean;
  maxItems?: number;
}

export const PaymentHistory = ({
  userId = 'user1',
  showSearch = true,
  maxItems,
}: PaymentHistoryProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const { getUserTransactions, generateReceipt } = usePaymentStore();

  const transactions = useMemo(() => {
    let items = getUserTransactions(userId);

    // فلترة حسب البحث
    if (searchQuery) {
      items = items.filter(
        (t) =>
          t.serviceName.includes(searchQuery) ||
          t.providerName.includes(searchQuery) ||
          t.receiptNumber.includes(searchQuery)
      );
    }

    // فلترة حسب التبويب
    if (activeTab !== 'all') {
      items = items.filter((t) => {
        if (activeTab === 'completed') return t.status === 'completed';
        if (activeTab === 'pending') return ['pending', 'processing'].includes(t.status);
        if (activeTab === 'failed') return ['failed', 'cancelled'].includes(t.status);
        return true;
      });
    }

    // تحديد العدد
    if (maxItems) {
      items = items.slice(0, maxItems);
    }

    return items;
  }, [userId, searchQuery, activeTab, maxItems, getUserTransactions]);

  const receipt = selectedReceipt ? generateReceipt(selectedReceipt) : null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'اليوم';
    if (diffDays === 1) return 'أمس';
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    return date.toLocaleDateString('ar-LY');
  };

  const getPaymentMethodName = (methodId: string) => {
    return LIBYAN_PAYMENT_METHODS.find((m) => m.id === methodId)?.name || methodId;
  };

  return (
    <>
      <div className="space-y-4">
        {/* البحث والفلترة */}
        {showSearch && (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث في المعاملات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
        )}

        {/* التبويبات */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="completed">مكتمل</TabsTrigger>
            <TabsTrigger value="pending">قيد الانتظار</TabsTrigger>
            <TabsTrigger value="failed">فاشل</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* قائمة المعاملات */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <Card className="p-8 text-center">
                <Receipt className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">لا توجد معاملات</p>
              </Card>
            ) : (
              transactions.map((transaction, index) => {
                const status = statusConfig[transaction.status];
                const StatusIcon = status.icon;
                const isCash = transaction.paymentMethod.startsWith('cash');

                return (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedReceipt(transaction.id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            transaction.status === 'completed' 
                              ? 'bg-green-100 dark:bg-green-900' 
                              : 'bg-muted'
                          }`}>
                            {transaction.serviceType === 'wallet_topup' ? (
                              <ArrowDownLeft className="w-5 h-5 text-green-600" />
                            ) : (
                              <ArrowUpRight className={`w-5 h-5 ${
                                transaction.status === 'completed' 
                                  ? 'text-green-600' 
                                  : 'text-muted-foreground'
                              }`} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{transaction.serviceName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {getPaymentMethodName(transaction.paymentMethod)}
                              </Badge>
                              {isCash && transaction.cashStatus === 'pending_collection' && (
                                <Badge className="bg-amber-100 text-amber-800 text-xs">
                                  في انتظار التحصيل
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(transaction.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-left shrink-0">
                          <p className={`font-bold ${
                            transaction.serviceType === 'wallet_topup' 
                              ? 'text-green-600' 
                              : 'text-foreground'
                          }`}>
                            {transaction.serviceType === 'wallet_topup' ? '+' : '-'}{transaction.amount} د.ل
                          </p>
                          <Badge className={`${status.color} text-xs mt-1`}>
                            {status.label}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* نافذة الإيصال */}
      <PaymentReceiptDialog
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        receipt={receipt}
      />
    </>
  );
};

export default PaymentHistory;
