import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, ArrowRight, ChevronLeft, Phone, FileText, 
  Calendar, Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const patients = [
  { 
    id: 1, 
    name: "محمد أحمد", 
    age: 35, 
    lastVisit: "منذ أسبوع",
    condition: "ضغط الدم",
    phone: "+218 91 234 5678"
  },
  { 
    id: 2, 
    name: "فاطمة علي", 
    age: 28, 
    lastVisit: "منذ شهر",
    condition: "فحص دوري",
    phone: "+218 92 345 6789"
  },
  { 
    id: 3, 
    name: "أحمد محمود", 
    age: 45, 
    lastVisit: "منذ 3 أيام",
    condition: "السكري",
    phone: "+218 93 456 7890"
  },
  { 
    id: 4, 
    name: "سارة خالد", 
    age: 32, 
    lastVisit: "اليوم",
    condition: "متابعة حمل",
    phone: "+218 94 567 8901"
  },
];

const DoctorPatients = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = patients.filter(patient =>
    patient.name.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" className="text-white" onClick={() => navigate(-1)}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">المرضى</h1>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="ابحث عن مريض..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 bg-white text-foreground"
          />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-primary">1,234</div>
              <div className="text-xs text-muted-foreground">إجمالي المرضى</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-primary">45</div>
              <div className="text-xs text-muted-foreground">هذا الشهر</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-xs text-muted-foreground">اليوم</div>
            </CardContent>
          </Card>
        </div>

        {/* Patients List */}
        <div className="space-y-3">
          {filteredPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {patient.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {patient.age} سنة • {patient.condition}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          آخر زيارة: {patient.lastVisit}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            لا توجد نتائج للبحث
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPatients;
