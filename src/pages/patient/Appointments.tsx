import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  ChevronLeft,
  Phone,
  MessageCircle,
  X,
  CheckCircle2,
  AlertCircle,
  Star
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useHealthcareStore, triggerRatingNotification } from "@/stores/healthcareStore";
import { doctors, clinics } from "@/data/mockData";
import { toast } from "sonner";
import { RatingDialog } from "@/components/patient/RatingDialog";

type TabType = "upcoming" | "past" | "cancelled";

const Appointments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [ratingDialog, setRatingDialog] = useState<{
    isOpen: boolean;
    serviceType: 'doctor' | 'clinic';
    serviceId: string;
    serviceName: string;
  }>({ isOpen: false, serviceType: 'doctor', serviceId: '', serviceName: '' });

  const { 
    appointments, 
    cancelAppointment, 
    updateAppointment,
    addNotification,
    userId 
  } = useHealthcareStore();

  // Categorize appointments
  const categorizedAppointments = {
    upcoming: appointments.filter(apt => 
      apt.status === 'confirmed' || apt.status === 'pending'
    ),
    past: appointments.filter(apt => apt.status === 'completed'),
    cancelled: appointments.filter(apt => apt.status === 'cancelled')
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: "upcoming", label: "القادمة" },
    { key: "past", label: "السابقة" },
    { key: "cancelled", label: "الملغاة" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            مؤكد
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
            <AlertCircle className="w-3 h-3" />
            في الانتظار
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            مكتمل
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
            <X className="w-3 h-3" />
            ملغي
          </span>
        );
    }
  };

  const handleCancel = (appointmentId: string) => {
    cancelAppointment(appointmentId);
    toast.success("تم إلغاء الموعد");
  };

  const handleComplete = (appointment: typeof appointments[0]) => {
    updateAppointment(appointment.id, { status: 'completed' });
    
    // Get doctor info
    const doctor = doctors.find(d => d.id === appointment.doctorId);
    
    // Trigger rating notification
    if (doctor) {
      triggerRatingNotification('doctor', doctor.id, doctor.name);
      
      // Also trigger clinic rating
      const clinic = clinics.find(c => c.id === doctor.clinicId);
      if (clinic) {
        setTimeout(() => {
          triggerRatingNotification('clinic', clinic.id, clinic.name);
        }, 1000);
      }
    }
    
    toast.success("تم اكتمال الموعد");
  };

  const handleRateService = (apt: typeof appointments[0]) => {
    const doctor = doctors.find(d => d.id === apt.doctorId);
    if (doctor) {
      setRatingDialog({
        isOpen: true,
        serviceType: 'doctor',
        serviceId: doctor.id,
        serviceName: doctor.name
      });
    }
  };

  return (
    <PatientLayout>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-xl">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground">مواعيدي</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-muted p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                {tab.label}
                <span className="mr-1 text-xs">
                  ({categorizedAppointments[tab.key].length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3"
          >
            {categorizedAppointments[activeTab].length === 0 ? (
              <Card className="p-8 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">لا توجد مواعيد</p>
                {activeTab === "upcoming" && (
                  <Link to="/patient/search">
                    <Button className="mt-4">احجز موعد جديد</Button>
                  </Link>
                )}
              </Card>
            ) : (
              categorizedAppointments[activeTab].map((apt, index) => {
                const doctor = apt.doctor || doctors.find(d => d.id === apt.doctorId);
                const clinic = apt.clinic || clinics.find(c => c.id === apt.clinicId);
                
                return (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card variant="elevated" className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-3">
                          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                            {doctor?.name?.charAt(0) || 'د'}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{doctor?.name || 'طبيب'}</h4>
                            <p className="text-sm text-muted-foreground">{doctor?.specialty}</p>
                          </div>
                        </div>
                        {getStatusBadge(apt.status)}
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(apt.date).toLocaleDateString('ar-LY')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {apt.time}
                        </span>
                        {apt.type === "video" ? (
                          <span className="flex items-center gap-1 text-primary">
                            <Video className="w-4 h-4" />
                            استشارة فيديو
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {clinic?.name}
                          </span>
                        )}
                      </div>

                      {/* Fee info */}
                      <div className="bg-muted/50 p-2 rounded-lg mb-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">رسوم الكشف</span>
                          <span className="font-medium">{apt.totalAmount} د.ل</span>
                        </div>
                      </div>

                      {activeTab === "upcoming" && (
                        <div className="flex gap-2">
                          {apt.type === "video" && apt.status === "confirmed" && (
                            <Button size="sm" className="flex-1 gap-2">
                              <Video className="w-4 h-4" />
                              انضم للمكالمة
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="flex-1 gap-2">
                            <MessageCircle className="w-4 h-4" />
                            رسالة
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleCancel(apt.id)}
                          >
                            إلغاء
                          </Button>
                          {/* Demo: Complete button for testing */}
                          <Button 
                            size="sm" 
                            variant="secondary"
                            onClick={() => handleComplete(apt)}
                          >
                            إنهاء
                          </Button>
                        </div>
                      )}

                      {activeTab === "past" && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            عرض التقرير
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 gap-1"
                            onClick={() => handleRateService(apt)}
                          >
                            <Star className="w-4 h-4" />
                            تقييم
                          </Button>
                          <Link to={`/patient/doctor/${apt.doctorId}`} className="flex-1">
                            <Button size="sm" className="w-full">
                              إعادة الحجز
                            </Button>
                          </Link>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Rating Dialog */}
      <RatingDialog
        isOpen={ratingDialog.isOpen}
        onClose={() => setRatingDialog({ ...ratingDialog, isOpen: false })}
        serviceType={ratingDialog.serviceType}
        serviceId={ratingDialog.serviceId}
        serviceName={ratingDialog.serviceName}
      />
    </PatientLayout>
  );
};

export default Appointments;
