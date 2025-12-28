import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Star, 
  Video,
  ChevronLeft,
  Clock,
  CheckCircle,
  Calendar
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { doctors } from "@/data/mockData";

const specialties = [
  { id: 1, name: "الكل", icon: "🏥" },
  { id: 2, name: "طب القلب", icon: "❤️" },
  { id: 3, name: "طب الأطفال", icon: "👶" },
  { id: 4, name: "طب الجلدية", icon: "🧴" },
  { id: 5, name: "طب العيون", icon: "👁️" },
];

const VideoConsultationPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("الكل");

  // Filter doctors who accept video consultations
  const videoDoctors = useMemo(() => {
    return doctors
      .filter(doc => {
        const acceptsVideo = doc.acceptsVideo;
        const matchesQuery = !query || 
          doc.name.includes(query) || 
          doc.specialty.includes(query);
        const matchesSpecialty = selectedSpecialty === "الكل" || doc.specialty === selectedSpecialty;
        return acceptsVideo && matchesQuery && matchesSpecialty;
      })
      .sort((a, b) => b.rating - a.rating);
  }, [query, selectedSpecialty]);

  return (
    <PatientLayout>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-xl">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground">استشارة فيديو</h1>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن طبيب..."
              className="pr-10 rounded-xl bg-muted border-0"
            />
          </div>

          {/* Specialty Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {specialties.map((spec) => (
              <button
                key={spec.id}
                onClick={() => setSelectedSpecialty(spec.name)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  selectedSpecialty === spec.name
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <span>{spec.icon}</span>
                <span className="text-sm font-medium">{spec.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Info Card */}
        <Card className="p-4 bg-teal-50 border-teal-200">
          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-teal-800">استشارة من المنزل</h3>
              <p className="text-sm text-teal-600">
                تحدث مع الطبيب مباشرة عبر مكالمة فيديو آمنة
              </p>
            </div>
          </div>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Video, label: "مكالمة فيديو", desc: "HD آمنة" },
            { icon: Clock, label: "فوري", desc: "بدون انتظار" },
            { icon: Calendar, label: "تسجيل", desc: "اختياري" },
          ].map((feat, i) => (
            <Card key={i} className="p-3 text-center">
              <feat.icon className="w-6 h-6 text-primary mx-auto mb-1" />
              <p className="text-sm font-medium text-foreground">{feat.label}</p>
              <p className="text-xs text-muted-foreground">{feat.desc}</p>
            </Card>
          ))}
        </div>

        {/* Doctors List */}
        <div>
          <h3 className="font-semibold mb-4 text-foreground">
            أطباء متاحون للفيديو ({videoDoctors.length})
          </h3>
          <div className="space-y-3">
            {videoDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/patient/video-booking/${doctor.id}`}>
                  <Card variant="elevated" className="p-4 hover:shadow-elevated transition-shadow">
                    <div className="flex gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                          {doctor.name.charAt(3)}
                        </div>
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                          <Video className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{doctor.name}</h4>
                          {doctor.isVerified && (
                            <CheckCircle className="w-4 h-4 text-primary fill-primary/20" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                        <div className="flex items-center gap-3 mt-2 text-sm">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{doctor.rating}</span>
                            <span className="text-muted-foreground">({doctor.reviewCount})</span>
                          </span>
                          <span className="text-muted-foreground">
                            {doctor.yearsExperience} سنة خبرة
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-primary font-bold">{doctor.fees.video} د.ل</span>
                          <Button size="sm" className="gap-2">
                            <Video className="w-4 h-4" />
                            احجز فيديو
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}

            {videoDoctors.length === 0 && (
              <Card className="p-8 text-center">
                <Video className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">لا يوجد أطباء متاحون</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default VideoConsultationPage;
