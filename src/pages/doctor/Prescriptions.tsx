import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowRight, Plus, Pill, Trash2, Send, FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

const DoctorPrescriptions = () => {
  const navigate = useNavigate();
  const [medications, setMedications] = useState<Medication[]>([
    { id: 1, name: "", dosage: "", frequency: "", duration: "" }
  ]);
  const [notes, setNotes] = useState("");

  const addMedication = () => {
    setMedications([
      ...medications,
      { id: Date.now(), name: "", dosage: "", frequency: "", duration: "" }
    ]);
  };

  const removeMedication = (id: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter(med => med.id !== id));
    }
  };

  const updateMedication = (id: number, field: keyof Medication, value: string) => {
    setMedications(medications.map(med =>
      med.id === id ? { ...med, [field]: value } : med
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
          <h1 className="text-xl font-bold">وصفة طبية جديدة</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Patient Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">معلومات المريض</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="اسم المريض" />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="العمر" type="number" />
              <Input placeholder="رقم الهاتف" />
            </div>
          </CardContent>
        </Card>

        {/* Medications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                الأدوية
              </CardTitle>
              <Button variant="outline" size="sm" onClick={addMedication}>
                <Plus className="h-4 w-4 ml-1" />
                إضافة دواء
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {medications.map((med, index) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">دواء {index + 1}</span>
                  {medications.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeMedication(med.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Input 
                  placeholder="اسم الدواء"
                  value={med.name}
                  onChange={(e) => updateMedication(med.id, "name", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input 
                    placeholder="الجرعة (مثال: 500mg)"
                    value={med.dosage}
                    onChange={(e) => updateMedication(med.id, "dosage", e.target.value)}
                  />
                  <Input 
                    placeholder="التكرار (مثال: 3 مرات)"
                    value={med.frequency}
                    onChange={(e) => updateMedication(med.id, "frequency", e.target.value)}
                  />
                </div>
                <Input 
                  placeholder="المدة (مثال: 7 أيام)"
                  value={med.duration}
                  onChange={(e) => updateMedication(med.id, "duration", e.target.value)}
                />
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              ملاحظات وتعليمات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="أضف تعليمات للمريض..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            حفظ كمسودة
          </Button>
          <Button className="flex-1">
            <Send className="h-4 w-4 ml-2" />
            إرسال للمريض
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorPrescriptions;
