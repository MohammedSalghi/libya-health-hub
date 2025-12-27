import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowRight, Clock, Plus, Trash2, Save
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const timeSlots = [
  { id: 1, start: "09:00", end: "12:00", active: true },
  { id: 2, start: "14:00", end: "17:00", active: true },
  { id: 3, start: "18:00", end: "20:00", active: false },
];

const DoctorSchedule = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState(timeSlots);
  const [consultationDuration, setConsultationDuration] = useState(30);

  const toggleSlot = (id: number) => {
    setSlots(slots.map(slot => 
      slot.id === id ? { ...slot, active: !slot.active } : slot
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-white" onClick={() => navigate(-1)}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">إدارة الجدول</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Calendar */}
        <Card>
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-0"
            />
          </CardContent>
        </Card>

        {/* Consultation Duration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              مدة الاستشارة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {[15, 30, 45, 60].map((duration) => (
                <Button
                  key={duration}
                  variant={consultationDuration === duration ? "default" : "outline"}
                  onClick={() => setConsultationDuration(duration)}
                  className="flex-1"
                >
                  {duration} دقيقة
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">فترات العمل</CardTitle>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 ml-1" />
                إضافة فترة
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {slots.map((slot, index) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={slot.active}
                      onCheckedChange={() => toggleSlot(slot.id)}
                    />
                    <div className={slot.active ? "" : "opacity-50"}>
                      <div className="font-medium">
                        {slot.start} - {slot.end}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.floor((parseInt(slot.end) - parseInt(slot.start)) * 60 / consultationDuration)} موعد متاح
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Days Off */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">أيام الإجازة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"].map((day, index) => (
                <Button
                  key={day}
                  variant={index === 4 ? "default" : "outline"}
                  size="sm"
                >
                  {day}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button className="w-full" size="lg">
          <Save className="h-5 w-5 ml-2" />
          حفظ التغييرات
        </Button>
      </div>
    </div>
  );
};

export default DoctorSchedule;
