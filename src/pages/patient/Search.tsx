import { useState, useMemo } from "react";
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
  X,
  Building2,
  FlaskConical,
  Map,
  List
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { doctors, clinics, labs, specialties } from "@/data/mockData";

type ViewMode = "list" | "map";
type SearchType = "doctor" | "clinic" | "lab" | "video";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = (searchParams.get("type") as SearchType) || "doctor";
  
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<SearchType>(initialType);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "price">("rating");
  const [availableNow, setAvailableNow] = useState(false);
  const [acceptsVideo, setAcceptsVideo] = useState(initialType === "video");

  // Calculate distance (mock function - would use real GPS)
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

  // Filter and sort doctors
  const filteredDoctors = useMemo(() => {
    let result = doctors.filter(doc => {
      const matchesQuery = !query || 
        doc.name.includes(query) || 
        doc.specialty.includes(query) ||
        doc.clinicName.includes(query);
      const matchesSpecialty = !selectedSpecialty || 
        doc.specialty.includes(selectedSpecialty) ||
        doc.specialty === specialties.find(s => s.name === selectedSpecialty)?.fullName;
      const matchesVideo = !acceptsVideo || doc.acceptsVideo;
      const matchesAvailable = !availableNow || doc.isAvailable;
      return matchesQuery && matchesSpecialty && matchesVideo && matchesAvailable;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price") return a.fees.consultation - b.fees.consultation;
      return 0;
    });

    return result;
  }, [query, selectedSpecialty, acceptsVideo, availableNow, sortBy]);

  // Filter clinics
  const filteredClinics = useMemo(() => {
    return clinics.filter(clinic => {
      const matchesQuery = !query || 
        clinic.name.includes(query) ||
        clinic.specialties.some(s => s.includes(query));
      const matchesSpecialty = !selectedSpecialty || clinic.specialties.includes(selectedSpecialty);
      return matchesQuery && matchesSpecialty;
    }).sort((a, b) => b.rating - a.rating);
  }, [query, selectedSpecialty]);

  // Filter labs
  const filteredLabs = useMemo(() => {
    return labs.filter(lab => {
      const matchesQuery = !query || lab.name.includes(query);
      return matchesQuery;
    }).sort((a, b) => b.rating - a.rating);
  }, [query]);

  const searchTypes = [
    { key: "doctor" as SearchType, label: "أطباء", icon: "👨‍⚕️" },
    { key: "clinic" as SearchType, label: "عيادات", icon: "🏥" },
    { key: "lab" as SearchType, label: "مختبرات", icon: "🔬" },
  ];

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
                placeholder={searchType === "doctor" ? "ابحث عن طبيب أو تخصص..." : 
                            searchType === "clinic" ? "ابحث عن عيادة..." : "ابحث عن مختبر..."}
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

          {/* Search Type Tabs */}
          <div className="flex gap-2">
            {searchTypes.map(type => (
              <button
                key={type.key}
                onClick={() => setSearchType(type.key)}
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  searchType === type.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
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
                  <Button
                    size="sm"
                    variant={sortBy === "price" ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => setSortBy("price")}
                  >
                    السعر
                  </Button>
                  <Button
                    size="sm"
                    variant={sortBy === "rating" ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => setSortBy("rating")}
                  >
                    التقييم
                  </Button>
                  <Button
                    size="sm"
                    variant={availableNow ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => setAvailableNow(!availableNow)}
                  >
                    متاح الآن
                  </Button>
                  {searchType === "doctor" && (
                    <Button
                      size="sm"
                      variant={acceptsVideo ? "default" : "outline"}
                      className="rounded-full"
                      onClick={() => setAcceptsVideo(!acceptsVideo)}
                    >
                      استشارة فيديو
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Specialties */}
        {searchType === "doctor" && (
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
        )}

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

        {/* View Toggle */}
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-foreground">
            {searchType === "doctor" && `الأطباء (${filteredDoctors.length})`}
            {searchType === "clinic" && `العيادات (${filteredClinics.length})`}
            {searchType === "lab" && `المختبرات (${filteredLabs.length})`}
          </h3>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${viewMode === "list" ? "bg-card shadow-sm" : ""}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`p-2 rounded-md ${viewMode === "map" ? "bg-card shadow-sm" : ""}`}
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results */}
        {viewMode === "map" ? (
          <Card className="h-64 flex items-center justify-center bg-muted">
            <div className="text-center">
              <Map className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">خريطة تفاعلية</p>
              <p className="text-sm text-muted-foreground">قريباً</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {/* Doctors List */}
            {searchType === "doctor" && filteredDoctors.map((doctor, index) => (
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
                        {doctor.name.charAt(3)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground">{doctor.name}</h4>
                            <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                            <Link 
                              to={`/patient/clinic/${doctor.clinicId}`}
                              className="text-xs text-primary hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {doctor.clinicName}
                            </Link>
                          </div>
                          {doctor.acceptsVideo && (
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <Video className="w-4 h-4 text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{doctor.rating}</span>
                            <span className="text-muted-foreground">({doctor.reviewCount})</span>
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {doctor.yearsExperience} سنة
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {doctor.isAvailable ? (
                              <span className="text-green-600">متاح</span>
                            ) : (
                              <span className="text-muted-foreground">غير متاح</span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-sm">
                            <span className="text-primary font-bold">{doctor.fees.consultation} د.ل</span>
                            {doctor.acceptsVideo && (
                              <span className="text-muted-foreground mr-2">
                                | فيديو: {doctor.fees.video} د.ل
                              </span>
                            )}
                          </div>
                          <Button size="sm">احجز الآن</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}

            {/* Clinics List */}
            {searchType === "clinic" && filteredClinics.map((clinic, index) => (
              <motion.div
                key={clinic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/patient/clinic/${clinic.id}`}>
                  <Card variant="elevated" className="p-4 hover:shadow-elevated transition-shadow">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl bg-teal-100 flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground">{clinic.name}</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {clinic.location.address}
                            </p>
                          </div>
                          {clinic.isOpen ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">مفتوح</span>
                          ) : (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">مغلق</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {clinic.specialties.slice(0, 3).map((spec, i) => (
                            <span key={i} className="text-xs bg-muted px-2 py-1 rounded-full">
                              {spec}
                            </span>
                          ))}
                          {clinic.specialties.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{clinic.specialties.length - 3}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3 text-sm">
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {clinic.rating} ({clinic.reviewCount})
                            </span>
                            <span className="text-muted-foreground">
                              {clinic.doctorCount} طبيب
                            </span>
                          </div>
                          <Button size="sm" variant="outline">عرض</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}

            {/* Labs List */}
            {searchType === "lab" && filteredLabs.map((lab, index) => (
              <motion.div
                key={lab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/patient/lab/${lab.id}`}>
                  <Card variant="elevated" className="p-4 hover:shadow-elevated transition-shadow">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl bg-coral-100 flex items-center justify-center">
                        <FlaskConical className="w-8 h-8 text-coral-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground">{lab.name}</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {lab.location.address}
                            </p>
                          </div>
                          {lab.offersHomeCollection && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              سحب منزلي
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3 text-sm">
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {lab.rating} ({lab.reviewCount})
                            </span>
                            {lab.offersHomeCollection && (
                              <span className="text-muted-foreground">
                                رسوم السحب: {lab.homeCollectionFee} د.ل
                              </span>
                            )}
                          </div>
                          <Button size="sm">احجز</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PatientLayout>
  );
};

export default SearchPage;
