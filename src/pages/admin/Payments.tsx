// =====================================================
// لوحة إدارة المدفوعات - Admin Payment Dashboard
// =====================================================

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Wallet, CreditCard, TrendingUp, TrendingDown,
  Users, Building2, Settings, Search, Download,
  CheckCircle, Clock, XCircle, ArrowUpRight,
  ArrowDownLeft, BarChart3, PieChart, Filter,
  ChevronRight, Smartphone, Landmark, Shield,
  Banknote, RefreshCw, Menu, X, Bell
} from "lucide-react";
import { usePaymentStore, LIBYAN_PAYMENT_METHODS, SERVICE_COMMISSIONS } from "@/stores/paymentStore";
import { PaymentMethodType, ServiceType, TransactionStatus } from "@/types/payment";

const AdminPaymentsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<'overview' | 'transactions' | 'methods' | 'providers' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const { 
    transactions, 
    providerWallets, 
    settings, 
    togglePaymentMethod,
    updateSettings 
  } = usePaymentStore();

  // إحصائيات عامة
  const stats = useMemo(() => {
    const completed = transactions.filter((t) => t.status === 'completed');
    const today = new Date().toDateString();
    const todayTransactions = completed.filter(
      (t) => new Date(t.createdAt).toDateString() === today
    );

    return {
      totalRevenue: completed.reduce((sum, t) => sum + t.amount, 0),
      totalCommission: completed.reduce((sum, t) => sum + t.platformFee, 0),
      totalTransactions: transactions.length,
      completedTransactions: completed.length,
      pendingTransactions: transactions.filter((t) => t.status === 'pending').length,
      failedTransactions: transactions.filter((t) => t.status === 'failed').length,
      todayRevenue: todayTransactions.reduce((sum, t) => sum + t.amount, 0),
      todayCommission: todayTransactions.reduce((sum, t) => sum + t.platformFee, 0),
      todayCount: todayTransactions.length,
      totalProviders: providerWallets.length,
      totalProviderBalance: providerWallets.reduce((sum, w) => sum + w.balance, 0),
    };
  }, [transactions, providerWallets]);

  // توزيع طرق الدفع
  const paymentMethodStats = useMemo(() => {
    const methodCounts: Record<string, { count: number; amount: number }> = {};
    
    transactions.forEach((t) => {
      if (!methodCounts[t.paymentMethod]) {
        methodCounts[t.paymentMethod] = { count: 0, amount: 0 };
      }
      methodCounts[t.paymentMethod].count++;
      methodCounts[t.paymentMethod].amount += t.amount;
    });

    return Object.entries(methodCounts).map(([method, data]) => ({
      method,
      name: LIBYAN_PAYMENT_METHODS.find((m) => m.id === method)?.name || method,
      ...data,
    }));
  }, [transactions]);

  const menuItems = [
    { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
    { id: 'transactions', label: 'المعاملات', icon: CreditCard },
    { id: 'methods', label: 'وسائل الدفع', icon: Wallet },
    { id: 'providers', label: 'مقدمي الخدمة', icon: Building2 },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  const getStatusBadge = (status: TransactionStatus) => {
    const config: Record<TransactionStatus, { label: string; color: string }> = {
      pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'قيد المعالجة', color: 'bg-blue-100 text-blue-800' },
      completed: { label: 'مكتمل', color: 'bg-green-100 text-green-800' },
      failed: { label: 'فاشل', color: 'bg-red-100 text-red-800' },
      refunded: { label: 'مسترد', color: 'bg-purple-100 text-purple-800' },
      cancelled: { label: 'ملغي', color: 'bg-gray-100 text-gray-800' },
    };
    return config[status];
  };

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* الشريط الجانبي */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-card border-l border-border transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && <h1 className="font-bold text-lg">إدارة المدفوعات</h1>}
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        <nav className="flex-1 p-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? 'secondary' : 'ghost'}
              className={`w-full justify-start mb-1 ${!sidebarOpen && 'px-3'}`}
              onClick={() => setActiveSection(item.id as typeof activeSection)}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="mr-3">{item.label}</span>}
            </Button>
          ))}
        </nav>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 overflow-auto">
        <header className="bg-card border-b border-border p-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold">
            {menuItems.find((m) => m.id === activeSection)?.label}
          </h2>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 ml-2" />
              تصدير التقرير
            </Button>
          </div>
        </header>

        <div className="p-6">
          {/* نظرة عامة */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* البطاقات الإحصائية */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
                          <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} د.ل</p>
                          <p className="text-xs text-green-600 mt-1">
                            +{stats.todayRevenue} اليوم
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">عمولة المنصة</p>
                          <p className="text-2xl font-bold">{stats.totalCommission.toLocaleString()} د.ل</p>
                          <p className="text-xs text-primary mt-1">
                            +{stats.todayCommission} اليوم
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Wallet className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">المعاملات</p>
                          <p className="text-2xl font-bold">{stats.totalTransactions}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge className="bg-green-100 text-green-800 text-xs">{stats.completedTransactions} مكتمل</Badge>
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">{stats.pendingTransactions} معلق</Badge>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">مقدمي الخدمة</p>
                          <p className="text-2xl font-bold">{stats.totalProviders}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            أرصدة: {stats.totalProviderBalance} د.ل
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* توزيع طرق الدفع */}
              <Card>
                <CardHeader>
                  <CardTitle>توزيع طرق الدفع</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentMethodStats.map((stat, i) => (
                      <div key={stat.method} className="flex items-center gap-4">
                        <div className="w-32 font-medium truncate">{stat.name}</div>
                        <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(stat.count / Math.max(...paymentMethodStats.map(s => s.count))) * 100}%` }}
                          />
                        </div>
                        <div className="w-24 text-left text-sm text-muted-foreground">
                          {stat.count} ({stat.amount} د.ل)
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* آخر المعاملات */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>آخر المعاملات</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setActiveSection('transactions')}>
                    عرض الكل
                    <ChevronRight className="w-4 h-4 mr-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((txn) => {
                      const status = getStatusBadge(txn.status);
                      return (
                        <div key={txn.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              txn.status === 'completed' ? 'bg-green-100' : 'bg-muted'
                            }`}>
                              <ArrowUpRight className={`w-5 h-5 ${
                                txn.status === 'completed' ? 'text-green-600' : 'text-muted-foreground'
                              }`} />
                            </div>
                            <div>
                              <p className="font-medium">{txn.serviceName}</p>
                              <p className="text-xs text-muted-foreground">{txn.providerName}</p>
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="font-bold">{txn.amount} د.ل</p>
                            <Badge className={status.color}>{status.label}</Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* المعاملات */}
          {activeSection === 'transactions' && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="بحث بالاسم أو رقم الإيصال..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 ml-2" />
                  فلترة
                </Button>
              </div>

              <Card>
                <ScrollArea className="h-[600px]">
                  <div className="p-4 space-y-3">
                    {transactions
                      .filter((t) => 
                        t.serviceName.includes(searchQuery) ||
                        t.receiptNumber.includes(searchQuery) ||
                        t.providerName.includes(searchQuery)
                      )
                      .map((txn) => {
                        const status = getStatusBadge(txn.status);
                        return (
                          <Card key={txn.id} className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <p className="font-medium">{txn.serviceName}</p>
                                <p className="text-sm text-muted-foreground">{txn.providerName}</p>
                                <div className="flex gap-2 mt-2">
                                  <Badge variant="outline">{txn.receiptNumber}</Badge>
                                  <Badge variant="outline">
                                    {LIBYAN_PAYMENT_METHODS.find((m) => m.id === txn.paymentMethod)?.name}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-left space-y-1">
                                <p className="font-bold text-lg">{txn.amount} د.ل</p>
                                <p className="text-xs text-muted-foreground">
                                  عمولة: {txn.platformFee} د.ل
                                </p>
                                <Badge className={status.color}>{status.label}</Badge>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                  </div>
                </ScrollArea>
              </Card>
            </div>
          )}

          {/* وسائل الدفع */}
          {activeSection === 'methods' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>إدارة وسائل الدفع</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {LIBYAN_PAYMENT_METHODS.map((method) => {
                      const isEnabled = settings.enabledMethods.includes(method.id);
                      
                      return (
                        <div 
                          key={method.id} 
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg ${method.color} flex items-center justify-center`}>
                              <Smartphone className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="font-medium">{method.name}</p>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline">عمولة: {method.commissionRate}%</Badge>
                                <Badge variant="outline">
                                  {method.minAmount} - {method.maxAmount} د.ل
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={(checked) => togglePaymentMethod(method.id, checked)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* مقدمي الخدمة */}
          {activeSection === 'providers' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>محافظ مقدمي الخدمة</CardTitle>
                </CardHeader>
                <CardContent>
                  {providerWallets.length === 0 ? (
                    <div className="text-center py-8">
                      <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">لا توجد محافظ مقدمي خدمة حالياً</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {providerWallets.map((wallet) => (
                        <Card key={wallet.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{wallet.providerName}</p>
                              <Badge variant="outline" className="mt-1">{wallet.providerType}</Badge>
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-lg">{wallet.balance} د.ل</p>
                              <p className="text-xs text-muted-foreground">
                                إجمالي: {wallet.totalEarnings} د.ل
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* الإعدادات */}
          {activeSection === 'settings' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات العمولات</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>العمولة الافتراضية (%)</Label>
                      <Input
                        type="number"
                        value={settings.defaultCommissionRate}
                        onChange={(e) => updateSettings({ defaultCommissionRate: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label>مهلة الموافقة التلقائية (دقائق)</Label>
                      <Input
                        type="number"
                        value={settings.autoApproveTimeout}
                        onChange={(e) => updateSettings({ autoApproveTimeout: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="mb-3 block">عمولات حسب نوع الخدمة</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(SERVICE_COMMISSIONS).map(([service, rate]) => (
                        <div key={service} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">{service}</span>
                          <Badge variant="outline">{rate}%</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>الحد الأدنى للشحن (د.ل)</Label>
                      <Input
                        type="number"
                        value={settings.minTopupAmount}
                        onChange={(e) => updateSettings({ minTopupAmount: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label>الحد الأقصى للشحن (د.ل)</Label>
                      <Input
                        type="number"
                        value={settings.maxTopupAmount}
                        onChange={(e) => updateSettings({ maxTopupAmount: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>الحد الأدنى للسحب (د.ل)</Label>
                      <Input
                        type="number"
                        value={settings.minWithdrawAmount}
                        onChange={(e) => updateSettings({ minWithdrawAmount: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label>الحد الأقصى اليومي للسحب (د.ل)</Label>
                      <Input
                        type="number"
                        value={settings.maxDailyWithdraw}
                        onChange={(e) => updateSettings({ maxDailyWithdraw: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPaymentsPage;
