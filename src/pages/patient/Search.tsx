import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PatientLayout } from "@/components/patient/PatientLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search as SearchIcon, 
  Filter, 
  Star, 
  MapPin, 
  Clock,
  Video,
  ChevronLeft,
  X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const specialties = [
  { id: 1, name: "طب القلب", icon: "❤️" },
  { id: 2, name: "طب الأطفال", icon: "👶" },
  { id: 3, name: "طب الأسنان", icon: "🦷" },
  { id: 4, name: "طب العيون", icon: "👁️" },
  { id: 5, name: "طب الجلدية", icon: "🧴" },
  { id: 6, name: "طب العظام", icon: "🦴" },
  { id: 7, name: "طب النساء", icon: "👩" },
  { id: 8, name: "طب الأعصاب", icon: "🧠" },
];

const doctors = [
  {
    id: 1,
    name: "د. أحمد محمد العزابي",
    specialty: "طب القلب",
    hospital: "مستشفى طرابلس المركزي",
    rating: 4.9,
    reviews: 156,
    price: 50,
    distance: "1.2 كم",
    available: true,
    videoConsult: true,
    avatar: "أ",
  },
  {
    id: 2,
    name: "د. فاطمة علي الشريف",
    specialty: "طب الأطفال",
    hospital: "عيادة الشفاء",
    rating: 4.8,
    reviews: 98,
    price: 40,
    distance: "0.8 كم",
    available: true,
    videoConsult: true,
    avatar: "ف",
  },
  {
    id: 3,
    name: "د. محمود سالم",
    specialty: "طب العيون",
    hospital: "مركز النور للعيون",
    rating: 4.7,
    reviews: 203,
    price: 60,
    distance: "2.5 كم",
    available: false,
    videoConsult: false,
    avatar: "م",
  },
];

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.includes(query) ||
      doc.specialty.includes(query) ||
      doc.hospital.includes(query)
  );

  return (
    <PatientLayout>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-xl">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex-1 relative">
              <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن طبيب، تخصص، أو مستشفى..."
                className="pr-10 rounded-xl bg-muted border-0"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-primary text-primary-foreground" : ""}
            >
              <Filter className="w-5 h-5" />
            </Button>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" className="rounded-full">
                    السعر
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full">
                    التقييم
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full">
                    المسافة
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full">
                    متاح الآن
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full">
                    استشارة فيديو
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Specialties */}
        <section>
          <h3 className="font-semibold mb-3 text-foreground">التخصصات</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {specialties.map((spec) => (
              <button
                key={spec.id}
                onClick={() => setSelectedSpecialty(selectedSpecialty === spec.name ? null : spec.name)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                  selectedSpecialty === spec.name
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border hover:border-primary"
                }`}
              >
                <span>{spec.icon}</span>
                <span className="text-sm font-medium">{spec.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Selected Specialty Tag */}
        {selectedSpecialty && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">نتائج البحث عن:</span>
            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              {selectedSpecialty}
              <button onClick={() => setSelectedSpecialty(null)}>
                <X className="w-4 h-4" />
              </button>
            </span>
          </div>
        )}

        {/* Results */}
        <section>
          <h3 className="font-semibold mb-3 text-foreground">
            الأطباء ({filteredDoctors.length})
          </h3>
          <div className="space-y-3">
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/patient/doctor/${doctor.id}`}>
                  <Card variant="elevated" className="p-4 hover:shadow-elevated transition-shadow">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                        {doctor.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground">{doctor.name}</h4>
                            <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                            <p className="text-xs text-muted-foreground">{doctor.hospital}</p>
                          </div>
                          {doctor.videoConsult && (
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <Video className="w-4 h-4 text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{doctor.rating}</span>
                            <span className="text-muted-foreground">({doctor.reviews})</span>
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {doctor.distance}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {doctor.available ? (
                              <span className="text-green-600">متاح</span>
                            ) : (
                              <span className="text-muted-foreground">غير متاح</span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-primary font-bold">{doctor.price} د.ل</span>
                          <Button size="sm">احجز الآن</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </PatientLayout>
  );
};

export default SearchPage;
