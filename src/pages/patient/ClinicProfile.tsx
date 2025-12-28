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
  Phone,
  Navigation,
  Heart,
  Share2,
  Users,
  CheckCircle,
  Shield
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { clinics, doctors } from "@/data/mockData";
import { useHealthcareStore } from "@/stores/healthcareStore";

const ClinicProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { favoriteClinics, toggleFavoriteClinic } = useHealthcareStore();
  
  const clinic = clinics.find(c => c.id === id);
  const clinicDoctors = doctors.filter(d => d.clinicId === id);
  
  const isFavorite = clinic ? favoriteClinics.includes(clinic.id) : false;

  if (!clinic) {
    return (
      <PatientLayout>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">العيادة غير موجودة</p>
          <Button onClick={() => navigate(-1)} className="mt-4">العودة</Button>
        </div>
      </PatientLayout>
    );
  }

  const isCurrentlyOpen = () => {
    const now = new Date();
    const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const todayName = dayNames[now.getDay()];
    const todayHours = clinic.workingHours.find(h => h.day === todayName);
    
    if (!todayHours || !todayHours.isOpen) return false;
    
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const [openHour, openMin] = todayHours.open.split(':').map(Number);
    const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
    const openTime = openHour * 100 + openMin;
    const closeTime = closeHour * 100 + closeMin;
    
    return currentTime >= openTime && currentTime <= closeTime;
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
              onClick={() => toggleFavoriteClinic(clinic.id)}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </button>
            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clinic Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-20 right-4 left-4"
        >
          <Card variant="elevated" className="p-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-3xl">
                🏥
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg text-foreground">{clinic.name}</h1>
                  {clinic.isVerified && (
                    <CheckCircle className="w-5 h-5 text-primary fill-primary/20" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{clinic.type === 'hospital' ? 'مستشفى' : clinic.type === 'clinic' ? 'عيادة' : 'مركز طبي'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-sm">{clinic.rating}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">({clinic.reviewCount} تقييم)</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isCurrentlyOpen() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isCurrentlyOpen() ? 'مفتوح الآن' : 'مغلق'}
                  </span>
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
            { label: "أطباء", value: clinic.doctorCount, icon: Users },
            { label: "تقييمات", value: clinic.reviewCount, icon: Star },
            { label: "تخصصات", value: clinic.specialties.length, icon: Shield },
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
            <Navigation className="w-4 h-4" />
            الاتجاهات
          </Button>
        </div>

        {/* Description */}
        {clinic.description && (
          <Card className="p-4">
            <h3 className="font-semibold mb-2 text-foreground">عن العيادة</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{clinic.description}</p>
          </Card>
        )}

        {/* Specialties */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-foreground">التخصصات</h3>
          <div className="flex flex-wrap gap-2">
            {clinic.specialties.map((spec, i) => (
              <span key={i} className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                {spec}
              </span>
            ))}
          </div>
        </Card>

        {/* Services */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-foreground">الخدمات</h3>
          <ul className="space-y-2">
            {clinic.services.map((service, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                {service}
              </li>
            ))}
          </ul>
        </Card>

        {/* Working Hours */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
            <Clock className="w-5 h-5 text-primary" />
            ساعات العمل
          </h3>
          <div className="space-y-2">
            {clinic.workingHours.map((day, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-foreground">{day.day}</span>
                <span className={day.isOpen ? "text-muted-foreground" : "text-red-500"}>
                  {day.isOpen ? `${day.open} - ${day.close}` : 'مغلق'}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Location */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
            <MapPin className="w-5 h-5 text-primary" />
            الموقع
          </h3>
          <p className="text-sm text-muted-foreground mb-3">{clinic.location.address}</p>
          <div className="h-32 bg-muted rounded-xl flex items-center justify-center">
            <p className="text-muted-foreground text-sm">خريطة تفاعلية</p>
          </div>
        </Card>

        {/* Insurance */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
            <Shield className="w-5 h-5 text-primary" />
            شركات التأمين المعتمدة
          </h3>
          <div className="flex flex-wrap gap-2">
            {clinic.insurances.map((ins, i) => (
              <span key={i} className="text-sm bg-muted px-3 py-1 rounded-full">
                {ins.name} ({ins.coveragePercentage}%)
              </span>
            ))}
          </div>
        </Card>

        {/* Doctors */}
        <div>
          <h3 className="font-semibold mb-4 text-foreground">الأطباء ({clinicDoctors.length})</h3>
          <div className="space-y-3">
            {clinicDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/patient/doctor/${doctor.id}`}>
                  <Card variant="elevated" className="p-4 hover:shadow-elevated transition-shadow">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                        {doctor.name.charAt(3)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{doctor.name}</h4>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                        <div className="flex items-center gap-3 mt-2 text-sm">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {doctor.rating}
                          </span>
                          <span className="text-primary font-bold">{doctor.fees.consultation} د.ل</span>
                        </div>
                      </div>
                      <Button size="sm">احجز</Button>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Fees */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-foreground">رسوم الخدمة</h3>
          <div className="space-y-2">
            {clinic.fees.map((fee, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{fee.description}</span>
                <span className="font-medium text-foreground">{fee.amount} {fee.currency}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PatientLayout>
  );
};

export default ClinicProfile;
