import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Star, 
  MapPin, 
  Clock, 
  Video, 
  Phone,
  MessageCircle,
  Calendar,
  Award,
  GraduationCap,
  Heart,
  Share2,
  Navigation,
  Shield,
  CheckCircle,
  Languages,
  Globe,
  AlertTriangle
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { doctors, clinics } from "@/data/mockData";
import { useHealthcareStore } from "@/stores/healthcareStore";
import { Appointment, Clinic } from "@/types/healthcare";
import { ClinicSelectionDialog } from "@/components/patient/ClinicSelectionDialog";
import { BookingSummaryDialog } from "@/components/patient/BookingSummaryDialog";
import { UnifiedPaymentDialog } from "@/components/payment/UnifiedPaymentDialog";
import { VisitingDoctorRequestDialog } from "@/components/patient/VisitingDoctorRequestDialog";
import { usePaymentStore } from "@/stores/paymentStore";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { 
    favoriteDoctors, 
    toggleFavoriteDoctor, 
    addAppointment,
    walletBalance,
    updateWalletBalance,
    addTransaction,
    addNotification
  } = useHealthcareStore();
  
  const doctor = doctors.find(d => d.id === id);
  
  // Get all clinics where this doctor works
  const doctorClinics = useMemo(() => {
    if (!doctor) return [];
    // For demo, show doctor's primary clinic + any clinics with matching specialty
    const primaryClinic = clinics.find(c => c.id === doctor.clinicId);
    const otherClinics = clinics.filter(c => 
      c.id !== doctor.clinicId && 
      c.specialties.some(s => s.includes(doctor.specialty) || doctor.specialty.includes(s))
    );
    return primaryClinic ? [primaryClinic, ...otherClinics] : otherClinics;
  }, [doctor]);
  
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(doctorClinics[0] || null);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingType, setBookingType] = useState<'in_person' | 'video'>('in_person');
  const [isBooking, setIsBooking] = useState(false);
  
  // Dialog states
  const [showClinicDialog, setShowClinicDialog] = useState(false);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showVisitingDoctorDialog, setShowVisitingDoctorDialog] = useState(false);

  const isFavorite = doctor ? favoriteDoctors.includes(doctor.id) : false;
  
  // Check if doctor is visiting/international
  const isVisitingDoctor = doctor?.title.includes('زائر') || doctor?.title.includes('دولي');

  // Generate next 7 days
  const dates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        day: date.toLocaleDateString("ar-LY", { weekday: "short" }),
        date: date.getDate(),
        month: date.toLocaleDateString("ar-LY", { month: "short" }),
        full: date.toISOString().split('T')[0],
        isToday: i === 0
      };
    });
  }, []);

  // Generate time slots based on working hours
  const timeSlots = useMemo(() => {
    const slots = [];
    const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'];
    
    times.forEach(time => {
      // Randomly mark some as unavailable for demo
      const available = Math.random() > 0.3;
      slots.push({
        time,
        timeAr: time.replace(':', ':').replace(/(\d+):(\d+)/, (_, h, m) => {
          const hour = parseInt(h);
          return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? 'م' : 'ص'}`;
        }),
        available
      });
    });
    
    return slots;
  }, [selectedDate]);

  if (!doctor) {
    return (
      <PatientLayout>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">الطبيب غير موجود</p>
          <Button onClick={() => navigate(-1)} className="mt-4">العودة</Button>
        </div>
      </PatientLayout>
    );
  }

  const currentFee = bookingType === 'video' ? doctor.fees.video : doctor.fees.consultation;
  const platformFee = 5;
  const totalFee = currentFee + platformFee;

  const fees = [
    { label: bookingType === 'video' ? 'رسوم استشارة الفيديو' : 'رسوم الاستشارة', amount: currentFee },
    { label: 'رسوم الخدمة', amount: platformFee }
  ];

  // Handle clinic selection for in-person bookings
  const handleSelectClinicClick = () => {
    if (doctorClinics.length > 1) {
      setShowClinicDialog(true);
    }
  };

  // Handle booking initiation
  const handleBookingClick = () => {
    if (!selectedTime) {
      toast.error("الرجاء اختيار وقت الموعد");
      return;
    }

    if (bookingType === 'in_person' && !selectedClinic) {
      toast.error("الرجاء اختيار العيادة");
      return;
    }

    // Check if visiting doctor - show request dialog
    if (isVisitingDoctor) {
      setShowVisitingDoctorDialog(true);
      return;
    }

    // Show summary dialog
    setShowSummaryDialog(true);
  };

  // Handle visiting doctor request submission
  const handleVisitingDoctorRequestSubmitted = (requestId: string) => {
    addNotification({
      id: `notif-${Date.now()}`,
      userId: 'user1',
      type: 'general',
      title: 'تم إرسال طلب الحجز',
      message: `طلب حجز موعد مع ${doctor.name} قيد المراجعة. رقم الطلب: ${requestId}`,
      data: {
        serviceType: 'doctor',
        serviceId: requestId
      },
      isRead: false,
      createdAt: new Date().toISOString()
    });
  };

  // Handle visiting doctor approval - proceed to payment
  const handleVisitingDoctorApproved = () => {
    setShowVisitingDoctorDialog(false);
    
    addNotification({
      id: `notif-${Date.now()}`,
      userId: 'user1',
      type: 'appointment_confirmed',
      title: 'تمت الموافقة على طلبك',
      message: `تمت الموافقة على حجز موعد مع ${doctor.name}. يمكنك الآن إكمال الدفع.`,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    // Show payment dialog
    setTimeout(() => {
      setShowPaymentDialog(true);
    }, 500);
  };

  // Handle summary confirmation - show payment
  const handleSummaryConfirm = () => {
    setShowSummaryDialog(false);
    setShowPaymentDialog(true);
  };

  // Handle payment completion
  const handlePaymentComplete = async (method: string, transactionId: string) => {
    setShowPaymentDialog(false);
    setIsBooking(true);

    try {
      const clinic = selectedClinic || doctorClinics[0];
      
      // Create appointment
      const appointment: Appointment = {
        id: `apt-${Date.now()}`,
        patientId: 'user1',
        doctorId: doctor.id,
        doctor: doctor,
        clinicId: clinic.id,
        clinic: clinic,
        date: dates[selectedDate].full,
        time: selectedTime!,
        type: bookingType === 'video' ? 'video' : 'in_person',
        status: 'confirmed',
        fees: [
          { type: 'consultation', amount: currentFee, currency: 'د.ل', description: 'رسوم الاستشارة' },
          { type: 'platform', amount: platformFee, currency: 'د.ل', description: 'رسوم الخدمة' }
        ],
        totalAmount: totalFee,
        paidAmount: method === 'cash' ? 0 : totalFee,
        paymentStatus: method === 'cash' ? 'pending' : 'paid',
        ratingPromptSent: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add appointment to store
      addAppointment(appointment);

      // Deduct from wallet if paid
      if (method === 'wallet') {
        updateWalletBalance(-totalFee);
      }

      // Add transaction
      addTransaction({
        id: transactionId,
        userId: 'user1',
        type: 'debit',
        amount: totalFee,
        description: `حجز موعد مع ${doctor.name}`,
        serviceType: 'doctor',
        serviceId: appointment.id,
        status: method === 'cash' ? 'pending' : 'completed',
        createdAt: new Date().toISOString()
      });

      // Add confirmation notification to patient
      addNotification({
        id: `notif-${Date.now()}`,
        userId: 'user1',
        type: 'appointment_confirmed',
        title: 'تم تأكيد الموعد',
        message: `موعدك مع ${doctor.name} يوم ${dates[selectedDate].day} الساعة ${selectedTime}`,
        data: {
          serviceType: 'doctor',
          serviceId: appointment.id,
          actionUrl: '/patient/appointments'
        },
        isRead: false,
        createdAt: new Date().toISOString()
      });

      // Add notification to doctor (simulated)
      addNotification({
        id: `notif-doc-${Date.now()}`,
        userId: doctor.id,
        type: 'appointment_confirmed',
        title: 'موعد جديد',
        message: `لديك موعد جديد يوم ${dates[selectedDate].day} الساعة ${selectedTime}`,
        isRead: false,
        createdAt: new Date().toISOString()
      });

      // Schedule reminder notification (simulated - would be server-side)
      setTimeout(() => {
        addNotification({
          id: `notif-reminder-${Date.now()}`,
          userId: 'user1',
          type: 'appointment_reminder',
          title: 'تذكير بالموعد',
          message: `تذكير: موعدك مع ${doctor.name} غداً الساعة ${selectedTime}`,
          data: {
            serviceType: 'doctor',
            serviceId: appointment.id
          },
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }, 5000);

      toast.success("تم حجز الموعد بنجاح!");
      navigate('/patient/appointments');
    } catch (error) {
      toast.error("حدث خطأ أثناء الحجز");
    } finally {
      setIsBooking(false);
    }
  };

  // Handle payment failure
  const handlePaymentFailed = (error: string) => {
    addNotification({
      id: `notif-${Date.now()}`,
      userId: 'user1',
      type: 'payment',
      title: 'فشل الدفع',
      message: error,
      isRead: false,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <PatientLayout hideNav>
      {/* Header */}
      <div className="relative">
        <div className="gradient-primary h-48 rounded-b-3xl" />
        <div className="absolute top-4 right-4 left-4 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => toggleFavoriteDoctor(doctor.id)}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </button>
            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Doctor Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-20 right-4 left-4"
        >
          <Card variant="elevated" className="p-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl">
                {doctor.name.charAt(3)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-bold text-lg text-foreground">{doctor.name}</h1>
                  {doctor.isVerified && (
                    <CheckCircle className="w-5 h-5 text-primary fill-primary/20" />
                  )}
                  {isVisitingDoctor && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      زائر
                    </span>
                  )}
                </div>
                <p className="text-primary">{doctor.specialty}</p>
                <Link to={`/patient/clinic/${doctor.clinicId}`} className="text-sm text-muted-foreground hover:text-primary">
                  {doctor.clinicName}
                </Link>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-sm">{doctor.rating}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">({doctor.reviewCount} تقييم)</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="mt-24 p-4 space-y-6">
        {/* Visiting Doctor Notice */}
        {isVisitingDoctor && (
          <Card className="p-4 bg-amber-50 border-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-800">طبيب زائر / دولي</p>
                <p className="text-sm text-amber-600">
                  هذا الطبيب زائر ويتطلب موافقة مسبقة على الحجز. سيتم مراجعة طلبك قبل التأكيد.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "سنوات الخبرة", value: doctor.yearsExperience, icon: Award },
            { label: "المرضى", value: `${doctor.patientCount}+`, icon: Heart },
            { label: "الاستشارة", value: `${doctor.fees.consultation} د.ل`, icon: Clock },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-3 text-center">
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-1" />
                <p className="font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 gap-2">
            <Phone className="w-4 h-4" />
            اتصال
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <MessageCircle className="w-4 h-4" />
            رسالة
          </Button>
        </div>

        {/* About */}
        <Card className="p-4">
          <h3 className="font-semibold mb-2 text-foreground">نبذة عن الطبيب</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{doctor.bio}</p>
        </Card>

        {/* Education & Certifications */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
            <GraduationCap className="w-5 h-5 text-primary" />
            المؤهلات والشهادات
          </h3>
          <ul className="space-y-2">
            {doctor.qualifications.map((qual, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                {qual}
              </li>
            ))}
            {doctor.certifications.map((cert, i) => (
              <li key={`cert-${i}`} className="text-sm text-muted-foreground flex items-start gap-2">
                <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                {cert}
              </li>
            ))}
          </ul>
        </Card>

        {/* Languages */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
            <Languages className="w-5 h-5 text-primary" />
            اللغات
          </h3>
          <div className="flex gap-2">
            {doctor.languages.map((lang, i) => (
              <span key={i} className="text-sm bg-muted px-3 py-1 rounded-full">
                {lang}
              </span>
            ))}
          </div>
        </Card>

        {/* Insurance */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
            <Shield className="w-5 h-5 text-primary" />
            شركات التأمين
          </h3>
          <div className="flex flex-wrap gap-2">
            {doctor.insurances.map((ins, i) => (
              <span key={i} className="text-sm bg-muted px-3 py-1 rounded-full">
                {ins.name}
              </span>
            ))}
          </div>
        </Card>

        {/* Services */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-foreground">الخدمات</h3>
          <div className="flex flex-wrap gap-2">
            {doctor.services.map((service, i) => (
              <span key={i} className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                {service}
              </span>
            ))}
          </div>
        </Card>

        {/* Fees */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-foreground">رسوم الخدمات</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">استشارة عيادة</span>
              <span className="font-medium text-foreground">{doctor.fees.consultation} د.ل</span>
            </div>
            {doctor.acceptsVideo && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">استشارة فيديو</span>
                <span className="font-medium text-foreground">{doctor.fees.video} د.ل</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">استشارة طارئة</span>
              <span className="font-medium text-foreground">{doctor.fees.urgent} د.ل</span>
            </div>
            {doctor.acceptsHomeVisit && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">زيارة منزلية</span>
                <span className="font-medium text-foreground">{doctor.fees.homeVisit} د.ل</span>
              </div>
            )}
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">رسوم الخدمة</span>
                <span className="font-medium text-foreground">{platformFee} د.ل</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Location / Clinic Selection */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
            <MapPin className="w-5 h-5 text-primary" />
            العيادة
          </h3>
          
          {selectedClinic && (
            <div className="space-y-2">
              <p className="font-medium text-foreground">{selectedClinic.name}</p>
              <p className="text-sm text-muted-foreground">{selectedClinic.location.address}</p>
              
              {doctorClinics.length > 1 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSelectClinicClick}
                  className="mt-2"
                >
                  تغيير العيادة ({doctorClinics.length} عيادات متاحة)
                </Button>
              )}
            </div>
          )}
          
          <Button variant="outline" className="w-full gap-2 mt-3">
            <Navigation className="w-4 h-4" />
            الاتجاهات على الخريطة
          </Button>
        </Card>

        {/* Book Appointment */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
            <Calendar className="w-5 h-5 text-primary" />
            حجز موعد
          </h3>

          {/* Booking Type */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setBookingType('in_person')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                bookingType === 'in_person'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              زيارة عيادة ({doctor.fees.consultation} د.ل)
            </button>
            {doctor.acceptsVideo && (
              <button
                onClick={() => setBookingType('video')}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  bookingType === 'video'
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <Video className="w-4 h-4" />
                فيديو ({doctor.fees.video} د.ل)
              </button>
            )}
          </div>

          {/* Date Selection */}
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-hide">
            {dates.map((date, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(index)}
                className={`flex-shrink-0 w-16 py-3 rounded-xl text-center transition-all ${
                  selectedDate === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <p className="text-xs">{date.day}</p>
                <p className="font-bold">{date.date}</p>
                <p className="text-xs">{date.month}</p>
              </button>
            ))}
          </div>

          {/* Time Slots */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                disabled={!slot.available}
                onClick={() => setSelectedTime(slot.time)}
                className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                  selectedTime === slot.time
                    ? "bg-primary text-primary-foreground"
                    : slot.available
                    ? "bg-muted hover:bg-primary/10 text-foreground"
                    : "bg-muted/50 text-muted-foreground cursor-not-allowed line-through"
                }`}
              >
                {slot.timeAr}
              </button>
            ))}
          </div>
        </Card>

        {/* Total & Book Button */}
        <div className="sticky bottom-0 py-4 bg-background border-t border-border -mx-4 px-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-muted-foreground">الإجمالي</span>
            <span className="text-2xl font-bold text-primary">{totalFee} د.ل</span>
          </div>
          <Button
            className="w-full h-14 text-lg"
            disabled={!selectedTime || isBooking}
            onClick={handleBookingClick}
          >
            {isBooking ? "جاري الحجز..." : isVisitingDoctor ? "إرسال طلب الحجز" : "حجز الموعد"}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            رصيد المحفظة: {walletBalance} د.ل
          </p>
        </div>
      </div>

      {/* Dialogs */}
      <ClinicSelectionDialog
        isOpen={showClinicDialog}
        onClose={() => setShowClinicDialog(false)}
        onSelectClinic={(clinic) => {
          setSelectedClinic(clinic);
          setShowClinicDialog(false);
        }}
        clinics={doctorClinics}
        doctorName={doctor.name}
      />

      {selectedClinic && (
        <BookingSummaryDialog
          isOpen={showSummaryDialog}
          onClose={() => setShowSummaryDialog(false)}
          onConfirm={handleSummaryConfirm}
          doctor={doctor}
          clinic={selectedClinic}
          date={dates[selectedDate].full}
          time={selectedTime || ''}
          bookingType={bookingType}
          fees={fees}
          totalAmount={totalFee}
          isVisitingDoctor={isVisitingDoctor}
        />
      )}

      <UnifiedPaymentDialog
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        onPaymentComplete={(result) => handlePaymentComplete(result.paymentMethod, result.transactionId || `TXN-${Date.now()}`)}
        onPaymentFailed={handlePaymentFailed}
        paymentRequest={{
          serviceType: 'appointment',
          serviceId: `apt-${Date.now()}`,
          serviceName: `حجز موعد مع ${doctor.name}`,
          providerId: doctor.id,
          providerName: doctor.name,
          providerType: 'doctor',
          amount: totalFee,
          fees: fees,
          allowCash: bookingType === 'in_person',
        }}
      />

      <VisitingDoctorRequestDialog
        isOpen={showVisitingDoctorDialog}
        onClose={() => setShowVisitingDoctorDialog(false)}
        onRequestSubmitted={handleVisitingDoctorRequestSubmitted}
        onRequestApproved={handleVisitingDoctorApproved}
        doctor={doctor}
        date={dates[selectedDate].full}
        time={selectedTime || ''}
      />
    </PatientLayout>
  );
};

export default DoctorProfile;
