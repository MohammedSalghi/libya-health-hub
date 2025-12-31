// Clinic Selection Dialog - User must manually select clinic
import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  MapPin, Star, Clock, Building2, Navigation, CheckCircle, Phone
} from "lucide-react";
import { Clinic } from "@/types/healthcare";

interface ClinicSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClinic: (clinic: Clinic) => void;
  clinics: Clinic[];
  doctorName: string;
}

export const ClinicSelectionDialog = ({
  isOpen,
  onClose,
  onSelectClinic,
  clinics,
  doctorName
}: ClinicSelectionDialogProps) => {
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

  // Calculate mock distance
  const calculateDistance = (lat: number, lng: number): number => {
    const userLat = 32.8872;
    const userLng = 13.1913;
    const R = 6371;
    const dLat = ((lat - userLat) * Math.PI) / 180;
    const dLon = ((lng - userLng) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos((userLat * Math.PI) / 180) * Math.cos((lat * Math.PI) / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  const handleConfirm = () => {
    if (selectedClinic) {
      onSelectClinic(selectedClinic);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            اختر العيادة
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-center text-muted-foreground">
            {doctorName} متاح في العيادات التالية
          </p>

          {/* Clinics List */}
          <div className="space-y-3">
            {clinics.map((clinic, index) => {
              const distance = calculateDistance(clinic.location.lat, clinic.location.lng);
              const isSelected = selectedClinic?.id === clinic.id;
              
              return (
                <motion.div
                  key={clinic.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-primary/10 border-primary ring-2 ring-primary' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedClinic(clinic)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-teal-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground truncate">{clinic.name}</h4>
                          {isSelected && (
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          )}
                        </div>
                        
                        {/* Address */}
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{clinic.location.address}</span>
                        </p>
                        
                        {/* Rating & Distance */}
                        <div className="flex items-center gap-3 mt-2 text-sm">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{clinic.rating}</span>
                          </span>
                          <span className="text-muted-foreground">
                            {distance} كم
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            clinic.isOpen 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {clinic.isOpen ? 'مفتوح' : 'مغلق'}
                          </span>
                        </div>

                        {/* Phone */}
                        {clinic.phone && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                            <Phone className="w-3 h-3" />
                            {clinic.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Map Preview (when selected) */}
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-3 pt-3 border-t border-border"
                      >
                        <div className="h-24 bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Navigation className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
                            <p className="text-xs text-muted-foreground">عرض على الخريطة</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 sticky bottom-0 bg-background">
            <Button variant="outline" onClick={onClose} className="flex-1">
              إلغاء
            </Button>
            <Button 
              onClick={handleConfirm} 
              className="flex-1"
              disabled={!selectedClinic}
            >
              تأكيد الاختيار
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClinicSelectionDialog;
