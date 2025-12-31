// Home Visit Data - Partners in Tripoli and Benghazi
import { HomeVisitProvider, HomeVisitDoctor, HomeVisitSlot } from '@/types/homeVisit';

// Generate available slots for the next 7 days
const generateSlots = (): HomeVisitSlot[] => {
  const slots: HomeVisitSlot[] = [];
  const today = new Date();
  
  for (let d = 0; d < 7; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    
    // Skip Friday
    if (date.getDay() === 5) continue;
    
    const times = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    times.forEach(time => {
      slots.push({
        date: dateStr,
        time,
        available: Math.random() > 0.3 // 70% availability
      });
    });
  }
  
  return slots;
};

// ============= Home Visit Providers =============
export const homeVisitProviders: HomeVisitProvider[] = [
  // Tripoli Providers
  {
    id: 'provider1',
    name: 'Medilink International',
    city: 'طرابلس',
    type: 'company',
    address: 'شارع الجمهورية، المنشية، طرابلس',
    phone: '+218 21 444 5566',
    rating: 4.8,
    reviewCount: 342,
    description: 'شركة متخصصة في الرعاية الصحية المنزلية تقدم خدمات طبية عالية الجودة في راحة منزلك',
    specialties: ['طب عام', 'طب الأطفال', 'طب الباطنية', 'طب القلب', 'طب الأعصاب'],
    priceRange: { min: 100, max: 300 },
    workingHours: 'السبت - الخميس: 8:00 - 20:00',
    isAvailable: true,
    responseTime: '30-60 دقيقة',
    doctors: ['hv-doc1', 'hv-doc2', 'hv-doc3']
  },
  {
    id: 'provider2',
    name: 'مستشفى طرابلس الجامعي',
    city: 'طرابلس',
    type: 'hospital',
    address: 'شارع الجامعة، طرابلس',
    phone: '+218 21 333 4444',
    rating: 4.6,
    reviewCount: 521,
    description: 'خدمة الزيارات المنزلية من مستشفى طرابلس الجامعي لجميع التخصصات',
    specialties: ['طب عام', 'طب الأطفال', 'طب النساء', 'طب العظام', 'طب الجلدية'],
    priceRange: { min: 80, max: 250 },
    workingHours: 'السبت - الخميس: 9:00 - 18:00',
    isAvailable: true,
    responseTime: '45-90 دقيقة',
    doctors: ['hv-doc4', 'hv-doc5']
  },
  {
    id: 'provider3',
    name: 'المصحة السلام الدائم',
    city: 'طرابلس',
    type: 'clinic',
    address: 'شارع النصر، حي الأندلس، طرابلس',
    phone: '+218 21 555 6677',
    rating: 4.7,
    reviewCount: 189,
    description: 'مصحة متميزة تقدم خدمات زيارة الطبيب إلى المنزل على مدار الساعة',
    specialties: ['طب عام', 'طب الأطفال', 'طب الباطنية'],
    priceRange: { min: 90, max: 200 },
    workingHours: '24 ساعة / 7 أيام',
    isAvailable: true,
    responseTime: '20-45 دقيقة',
    doctors: ['hv-doc6', 'hv-doc7']
  },
  {
    id: 'provider4',
    name: 'عيادة الحياة للرعاية المنزلية',
    city: 'طرابلس',
    type: 'clinic',
    address: 'شارع زاوية الدهماني، طرابلس',
    phone: '+218 21 666 7788',
    rating: 4.5,
    reviewCount: 156,
    description: 'رعاية صحية متكاملة في منزلك مع فريق طبي متخصص',
    specialties: ['طب عام', 'طب الأطفال', 'علاج طبيعي'],
    priceRange: { min: 70, max: 180 },
    workingHours: 'السبت - الخميس: 8:00 - 22:00',
    isAvailable: true,
    responseTime: '30-60 دقيقة',
    doctors: ['hv-doc8']
  },
  // Benghazi Providers
  {
    id: 'provider5',
    name: 'مكتب طبيبك إلى منزلك',
    city: 'بنغازي',
    type: 'company',
    address: 'شارع جمال عبدالناصر، بنغازي',
    phone: '+218 61 222 3344',
    rating: 4.9,
    reviewCount: 287,
    description: 'أول مكتب متخصص في خدمات الطبيب المنزلي في بنغازي',
    specialties: ['طب عام', 'طب الأطفال', 'طب الباطنية', 'طب القلب', 'طب النساء'],
    priceRange: { min: 80, max: 250 },
    workingHours: 'السبت - الخميس: 8:00 - 21:00',
    isAvailable: true,
    responseTime: '25-50 دقيقة',
    doctors: ['hv-doc9', 'hv-doc10', 'hv-doc11']
  },
  {
    id: 'provider6',
    name: 'Touches Clinic',
    city: 'بنغازي',
    type: 'clinic',
    address: 'شارع فينيسيا، الفويهات، بنغازي',
    phone: '+218 61 333 4455',
    rating: 4.8,
    reviewCount: 203,
    description: 'عيادة تقدم خدمات زيارة منزلية بأعلى المعايير الطبية',
    specialties: ['طب الجلدية', 'طب الأطفال', 'طب النساء', 'طب عام'],
    priceRange: { min: 100, max: 280 },
    workingHours: 'السبت - الخميس: 9:00 - 20:00',
    isAvailable: true,
    responseTime: '30-60 دقيقة',
    doctors: ['hv-doc12', 'hv-doc13']
  },
  {
    id: 'provider7',
    name: 'لمسة شفاء',
    city: 'بنغازي',
    type: 'clinic',
    address: 'شارع عمر المختار، وسط بنغازي',
    phone: '+218 61 444 5566',
    rating: 4.6,
    reviewCount: 167,
    description: 'رعاية طبية منزلية متميزة مع أفضل الأطباء في بنغازي',
    specialties: ['طب عام', 'طب الأطفال', 'طب الباطنية', 'طب العظام'],
    priceRange: { min: 75, max: 220 },
    workingHours: 'السبت - الخميس: 8:00 - 19:00',
    isAvailable: true,
    responseTime: '35-70 دقيقة',
    doctors: ['hv-doc14', 'hv-doc15']
  },
  {
    id: 'provider8',
    name: 'مركز الرحمة الطبي المنزلي',
    city: 'بنغازي',
    type: 'company',
    address: 'شارع الاستقلال، بنغازي',
    phone: '+218 61 555 6677',
    rating: 4.7,
    reviewCount: 234,
    description: 'مركز متخصص في تقديم الخدمات الطبية المنزلية الشاملة',
    specialties: ['طب عام', 'طب الأطفال', 'تمريض منزلي', 'علاج طبيعي'],
    priceRange: { min: 60, max: 200 },
    workingHours: '24 ساعة / 7 أيام',
    isAvailable: true,
    responseTime: '20-40 دقيقة',
    doctors: ['hv-doc16', 'hv-doc17']
  }
];

// ============= Home Visit Doctors =============
export const homeVisitDoctors: HomeVisitDoctor[] = [
  // Tripoli - Medilink International
  {
    id: 'hv-doc1',
    name: 'د. سالم محمد العزابي',
    specialty: 'طب عام',
    rating: 4.9,
    reviewCount: 156,
    homeVisitFee: 120,
    providerId: 'provider1',
    providerName: 'Medilink International',
    yearsExperience: 12,
    isAvailable: true,
    availableSlots: generateSlots()
  },
  {
    id: 'hv-doc2',
    name: 'د. آمنة علي الشريف',
    specialty: 'طب الأطفال',
    rating: 4.8,
    reviewCount: 203,
    homeVisitFee: 130,
    providerId: 'provider1',
    providerName: 'Medilink International',
    yearsExperience: 10,
    isAvailable: true,
    availableSlots: generateSlots()
  },
  {
    id: 'hv-doc3',
    name: 'د. عمر حسن الفيتوري',
    specialty: 'طب الباطنية',
    rating: 4.7,
    reviewCount: 89,
    homeVisitFee: 150,
    providerId: 'provider1',
    providerName: 'Medilink International',
    yearsExperience: 15,
    isAvailable: true,
    availableSlots: generateSlots()
  },
  // Tripoli - Tripoli University Hospital
  {
    id: 'hv-doc4',
    name: 'د. خالد أحمد الطرابلسي',
    specialty: 'طب عام',
    rating: 4.6,
    reviewCount: 178,
    homeVisitFee: 100,
    providerId: 'provider2',
    providerName: 'مستشفى طرابلس الجامعي',
    yearsExperience: 8,
    isAvailable: true,
    availableSlots: generateSlots()
  },
  {
    id: 'hv-doc5',
    name: 'د. فاطمة محمود السنوسي',
    specialty: 'طب الأطفال',
    rating: 4.8,
    reviewCount: 145,
    homeVisitFee: 110,
    providerId: 'provider2',
    providerName: 'مستشفى طرابلس الجامعي',
    yearsExperience: 11,
    isAvailable: true,
    availableSlots: generateSlots()
  },
  // Tripoli - Al-Salam Clinic
  {
    id: 'hv-doc6',
    name: 'د. محمد علي الغرياني',
    specialty: 'طب عام',
    rating: 4.7,
    reviewCount: 112,
    homeVisitFee: 100,
    providerId: 'provider3',
    providerName: 'المصحة السلام الدائم',
    yearsExperience: 9,
    isAvailable: true,
    availableSlots: generateSlots()
  },
  {
    id: 'hv-doc7',
    name: 'د. سارة يوسف البكوش',
    specialty: 'طب الباطنية',
    rating: 4.9,
    reviewCount: 134,
    homeVisitFee: 140,
    providerId: 'provider3',
    providerName: 'المصحة السلام الدائم',
    yearsExperience: 14,
    isAvailable: true,
    availableSlots: generateSlots()
  },
  // Tripoli - Al-Hayat Clinic
  {
    id: 'hv-doc8',
    name: 'د. أحمد سالم المصراتي',
    specialty: 'طب عام',
    rating: 4.5,
    reviewCount: 89,
    homeVisitFee: 90,
    providerId: 'provider4',
    providerName: 'عيادة الحياة للرعاية المنزلية',
    yearsExperience: 6,
    isAvailable: true,
    availableSlots: generateSlots()
  },
  // Benghazi - طبيبك إلى منزلك
  {
    id: 'hv-doc9',
    name: 'د. عبدالله محمد الزناتي',
    specialty: 'طب عام',
    rating: 4.9,
    reviewCount: 198,
    homeVisitFee: 100,
    providerId: 'provider5',
    providerName: 'مكتب طبيبك إلى منزلك',
    yearsExperience: 13,
    isAvailable: true,
    availableSlots: generateSlots()
  },
  {
    id: 'hv-doc10',
    name: 'د. هدى علي الدرسي',
    specialty: 'طب الأطفال',
    rating: 4.8,
    reviewCount: 167,
    homeVisitFee: 110,
    providerId: 'provider5',
    providerName: 'مكتب طبيبك إلى منزلك',
    yearsExperience: 10,
    isAvailable: true,
    availableSlots: generateSlots()
  },
  {
    id: 'hv-doc11',
    name: 'د. يوسف خالد الأوجلي',
    specialty: 'طب الباطنية',
    rating: 4.7,
    reviewCount: 145,
    homeVisitFee: 130,
    providerId: 'provider5',
    providerName: 'مكتب طبيبك إلى منزلك',
    yearsExperience: 16,
    isAvailable: true,
    availableSlots: generateSlots()
  },
  // Benghazi - Touches Clinic
  {
    id: 'hv-doc12',
    name: 'د. ليلى أحمد المسماري',
    specialty: 'طب الجلدية',
    rating: 4.8,
    reviewCount: 123,
    homeVisitFee: 150,
    providerId: 'provider6',
    providerName: 'Touches Clinic',
    yearsExperience: 11,
    isAvailable: true,
    availableSlots: generateSlots()
  },
  {
    id: 'hv-doc13',
    name: 'د. نورة سعيد البرغثي',
    specialty: 'طب النساء',
    rating: 4.9,
    reviewCount: 189,
    homeVisitFee: 160,
    providerId: 'provider6',
    providerName: 'Touches Clinic',
    yearsExperience: 14,
    isAvailable: true,
    availableSlots: generateSlots()
  },
  // Benghazi - لمسة شفاء
  {
    id: 'hv-doc14',
    name: 'د. عمار محمد الككلي',
    specialty: 'طب عام',
    rating: 4.6,
    reviewCount: 98,
    homeVisitFee: 90,
    providerId: 'provider7',
    providerName: 'لمسة شفاء',
    yearsExperience: 7,
    isAvailable: true,
    availableSlots: generateSlots()
  },
  {
    id: 'hv-doc15',
    name: 'د. منى علي الفاخري',
    specialty: 'طب الأطفال',
    rating: 4.7,
    reviewCount: 134,
    homeVisitFee: 100,
    providerId: 'provider7',
    providerName: 'لمسة شفاء',
    yearsExperience: 9,
    isAvailable: true,
    availableSlots: generateSlots()
  },
  // Benghazi - مركز الرحمة
  {
    id: 'hv-doc16',
    name: 'د. سليمان أحمد العقوري',
    specialty: 'طب عام',
    rating: 4.7,
    reviewCount: 156,
    homeVisitFee: 80,
    providerId: 'provider8',
    providerName: 'مركز الرحمة الطبي المنزلي',
    yearsExperience: 8,
    isAvailable: true,
    availableSlots: generateSlots()
  },
  {
    id: 'hv-doc17',
    name: 'د. إيمان خالد الشلماني',
    specialty: 'طب الأطفال',
    rating: 4.8,
    reviewCount: 178,
    homeVisitFee: 90,
    providerId: 'provider8',
    providerName: 'مركز الرحمة الطبي المنزلي',
    yearsExperience: 12,
    isAvailable: true,
    availableSlots: generateSlots()
  }
];

// Helper function to get doctors by provider
export const getDoctorsByProvider = (providerId: string): HomeVisitDoctor[] => {
  return homeVisitDoctors.filter(doc => doc.providerId === providerId);
};

// Helper function to get providers by city
export const getProvidersByCity = (city: 'طرابلس' | 'بنغازي'): HomeVisitProvider[] => {
  return homeVisitProviders.filter(provider => provider.city === city);
};

// Helper function to get doctors by specialty
export const getDoctorsBySpecialty = (specialty: string): HomeVisitDoctor[] => {
  return homeVisitDoctors.filter(doc => doc.specialty === specialty);
};

// Get all unique specialties
export const getHomeVisitSpecialties = (): string[] => {
  const specialties = new Set<string>();
  homeVisitDoctors.forEach(doc => specialties.add(doc.specialty));
  return Array.from(specialties);
};
