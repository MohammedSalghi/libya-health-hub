// Home Visit Page - Complete Professional Workflow
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  ChevronLeft, 
  ChevronRight,
  MapPin, 
  Clock,
  Star,
  Home,
  Stethoscope,
  Building2,
  CheckCircle,
  Loader2,
  Phone,
  Calendar,
  Navigation,
  User,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { homeVisitProviders, homeVisitDoctors, getProvidersByCity, getDoctorsByProvider } from "@/data/homeVisitData";
import { useHomeVisitStore } from "@/stores/homeVisitStore";
import { useHealthcareStore } from "@/stores/healthcareStore";
import { HomeVisitProvider, HomeVisitDoctor, HomeVisitBooking } from "@/types/homeVisit";
import { UnifiedPaymentDialog } from "@/components/payment/UnifiedPaymentDialog";
import { PaymentResult } from "@/types/payment";

type Step = 'city' | 'specialty' | 'provider' | 'doctor' | 'datetime' | 'address' | 'summary' | 'payment' | 'confirmation' | 'tracking';

const specialties = [
  { id: 'طب عام', name: 'طب عام', icon: Stethoscope },
  { id: 'طب الأطفال', name: 'طب الأطفال', icon: User },
  { id: 'طب الباطنية', name: 'طب الباطنية', icon: Stethoscope },
  { id: 'طب القلب', name: 'طب القلب', icon: Stethoscope },
  { id: 'طب الأعصاب', name: 'طب الأعصاب', icon: Stethoscope },
  { id: 'طب الجلدية', name: 'طب الجلدية', icon: User },
  { id: 'طب النساء', name: 'طب النساء', icon: User },
  { id: 'طب العظام', name: 'طب العظام', icon: Stethoscope },
];

const HomeVisitPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('city');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<HomeVisitBooking | null>(null);
  const [locationAddress, setLocationAddress] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressLandmark, setAddressLandmark] = useState('');
  const [visitNotes, setVisitNotes] = useState('');
  
  const { 
    walletBalance, 
    addNotification, 
    updateWalletBalance, 
    addTransaction,
    addPendingRating 
  } = useHealthcareStore();
  
  const {
    selectedCity,
    selectedProvider,
    selectedDoctor,
    selectedDate,
    selectedTime,
    homeAddress,
    setCity,
    setProvider,
    setDoctor,
    setDateTime,
    setHomeAddress,
    addBooking,
    updateBooking,
    resetFlow
  } = useHomeVisitStore();

  // Get filtered providers and doctors
  const filteredProviders = selectedCity ? getProvidersByCity(selectedCity) : [];
  const filteredDoctors = selectedProvider 
    ? getDoctorsByProvider(selectedProvider.id).filter(d => !selectedSpecialty || d.specialty === selectedSpecialty)
    : [];

  // Get available dates and times
  const getAvailableDates = () => {
    if (!selectedDoctor) return [];
    const dates = new Set<string>();
    selectedDoctor.availableSlots.forEach(slot => {
      if (slot.available) dates.add(slot.date);
    });
    return Array.from(dates);
  };

  const getAvailableTimes = () => {
    if (!selectedDoctor || !selectedDate) return [];
    return selectedDoctor.availableSlots.filter(
      slot => slot.date === selectedDate && slot.available
    );
  };

  // Calculate fees
  const calculateFees = () => {
    if (!selectedDoctor) return { consultationFee: 0, visitFee: 0, platformFee: 0, total: 0 };
    const consultationFee = selectedDoctor.homeVisitFee;
    const visitFee = 20; // Fixed visit fee
    const platformFee = 5;
    return {
      consultationFee,
      visitFee,
      platformFee,
      total: consultationFee + visitFee + platformFee
    };
  };

  // Detect location
  const detectLocation = () => {
    setIsProcessing(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock address based on selected city
          const mockAddress = selectedCity === 'طرابلس' 
            ? 'شارع الجمهورية، المنشية' 
            : 'شارع جمال عبدالناصر، الفويهات';
          setLocationAddress(mockAddress);
          setHomeAddress({
            street: mockAddress,
            city: selectedCity || 'طرابلس',
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsProcessing(false);
          toast.success("تم تحديد موقعك بنجاح");
        },
        () => {
          setIsProcessing(false);
          toast.error("تعذر تحديد الموقع، يرجى إدخال العنوان يدوياً");
        }
      );
    } else {
      setIsProcessing(false);
      toast.error("خدمة تحديد الموقع غير متوفرة");
    }
  };

  // Handle payment completion
  const handlePaymentComplete = (method: string, transactionId: string) => {
    setIsPaymentOpen(false);
    setIsProcessing(true);

    const fees = calculateFees();
    const booking: HomeVisitBooking = {
      id: `hv-${Date.now()}`,
      patientId: 'user1',
      patientName: 'محمد',
      providerId: selectedProvider!.id,
      provider: selectedProvider!,
      doctorId: selectedDoctor!.id,
      doctor: selectedDoctor!,
      date: selectedDate!,
      time: selectedTime!,
      address: {
        street: addressStreet || locationAddress,
        city: selectedCity!,
        landmark: addressLandmark,
        lat: homeAddress?.lat,
        lng: homeAddress?.lng
      },
      notes: visitNotes,
      status: 'confirmed',
      fees,
      paymentMethod: method as HomeVisitBooking['paymentMethod'],
      paymentStatus: method === 'cash' ? 'cod' : 'paid',
      transactionId: method !== 'cash' ? transactionId : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Deduct from wallet if paid via wallet
    if (method === 'wallet') {
      updateWalletBalance(-fees.total);
      addTransaction({
        id: transactionId,
        userId: 'user1',
        type: 'debit',
        amount: fees.total,
        description: `زيارة منزلية - ${selectedDoctor!.name}`,
        serviceType: 'doctor',
        serviceId: booking.id,
        status: 'completed',
        createdAt: new Date().toISOString()
      });
    }

    addBooking(booking);
    setCurrentBooking(booking);

    // Add confirmation notification
    addNotification({
      id: `notif-${Date.now()}`,
      userId: 'user1',
      type: 'appointment_confirmed',
      title: 'تم تأكيد الزيارة المنزلية',
      message: `تم تأكيد زيارة ${selectedDoctor!.name} إلى منزلك يوم ${formatDate(selectedDate!)} الساعة ${selectedTime}`,
      data: {
        serviceType: 'doctor',
        serviceId: booking.id,
        actionUrl: `/patient/home-visit/${booking.id}`
      },
      isRead: false,
      createdAt: new Date().toISOString()
    });

    // Add reminder notification (simulated for 1 hour before)
    setTimeout(() => {
      addNotification({
        id: `notif-reminder-${Date.now()}`,
        userId: 'user1',
        type: 'appointment_reminder',
        title: 'تذكير بالزيارة المنزلية',
        message: `تذكير: زيارة ${selectedDoctor!.name} بعد ساعة واحدة`,
        data: {
          serviceType: 'doctor',
          serviceId: booking.id
        },
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }, 3000);

    setIsProcessing(false);
    setStep('confirmation');
    toast.success("تم تأكيد حجز الزيارة المنزلية!");
  };

  // Handle payment failure
  const handlePaymentFailed = (error: string) => {
    addNotification({
      id: `notif-${Date.now()}`,
      userId: 'user1',
      type: 'payment',
      title: 'فشل الدفع',
      message: `فشل في معالجة الدفع: ${error}`,
      isRead: false,
      createdAt: new Date().toISOString()
    });
    toast.error("فشل الدفع، يرجى المحاولة مرة أخرى");
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-LY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Simulate provider acceptance
  const simulateProviderAcceptance = () => {
    if (!currentBooking) return;
    
    setTimeout(() => {
      updateBooking(currentBooking.id, { 
        status: 'provider_accepted',
        doctorPhone: '+218 91 234 5678',
        estimatedArrival: '30-45 دقيقة'
      });
      
      addNotification({
        id: `notif-${Date.now()}`,
        userId: 'user1',
        type: 'appointment_confirmed',
        title: 'تم قبول الطلب',
        message: `قبل ${selectedProvider?.name} طلب الزيارة المنزلية`,
        data: {
          serviceType: 'doctor',
          serviceId: currentBooking.id
        },
        isRead: false,
        createdAt: new Date().toISOString()
      });
      
      setCurrentBooking(prev => prev ? { ...prev, status: 'provider_accepted', doctorPhone: '+218 91 234 5678', estimatedArrival: '30-45 دقيقة' } : null);
      toast.info("تم قبول طلبك من مقدم الخدمة");
    }, 5000);
  };

  // Track visit
  const startTracking = () => {
    setStep('tracking');
    simulateProviderAcceptance();
  };

  // Complete visit (simulated)
  const completeVisit = () => {
    if (!currentBooking) return;
    
    updateBooking(currentBooking.id, { status: 'completed' });
    
    addNotification({
      id: `notif-${Date.now()}`,
      userId: 'user1',
      type: 'general',
      title: 'تمت الزيارة بنجاح',
      message: `تمت زيارة ${selectedDoctor?.name} بنجاح. شكراً لاستخدامك خدماتنا`,
      data: {
        serviceType: 'doctor',
        serviceId: currentBooking.id
      },
      isRead: false,
      createdAt: new Date().toISOString()
    });
    
    // Add rating request
    addPendingRating({
      serviceType: 'doctor',
      serviceId: currentBooking.id,
      serviceName: selectedDoctor?.name || ''
    });
    
    addNotification({
      id: `notif-rating-${Date.now()}`,
      userId: 'user1',
      type: 'rating_request',
      title: 'كيف كانت تجربتك؟',
      message: `قيم تجربتك مع ${selectedDoctor?.name}`,
      data: {
        serviceType: 'doctor',
        serviceId: currentBooking.id
      },
      isRead: false,
      createdAt: new Date().toISOString()
    });
    
    toast.success("تمت الزيارة بنجاح!");
    resetFlow();
    navigate('/patient');
  };

  // Cancel booking
  const cancelBooking = () => {
    if (!currentBooking) return;
    
    updateBooking(currentBooking.id, { status: 'cancelled' });
    
    addNotification({
      id: `notif-${Date.now()}`,
      userId: 'user1',
      type: 'general',
      title: 'تم إلغاء الزيارة',
      message: 'تم إلغاء طلب الزيارة المنزلية',
      isRead: false,
      createdAt: new Date().toISOString()
    });
    
    toast.info("تم إلغاء الزيارة");
    resetFlow();
    navigate('/patient');
  };

  return (
    <PatientLayout hideNav>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-teal-600">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (step === 'city') {
                  navigate(-1);
                } else if (step === 'specialty') {
                  setStep('city');
                } else if (step === 'provider') {
                  setStep('specialty');
                } else if (step === 'doctor') {
                  setStep('provider');
                } else if (step === 'datetime') {
                  setStep('doctor');
                } else if (step === 'address') {
                  setStep('datetime');
                } else if (step === 'summary') {
                  setStep('address');
                }
              }} 
              className="p-2 bg-white/20 rounded-xl text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">زيارة طبيب إلى المنزل</h1>
              <p className="text-white/80 text-sm">
                {step === 'city' && 'اختر المدينة'}
                {step === 'specialty' && 'اختر التخصص'}
                {step === 'provider' && 'اختر مقدم الخدمة'}
                {step === 'doctor' && 'اختر الطبيب'}
                {step === 'datetime' && 'اختر الموعد'}
                {step === 'address' && 'أدخل العنوان'}
                {step === 'summary' && 'ملخص الحجز'}
                {step === 'confirmation' && 'تأكيد الحجز'}
                {step === 'tracking' && 'تتبع الزيارة'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        {!['confirmation', 'tracking'].includes(step) && (
          <div className="px-4 pb-4">
            <div className="flex gap-1">
              {['city', 'specialty', 'provider', 'doctor', 'datetime', 'address', 'summary'].map((s, i) => (
                <div 
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    ['city', 'specialty', 'provider', 'doctor', 'datetime', 'address', 'summary'].indexOf(step) >= i 
                      ? 'bg-white' 
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-6">
        <AnimatePresence mode="wait">
          {/* Step 1: City Selection */}
          {step === 'city' && (
            <motion.div
              key="city"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card className="p-4 bg-teal-50 border-teal-200">
                <div className="flex items-start gap-3">
                  <Home className="w-6 h-6 text-teal-600" />
                  <div>
                    <p className="font-medium text-teal-800">خدمة الزيارة المنزلية</p>
                    <p className="text-sm text-teal-600">
                      احصل على رعاية طبية متميزة في راحة منزلك من خلال شراكتنا مع أفضل مقدمي الخدمات الصحية
                    </p>
                  </div>
                </div>
              </Card>

              <h2 className="text-lg font-semibold text-foreground">اختر مدينتك</h2>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'طرابلس', name: 'طرابلس', providers: getProvidersByCity('طرابلس').length },
                  { id: 'بنغازي', name: 'بنغازي', providers: getProvidersByCity('بنغازي').length }
                ].map((city) => (
                  <Card
                    key={city.id}
                    className={`p-6 cursor-pointer transition-all text-center ${
                      selectedCity === city.id
                        ? 'bg-teal-100 border-2 border-teal-500'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => {
                      setCity(city.id as 'طرابلس' | 'بنغازي');
                      setStep('specialty');
                    }}
                  >
                    <MapPin className="w-10 h-10 mx-auto mb-3 text-teal-600" />
                    <h3 className="text-lg font-bold text-foreground">{city.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {city.providers} مقدم خدمة
                    </p>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Specialty Selection */}
          {step === 'specialty' && (
            <motion.div
              key="specialty"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-foreground">اختر التخصص المطلوب</h2>
              
              <div className="grid grid-cols-2 gap-3">
                {specialties.map((specialty) => (
                  <Card
                    key={specialty.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedSpecialty === specialty.id
                        ? 'bg-teal-100 border-2 border-teal-500'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => {
                      setSelectedSpecialty(specialty.id);
                      setStep('provider');
                    }}
                  >
                    <specialty.icon className="w-8 h-8 mx-auto mb-2 text-teal-600" />
                    <p className="text-center font-medium text-foreground">{specialty.name}</p>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Provider Selection */}
          {step === 'provider' && (
            <motion.div
              key="provider"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-foreground">مقدمي الخدمة في {selectedCity}</h2>
              
              <div className="space-y-3">
                {filteredProviders.map((provider) => (
                  <Card
                    key={provider.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedProvider?.id === provider.id
                        ? 'bg-teal-50 border-2 border-teal-500'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => {
                      setProvider(provider);
                      setStep('doctor');
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                        <Building2 className="w-7 h-7 text-teal-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-foreground truncate">{provider.name}</h3>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            provider.type === 'hospital' ? 'bg-blue-100 text-blue-700' :
                            provider.type === 'clinic' ? 'bg-green-100 text-green-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {provider.type === 'hospital' ? 'مستشفى' : provider.type === 'clinic' ? 'عيادة' : 'شركة'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-yellow-500 mb-1">
                          <Star className="w-4 h-4 fill-yellow-400" />
                          <span>{provider.rating}</span>
                          <span className="text-muted-foreground">({provider.reviewCount} تقييم)</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{provider.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {provider.responseTime}
                          </span>
                          <span>{provider.priceRange.min}-{provider.priceRange.max} د.ل</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Doctor Selection */}
          {step === 'doctor' && (
            <motion.div
              key="doctor"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card className="p-3 bg-muted/50">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-600" />
                  <span className="font-medium text-foreground">{selectedProvider?.name}</span>
                </div>
              </Card>

              <h2 className="text-lg font-semibold text-foreground">اختر الطبيب</h2>
              
              <div className="space-y-3">
                {filteredDoctors.map((doctor) => (
                  <Card
                    key={doctor.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedDoctor?.id === doctor.id
                        ? 'bg-teal-50 border-2 border-teal-500'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => {
                      setDoctor(doctor);
                      setStep('datetime');
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center">
                        <User className="w-7 h-7 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">{doctor.name}</h3>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-4 h-4 fill-yellow-400" />
                            <span className="text-sm">{doctor.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">• {doctor.yearsExperience} سنة خبرة</span>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-lg font-bold text-teal-600">{doctor.homeVisitFee}</p>
                        <p className="text-xs text-muted-foreground">د.ل</p>
                      </div>
                    </div>
                  </Card>
                ))}

                {filteredDoctors.length === 0 && (
                  <Card className="p-8 text-center">
                    <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">لا يوجد أطباء متاحون في هذا التخصص</p>
                    <Button variant="outline" className="mt-4" onClick={() => setStep('specialty')}>
                      اختر تخصص آخر
                    </Button>
                  </Card>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 5: Date & Time Selection */}
          {step === 'datetime' && (
            <motion.div
              key="datetime"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card className="p-3 bg-muted/50">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-600" />
                  <span className="font-medium text-foreground">{selectedDoctor?.name}</span>
                  <span className="text-sm text-muted-foreground">• {selectedDoctor?.specialty}</span>
                </div>
              </Card>

              <h2 className="text-lg font-semibold text-foreground">اختر تاريخ الزيارة</h2>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {getAvailableDates().slice(0, 7).map((date) => {
                  const d = new Date(date);
                  const isSelected = selectedDate === date;
                  return (
                    <button
                      key={date}
                      onClick={() => setDateTime(date, selectedTime || '')}
                      className={`flex flex-col items-center p-3 rounded-xl min-w-[70px] transition-all ${
                        isSelected ? 'bg-teal-500 text-white' : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      <span className="text-xs">{d.toLocaleDateString('ar-LY', { weekday: 'short' })}</span>
                      <span className="text-lg font-bold">{d.getDate()}</span>
                      <span className="text-xs">{d.toLocaleDateString('ar-LY', { month: 'short' })}</span>
                    </button>
                  );
                })}
              </div>

              {selectedDate && (
                <>
                  <h2 className="text-lg font-semibold text-foreground">اختر وقت الزيارة</h2>
                  <div className="grid grid-cols-3 gap-2">
                    {getAvailableTimes().map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => setDateTime(selectedDate, slot.time)}
                        className={`p-3 rounded-xl text-center transition-all ${
                          selectedTime === slot.time
                            ? 'bg-teal-500 text-white'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        <Clock className="w-4 h-4 mx-auto mb-1" />
                        <span className="text-sm font-medium">{slot.time}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              <Button 
                className="w-full mt-4" 
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep('address')}
              >
                التالي
              </Button>
            </motion.div>
          )}

          {/* Step 6: Address Input */}
          {step === 'address' && (
            <motion.div
              key="address"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-foreground">عنوان الزيارة</h2>

              {/* GPS Detection */}
              <Card className="p-4">
                <Button 
                  variant="outline" 
                  className="w-full gap-2" 
                  onClick={detectLocation}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Navigation className="w-4 h-4" />
                  )}
                  تحديد موقعي تلقائياً
                </Button>
                {locationAddress && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700">{locationAddress}</span>
                  </div>
                )}
              </Card>

              <div className="text-center text-muted-foreground text-sm">أو أدخل العنوان يدوياً</div>

              <div className="space-y-3">
                <div>
                  <Label>العنوان التفصيلي</Label>
                  <Input
                    placeholder="مثال: شارع الجمهورية، عمارة 5، شقة 3"
                    value={addressStreet}
                    onChange={(e) => setAddressStreet(e.target.value)}
                  />
                </div>
                <div>
                  <Label>علامة مميزة (اختياري)</Label>
                  <Input
                    placeholder="مثال: بجانب مسجد النور"
                    value={addressLandmark}
                    onChange={(e) => setAddressLandmark(e.target.value)}
                  />
                </div>
                <div>
                  <Label>ملاحظات للطبيب (اختياري)</Label>
                  <Textarea
                    placeholder="أي معلومات إضافية تود إخبار الطبيب بها..."
                    value={visitNotes}
                    onChange={(e) => setVisitNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Map Placeholder */}
              <Card className="h-40 flex items-center justify-center bg-muted">
                <div className="text-center">
                  <MapPin className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">معاينة الموقع على الخريطة</p>
                </div>
              </Card>

              <Button 
                className="w-full" 
                disabled={!addressStreet && !locationAddress}
                onClick={() => {
                  setHomeAddress({
                    street: addressStreet || locationAddress,
                    city: selectedCity!,
                    landmark: addressLandmark
                  });
                  setStep('summary');
                }}
              >
                التالي
              </Button>
            </motion.div>
          )}

          {/* Step 7: Booking Summary */}
          {step === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-foreground">ملخص الحجز</h2>

              <Card className="p-4 space-y-4">
                {/* Doctor Info */}
                <div className="flex items-center gap-3 pb-3 border-b">
                  <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center">
                    <User className="w-7 h-7 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{selectedDoctor?.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedDoctor?.specialty}</p>
                  </div>
                </div>

                {/* Provider */}
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">مقدم الخدمة:</span>
                  <span className="font-medium">{selectedProvider?.name}</span>
                </div>

                {/* Date & Time */}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">الموعد:</span>
                  <span className="font-medium">{formatDate(selectedDate!)} - {selectedTime}</span>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="text-muted-foreground">العنوان:</span>
                    <p className="font-medium">{addressStreet || locationAddress}</p>
                    {addressLandmark && <p className="text-xs text-muted-foreground">{addressLandmark}</p>}
                  </div>
                </div>

                {/* Notes */}
                {visitNotes && (
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <p className="text-muted-foreground mb-1">ملاحظات:</p>
                    <p>{visitNotes}</p>
                  </div>
                )}
              </Card>

              {/* Fees */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">تفاصيل الرسوم</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">رسوم الكشف</span>
                    <span>{calculateFees().consultationFee} د.ل</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">رسوم الزيارة المنزلية</span>
                    <span>{calculateFees().visitFee} د.ل</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">رسوم الخدمة</span>
                    <span>{calculateFees().platformFee} د.ل</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>الإجمالي</span>
                      <span className="text-teal-600">{calculateFees().total} د.ل</span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="text-xs text-center text-muted-foreground">
                رصيد المحفظة: {walletBalance} د.ل
              </div>

              <Button className="w-full h-12 text-lg" onClick={() => setIsPaymentOpen(true)}>
                تأكيد وإتمام الدفع
              </Button>
            </motion.div>
          )}

          {/* Step 8: Confirmation */}
          {step === 'confirmation' && currentBooking && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center py-8"
            >
              <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">تم تأكيد الزيارة!</h2>
                <p className="text-muted-foreground">
                  سيصلك إشعار عند قبول الطلب من مقدم الخدمة
                </p>
              </div>

              <Card className="p-4 text-right">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">رقم الحجز</span>
                    <span className="font-mono font-bold">{currentBooking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الطبيب</span>
                    <span className="font-medium">{selectedDoctor?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الموعد</span>
                    <span>{formatDate(selectedDate!)} - {selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الحالة</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      تم التأكيد
                    </span>
                  </div>
                </div>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => navigate('/patient')}>
                  الرئيسية
                </Button>
                <Button className="flex-1" onClick={startTracking}>
                  تتبع الزيارة
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 9: Tracking */}
          {step === 'tracking' && currentBooking && (
            <motion.div
              key="tracking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Status Card */}
              <Card className={`p-4 ${
                currentBooking.status === 'provider_accepted' ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center animate-pulse ${
                    currentBooking.status === 'provider_accepted' ? 'bg-green-500' : 'bg-amber-500'
                  }`}>
                    {currentBooking.status === 'provider_accepted' ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <Clock className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold ${
                      currentBooking.status === 'provider_accepted' ? 'text-green-700' : 'text-amber-700'
                    }`}>
                      {currentBooking.status === 'confirmed' && 'في انتظار قبول مقدم الخدمة'}
                      {currentBooking.status === 'provider_accepted' && 'تم قبول الطلب'}
                      {currentBooking.status === 'doctor_en_route' && 'الطبيب في الطريق'}
                    </p>
                    {currentBooking.estimatedArrival && (
                      <p className="text-sm text-muted-foreground">
                        الوصول المتوقع: {currentBooking.estimatedArrival}
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Doctor Info */}
              {currentBooking.status === 'provider_accepted' && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">معلومات الطبيب</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الطبيب</span>
                      <span className="font-medium">{selectedDoctor?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">رقم الهاتف</span>
                      <a href={`tel:${currentBooking.doctorPhone}`} className="font-medium text-primary">
                        {currentBooking.doctorPhone}
                      </a>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4 gap-2">
                    <Phone className="w-4 h-4" />
                    اتصل بالطبيب
                  </Button>
                </Card>
              )}

              {/* Map Placeholder */}
              <Card className="h-48 flex items-center justify-center bg-muted">
                <div className="text-center">
                  <Navigation className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">تتبع مباشر على الخريطة</p>
                </div>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="destructive" className="flex-1" onClick={cancelBooking}>
                  إلغاء الزيارة
                </Button>
                <Button className="flex-1" onClick={completeVisit}>
                  تم إنجاز الزيارة
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Payment Dialog */}
      <UnifiedPaymentDialog
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentComplete={(result: PaymentResult) => handlePaymentComplete(result.paymentMethod, result.transactionId || `TXN-${Date.now()}`)}
        onPaymentFailed={handlePaymentFailed}
        paymentRequest={{
          serviceType: 'home_visit',
          serviceId: `hv-${Date.now()}`,
          serviceName: `زيارة منزلية - ${selectedDoctor?.name || ''}`,
          providerId: selectedProvider?.id || '',
          providerName: selectedProvider?.name || '',
          providerType: 'doctor',
          amount: calculateFees().total,
          fees: [
            { label: 'رسوم الكشف', amount: calculateFees().consultationFee },
            { label: 'رسوم الزيارة', amount: calculateFees().visitFee },
            { label: 'رسوم الخدمة', amount: calculateFees().platformFee }
          ],
          allowCash: true,
        }}
      />
    </PatientLayout>
  );
};

export default HomeVisitPage;
