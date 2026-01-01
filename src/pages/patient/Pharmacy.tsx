import { useState, useMemo, useRef } from "react";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  MapPin, Upload, Truck, Package, Clock, CheckCircle, Star, 
  Plus, Minus, AlertCircle, Pill, FileText, Shield, CreditCard,
  Phone, ChevronLeft, Loader2, CheckCircle2, XCircle, Bell,
  History, User, Calendar, Box
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useHealthcareStore } from "@/stores/healthcareStore";
import { usePharmacyStore } from "@/stores/pharmacyStore";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { 
  Prescription, 
  PharmacyWithStock, 
  LIBYAN_PAYMENT_METHODS,
  ORDER_STATUS_INFO,
  LibyanPaymentMethod
} from "@/types/pharmacy";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

type Step = 'prescriptions' | 'medications' | 'pharmacy' | 'payment' | 'confirmation';

const PharmacyPage = () => {
  const [activeTab, setActiveTab] = useState("order");
  const [currentStep, setCurrentStep] = useState<Step>('prescriptions');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<LibyanPaymentMethod | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addNotification, userId } = useHealthcareStore();
  
  const {
    prescriptions,
    activePrescription,
    orders,
    pharmacies,
    selectedPharmacy,
    isValidating,
    uploadPrescription,
    selectPrescription,
    updateMedicationSelection,
    updateMedicationQuantity,
    selectPharmacy,
    getPharmaciesWithStock,
    createOrder,
    updateOrderStatus,
    processPayment,
    addAuditLog
  } = usePharmacyStore();

  // Filter approved prescriptions
  const approvedPrescriptions = useMemo(() => 
    prescriptions.filter(p => p.status === 'approved' && new Date(p.validUntil) > new Date()),
    [prescriptions]
  );

  // Get pharmacies with stock for active prescription
  const availablePharmacies = useMemo(() => {
    if (!activePrescription) return [];
    return getPharmaciesWithStock(activePrescription.id);
  }, [activePrescription, getPharmaciesWithStock]);

  // Calculate order total
  const orderTotal = useMemo(() => {
    if (!activePrescription || !selectedPharmacy) return { subtotal: 0, deliveryFee: 0, serviceFee: 5, total: 0 };
    
    const selectedMeds = activePrescription.medications.filter(m => m.isSelected);
    const subtotal = selectedMeds.reduce((sum, m) => sum + ((m.price || 0) * m.quantity), 0);
    const deliveryFee = selectedPharmacy.deliveryFee;
    const serviceFee = 5;
    
    return { subtotal, deliveryFee, serviceFee, total: subtotal + deliveryFee + serviceFee };
  }, [activePrescription, selectedPharmacy]);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setShowUploadDialog(true);
    
    try {
      await uploadPrescription(imageUrl);
      toast.success("تم رفع الوصفة بنجاح وجاري التحقق منها");
      
      addNotification({
        id: `notif-${Date.now()}`,
        userId,
        type: 'general',
        title: 'تم استلام الوصفة',
        message: 'جاري التحقق من الوصفة الطبية',
        isRead: false,
        createdAt: new Date().toISOString()
      });

      // Simulate pharmacist approval notification
      setTimeout(() => {
        addNotification({
          id: `notif-${Date.now()}`,
          userId,
          type: 'general',
          title: 'تمت الموافقة على الوصفة',
          message: 'تمت الموافقة على وصفتك الطبية ويمكنك الآن طلب الأدوية',
          isRead: false,
          createdAt: new Date().toISOString()
        });
        toast.success("تمت الموافقة على الوصفة!");
      }, 5000);
    } catch {
      toast.error("حدث خطأ أثناء رفع الوصفة");
    }
    
    setShowUploadDialog(false);
  };

  // Handle prescription selection
  const handleSelectPrescription = (prescription: Prescription) => {
    selectPrescription(prescription.id);
    setCurrentStep('medications');
  };

  // Handle pharmacy selection
  const handleSelectPharmacy = (pharmacy: PharmacyWithStock) => {
    if (!pharmacy.isOpen) {
      toast.error("هذه الصيدلية مغلقة حالياً");
      return;
    }
    if (pharmacy.stockAvailability === 'none') {
      toast.error("الأدوية المطلوبة غير متوفرة في هذه الصيدلية");
      return;
    }
    selectPharmacy(pharmacy.id);
    setCurrentStep('payment');
  };

  // Handle payment and order creation
  const handlePlaceOrder = async () => {
    if (!activePrescription || !selectedPharmacy || !selectedPaymentMethod) {
      toast.error("يرجى إكمال جميع الخطوات");
      return;
    }

    setIsProcessingPayment(true);

    try {
      const order = createOrder(activePrescription.id, selectedPharmacy.id, selectedPaymentMethod);
      
      if (selectedPaymentMethod !== 'cash_on_delivery') {
        const success = await processPayment(order.id);
        if (!success) {
          toast.error("فشل في عملية الدفع، يرجى المحاولة مرة أخرى");
          setIsProcessingPayment(false);
          return;
        }
      }

      // Add audit log
      addAuditLog(order.id, 'payment_completed', 'patient', `الدفع عبر ${selectedPaymentMethod}`);

      // Send notifications
      addNotification({
        id: `notif-${Date.now()}`,
        userId,
        type: 'delivery_update',
        title: 'تم تأكيد الطلب',
        message: `طلبك من ${selectedPharmacy.name} قيد التجهيز`,
        isRead: false,
        createdAt: new Date().toISOString()
      });

      toast.success("تم تأكيد الطلب بنجاح!");
      setCurrentStep('confirmation');

      // Simulate order status updates
      simulateOrderProgress(order.id);

    } catch {
      toast.error("حدث خطأ أثناء إنشاء الطلب");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Simulate order progress
  const simulateOrderProgress = (orderId: string) => {
    const statuses: { status: 'preparing' | 'out_for_delivery' | 'delivered'; delay: number; message: string }[] = [
      { status: 'preparing', delay: 5000, message: 'جاري تجهيز طلبك' },
      { status: 'out_for_delivery', delay: 10000, message: 'طلبك في الطريق إليك' },
      { status: 'delivered', delay: 15000, message: 'تم توصيل طلبك بنجاح' }
    ];

    statuses.forEach(({ status, delay, message }) => {
      setTimeout(() => {
        updateOrderStatus(orderId, status);
        addNotification({
          id: `notif-${Date.now()}`,
          userId,
          type: 'delivery_update',
          title: ORDER_STATUS_INFO[status].label,
          message,
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }, delay);
    });
  };

  // Render step indicator
  const renderStepIndicator = () => {
    const steps = [
      { key: 'prescriptions', label: 'الوصفة' },
      { key: 'medications', label: 'الأدوية' },
      { key: 'pharmacy', label: 'الصيدلية' },
      { key: 'payment', label: 'الدفع' }
    ];

    const currentIndex = steps.findIndex(s => s.key === currentStep);

    return (
      <div className="flex items-center justify-between mb-6 px-2">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${index <= currentIndex ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
            `}>
              {index < currentIndex ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
            </div>
            <span className={`mr-2 text-xs ${index <= currentIndex ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-2 ${index < currentIndex ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render prescriptions step
  const renderPrescriptionsStep = () => (
    <div className="space-y-4">
      {/* Upload prescription card */}
      <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
        <CardContent className="p-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button 
            variant="ghost" 
            className="w-full flex flex-col gap-2 h-auto py-6"
            onClick={() => fileInputRef.current?.click()}
            disabled={isValidating}
          >
            {isValidating ? (
              <>
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <span className="text-primary font-medium">جاري التحقق من الوصفة...</span>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-primary" />
                <span className="text-primary font-medium">رفع وصفة طبية جديدة</span>
                <span className="text-sm text-muted-foreground">اضغط لرفع صورة الوصفة</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Safety notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-3 flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-800">طلب آمن ومعتمد</p>
            <p className="text-blue-600 text-xs mt-1">
              يمكنك فقط طلب الأدوية من الوصفات الطبية المعتمدة من أطبائنا أو المرفوعة والموافق عليها
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Approved prescriptions */}
      <div className="space-y-3">
        <h3 className="font-medium text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5" />
          الوصفات الطبية المعتمدة
        </h3>

        {approvedPrescriptions.length === 0 ? (
          <Card className="p-6 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">لا توجد وصفات معتمدة</p>
            <p className="text-sm text-muted-foreground mt-1">
              قم برفع وصفة طبية أو احصل على وصفة من أحد أطبائنا
            </p>
          </Card>
        ) : (
          approvedPrescriptions.map((prescription, index) => (
            <motion.div
              key={prescription.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => handleSelectPrescription(prescription)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{prescription.doctorName}</p>
                        <p className="text-sm text-muted-foreground">{prescription.doctorSpecialty || prescription.clinicName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(prescription.prescriptionDate).toLocaleDateString('ar-LY')}
                          </span>
                          <Badge variant={prescription.source === 'in_app' ? 'default' : 'secondary'} className="text-xs">
                            {prescription.source === 'in_app' ? 'وصفة داخلية' : 'وصفة مرفوعة'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="w-3 h-3 ml-1" />
                        معتمدة
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {prescription.medications.length} أدوية
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {prescription.medications.slice(0, 3).map(med => (
                      <Badge key={med.id} variant="secondary" className="text-xs">
                        <Pill className="w-3 h-3 ml-1" />
                        {med.name}
                      </Badge>
                    ))}
                    {prescription.medications.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{prescription.medications.length - 3} أخرى
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );

  // Render medications step
  const renderMedicationsStep = () => {
    if (!activePrescription) return null;

    const selectedCount = activePrescription.medications.filter(m => m.isSelected).length;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setCurrentStep('prescriptions')}>
            <ChevronLeft className="w-4 h-4 ml-1" />
            العودة
          </Button>
          <Badge variant="outline">
            {selectedCount} من {activePrescription.medications.length} مختار
          </Badge>
        </div>

        <Card className="bg-muted/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{activePrescription.doctorName}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{activePrescription.doctorSpecialty}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Pill className="w-5 h-5" />
            الأدوية الموصوفة
          </h3>

          {activePrescription.medications.map((medication, index) => (
            <motion.div
              key={medication.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={medication.isSelected ? 'ring-2 ring-primary' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={medication.isSelected}
                      onCheckedChange={(checked) => 
                        updateMedicationSelection(activePrescription.id, medication.id, !!checked)
                      }
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{medication.name}</p>
                          {medication.nameEn && (
                            <p className="text-xs text-muted-foreground">{medication.nameEn}</p>
                          )}
                        </div>
                        <span className="font-bold text-primary">
                          {(medication.price || 0) * medication.quantity} د.ل
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="bg-muted px-2 py-1 rounded">{medication.dosage}</span>
                        <span className="bg-muted px-2 py-1 rounded">{medication.frequency}</span>
                        <span className="bg-muted px-2 py-1 rounded">{medication.duration}</span>
                      </div>
                      {medication.instructions && (
                        <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {medication.instructions}
                        </p>
                      )}
                      
                      {medication.isSelected && (
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">الكمية:</span>
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateMedicationQuantity(
                                activePrescription.id, 
                                medication.id, 
                                medication.quantity - 1
                              )}
                              disabled={medication.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-10 text-center font-medium">{medication.quantity}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateMedicationQuantity(
                                activePrescription.id, 
                                medication.id, 
                                medication.quantity + 1
                              )}
                              disabled={medication.quantity >= medication.maxQuantity}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <span className="text-xs text-muted-foreground">
                              (الحد الأقصى: {medication.maxQuantity})
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Button 
          className="w-full" 
          size="lg"
          onClick={() => setCurrentStep('pharmacy')}
          disabled={selectedCount === 0}
        >
          اختيار الصيدلية
          <ChevronLeft className="w-5 h-5 mr-2" />
        </Button>
      </div>
    );
  };

  // Render pharmacy selection step
  const renderPharmacyStep = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setCurrentStep('medications')}>
          <ChevronLeft className="w-4 h-4 ml-1" />
          العودة
        </Button>
      </div>

      <h3 className="font-medium flex items-center gap-2">
        <MapPin className="w-5 h-5" />
        اختر الصيدلية
      </h3>

      <div className="space-y-3">
        {availablePharmacies.map((pharmacy, index) => (
          <motion.div
            key={pharmacy.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all ${
                !pharmacy.isOpen ? 'opacity-60' :
                selectedPharmacy?.id === pharmacy.id ? 'ring-2 ring-primary bg-primary/5' :
                'hover:bg-accent/50'
              }`}
              onClick={() => handleSelectPharmacy(pharmacy)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      pharmacy.stockAvailability === 'full' ? 'bg-green-100' :
                      pharmacy.stockAvailability === 'partial' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <Pill className={`h-6 w-6 ${
                        pharmacy.stockAvailability === 'full' ? 'text-green-600' :
                        pharmacy.stockAvailability === 'partial' ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{pharmacy.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {pharmacy.address}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {pharmacy.rating}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {pharmacy.distance} كم
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {pharmacy.deliveryTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={pharmacy.isOpen ? 'default' : 'secondary'}>
                      {pharmacy.isOpen ? 'مفتوح' : 'مغلق'}
                    </Badge>
                    <Badge variant="outline" className={
                      pharmacy.stockAvailability === 'full' ? 'bg-green-50 text-green-700 border-green-200' :
                      pharmacy.stockAvailability === 'partial' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }>
                      {pharmacy.stockAvailability === 'full' ? 'جميع الأدوية متوفرة' :
                       pharmacy.stockAvailability === 'partial' ? 'بعض الأدوية متوفرة' : 
                       'الأدوية غير متوفرة'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      توصيل: {pharmacy.deliveryFee} د.ل
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Render payment step
  const renderPaymentStep = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setCurrentStep('pharmacy')}>
          <ChevronLeft className="w-4 h-4 ml-1" />
          العودة
        </Button>
      </div>

      {/* Order summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="w-5 h-5" />
            ملخص الطلب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Pill className="w-4 h-4 text-muted-foreground" />
            <span>{activePrescription?.medications.filter(m => m.isSelected).length} أدوية</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{selectedPharmacy?.name}</span>
          </div>
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">المجموع الفرعي</span>
              <span>{orderTotal.subtotal} د.ل</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">رسوم التوصيل</span>
              <span>{orderTotal.deliveryFee} د.ل</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">رسوم الخدمة</span>
              <span>{orderTotal.serviceFee} د.ل</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>الإجمالي</span>
              <span className="text-primary">{orderTotal.total} د.ل</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment methods */}
      <div className="space-y-3">
        <h3 className="font-medium flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          اختر طريقة الدفع
        </h3>

        {LIBYAN_PAYMENT_METHODS.map((method) => (
          <Card 
            key={method.id}
            className={`cursor-pointer transition-all ${
              selectedPaymentMethod === method.id 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:bg-accent/50'
            }`}
            onClick={() => setSelectedPaymentMethod(method.id)}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center text-2xl text-white`}>
                {method.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium">{method.name}</p>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </div>
              {selectedPaymentMethod === method.id && (
                <CheckCircle2 className="w-6 h-6 text-primary" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Button 
        className="w-full" 
        size="lg"
        onClick={handlePlaceOrder}
        disabled={!selectedPaymentMethod || isProcessingPayment}
      >
        {isProcessingPayment ? (
          <>
            <Loader2 className="w-5 h-5 ml-2 animate-spin" />
            جاري معالجة الطلب...
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5 ml-2" />
            تأكيد الطلب ({orderTotal.total} د.ل)
          </>
        )}
      </Button>
    </div>
  );

  // Render confirmation step
  const renderConfirmationStep = () => (
    <motion.div 
      className="text-center py-8 space-y-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground">تم تأكيد طلبك!</h2>
        <p className="text-muted-foreground mt-2">
          سيتم تجهيز طلبك وتوصيله في أقرب وقت
        </p>
      </div>
      
      <Card className="text-right">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">الصيدلية</span>
            <span className="font-medium">{selectedPharmacy?.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">وقت التوصيل المتوقع</span>
            <span className="font-medium">{selectedPharmacy?.deliveryTime}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">طريقة الدفع</span>
            <span className="font-medium">
              {LIBYAN_PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod)?.name}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between font-bold">
            <span>الإجمالي</span>
            <span className="text-primary">{orderTotal.total} د.ل</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => {
            setActiveTab('orders');
            setCurrentStep('prescriptions');
          }}
        >
          <History className="w-4 h-4 ml-2" />
          تتبع الطلب
        </Button>
        <Button 
          className="flex-1"
          onClick={() => setCurrentStep('prescriptions')}
        >
          <Plus className="w-4 h-4 ml-2" />
          طلب جديد
        </Button>
      </div>
    </motion.div>
  );

  // Render orders tab
  const renderOrdersTab = () => (
    <div className="space-y-4">
      <AnimatePresence>
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">لا توجد طلبات</p>
          </div>
        ) : (
          orders.map((order, index) => {
            const statusInfo = ORDER_STATUS_INFO[order.status];
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="cursor-pointer hover:bg-accent/50"
                  onClick={() => {
                    setSelectedOrderId(order.id);
                    setShowOrderDetails(true);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">{order.pharmacyName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('ar-LY')}
                        </p>
                      </div>
                      <Badge className={statusInfo.color}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{order.selectedMedications.length} أدوية</span>
                      <span className="font-bold text-foreground">{order.totalAmount} د.ل</span>
                    </div>
                    
                    {/* Status timeline */}
                    <div className="mt-3 flex items-center gap-1">
                      {order.statusHistory.slice(-4).map((history, i) => (
                        <div key={i} className="flex items-center">
                          <div className={`w-2 h-2 rounded-full ${
                            i === order.statusHistory.length - 1 ? 'bg-primary' : 'bg-muted-foreground'
                          }`} />
                          {i < order.statusHistory.slice(-4).length - 1 && (
                            <div className="w-4 h-0.5 bg-muted" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </AnimatePresence>
    </div>
  );

  // Get selected order for details sheet
  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  return (
    <PatientLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">الصيدلية</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setActiveTab('orders')}>
              <Bell className="h-5 w-5" />
              {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length > 0 && (
                <span className="absolute -top-1 -left-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="order">طلب جديد</TabsTrigger>
            <TabsTrigger value="orders">طلباتي</TabsTrigger>
          </TabsList>

          <TabsContent value="order" className="mt-4">
            {currentStep !== 'confirmation' && renderStepIndicator()}
            
            {currentStep === 'prescriptions' && renderPrescriptionsStep()}
            {currentStep === 'medications' && renderMedicationsStep()}
            {currentStep === 'pharmacy' && renderPharmacyStep()}
            {currentStep === 'payment' && renderPaymentStep()}
            {currentStep === 'confirmation' && renderConfirmationStep()}
          </TabsContent>

          <TabsContent value="orders" className="mt-4">
            {renderOrdersTab()}
          </TabsContent>
        </Tabs>
      </div>

      {/* Upload validation dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">جاري التحقق من الوصفة</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-6 gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-center text-muted-foreground">
              يتم التحقق من صحة الوصفة الطبية...
            </p>
            <div className="space-y-2 w-full">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>التحقق من اسم الطبيب</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span>التحقق من تاريخ الوصفة</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>فحص الأدوية</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order details sheet */}
      <Sheet open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <SheetContent side="left" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>تفاصيل الطلب</SheetTitle>
          </SheetHeader>
          
          {selectedOrder && (
            <ScrollArea className="h-[calc(100vh-100px)] mt-4">
              <div className="space-y-4 pl-1">
                {/* Status */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">الحالة</span>
                      <Badge className={ORDER_STATUS_INFO[selectedOrder.status].color}>
                        {ORDER_STATUS_INFO[selectedOrder.status].label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Pharmacy info */}
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Pill className="w-5 h-5 text-primary" />
                      <span className="font-medium">{selectedOrder.pharmacyName}</span>
                    </div>
                    <Button variant="outline" className="w-full" size="sm">
                      <Phone className="w-4 h-4 ml-2" />
                      {selectedOrder.pharmacyPhone}
                    </Button>
                  </CardContent>
                </Card>

                {/* Medications */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">الأدوية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {selectedOrder.selectedMedications.map(med => (
                      <div key={med.medicationId} className="flex justify-between text-sm">
                        <span>{med.name} ({med.dosage}) x{med.quantity}</span>
                        <span>{med.price * med.quantity} د.ل</span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">المجموع الفرعي</span>
                      <span>{selectedOrder.subtotal} د.ل</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">التوصيل</span>
                      <span>{selectedOrder.deliveryFee} د.ل</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">رسوم الخدمة</span>
                      <span>{selectedOrder.serviceFee} د.ل</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>الإجمالي</span>
                      <span className="text-primary">{selectedOrder.totalAmount} د.ل</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Status timeline */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <History className="w-4 h-4" />
                      سجل الحالة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedOrder.statusHistory.map((history, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`w-3 h-3 rounded-full mt-1.5 ${
                            index === selectedOrder.statusHistory.length - 1 
                              ? 'bg-primary' 
                              : 'bg-muted-foreground'
                          }`} />
                          <div>
                            <p className="text-sm font-medium">
                              {ORDER_STATUS_INFO[history.status]?.label || history.status}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(history.timestamp).toLocaleString('ar-LY')}
                            </p>
                            {history.note && (
                              <p className="text-xs text-muted-foreground mt-1">{history.note}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery address */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <Truck className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">عنوان التوصيل</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedOrder.deliveryAddress.address}، {selectedOrder.deliveryAddress.city}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </PatientLayout>
  );
};

export default PharmacyPage;
