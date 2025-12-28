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
  Languages
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { doctors, clinics } from "@/data/mockData";
import { useHealthcareStore } from "@/stores/healthcareStore";
import { Appointment, Fee } from "@/types/healthcare";

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
  const clinic = doctor ? clinics.find(c => c.id === doctor.clinicId) : null;
  
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingType, setBookingType] = useState<'in_person' | 'video'>('in_person');
  const [isBooking, setIsBooking] = useState(false);

  const isFavorite = doctor ? favoriteDoctors.includes(doctor.id) : false;

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

  const handleBooking = async () => {
    if (!selectedTime) {
      toast.error("الرجاء اختيار وقت الموعد");
      return;
    }

    if (walletBalance < totalFee) {
      toast.error("رصيد المحفظة غير كافي");
      navigate('/patient/wallet');
      return;
    }

    setIsBooking(true);

    try {
      // Create appointment
      const appointment: Appointment = {
        id: `apt-${Date.now()}`,
        patientId: 'user1',
        doctorId: doctor.id,
        doctor: doctor,
        clinicId: doctor.clinicId,
        clinic: clinic!,
        date: dates[selectedDate].full,
        time: selectedTime,
        type: bookingType === 'video' ? 'video' : 'in_person',
        status: 'confirmed',
        fees: [
          { type: 'consultation', amount: currentFee, currency: 'د.ل', description: 'رسوم الاستشارة' },
          { type: 'platform', amount: platformFee, currency: 'د.ل', description: 'رسوم الخدمة' }
        ],
        totalAmount: totalFee,
        paidAmount: totalFee,
        paymentStatus: 'paid',
        ratingPromptSent: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add appointment to store
      addAppointment(appointment);

      // Deduct from wallet
      updateWalletBalance(-totalFee);

      // Add transaction
      addTransaction({
        id: `txn-${Date.now()}`,
        userId: 'user1',
        type: 'debit',
        amount: totalFee,
        description: `حجز موعد مع ${doctor.name}`,
        serviceType: 'doctor',
        serviceId: appointment.id,
        status: 'completed',
        createdAt: new Date().toISOString()
      });

      // Add confirmation notification
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

      toast.success("تم حجز الموعد بنجاح!");
      navigate('/patient/appointments');
    } catch (error) {
      toast.error("حدث خطأ أثناء الحجز");
    } finally {
      setIsBooking(false);
    }
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
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg text-foreground">{doctor.name}</h1>
                  {doctor.isVerified && (
                    <CheckCircle className="w-5 h-5 text-primary fill-primary/20" />
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

        {/* Location */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
            <MapPin className="w-5 h-5 text-primary" />
            الموقع
          </h3>
          <p className="text-sm text-muted-foreground mb-3">{clinic?.location.address}</p>
          <Button variant="outline" className="w-full gap-2">
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
            <span className="text-muted-foreground">المجموع:</span>
            <span className="text-xl font-bold text-primary">{totalFee} د.ل</span>
          </div>
          <Button
            className="w-full h-14 text-lg"
            disabled={!selectedTime || isBooking}
            onClick={handleBooking}
          >
            {isBooking ? "جاري الحجز..." : selectedTime ? `تأكيد الحجز` : "اختر الوقت للحجز"}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            رصيد المحفظة: {walletBalance} د.ل
          </p>
        </div>
      </div>
    </PatientLayout>
  );
};

export default DoctorProfile;
