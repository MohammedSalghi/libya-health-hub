import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Star, 
  MapPin,
  ChevronLeft,
  Clock,
  Home,
  FlaskConical,
  CheckCircle,
  Plus,
  Minus,
  Calendar
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { labs, labTests } from "@/data/mockData";
import { useHealthcareStore } from "@/stores/healthcareStore";
import { LabBooking, LabTest, Fee } from "@/types/healthcare";

const LabBookingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const lab = labs.find(l => l.id === id) || labs[0];
  
  const { 
    addLabBooking, 
    walletBalance, 
    updateWalletBalance,
    addTransaction,
    addNotification 
  } = useHealthcareStore();
  
  const [query, setQuery] = useState("");
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [bookingType, setBookingType] = useState<'in_lab' | 'home_collection'>('in_lab');
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  // Generate dates
  const dates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        day: date.toLocaleDateString("ar-LY", { weekday: "short" }),
        date: date.getDate(),
        full: date.toISOString().split('T')[0]
      };
    });
  }, []);

  // Time slots
  const timeSlots = ['08:00 ص', '09:00 ص', '10:00 ص', '11:00 ص', '12:00 م', '14:00 م', '15:00 م'];

  // Filter tests
  const filteredTests = useMemo(() => {
    return labTests.filter(test => 
      !query || test.name.includes(query) || test.nameEn?.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  // Calculate totals
  const selectedTestsData = labTests.filter(t => selectedTests.includes(t.id));
  const testsTotal = selectedTestsData.reduce((sum, t) => sum + t.price, 0);
  const homeCollectionFee = bookingType === 'home_collection' ? lab.homeCollectionFee : 0;
  const platformFee = 5;
  const totalAmount = testsTotal + homeCollectionFee + platformFee;

  const toggleTest = (testId: string) => {
    setSelectedTests(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const handleBooking = async () => {
    if (selectedTests.length === 0) {
      toast.error("الرجاء اختيار تحليل واحد على الأقل");
      return;
    }

    if (!selectedTime) {
      toast.error("الرجاء اختيار وقت الموعد");
      return;
    }

    if (walletBalance < totalAmount) {
      toast.error("رصيد المحفظة غير كافي");
      navigate('/patient/wallet');
      return;
    }

    setIsBooking(true);

    try {
      const booking: LabBooking = {
        id: `lab-${Date.now()}`,
        patientId: 'user1',
        labId: lab.id,
        lab: lab,
        tests: selectedTestsData,
        date: dates[selectedDate].full,
        time: selectedTime,
        type: bookingType,
        status: 'confirmed',
        fees: [
          { type: 'lab_test', amount: testsTotal, currency: 'د.ل', description: 'رسوم التحاليل' },
          ...(homeCollectionFee > 0 ? [{ type: 'home_visit' as const, amount: homeCollectionFee, currency: 'د.ل', description: 'رسوم السحب المنزلي' }] : []),
          { type: 'platform' as const, amount: platformFee, currency: 'د.ل', description: 'رسوم الخدمة' }
        ],
        totalAmount,
        paymentStatus: 'paid',
        ratingPromptSent: false,
        createdAt: new Date().toISOString()
      };

      addLabBooking(booking);
      updateWalletBalance(-totalAmount);

      addTransaction({
        id: `txn-${Date.now()}`,
        userId: 'user1',
        type: 'debit',
        amount: totalAmount,
        description: `حجز تحاليل في ${lab.name}`,
        serviceType: 'lab',
        serviceId: booking.id,
        status: 'completed',
        createdAt: new Date().toISOString()
      });

      addNotification({
        id: `notif-${Date.now()}`,
        userId: 'user1',
        type: 'appointment_confirmed',
        title: 'تم تأكيد حجز التحاليل',
        message: `موعدك في ${lab.name} يوم ${dates[selectedDate].day} الساعة ${selectedTime}`,
        data: {
          serviceType: 'lab',
          serviceId: booking.id
        },
        isRead: false,
        createdAt: new Date().toISOString()
      });

      toast.success("تم حجز التحاليل بنجاح!");
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
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-xl">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-foreground">{lab.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {lab.rating} ({lab.reviewCount})
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن تحليل..."
              className="pr-10 rounded-xl bg-muted border-0"
            />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Booking Type */}
        <div className="flex gap-2">
          <button
            onClick={() => setBookingType('in_lab')}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              bookingType === 'in_lab'
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            زيارة المختبر
          </button>
          {lab.offersHomeCollection && (
            <button
              onClick={() => setBookingType('home_collection')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                bookingType === 'home_collection'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <Home className="w-4 h-4" />
              سحب منزلي (+{lab.homeCollectionFee} د.ل)
            </button>
          )}
        </div>

        {/* Tests List */}
        <div>
          <h3 className="font-semibold mb-3 text-foreground">التحاليل المتاحة</h3>
          <div className="space-y-2">
            {filteredTests.map((test) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card 
                  className={`p-4 cursor-pointer transition-all ${
                    selectedTests.includes(test.id) 
                      ? 'bg-primary/10 border-primary' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => toggleTest(test.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{test.name}</h4>
                        {test.homeCollectionAvailable && (
                          <Home className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{test.nameEn}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {test.resultTime}
                        </span>
                        {test.preparationInstructions && (
                          <span className="text-primary">{test.preparationInstructions}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary">{test.price} د.ل</span>
                      {selectedTests.includes(test.id) ? (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-muted-foreground" />
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Selected Tests Summary */}
        {selectedTests.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold mb-3 text-foreground">التحاليل المختارة ({selectedTests.length})</h3>
            <div className="space-y-2">
              {selectedTestsData.map((test) => (
                <div key={test.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{test.name}</span>
                  <span>{test.price} د.ل</span>
                </div>
              ))}
              {homeCollectionFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">رسوم السحب المنزلي</span>
                  <span>{homeCollectionFee} د.ل</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">رسوم الخدمة</span>
                <span>{platformFee} د.ل</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>المجموع</span>
                  <span className="text-primary">{totalAmount} د.ل</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Date & Time Selection */}
        {selectedTests.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
              <Calendar className="w-5 h-5 text-primary" />
              اختر الموعد
            </h3>

            {/* Dates */}
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
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

            {/* Times */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                    selectedTime === time
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-primary/10"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Book Button */}
        {selectedTests.length > 0 && (
          <div className="sticky bottom-0 py-4 bg-background border-t border-border -mx-4 px-4">
            <Button
              className="w-full h-14 text-lg"
              disabled={!selectedTime || isBooking}
              onClick={handleBooking}
            >
              {isBooking ? "جاري الحجز..." : `تأكيد الحجز - ${totalAmount} د.ل`}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              رصيد المحفظة: {walletBalance} د.ل
            </p>
          </div>
        )}
      </div>
    </PatientLayout>
  );
};

export default LabBookingPage;
