import { useState } from "react";
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
  Navigation
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const doctor = {
  id: 1,
  name: "د. أحمد محمد العزابي",
  specialty: "طب القلب",
  hospital: "مستشفى طرابلس المركزي",
  rating: 4.9,
  reviews: 156,
  price: 50,
  experience: 15,
  patients: 2500,
  about: "طبيب قلب متخصص مع خبرة تزيد عن 15 عاماً في تشخيص وعلاج أمراض القلب والأوعية الدموية. حاصل على الزمالة البريطانية في أمراض القلب.",
  education: [
    "بكالوريوس الطب والجراحة - جامعة طرابلس",
    "ماجستير أمراض القلب - جامعة القاهرة",
    "زمالة بريطانية في أمراض القلب - MRCP",
  ],
  services: ["تخطيط القلب", "فحص إيكو", "اختبار الجهد", "قسطرة القلب"],
  languages: ["العربية", "الإنجليزية"],
  videoConsult: true,
  homeVisit: true,
  address: "شارع الجمهورية، طرابلس",
  workingHours: "السبت - الخميس: 9:00 ص - 5:00 م",
};

const timeSlots = [
  { time: "9:00 ص", available: true },
  { time: "9:30 ص", available: false },
  { time: "10:00 ص", available: true },
  { time: "10:30 ص", available: true },
  { time: "11:00 ص", available: false },
  { time: "11:30 ص", available: true },
  { time: "2:00 م", available: true },
  { time: "2:30 م", available: true },
  { time: "3:00 م", available: false },
];

const DoctorProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      day: date.toLocaleDateString("ar-LY", { weekday: "short" }),
      date: date.getDate(),
      full: date,
    };
  });

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
              onClick={() => setIsFavorite(!isFavorite)}
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
                أ
              </div>
              <div className="flex-1">
                <h1 className="font-bold text-lg text-foreground">{doctor.name}</h1>
                <p className="text-primary">{doctor.specialty}</p>
                <p className="text-sm text-muted-foreground">{doctor.hospital}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-sm">{doctor.rating}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">({doctor.reviews} تقييم)</span>
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
            { label: "سنوات الخبرة", value: doctor.experience, icon: Award },
            { label: "المرضى", value: `${doctor.patients}+`, icon: Heart },
            { label: "السعر", value: `${doctor.price} د.ل`, icon: Clock },
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
          {doctor.videoConsult && (
            <Button variant="outline" className="flex-1 gap-2">
              <Video className="w-4 h-4" />
              فيديو
            </Button>
          )}
        </div>

        {/* About */}
        <Card className="p-4">
          <h3 className="font-semibold mb-2 text-foreground">نبذة عن الطبيب</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{doctor.about}</p>
        </Card>

        {/* Education */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
            <GraduationCap className="w-5 h-5 text-primary" />
            المؤهلات العلمية
          </h3>
          <ul className="space-y-2">
            {doctor.education.map((edu, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                {edu}
              </li>
            ))}
          </ul>
        </Card>

        {/* Location */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
            <MapPin className="w-5 h-5 text-primary" />
            الموقع
          </h3>
          <p className="text-sm text-muted-foreground mb-2">{doctor.address}</p>
          <p className="text-sm text-muted-foreground mb-3">
            <Clock className="w-4 h-4 inline ml-1" />
            {doctor.workingHours}
          </p>
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

          {/* Date Selection */}
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-hide">
            {dates.map((date, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(index)}
                className={`flex-shrink-0 w-14 py-3 rounded-xl text-center transition-all ${
                  selectedDate === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <p className="text-xs">{date.day}</p>
                <p className="font-bold">{date.date}</p>
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
                    : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </Card>

        {/* Book Button */}
        <div className="sticky bottom-0 py-4 bg-background border-t border-border -mx-4 px-4">
          <Button
            className="w-full h-14 text-lg"
            disabled={!selectedTime}
            onClick={() => navigate(`/patient/booking/${id}?date=${selectedDate}&time=${selectedTime}`)}
          >
            {selectedTime ? `احجز الموعد - ${doctor.price} د.ل` : "اختر الوقت للحجز"}
          </Button>
        </div>
      </div>
    </PatientLayout>
  );
};

export default DoctorProfile;
