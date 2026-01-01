import { useState, useMemo } from "react";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Pill, Plus, Clock, Bell, AlertTriangle, CheckCircle, 
  RefreshCw, ShoppingCart, Calendar, Trash2, Edit2,
  Package, Truck, CreditCard, X, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEnhancedFeaturesStore } from "@/stores/enhancedFeaturesStore";
import { useHealthcareStore } from "@/stores/healthcareStore";
import { pharmacies } from "@/data/mockData";
import { LIBYAN_PAYMENT_METHODS, MedicationReminder, RefillOrder } from "@/types/enhancedFeatures";
import { toast } from "sonner";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const frequencyOptions = [
  { value: 'once_daily', label: 'مرة واحدة يومياً' },
  { value: 'twice_daily', label: 'مرتين يومياً' },
  { value: 'three_times_daily', label: 'ثلاث مرات يومياً' },
  { value: 'every_8_hours', label: 'كل 8 ساعات' },
  { value: 'every_12_hours', label: 'كل 12 ساعة' },
  { value: 'weekly', label: 'أسبوعياً' },
  { value: 'as_needed', label: 'عند الحاجة' }
];

const formOptions = [
  { value: 'tablet', label: 'أقراص' },
  { value: 'capsule', label: 'كبسولات' },
  { value: 'syrup', label: 'شراب' },
  { value: 'injection', label: 'حقن' },
  { value: 'cream', label: 'كريم' },
  { value: 'drops', label: 'قطرات' },
  { value: 'inhaler', label: 'بخاخ' }
];

const MedicationReminderPage = () => {
  const [activeTab, setActiveTab] = useState("reminders");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [refillDialogOpen, setRefillDialogOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<MedicationReminder | null>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<{ reminderId: string; time: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    medicationName: '',
    genericName: '',
    dosage: '',
    form: '' as MedicationReminder['form'] | '',
    frequency: '' as MedicationReminder['frequency'] | '',
    times: ['08:00'],
    startDate: '',
    endDate: '',
    totalQuantity: 30,
    refillThreshold: 7,
    instructions: '',
    autoRefill: false
  });

  const {
    medicationReminders,
    medicationLogs,
    refillOrders,
    addMedicationReminder,
    updateMedicationReminder,
    deleteMedicationReminder,
    logMedicationTaken,
    logMedicationSkipped,
    snoozeMedication,
    addRefillOrder,
    updateRefillOrder
  } = useEnhancedFeaturesStore();

  const { addNotification, userId } = useHealthcareStore();

  // Get reminders needing refill
  const lowStockReminders = useMemo(() => {
    return medicationReminders.filter(r => r.isActive && r.remainingQuantity <= r.refillThreshold);
  }, [medicationReminders]);

  // Today's medication schedule
  const todaySchedule = useMemo(() => {
    const schedule: { reminder: MedicationReminder; time: string; status: 'pending' | 'taken' | 'skipped' | 'snoozed' }[] = [];
    const today = new Date().toISOString().split('T')[0];
    
    medicationReminders.filter(r => r.isActive).forEach(reminder => {
      reminder.times.forEach(time => {
        const log = medicationLogs.find(
          l => l.reminderId === reminder.id && 
               l.scheduledTime === `${today}T${time}:00` 
        );
        schedule.push({
          reminder,
          time,
          status: log?.status || 'pending'
        });
      });
    });

    return schedule.sort((a, b) => a.time.localeCompare(b.time));
  }, [medicationReminders, medicationLogs]);

  const resetForm = () => {
    setFormData({
      medicationName: '',
      genericName: '',
      dosage: '',
      form: '',
      frequency: '',
      times: ['08:00'],
      startDate: '',
      endDate: '',
      totalQuantity: 30,
      refillThreshold: 7,
      instructions: '',
      autoRefill: false
    });
  };

  const handleAddReminder = () => {
    if (!formData.medicationName || !formData.dosage || !formData.form || !formData.frequency) {
      toast.error('الرجاء إكمال جميع الحقول المطلوبة');
      return;
    }

    try {
      const newReminder: MedicationReminder = {
        id: `med-${Date.now()}`,
        patientId: userId,
        medicationName: formData.medicationName,
        genericName: formData.genericName || undefined,
        dosage: formData.dosage,
        form: formData.form as MedicationReminder['form'],
        frequency: formData.frequency as MedicationReminder['frequency'],
        times: formData.times,
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        endDate: formData.endDate || undefined,
        totalQuantity: formData.totalQuantity,
        remainingQuantity: formData.totalQuantity,
        refillThreshold: formData.refillThreshold,
        instructions: formData.instructions || undefined,
        isActive: true,
        autoRefill: formData.autoRefill,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      addMedicationReminder(newReminder);

      addNotification({
        id: `notif-${Date.now()}`,
        userId,
        type: 'general',
        title: 'تم إضافة تذكير دواء',
        message: `تمت إضافة ${formData.medicationName} إلى قائمة التذكيرات`,
        isRead: false,
        createdAt: new Date().toISOString()
      });

      toast.success('تم إضافة الدواء بنجاح');
      setAddDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ أثناء الإضافة');
    }
  };

  const handleTakeMedication = (reminderId: string, time: string) => {
    const today = new Date().toISOString().split('T')[0];
    logMedicationTaken(reminderId, `${today}T${time}:00`);
    
    addNotification({
      id: `notif-${Date.now()}`,
      userId,
      type: 'general',
      title: 'تم تسجيل الدواء',
      message: 'تم تسجيل تناول الدواء بنجاح',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    toast.success('تم تسجيل تناول الدواء');
    setActionDialogOpen(false);
  };

  const handleSkipMedication = (reminderId: string, time: string) => {
    const today = new Date().toISOString().split('T')[0];
    logMedicationSkipped(reminderId, `${today}T${time}:00`);
    toast.info('تم تخطي الجرعة');
    setActionDialogOpen(false);
  };

  const handleSnoozeMedication = (reminderId: string, time: string) => {
    const today = new Date().toISOString().split('T')[0];
    snoozeMedication(reminderId, `${today}T${time}:00`, 15);
    toast.info('سيتم تذكيرك بعد 15 دقيقة');
    setActionDialogOpen(false);
  };

  const handleRefillOrder = () => {
    if (!selectedReminder || !selectedPharmacy || !paymentMethod) {
      toast.error('الرجاء إكمال جميع البيانات');
      return;
    }

    const pharmacy = pharmacies.find(p => p.id === selectedPharmacy);
    const order: RefillOrder = {
      id: `refill-${Date.now()}`,
      reminderId: selectedReminder.id,
      medicationName: selectedReminder.medicationName,
      quantity: selectedReminder.totalQuantity,
      pharmacyId: selectedPharmacy,
      pharmacyName: pharmacy?.name || '',
      status: 'pending',
      paymentMethod: paymentMethod as RefillOrder['paymentMethod'],
      paymentStatus: paymentMethod === 'cash_on_delivery' ? 'cod' : 'pending',
      totalAmount: 45, // Mock price
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addRefillOrder(order);

    // Update reminder quantity
    updateMedicationReminder(selectedReminder.id, {
      remainingQuantity: selectedReminder.totalQuantity
    });

    addNotification({
      id: `notif-${Date.now()}`,
      userId,
      type: 'general',
      title: 'تم طلب إعادة التعبئة',
      message: `تم طلب ${selectedReminder.medicationName} من ${pharmacy?.name}`,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    toast.success('تم إرسال طلب إعادة التعبئة');
    setRefillDialogOpen(false);
    setSelectedReminder(null);
    setSelectedPharmacy('');
    setPaymentMethod('');
  };

  const getStockStatus = (remaining: number, threshold: number, total: number) => {
    const percentage = (remaining / total) * 100;
    if (remaining <= threshold) return { color: 'destructive', text: 'منخفض' };
    if (percentage <= 50) return { color: 'warning', text: 'متوسط' };
    return { color: 'success', text: 'كافٍ' };
  };

  return (
    <PatientLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Pill className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">تذكير الأدوية</h1>
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 ml-2" />
            إضافة دواء
          </Button>
        </div>

        {/* Low Stock Alert */}
        {lowStockReminders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-destructive/10 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-destructive">
                      {lowStockReminders.length} دواء يحتاج إعادة تعبئة
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {lowStockReminders.map(r => r.medicationName).join('، ')}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedReminder(lowStockReminders[0]);
                      setRefillDialogOpen(true);
                    }}
                  >
                    <RefreshCw className="h-4 w-4 ml-2" />
                    إعادة تعبئة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="today">اليوم</TabsTrigger>
            <TabsTrigger value="reminders">الأدوية</TabsTrigger>
            <TabsTrigger value="orders">الطلبات</TabsTrigger>
          </TabsList>

          {/* Today's Schedule */}
          <TabsContent value="today" className="space-y-4 mt-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              جدول اليوم
            </h3>
            
            {todaySchedule.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">لا توجد أدوية مجدولة لهذا اليوم</p>
                </CardContent>
              </Card>
            ) : (
              todaySchedule.map((item, index) => (
                <motion.div
                  key={`${item.reminder.id}-${item.time}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={item.status === 'taken' ? 'bg-green-50 border-green-200' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`text-2xl font-bold ${item.status === 'taken' ? 'text-green-600' : 'text-primary'}`}>
                            {item.time}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.reminder.medicationName}</span>
                              {item.status === 'taken' && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {item.reminder.dosage} - {formOptions.find(f => f.value === item.reminder.form)?.label}
                            </p>
                          </div>
                        </div>
                        
                        {item.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setCurrentAction({ reminderId: item.reminder.id, time: item.time });
                              setActionDialogOpen(true);
                            }}
                          >
                            تسجيل
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>

          {/* All Medications */}
          <TabsContent value="reminders" className="space-y-4 mt-4">
            {medicationReminders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">لم تقم بإضافة أي أدوية بعد</p>
                  <Button onClick={() => setAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة دواء
                  </Button>
                </CardContent>
              </Card>
            ) : (
              medicationReminders.map((reminder, index) => {
                const stock = getStockStatus(reminder.remainingQuantity, reminder.refillThreshold, reminder.totalQuantity);
                
                return (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                              <Pill className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{reminder.medicationName}</span>
                                {!reminder.isActive && (
                                  <Badge variant="secondary">متوقف</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {reminder.dosage} - {frequencyOptions.find(f => f.value === reminder.frequency)?.label}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedReminder(reminder);
                                setRefillDialogOpen(true);
                              }}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => {
                                deleteMedicationReminder(reminder.id);
                                toast.success('تم حذف التذكير');
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">الكمية المتبقية</span>
                            <Badge variant={stock.color === 'destructive' ? 'destructive' : 'secondary'}>
                              {stock.text}: {reminder.remainingQuantity}/{reminder.totalQuantity}
                            </Badge>
                          </div>
                          <Progress 
                            value={(reminder.remainingQuantity / reminder.totalQuantity) * 100}
                            className={stock.color === 'destructive' ? '[&>div]:bg-destructive' : ''}
                          />
                        </div>

                        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>الأوقات: {reminder.times.join(' • ')}</span>
                        </div>

                        {reminder.instructions && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {reminder.instructions}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4 mt-4">
            {refillOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">لا توجد طلبات إعادة تعبئة</p>
                </CardContent>
              </Card>
            ) : (
              refillOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-medium">{order.medicationName}</div>
                          <p className="text-sm text-muted-foreground">{order.pharmacyName}</p>
                        </div>
                        <Badge variant={
                          order.status === 'delivered' ? 'default' :
                          order.status === 'cancelled' ? 'destructive' : 'secondary'
                        }>
                          {order.status === 'pending' && 'قيد الانتظار'}
                          {order.status === 'confirmed' && 'تم التأكيد'}
                          {order.status === 'preparing' && 'قيد التحضير'}
                          {order.status === 'ready' && 'جاهز'}
                          {order.status === 'out_for_delivery' && 'في الطريق'}
                          {order.status === 'delivered' && 'تم التوصيل'}
                          {order.status === 'cancelled' && 'ملغي'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{format(new Date(order.createdAt), 'd MMMM yyyy', { locale: ar })}</span>
                        <span>{order.totalAmount} د.ل</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Medication Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>إضافة دواء جديد</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>اسم الدواء *</Label>
              <Input
                value={formData.medicationName}
                onChange={(e) => setFormData({ ...formData, medicationName: e.target.value })}
                placeholder="مثال: أملوديبين"
              />
            </div>

            <div>
              <Label>الجرعة *</Label>
              <Input
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="مثال: 5mg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>الشكل الدوائي *</Label>
                <Select
                  value={formData.form}
                  onValueChange={(value) => setFormData({ ...formData, form: value as MedicationReminder['form'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    {formOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>التكرار *</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => setFormData({ ...formData, frequency: value as MedicationReminder['frequency'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>أوقات التذكير</Label>
              <div className="flex gap-2 flex-wrap">
                {formData.times.map((time, i) => (
                  <Input
                    key={i}
                    type="time"
                    value={time}
                    onChange={(e) => {
                      const newTimes = [...formData.times];
                      newTimes[i] = e.target.value;
                      setFormData({ ...formData, times: newTimes });
                    }}
                    className="w-28"
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setFormData({ ...formData, times: [...formData.times, '12:00'] })}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>الكمية الإجمالية</Label>
                <Input
                  type="number"
                  value={formData.totalQuantity}
                  onChange={(e) => setFormData({ ...formData, totalQuantity: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>حد التنبيه</Label>
                <Input
                  type="number"
                  value={formData.refillThreshold}
                  onChange={(e) => setFormData({ ...formData, refillThreshold: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <Label>تعليمات الاستخدام</Label>
              <Input
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="مثال: تؤخذ قبل الطعام"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setAddDialogOpen(false); resetForm(); }}>
              إلغاء
            </Button>
            <Button onClick={handleAddReminder}>
              إضافة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>تسجيل الدواء</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Button 
              className="w-full justify-start" 
              onClick={() => currentAction && handleTakeMedication(currentAction.reminderId, currentAction.time)}
            >
              <Check className="h-4 w-4 ml-2" />
              تم تناول الدواء
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => currentAction && handleSnoozeMedication(currentAction.reminderId, currentAction.time)}
            >
              <Clock className="h-4 w-4 ml-2" />
              تأجيل 15 دقيقة
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground"
              onClick={() => currentAction && handleSkipMedication(currentAction.reminderId, currentAction.time)}
            >
              <X className="h-4 w-4 ml-2" />
              تخطي هذه الجرعة
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Refill Dialog */}
      <Dialog open={refillDialogOpen} onOpenChange={setRefillDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>إعادة تعبئة الدواء</DialogTitle>
          </DialogHeader>
          
          {selectedReminder && (
            <div className="space-y-4">
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Pill className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">{selectedReminder.medicationName}</div>
                      <p className="text-sm text-muted-foreground">{selectedReminder.dosage}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <Label>اختر الصيدلية</Label>
                <Select value={selectedPharmacy} onValueChange={setSelectedPharmacy}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر صيدلية" />
                  </SelectTrigger>
                  <SelectContent>
                    {pharmacies.map((pharmacy) => (
                      <SelectItem key={pharmacy.id} value={pharmacy.id}>
                        {pharmacy.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>طريقة الدفع</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {LIBYAN_PAYMENT_METHODS.slice(0, 6).map((method) => (
                    <Button
                      key={method.method}
                      variant={paymentMethod === method.method ? "default" : "outline"}
                      className="justify-start h-auto py-3"
                      onClick={() => setPaymentMethod(method.method)}
                    >
                      <span className="text-lg ml-2">{method.icon}</span>
                      <span className="text-sm">{method.nameAr}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Card className="bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span>المجموع</span>
                    <span className="text-xl font-bold">45 د.ل</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRefillDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleRefillOrder}>
              <ShoppingCart className="h-4 w-4 ml-2" />
              تأكيد الطلب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PatientLayout>
  );
};

export default MedicationReminderPage;