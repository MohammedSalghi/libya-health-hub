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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Pill, Plus, Clock, Bell, AlertTriangle, CheckCircle, 
  RefreshCw, ShoppingCart, Calendar, Trash2, Edit2,
  Package, Truck, CreditCard, X, Check, Shield, Users,
  Activity, FileText, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEnhancedFeaturesStore } from "@/stores/enhancedFeaturesStore";
import { useHealthcareStore } from "@/stores/healthcareStore";
import { LIBYAN_PAYMENT_METHODS, MedicationReminder, RefillOrder } from "@/types/enhancedFeatures";
import { libyanPharmacies, libyanMedications, checkDrugInteractions, calculateComplianceReport } from "@/data/libyaHealthcareData";
import { toast } from "sonner";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const frequencyOptions = [
  { value: 'once_daily', label: 'مرة واحدة يومياً', doses: 1 },
  { value: 'twice_daily', label: 'مرتين يومياً', doses: 2 },
  { value: 'three_times_daily', label: 'ثلاث مرات يومياً', doses: 3 },
  { value: 'every_8_hours', label: 'كل 8 ساعات', doses: 3 },
  { value: 'every_12_hours', label: 'كل 12 ساعة', doses: 2 },
  { value: 'weekly', label: 'أسبوعياً', doses: 0.14 },
  { value: 'as_needed', label: 'عند الحاجة', doses: 0 }
];

const formOptions = [
  { value: 'tablet', label: 'أقراص', icon: '💊' },
  { value: 'capsule', label: 'كبسولات', icon: '💊' },
  { value: 'syrup', label: 'شراب', icon: '🧴' },
  { value: 'injection', label: 'حقن', icon: '💉' },
  { value: 'cream', label: 'كريم', icon: '🧴' },
  { value: 'drops', label: 'قطرات', icon: '💧' },
  { value: 'inhaler', label: 'بخاخ', icon: '🌬️' }
];

const MedicationReminderPage = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [refillDialogOpen, setRefillDialogOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<MedicationReminder | null>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState('');
  const [selectedCity, setSelectedCity] = useState<'طرابلس' | 'بنغازي' | ''>('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<{ reminderId: string; time: string } | null>(null);
  const [interactionWarningOpen, setInteractionWarningOpen] = useState(false);
  const [interactionWarnings, setInteractionWarnings] = useState<string[]>([]);

  // Form state - مقيد بالوصفات الطبية فقط
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
    autoRefill: false,
    prescriptionId: '',
    doctorName: ''
  });

  const {
    medicationReminders,
    medicationLogs,
    refillOrders,
    familyMembers,
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

  // حساب تقرير الالتزام
  const complianceReport = useMemo(() => {
    return calculateComplianceReport(
      medicationLogs.map(l => ({ status: l.status }))
    );
  }, [medicationLogs]);

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

  // صيدليات المدينة المختارة
  const filteredPharmacies = useMemo(() => {
    if (!selectedCity) return libyanPharmacies;
    return libyanPharmacies.filter(p => p.city === selectedCity);
  }, [selectedCity]);

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
      autoRefill: false,
      prescriptionId: '',
      doctorName: ''
    });
  };

  // فحص التفاعلات الدوائية قبل الإضافة
  const checkInteractionsBeforeAdd = () => {
    const currentMedications = medicationReminders
      .filter(r => r.isActive)
      .map(r => r.medicationName);
    
    const allMedications = [...currentMedications, formData.medicationName];
    
    // جلب الحساسية من أعضاء العائلة
    const userAllergies: string[] = [];
    familyMembers.forEach(m => {
      if (m.allergies) userAllergies.push(...m.allergies);
    });

    const result = checkDrugInteractions(allMedications, userAllergies);
    
    if (result.hasInteraction) {
      setInteractionWarnings(result.warnings);
      setInteractionWarningOpen(true);
      return false;
    }
    
    return true;
  };

  const handleAddReminder = (force = false) => {
    if (!formData.medicationName || !formData.dosage || !formData.form || !formData.frequency) {
      toast.error('الرجاء إكمال جميع الحقول المطلوبة');
      return;
    }

    if (!formData.prescriptionId && !formData.doctorName) {
      toast.error('يجب إدخال رقم الوصفة أو اسم الطبيب الموصي');
      return;
    }

    // فحص التفاعلات
    if (!force && !checkInteractionsBeforeAdd()) {
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
        prescriptionId: formData.prescriptionId || undefined,
        doctorName: formData.doctorName || undefined,
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
        message: `تمت إضافة ${formData.medicationName} إلى قائمة التذكيرات. سيتم تنبيهك في الأوقات المحددة.`,
        isRead: false,
        createdAt: new Date().toISOString()
      });

      toast.success('تم إضافة الدواء بنجاح');
      setAddDialogOpen(false);
      setInteractionWarningOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ أثناء الإضافة');
    }
  };

  const handleTakeMedication = (reminderId: string, time: string) => {
    const today = new Date().toISOString().split('T')[0];
    logMedicationTaken(reminderId, `${today}T${time}:00`);
    
    const reminder = medicationReminders.find(r => r.id === reminderId);
    
    // تحقق من انخفاض المخزون
    if (reminder && reminder.remainingQuantity <= reminder.refillThreshold + 1) {
      addNotification({
        id: `notif-${Date.now()}`,
        userId,
        type: 'general',
        title: 'تنبيه: الدواء على وشك النفاد',
        message: `${reminder.medicationName} متبقي منه ${reminder.remainingQuantity - 1} جرعة فقط. يُنصح بإعادة التعبئة.`,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    toast.success('تم تسجيل تناول الدواء ✓');
    setActionDialogOpen(false);
  };

  const handleSkipMedication = (reminderId: string, time: string) => {
    const today = new Date().toISOString().split('T')[0];
    logMedicationSkipped(reminderId, `${today}T${time}:00`);
    
    addNotification({
      id: `notif-${Date.now()}`,
      userId,
      type: 'general',
      title: 'تم تخطي جرعة',
      message: 'تم تسجيل تخطي الجرعة. تذكر أن الالتزام بالدواء مهم لصحتك.',
      isRead: false,
      createdAt: new Date().toISOString()
    });

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

    const pharmacy = libyanPharmacies.find(p => p.id === selectedPharmacy);
    
    if (!pharmacy) {
      toast.error('الرجاء اختيار صيدلية صحيحة');
      return;
    }

    const medication = libyanMedications.find(m => m.name === selectedReminder.medicationName);
    const price = medication?.averagePrice || 30;
    const totalAmount = price + (pharmacy.offersDelivery ? pharmacy.deliveryFee : 0);

    const order: RefillOrder = {
      id: `refill-${Date.now()}`,
      reminderId: selectedReminder.id,
      medicationName: selectedReminder.medicationName,
      quantity: selectedReminder.totalQuantity,
      pharmacyId: selectedPharmacy,
      pharmacyName: pharmacy.nameAr,
      status: 'pending',
      paymentMethod: paymentMethod as RefillOrder['paymentMethod'],
      paymentStatus: paymentMethod === 'cash_on_delivery' ? 'cod' : 'pending',
      totalAmount,
      deliveryAddress: 'العنوان المحفوظ',
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
      message: `تم طلب ${selectedReminder.medicationName} من ${pharmacy.nameAr}. سيتم إشعارك عند تأكيد الطلب.`,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    toast.success('تم إرسال طلب إعادة التعبئة');
    setRefillDialogOpen(false);
    setSelectedReminder(null);
    setSelectedPharmacy('');
    setSelectedCity('');
    setPaymentMethod('');
  };

  const getStockStatus = (remaining: number, threshold: number, total: number) => {
    const percentage = (remaining / total) * 100;
    if (remaining <= threshold) return { color: 'destructive', text: 'منخفض', bgColor: 'bg-red-100' };
    if (percentage <= 50) return { color: 'warning', text: 'متوسط', bgColor: 'bg-yellow-100' };
    return { color: 'success', text: 'كافٍ', bgColor: 'bg-green-100' };
  };

  const getOrderStatusBadge = (status: RefillOrder['status']) => {
    const statusMap: Record<RefillOrder['status'], { label: string; className: string }> = {
      pending: { label: 'قيد المراجعة', className: 'bg-yellow-100 text-yellow-700' },
      confirmed: { label: 'مؤكد', className: 'bg-blue-100 text-blue-700' },
      preparing: { label: 'قيد التحضير', className: 'bg-purple-100 text-purple-700' },
      ready: { label: 'جاهز للاستلام', className: 'bg-green-100 text-green-700' },
      out_for_delivery: { label: 'في الطريق', className: 'bg-orange-100 text-orange-700' },
      delivered: { label: 'تم التسليم', className: 'bg-green-100 text-green-700' },
      cancelled: { label: 'ملغي', className: 'bg-red-100 text-red-700' }
    };
    return statusMap[status];
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

        {/* Compliance Stats */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <span className="font-medium">نسبة الالتزام بالأدوية</span>
              </div>
              <Badge className={complianceReport.complianceRate >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                {complianceReport.complianceRate.toFixed(0)}%
              </Badge>
            </div>
            <Progress value={complianceReport.complianceRate} className="h-2 mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{complianceReport.takenDoses} جرعة تم تناولها</span>
              <span>سلسلة الالتزام: {complianceReport.streak} أيام</span>
            </div>
          </CardContent>
        </Card>

        {/* Safety Notice */}
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <span className="font-medium">سلامتك أولاً:</span> التذكيرات مبنية على الوصفات الطبية المعتمدة فقط. 
            يتم فحص التفاعلات الدوائية والحساسية تلقائياً.
          </AlertDescription>
        </Alert>

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
            <TabsTrigger value="today" className="relative">
              اليوم
              {todaySchedule.filter(s => s.status === 'pending').length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {todaySchedule.filter(s => s.status === 'pending').length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="reminders">الأدوية</TabsTrigger>
            <TabsTrigger value="orders">الطلبات</TabsTrigger>
          </TabsList>

          {/* Today's Schedule */}
          <TabsContent value="today" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                جدول اليوم - {format(new Date(), 'd MMMM yyyy', { locale: ar })}
              </h3>
            </div>
            
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
                  <Card className={
                    item.status === 'taken' ? 'bg-green-50 border-green-200' : 
                    item.status === 'skipped' ? 'bg-gray-50 border-gray-200' : ''
                  }>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`text-2xl font-bold ${
                            item.status === 'taken' ? 'text-green-600' : 
                            item.status === 'skipped' ? 'text-gray-400' : 'text-primary'
                          }`}>
                            {item.time}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.reminder.medicationName}</span>
                              {item.status === 'taken' && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                              {item.status === 'skipped' && (
                                <X className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {item.reminder.dosage} - {formOptions.find(f => f.value === item.reminder.form)?.label}
                            </p>
                            {item.reminder.instructions && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.reminder.instructions}
                              </p>
                            )}
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
                  <h3 className="font-medium mb-2">لم تقم بإضافة أي أدوية بعد</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    أضف أدويتك من الوصفات الطبية لتلقي تذكيرات في الأوقات المحددة
                  </p>
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
                    <Card className={!reminder.isActive ? 'opacity-60' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${stock.bgColor}`}>
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
                              {reminder.doctorName && (
                                <p className="text-xs text-muted-foreground">
                                  الطبيب: {reminder.doctorName}
                                </p>
                              )}
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
                              onClick={() => deleteMedicationReminder(reminder.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>

                        {/* Stock Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">المخزون</span>
                            <Badge className={stock.bgColor + ' ' + (stock.color === 'destructive' ? 'text-red-700' : stock.color === 'warning' ? 'text-yellow-700' : 'text-green-700')}>
                              {stock.text} - {reminder.remainingQuantity} من {reminder.totalQuantity}
                            </Badge>
                          </div>
                          <Progress 
                            value={(reminder.remainingQuantity / reminder.totalQuantity) * 100} 
                            className="h-2"
                          />
                        </div>

                        {/* Times */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {reminder.times.map((time, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 ml-1" />
                              {time}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders" className="space-y-4 mt-4">
            {refillOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">لا توجد طلبات إعادة تعبئة</p>
                </CardContent>
              </Card>
            ) : (
              refillOrders.map((order, index) => {
                const statusInfo = getOrderStatusBadge(order.status);
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{order.medicationName}</span>
                              <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {order.pharmacyName} • {order.quantity} قطعة
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(order.createdAt), 'd MMMM yyyy', { locale: ar })}
                            </p>
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-primary">{order.totalAmount} د.ل</p>
                            <p className="text-xs text-muted-foreground">
                              {LIBYAN_PAYMENT_METHODS.find(m => m.method === order.paymentMethod)?.nameAr}
                            </p>
                          </div>
                        </div>
                        
                        {order.status === 'out_for_delivery' && (
                          <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg text-sm">
                            <Truck className="h-4 w-4 text-orange-600" />
                            <span className="text-orange-700">الطلب في الطريق إليك</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Medication Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              إضافة دواء من وصفة طبية
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                لضمان السلامة، يُرجى إدخال بيانات الدواء من الوصفة الطبية الموصوفة من الطبيب.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>رقم الوصفة</Label>
                <Input
                  value={formData.prescriptionId}
                  onChange={(e) => setFormData({ ...formData, prescriptionId: e.target.value })}
                  placeholder="RX-XXXX"
                  dir="ltr"
                />
              </div>
              <div>
                <Label>الطبيب الموصي *</Label>
                <Input
                  value={formData.doctorName}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                  placeholder="د. أحمد محمد"
                />
              </div>
            </div>

            <div>
              <Label>اسم الدواء *</Label>
              <Select
                value={formData.medicationName}
                onValueChange={(value) => {
                  const med = libyanMedications.find(m => m.name === value);
                  setFormData({ 
                    ...formData, 
                    medicationName: value,
                    genericName: med?.genericName || ''
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدواء" />
                </SelectTrigger>
                <SelectContent>
                  {libyanMedications.map((med) => (
                    <SelectItem key={med.id} value={med.name}>
                      {med.name} ({med.genericName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>الجرعة *</Label>
                <Input
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  placeholder="مثال: 500mg"
                />
              </div>
              <div>
                <Label>الشكل *</Label>
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
                        {opt.icon} {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>التكرار *</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) => {
                  const freq = frequencyOptions.find(f => f.value === value);
                  const times = freq?.doses === 1 ? ['08:00'] :
                               freq?.doses === 2 ? ['08:00', '20:00'] :
                               freq?.doses === 3 ? ['08:00', '14:00', '20:00'] :
                               ['08:00'];
                  setFormData({ ...formData, frequency: value as MedicationReminder['frequency'], times });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر التكرار" />
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>الكمية الإجمالية</Label>
                <Input
                  type="number"
                  value={formData.totalQuantity}
                  onChange={(e) => setFormData({ ...formData, totalQuantity: parseInt(e.target.value) || 30 })}
                />
              </div>
              <div>
                <Label>تنبيه عند</Label>
                <Input
                  type="number"
                  value={formData.refillThreshold}
                  onChange={(e) => setFormData({ ...formData, refillThreshold: parseInt(e.target.value) || 7 })}
                />
              </div>
            </div>

            <div>
              <Label>تعليمات إضافية</Label>
              <Input
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="مثال: تؤخذ بعد الطعام"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setAddDialogOpen(false); resetForm(); }}>
              إلغاء
            </Button>
            <Button onClick={() => handleAddReminder()}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة الدواء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Drug Interaction Warning Dialog */}
      <Dialog open={interactionWarningOpen} onOpenChange={setInteractionWarningOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-5 w-5" />
              تحذير: تفاعلات دوائية محتملة
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {interactionWarnings.map((warning, i) => (
              <Alert key={i} className="border-yellow-200 bg-yellow-50">
                <AlertDescription className="text-yellow-800">
                  {warning}
                </AlertDescription>
              </Alert>
            ))}
            <p className="text-sm text-muted-foreground">
              يُنصح بمراجعة الطبيب أو الصيدلي قبل تناول هذا الدواء.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setInteractionWarningOpen(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={() => handleAddReminder(true)}>
              متابعة رغم التحذير
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>تسجيل الجرعة</DialogTitle>
          </DialogHeader>
          
          {currentAction && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <Button
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => handleTakeMedication(currentAction.reminderId, currentAction.time)}
                >
                  <Check className="h-6 w-6" />
                  <span className="text-sm">تم تناوله</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => handleSnoozeMedication(currentAction.reminderId, currentAction.time)}
                >
                  <Clock className="h-6 w-6" />
                  <span className="text-sm">تأجيل</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-4 text-destructive"
                  onClick={() => handleSkipMedication(currentAction.reminderId, currentAction.time)}
                >
                  <X className="h-6 w-6" />
                  <span className="text-sm">تخطي</span>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Refill Dialog */}
      <Dialog open={refillDialogOpen} onOpenChange={setRefillDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              طلب إعادة تعبئة
            </DialogTitle>
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
                <Label>المدينة</Label>
                <Select
                  value={selectedCity}
                  onValueChange={(value) => {
                    setSelectedCity(value as 'طرابلس' | 'بنغازي');
                    setSelectedPharmacy('');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="طرابلس">طرابلس</SelectItem>
                    <SelectItem value="بنغازي">بنغازي</SelectItem>
                    <SelectItem value="مصراتة">مصراتة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>الصيدلية</Label>
                <Select
                  value={selectedPharmacy}
                  onValueChange={setSelectedPharmacy}
                  disabled={!selectedCity}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الصيدلية" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPharmacies.map((pharm) => (
                      <SelectItem key={pharm.id} value={pharm.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{pharm.nameAr}</span>
                          <span className="text-xs text-muted-foreground">
                            {pharm.rating}⭐ {pharm.offersDelivery && '🚚'}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>طريقة الدفع</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر طريقة الدفع" />
                  </SelectTrigger>
                  <SelectContent>
                    {LIBYAN_PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method.method} value={method.method}>
                        <div className="flex items-center gap-2">
                          <span>{method.icon}</span>
                          <span>{method.nameAr}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPharmacy && (
                <Card className="bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>سعر الدواء (تقديري)</span>
                      <span>{libyanMedications.find(m => m.name === selectedReminder.medicationName)?.averagePrice || 30} د.ل</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>رسوم التوصيل</span>
                      <span>{filteredPharmacies.find(p => p.id === selectedPharmacy)?.deliveryFee || 0} د.ل</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>الإجمالي</span>
                      <span className="text-primary">
                        {(libyanMedications.find(m => m.name === selectedReminder.medicationName)?.averagePrice || 30) + 
                         (filteredPharmacies.find(p => p.id === selectedPharmacy)?.deliveryFee || 0)} د.ل
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => {
              setRefillDialogOpen(false);
              setSelectedReminder(null);
              setSelectedPharmacy('');
              setSelectedCity('');
              setPaymentMethod('');
            }}>
              إلغاء
            </Button>
            <Button onClick={handleRefillOrder} disabled={!selectedPharmacy || !paymentMethod}>
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
