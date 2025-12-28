import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Phone, 
  MapPin, 
  Clock,
  AlertTriangle,
  Ambulance as AmbulanceIcon,
  Navigation,
  CheckCircle,
  Loader2,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ambulanceServices, ambulanceTypes } from "@/data/mockData";
import { useHealthcareStore } from "@/stores/healthcareStore";
import { AmbulanceRequest, AmbulanceType } from "@/types/healthcare";

type RequestStatus = 'idle' | 'locating' | 'selecting' | 'requesting' | 'dispatched' | 'en_route' | 'arrived';

const AmbulancePage = () => {
  const navigate = useNavigate();
  const { 
    addAmbulanceRequest, 
    userLocation, 
    setUserLocation,
    updateWalletBalance,
    addTransaction,
    addNotification,
    walletBalance
  } = useHealthcareStore();
  
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [selectedType, setSelectedType] = useState<AmbulanceType | null>(null);
  const [emergencyType, setEmergencyType] = useState<'critical' | 'urgent' | 'standard'>('urgent');
  const [estimatedArrival, setEstimatedArrival] = useState<number | null>(null);
  const [currentRequest, setCurrentRequest] = useState<AmbulanceRequest | null>(null);
  const [locationAddress, setLocationAddress] = useState<string>('');

  // Get user location
  const getLocation = () => {
    setStatus('locating');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setLocationAddress('شارع الجمهورية، طرابلس'); // Mock address
          setStatus('selecting');
        },
        (error) => {
          // Use default location if GPS fails
          setUserLocation({ lat: 32.8872, lng: 13.1913 });
          setLocationAddress('طرابلس، ليبيا');
          setStatus('selecting');
          toast.error("تعذر تحديد موقعك بدقة، يرجى التأكد من تفعيل GPS");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setUserLocation({ lat: 32.8872, lng: 13.1913 });
      setLocationAddress('طرابلس، ليبيا');
      setStatus('selecting');
    }
  };

  // Calculate estimated fee
  const calculateFee = (type: AmbulanceType): number => {
    const estimatedDistance = 5; // km (would be calculated from actual route)
    return type.baseFee + (type.perKmFee * estimatedDistance);
  };

  // Request ambulance
  const requestAmbulance = async () => {
    if (!selectedType || !userLocation) {
      toast.error("الرجاء اختيار نوع الإسعاف");
      return;
    }

    const estimatedFee = calculateFee(selectedType);
    
    if (walletBalance < estimatedFee) {
      toast.error("رصيد المحفظة غير كافي");
      navigate('/patient/wallet');
      return;
    }

    setStatus('requesting');

    // Simulate request processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const service = ambulanceServices[0];
    const arrival = Math.floor(Math.random() * 5) + 5; // 5-10 minutes
    setEstimatedArrival(arrival);

    const request: AmbulanceRequest = {
      id: `amb-${Date.now()}`,
      patientId: 'user1',
      serviceId: service.id,
      service: service,
      ambulanceType: selectedType,
      pickupLocation: {
        lat: userLocation.lat,
        lng: userLocation.lng,
        address: locationAddress,
        city: 'طرابلس'
      },
      status: 'dispatched',
      emergencyType,
      estimatedArrival: `${arrival} دقائق`,
      driverName: 'محمد علي',
      driverPhone: '+218 91 234 5678',
      vehicleNumber: 'طرابلس 123',
      distance: 5,
      fees: [
        { type: 'ambulance', amount: estimatedFee, currency: 'د.ل', description: 'رسوم الإسعاف' }
      ],
      totalAmount: estimatedFee,
      paymentStatus: 'pending',
      ratingPromptSent: false,
      createdAt: new Date().toISOString()
    };

    addAmbulanceRequest(request);
    setCurrentRequest(request);
    setStatus('dispatched');

    // Add notification
    addNotification({
      id: `notif-${Date.now()}`,
      userId: 'user1',
      type: 'ambulance_update',
      title: 'تم إرسال سيارة الإسعاف',
      message: `سيارة الإسعاف في الطريق إليك، الوصول المتوقع: ${arrival} دقائق`,
      data: {
        serviceType: 'ambulance',
        serviceId: request.id
      },
      isRead: false,
      createdAt: new Date().toISOString()
    });

    toast.success("تم إرسال سيارة الإسعاف!");

    // Simulate status updates
    setTimeout(() => {
      setStatus('en_route');
      toast.info("سيارة الإسعاف في الطريق إليك");
    }, 5000);
  };

  // Emergency call
  const callEmergency = () => {
    window.location.href = 'tel:1515';
  };

  return (
    <PatientLayout hideNav>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-destructive">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-xl text-white">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-white">طلب إسعاف</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Emergency Call */}
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-destructive flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-destructive">خط الطوارئ</p>
                <p className="text-2xl font-bold text-foreground">1515</p>
              </div>
            </div>
            <Button variant="destructive" size="lg" onClick={callEmergency}>
              اتصل الآن
            </Button>
          </div>
        </Card>

        {/* Status Display */}
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <Card className="p-6 text-center">
                <AmbulanceIcon className="w-16 h-16 text-destructive mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2 text-foreground">هل تحتاج إسعاف؟</h2>
                <p className="text-muted-foreground mb-6">
                  اضغط على الزر لتحديد موقعك وطلب سيارة إسعاف
                </p>
                <Button 
                  size="lg" 
                  variant="destructive" 
                  className="w-full h-14 text-lg"
                  onClick={getLocation}
                >
                  <MapPin className="w-5 h-5 ml-2" />
                  تحديد موقعي وطلب إسعاف
                </Button>
              </Card>
            </motion.div>
          )}

          {status === 'locating' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <Card className="p-8 text-center">
                <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
                <h2 className="text-xl font-bold mb-2 text-foreground">جاري تحديد موقعك...</h2>
                <p className="text-muted-foreground">يرجى الانتظار</p>
              </Card>
            </motion.div>
          )}

          {status === 'selecting' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Location Card */}
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">موقعك الحالي</p>
                    <p className="text-sm text-muted-foreground">{locationAddress}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={getLocation}>
                    تحديث
                  </Button>
                </div>
              </Card>

              {/* Emergency Type */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 text-foreground">نوع الحالة</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'critical' as const, label: 'حرجة', color: 'bg-red-500' },
                    { key: 'urgent' as const, label: 'طارئة', color: 'bg-orange-500' },
                    { key: 'standard' as const, label: 'عادية', color: 'bg-yellow-500' }
                  ].map(type => (
                    <button
                      key={type.key}
                      onClick={() => setEmergencyType(type.key)}
                      className={`p-3 rounded-xl text-center transition-all ${
                        emergencyType === type.key
                          ? `${type.color} text-white`
                          : 'bg-muted'
                      }`}
                    >
                      <AlertTriangle className={`w-6 h-6 mx-auto mb-1 ${emergencyType === type.key ? 'text-white' : 'text-muted-foreground'}`} />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Ambulance Types */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 text-foreground">نوع الإسعاف</h3>
                <div className="space-y-3">
                  {ambulanceTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type)}
                      className={`w-full p-4 rounded-xl text-right transition-all ${
                        selectedType?.id === type.id
                          ? 'bg-primary/10 border-2 border-primary'
                          : 'bg-muted border-2 border-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">{type.name}</h4>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                        <span className="font-bold text-primary">
                          ~{calculateFee(type)} د.ل
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {type.equipment.map((eq, i) => (
                          <span key={i} className="text-xs bg-background px-2 py-1 rounded-full">
                            {eq}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Request Button */}
              <Button 
                size="lg" 
                variant="destructive" 
                className="w-full h-14 text-lg"
                disabled={!selectedType}
                onClick={requestAmbulance}
              >
                <AmbulanceIcon className="w-5 h-5 ml-2" />
                طلب إسعاف الآن
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                رصيد المحفظة: {walletBalance} د.ل
              </p>
            </motion.div>
          )}

          {status === 'requesting' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <Card className="p-8 text-center">
                <Loader2 className="w-16 h-16 text-destructive mx-auto mb-4 animate-spin" />
                <h2 className="text-xl font-bold mb-2 text-foreground">جاري إرسال الطلب...</h2>
                <p className="text-muted-foreground">يتم البحث عن أقرب سيارة إسعاف</p>
              </Card>
            </motion.div>
          )}

          {(status === 'dispatched' || status === 'en_route') && currentRequest && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Status Card */}
              <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center animate-pulse">
                    <AmbulanceIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-700">
                      {status === 'dispatched' ? 'تم إرسال الإسعاف' : 'الإسعاف في الطريق'}
                    </p>
                    <p className="text-2xl font-bold text-green-800">
                      الوصول خلال {estimatedArrival} دقائق
                    </p>
                  </div>
                </div>
              </Card>

              {/* Driver Info */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 text-foreground">معلومات السائق</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">اسم السائق</span>
                    <span className="font-medium">{currentRequest.driverName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">رقم الهاتف</span>
                    <a href={`tel:${currentRequest.driverPhone}`} className="font-medium text-primary">
                      {currentRequest.driverPhone}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">رقم السيارة</span>
                    <span className="font-medium">{currentRequest.vehicleNumber}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 gap-2">
                  <Phone className="w-4 h-4" />
                  اتصل بالسائق
                </Button>
              </Card>

              {/* Map Placeholder */}
              <Card className="h-48 flex items-center justify-center bg-muted">
                <div className="text-center">
                  <Navigation className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">تتبع مباشر على الخريطة</p>
                </div>
              </Card>

              {/* Fee Info */}
              <Card className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">الرسوم المتوقعة</span>
                  <span className="text-xl font-bold text-foreground">
                    {currentRequest.totalAmount} د.ل
                  </span>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Service Info */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            خدمة الإسعاف الوطنية
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">متوسط وقت الوصول</span>
              <span>{ambulanceServices[0].averageResponseTime} دقائق</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">التقييم</span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {ambulanceServices[0].rating}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </PatientLayout>
  );
};

export default AmbulancePage;
