// Mock Data for Healthcare Super App
import { 
  Clinic, Doctor, Lab, Pharmacy, AmbulanceService,
  Insurance, WorkingHours, LabTest, Medication, AmbulanceType
} from '@/types/healthcare';

// ============= Insurance Companies =============
export const insuranceCompanies: Insurance[] = [
  { id: 'ins1', name: 'التأمين الوطني', coveragePercentage: 80 },
  { id: 'ins2', name: 'ليبيا للتأمين', coveragePercentage: 70 },
  { id: 'ins3', name: 'الصحراء للتأمين', coveragePercentage: 75 },
  { id: 'ins4', name: 'المتوسط للتأمين', coveragePercentage: 65 },
];

// ============= Standard Working Hours =============
const standardWorkingHours: WorkingHours[] = [
  { day: 'السبت', open: '09:00', close: '17:00', isOpen: true },
  { day: 'الأحد', open: '09:00', close: '17:00', isOpen: true },
  { day: 'الإثنين', open: '09:00', close: '17:00', isOpen: true },
  { day: 'الثلاثاء', open: '09:00', close: '17:00', isOpen: true },
  { day: 'الأربعاء', open: '09:00', close: '17:00', isOpen: true },
  { day: 'الخميس', open: '09:00', close: '14:00', isOpen: true },
  { day: 'الجمعة', open: '00:00', close: '00:00', isOpen: false },
];

// ============= Clinics =============
export const clinics: Clinic[] = [
  {
    id: 'clinic1',
    name: 'مستشفى طرابلس المركزي',
    type: 'hospital',
    description: 'مستشفى متكامل يقدم خدمات طبية شاملة بأحدث التجهيزات الطبية',
    location: {
      lat: 32.8872,
      lng: 13.1913,
      address: 'شارع الجمهورية، وسط المدينة',
      city: 'طرابلس',
      district: 'المنشية'
    },
    phone: '+218 21 123 4567',
    email: 'info@tripoli-central.ly',
    workingHours: standardWorkingHours,
    services: ['طوارئ 24 ساعة', 'عمليات جراحية', 'أشعة', 'مختبر', 'صيدلية'],
    specialties: ['طب القلب', 'طب الأطفال', 'جراحة عامة', 'طب العيون', 'طب النساء'],
    insurances: insuranceCompanies,
    images: ['/hospital1.jpg', '/hospital2.jpg'],
    rating: 4.5,
    reviewCount: 234,
    doctorCount: 45,
    isVerified: true,
    isOpen: true,
    fees: [
      { type: 'platform', amount: 5, currency: 'د.ل', description: 'رسوم الخدمة' }
    ]
  },
  {
    id: 'clinic2',
    name: 'عيادة الشفاء التخصصية',
    type: 'clinic',
    description: 'عيادة تخصصية متميزة في طب الباطنية والقلب',
    location: {
      lat: 32.8952,
      lng: 13.1823,
      address: 'شارع النصر، حي الأندلس',
      city: 'طرابلس',
      district: 'الأندلس'
    },
    phone: '+218 21 987 6543',
    email: 'info@alshifa-clinic.ly',
    workingHours: standardWorkingHours,
    services: ['استشارات طبية', 'تخطيط القلب', 'فحص إيكو', 'تحاليل'],
    specialties: ['طب القلب', 'طب الباطنية'],
    insurances: [insuranceCompanies[0], insuranceCompanies[1]],
    images: ['/clinic1.jpg'],
    rating: 4.8,
    reviewCount: 156,
    doctorCount: 8,
    isVerified: true,
    isOpen: true,
    fees: [
      { type: 'platform', amount: 3, currency: 'د.ل', description: 'رسوم الخدمة' }
    ]
  },
  {
    id: 'clinic3',
    name: 'مركز النور للعيون',
    type: 'medical_center',
    description: 'مركز متخصص في طب وجراحة العيون بأحدث التقنيات',
    location: {
      lat: 32.8782,
      lng: 13.2013,
      address: 'شارع زاوية الدهماني',
      city: 'طرابلس',
      district: 'زاوية الدهماني'
    },
    phone: '+218 21 555 1234',
    workingHours: standardWorkingHours,
    services: ['فحص نظر', 'جراحة الليزك', 'علاج المياه البيضاء', 'علاج الشبكية'],
    specialties: ['طب العيون'],
    insurances: insuranceCompanies,
    images: ['/eye-center.jpg'],
    rating: 4.7,
    reviewCount: 203,
    doctorCount: 5,
    isVerified: true,
    isOpen: true,
    fees: [
      { type: 'platform', amount: 5, currency: 'د.ل', description: 'رسوم الخدمة' }
    ]
  }
];

// ============= Doctors =============
export const doctors: Doctor[] = [
  {
    id: 'doc1',
    name: 'د. أحمد محمد العزابي',
    title: 'استشاري أمراض القلب',
    specialty: 'طب القلب',
    subspecialties: ['قسطرة القلب', 'أمراض الشرايين'],
    clinicId: 'clinic1',
    clinicName: 'مستشفى طرابلس المركزي',
    qualifications: [
      'بكالوريوس الطب والجراحة - جامعة طرابلس',
      'ماجستير أمراض القلب - جامعة القاهرة',
    ],
    certifications: ['زمالة بريطانية MRCP', 'البورد العربي لأمراض القلب'],
    yearsExperience: 15,
    languages: ['العربية', 'الإنجليزية'],
    insurances: insuranceCompanies,
    bio: 'طبيب قلب متخصص مع خبرة تزيد عن 15 عاماً في تشخيص وعلاج أمراض القلب والأوعية الدموية.',
    rating: 4.9,
    reviewCount: 156,
    patientCount: 2500,
    fees: { consultation: 50, video: 40, urgent: 100, homeVisit: 150 },
    availability: [],
    services: ['تخطيط القلب', 'فحص إيكو', 'اختبار الجهد', 'قسطرة القلب'],
    acceptsVideo: true,
    acceptsHomeVisit: true,
    gender: 'male',
    isVerified: true,
    isAvailable: true
  },
  {
    id: 'doc2',
    name: 'د. فاطمة علي الشريف',
    title: 'أخصائية طب الأطفال',
    specialty: 'طب الأطفال',
    subspecialties: ['حديثي الولادة', 'أمراض الجهاز التنفسي للأطفال'],
    clinicId: 'clinic2',
    clinicName: 'عيادة الشفاء التخصصية',
    qualifications: ['بكالوريوس الطب - جامعة بنغازي', 'دبلوم طب الأطفال - جامعة طرابلس'],
    certifications: ['عضو الجمعية الليبية لطب الأطفال'],
    yearsExperience: 8,
    languages: ['العربية', 'الإنجليزية', 'الفرنسية'],
    insurances: [insuranceCompanies[0], insuranceCompanies[1]],
    bio: 'طبيبة أطفال متخصصة في رعاية الأطفال وحديثي الولادة.',
    rating: 4.8,
    reviewCount: 98,
    patientCount: 1200,
    fees: { consultation: 40, video: 30, urgent: 80, homeVisit: 120 },
    availability: [],
    services: ['فحص عام', 'تطعيمات', 'متابعة النمو', 'علاج أمراض الأطفال'],
    acceptsVideo: true,
    acceptsHomeVisit: true,
    gender: 'female',
    isVerified: true,
    isAvailable: true
  },
  {
    id: 'doc3',
    name: 'د. محمود سالم الفيتوري',
    title: 'استشاري طب العيون',
    specialty: 'طب العيون',
    subspecialties: ['جراحة الليزك', 'جراحة الشبكية'],
    clinicId: 'clinic3',
    clinicName: 'مركز النور للعيون',
    qualifications: ['بكالوريوس الطب - جامعة طرابلس', 'ماجستير طب العيون - جامعة عين شمس'],
    certifications: ['زمالة أوروبية في جراحة العيون FEBO'],
    yearsExperience: 12,
    languages: ['العربية', 'الإنجليزية'],
    insurances: insuranceCompanies,
    bio: 'استشاري طب وجراحة العيون متخصص في عمليات تصحيح النظر بالليزك.',
    rating: 4.7,
    reviewCount: 203,
    patientCount: 1800,
    fees: { consultation: 60, video: 45, urgent: 120, homeVisit: 200 },
    availability: [],
    services: ['فحص نظر شامل', 'جراحة الليزك', 'علاج الجلوكوما', 'جراحة المياه البيضاء'],
    acceptsVideo: true,
    acceptsHomeVisit: false,
    gender: 'male',
    isVerified: true,
    isAvailable: true
  },
  {
    id: 'doc4',
    name: 'د. سارة أحمد المصراتي',
    title: 'أخصائية الأمراض الجلدية',
    specialty: 'طب الجلدية',
    clinicId: 'clinic1',
    clinicName: 'مستشفى طرابلس المركزي',
    qualifications: ['بكالوريوس الطب - جامعة طرابلس', 'ماجستير الأمراض الجلدية'],
    certifications: [],
    yearsExperience: 6,
    languages: ['العربية', 'الإنجليزية'],
    insurances: [insuranceCompanies[0]],
    bio: 'أخصائية جلدية متميزة في علاج مشاكل البشرة والشعر.',
    rating: 4.6,
    reviewCount: 87,
    patientCount: 950,
    fees: { consultation: 45, video: 35, urgent: 90, homeVisit: 130 },
    availability: [],
    services: ['علاج حب الشباب', 'علاج الصدفية', 'إزالة الشامات', 'العناية بالبشرة'],
    acceptsVideo: true,
    acceptsHomeVisit: true,
    gender: 'female',
    isVerified: true,
    isAvailable: true
  },
  {
    id: 'doc5',
    name: 'د. خالد عبدالله الزناتي',
    title: 'استشاري جراحة العظام',
    specialty: 'طب العظام',
    clinicId: 'clinic1',
    clinicName: 'مستشفى طرابلس المركزي',
    qualifications: ['بكالوريوس الطب - جامعة طرابلس', 'زمالة جراحة العظام - ألمانيا'],
    certifications: ['البورد العربي لجراحة العظام'],
    yearsExperience: 18,
    languages: ['العربية', 'الإنجليزية', 'الألمانية'],
    insurances: insuranceCompanies,
    bio: 'استشاري جراحة العظام والمفاصل مع خبرة واسعة في جراحات الركبة والورك.',
    rating: 4.9,
    reviewCount: 312,
    patientCount: 3200,
    fees: { consultation: 70, video: 50, urgent: 150, homeVisit: 250 },
    availability: [],
    services: ['تقييم الإصابات', 'جراحة المفاصل', 'علاج الكسور', 'العلاج الطبيعي'],
    acceptsVideo: true,
    acceptsHomeVisit: false,
    gender: 'male',
    isVerified: true,
    isAvailable: true
  },
  {
    id: 'doc6',
    name: 'د. نورة محمد البكوش',
    title: 'استشارية أمراض النساء والتوليد',
    specialty: 'طب النساء',
    clinicId: 'clinic2',
    clinicName: 'عيادة الشفاء التخصصية',
    qualifications: ['بكالوريوس الطب - جامعة بنغازي', 'ماجستير أمراض النساء - مصر'],
    certifications: ['عضو الجمعية الليبية لأمراض النساء'],
    yearsExperience: 14,
    languages: ['العربية', 'الإنجليزية'],
    insurances: insuranceCompanies,
    bio: 'استشارية متخصصة في أمراض النساء والتوليد وعلاج العقم.',
    rating: 4.8,
    reviewCount: 245,
    patientCount: 2100,
    fees: { consultation: 55, video: 40, urgent: 110, homeVisit: 180 },
    availability: [],
    services: ['متابعة الحمل', 'علاج العقم', 'فحوصات ما قبل الزواج', 'أمراض النساء'],
    acceptsVideo: true,
    acceptsHomeVisit: true,
    gender: 'female',
    isVerified: true,
    isAvailable: true
  },
  {
    id: 'doc7',
    name: 'د. عمر سعيد الغرياني',
    title: 'استشاري مخ وأعصاب',
    specialty: 'طب الأعصاب',
    clinicId: 'clinic1',
    clinicName: 'مستشفى طرابلس المركزي',
    qualifications: ['بكالوريوس الطب - جامعة طرابلس', 'دكتوراه طب الأعصاب - المملكة المتحدة'],
    certifications: ['زمالة بريطانية في طب الأعصاب'],
    yearsExperience: 20,
    languages: ['العربية', 'الإنجليزية'],
    insurances: insuranceCompanies,
    bio: 'استشاري مخ وأعصاب مع خبرة عالمية في علاج أمراض الجهاز العصبي.',
    rating: 4.9,
    reviewCount: 178,
    patientCount: 1500,
    fees: { consultation: 80, video: 60, urgent: 160, homeVisit: 300 },
    availability: [],
    services: ['تشخيص أمراض الأعصاب', 'علاج الصداع المزمن', 'علاج الصرع', 'تخطيط المخ'],
    acceptsVideo: true,
    acceptsHomeVisit: true,
    gender: 'male',
    isVerified: true,
    isAvailable: true
  },
  {
    id: 'doc8',
    name: 'د. ليلى عبدالرحمن الطرابلسي',
    title: 'أخصائية الطب النفسي',
    specialty: 'الطب النفسي',
    clinicId: 'clinic2',
    clinicName: 'عيادة الشفاء التخصصية',
    qualifications: ['بكالوريوس الطب - جامعة طرابلس', 'ماجستير الطب النفسي'],
    certifications: ['عضو الجمعية العربية للطب النفسي'],
    yearsExperience: 10,
    languages: ['العربية', 'الإنجليزية', 'الفرنسية'],
    insurances: [insuranceCompanies[0], insuranceCompanies[1]],
    bio: 'أخصائية طب نفسي متخصصة في علاج القلق والاكتئاب والاضطرابات النفسية.',
    rating: 4.7,
    reviewCount: 134,
    patientCount: 800,
    fees: { consultation: 60, video: 50, urgent: 120, homeVisit: 200 },
    availability: [],
    services: ['علاج القلق والاكتئاب', 'العلاج السلوكي', 'الاستشارات النفسية', 'علاج الإدمان'],
    acceptsVideo: true,
    acceptsHomeVisit: false,
    gender: 'female',
    isVerified: true,
    isAvailable: true
  },
  {
    id: 'doc9',
    name: 'د. محمد علي السنوسي',
    title: 'استشاري طب الباطنية',
    specialty: 'طب الباطنية',
    clinicId: 'clinic1',
    clinicName: 'مستشفى طرابلس المركزي',
    qualifications: ['بكالوريوس الطب - جامعة طرابلس', 'ماجستير طب الباطنية'],
    certifications: ['البورد العربي لطب الباطنية'],
    yearsExperience: 16,
    languages: ['العربية', 'الإنجليزية'],
    insurances: insuranceCompanies,
    bio: 'استشاري طب باطني متخصص في أمراض الجهاز الهضمي والسكري.',
    rating: 4.8,
    reviewCount: 267,
    patientCount: 2800,
    fees: { consultation: 50, video: 40, urgent: 100, homeVisit: 150 },
    availability: [],
    services: ['فحص شامل', 'علاج السكري', 'أمراض الجهاز الهضمي', 'ضغط الدم'],
    acceptsVideo: true,
    acceptsHomeVisit: true,
    gender: 'male',
    isVerified: true,
    isAvailable: true
  },
  {
    id: 'doc10',
    name: 'د. أمينة حسن الدرسي',
    title: 'أخصائية طب الأسنان',
    specialty: 'طب الأسنان',
    clinicId: 'clinic2',
    clinicName: 'عيادة الشفاء التخصصية',
    qualifications: ['بكالوريوس طب الأسنان - جامعة طرابلس'],
    certifications: ['عضو نقابة أطباء الأسنان الليبية'],
    yearsExperience: 7,
    languages: ['العربية', 'الإنجليزية'],
    insurances: [insuranceCompanies[0]],
    bio: 'أخصائية طب أسنان متميزة في التجميل والحشوات وعلاج جذور الأسنان.',
    rating: 4.6,
    reviewCount: 156,
    patientCount: 1100,
    fees: { consultation: 30, video: 20, urgent: 60, homeVisit: 0 },
    availability: [],
    services: ['تنظيف الأسنان', 'الحشوات', 'علاج الجذور', 'تبييض الأسنان'],
    acceptsVideo: false,
    acceptsHomeVisit: false,
    gender: 'female',
    isVerified: true,
    isAvailable: true
  },
  {
    id: 'doc11',
    name: 'د. يوسف العريبي',
    title: 'طبيب عام',
    specialty: 'طب عام',
    clinicId: 'clinic1',
    clinicName: 'مستشفى طرابلس المركزي',
    qualifications: ['بكالوريوس الطب - جامعة طرابلس'],
    certifications: [],
    yearsExperience: 5,
    languages: ['العربية', 'الإنجليزية'],
    insurances: insuranceCompanies,
    bio: 'طبيب عام يقدم خدمات الرعاية الصحية الأولية والفحوصات الشاملة.',
    rating: 4.5,
    reviewCount: 89,
    patientCount: 650,
    fees: { consultation: 25, video: 20, urgent: 50, homeVisit: 80 },
    availability: [],
    services: ['فحص عام', 'علاج الأمراض الشائعة', 'تحويلات طبية', 'شهادات صحية'],
    acceptsVideo: true,
    acceptsHomeVisit: true,
    gender: 'male',
    isVerified: true,
    isAvailable: true
  },
  {
    id: 'doc12',
    name: 'د. هند الزروق',
    title: 'طبيب زائر - استشارية تجميل',
    specialty: 'طب الجلدية',
    clinicId: 'clinic1',
    clinicName: 'مستشفى طرابلس المركزي',
    qualifications: ['بكالوريوس الطب - جامعة تونس', 'زمالة التجميل - فرنسا'],
    certifications: ['البورد الأوروبي للتجميل'],
    yearsExperience: 12,
    languages: ['العربية', 'الفرنسية', 'الإنجليزية'],
    insurances: [],
    bio: 'استشارية تجميل زائرة من تونس، متخصصة في إجراءات التجميل غير الجراحية.',
    rating: 4.9,
    reviewCount: 67,
    patientCount: 400,
    fees: { consultation: 150, video: 100, urgent: 250, homeVisit: 0 },
    availability: [],
    services: ['حقن البوتوكس', 'الفيلر', 'تجديد البشرة', 'علاج التجاعيد'],
    acceptsVideo: true,
    acceptsHomeVisit: false,
    gender: 'female',
    isVerified: true,
    isAvailable: true
  }
];

// ============= Labs =============
export const labs: Lab[] = [
  {
    id: 'lab1',
    name: 'مختبرات الأمل الطبية',
    location: {
      lat: 32.8862,
      lng: 13.1903,
      address: 'شارع الفتح، طرابلس',
      city: 'طرابلس'
    },
    phone: '+218 91 111 2222',
    workingHours: standardWorkingHours,
    services: [],
    insurances: insuranceCompanies,
    images: ['/lab1.jpg'],
    rating: 4.7,
    reviewCount: 312,
    offersHomeCollection: true,
    homeCollectionFee: 20,
    isOpen: true
  },
  {
    id: 'lab2',
    name: 'مختبر الصحة المتكاملة',
    location: {
      lat: 32.8932,
      lng: 13.1853,
      address: 'شارع النصر، حي الأندلس',
      city: 'طرابلس'
    },
    phone: '+218 91 222 3333',
    workingHours: standardWorkingHours,
    services: [],
    insurances: [insuranceCompanies[0], insuranceCompanies[1]],
    images: ['/lab2.jpg'],
    rating: 4.5,
    reviewCount: 198,
    offersHomeCollection: true,
    homeCollectionFee: 25,
    isOpen: true
  }
];

// ============= Lab Tests =============
export const labTests: LabTest[] = [
  {
    id: 'test1',
    name: 'تحليل دم شامل (CBC)',
    nameEn: 'Complete Blood Count',
    category: 'تحاليل الدم',
    description: 'فحص شامل لمكونات الدم',
    preparationInstructions: 'لا يتطلب صيام',
    resultTime: '4 ساعات',
    price: 25,
    insuranceCoverage: 80,
    homeCollectionAvailable: true
  },
  {
    id: 'test2',
    name: 'سكر صائم',
    nameEn: 'Fasting Blood Sugar',
    category: 'تحاليل السكر',
    description: 'قياس مستوى السكر في الدم',
    preparationInstructions: 'صيام 8-12 ساعة قبل التحليل',
    resultTime: '2 ساعات',
    price: 15,
    insuranceCoverage: 80,
    homeCollectionAvailable: true
  },
  {
    id: 'test3',
    name: 'وظائف الكلى',
    nameEn: 'Kidney Function Test',
    category: 'تحاليل الكلى',
    description: 'فحص وظائف الكلى شامل',
    preparationInstructions: 'لا يتطلب صيام',
    resultTime: '6 ساعات',
    price: 45,
    insuranceCoverage: 70,
    homeCollectionAvailable: true
  },
  {
    id: 'test4',
    name: 'وظائف الكبد',
    nameEn: 'Liver Function Test',
    category: 'تحاليل الكبد',
    description: 'فحص شامل لوظائف الكبد',
    resultTime: '6 ساعات',
    price: 50,
    insuranceCoverage: 70,
    homeCollectionAvailable: true
  },
  {
    id: 'test5',
    name: 'تحليل الغدة الدرقية TSH',
    nameEn: 'Thyroid Stimulating Hormone',
    category: 'تحاليل الهرمونات',
    description: 'فحص هرمون الغدة الدرقية',
    resultTime: '24 ساعة',
    price: 60,
    insuranceCoverage: 60,
    homeCollectionAvailable: true
  }
];

// ============= Pharmacies =============
export const pharmacies: Pharmacy[] = [
  {
    id: 'pharm1',
    name: 'صيدلية الشفاء',
    location: {
      lat: 32.8872,
      lng: 13.1923,
      address: 'شارع الجمهورية',
      city: 'طرابلس'
    },
    phone: '+218 91 444 5555',
    workingHours: [
      ...standardWorkingHours.slice(0, 5),
      { day: 'الخميس', open: '09:00', close: '22:00', isOpen: true },
      { day: 'الجمعة', open: '10:00', close: '14:00', isOpen: true },
    ],
    rating: 4.8,
    reviewCount: 456,
    isOpen: true,
    offersDelivery: true,
    deliveryFee: 10,
    deliveryTime: '30-45 دقيقة',
    insurances: insuranceCompanies
  },
  {
    id: 'pharm2',
    name: 'صيدلية الأمل',
    location: {
      lat: 32.8912,
      lng: 13.1843,
      address: 'شارع النصر، حي الأندلس',
      city: 'طرابلس'
    },
    phone: '+218 91 555 6666',
    workingHours: standardWorkingHours,
    rating: 4.5,
    reviewCount: 234,
    isOpen: true,
    offersDelivery: true,
    deliveryFee: 15,
    deliveryTime: '45-60 دقيقة',
    insurances: [insuranceCompanies[0], insuranceCompanies[1]]
  },
  {
    id: 'pharm3',
    name: 'صيدلية النور',
    location: {
      lat: 32.8792,
      lng: 13.2003,
      address: 'شارع زاوية الدهماني',
      city: 'طرابلس'
    },
    phone: '+218 91 666 7777',
    workingHours: standardWorkingHours,
    rating: 4.7,
    reviewCount: 189,
    isOpen: false,
    offersDelivery: true,
    deliveryFee: 12,
    deliveryTime: '40-50 دقيقة',
    insurances: insuranceCompanies
  }
];

// ============= Medications =============
export const medications: Medication[] = [
  {
    id: 'med1',
    name: 'باراسيتامول 500mg',
    nameEn: 'Paracetamol',
    genericName: 'Acetaminophen',
    manufacturer: 'شركة الدواء الليبية',
    dosage: '500mg',
    form: 'tablet',
    price: 15,
    inStock: true,
    requiresPrescription: false,
    alternatives: ['med2'],
    sideEffects: ['غثيان خفيف في حالات نادرة']
  },
  {
    id: 'med2',
    name: 'إيبوبروفين 400mg',
    nameEn: 'Ibuprofen',
    manufacturer: 'فارما ليبيا',
    dosage: '400mg',
    form: 'tablet',
    price: 20,
    inStock: true,
    requiresPrescription: false,
    sideEffects: ['اضطرابات معوية', 'صداع']
  },
  {
    id: 'med3',
    name: 'أوميبرازول 20mg',
    nameEn: 'Omeprazole',
    manufacturer: 'الشركة العربية للأدوية',
    dosage: '20mg',
    form: 'capsule',
    price: 35,
    inStock: true,
    requiresPrescription: true
  },
  {
    id: 'med4',
    name: 'أموكسيسيلين 500mg',
    nameEn: 'Amoxicillin',
    manufacturer: 'فارما ليبيا',
    dosage: '500mg',
    form: 'capsule',
    price: 25,
    inStock: true,
    requiresPrescription: true,
    sideEffects: ['إسهال', 'طفح جلدي في حالات الحساسية']
  }
];

// ============= Ambulance Services =============
export const ambulanceServices: AmbulanceService[] = [
  {
    id: 'amb1',
    name: 'خدمة الإسعاف الوطنية',
    phone: '1515',
    types: [],
    rating: 4.6,
    reviewCount: 567,
    averageResponseTime: 8,
    isAvailable: true
  }
];

// ============= Ambulance Types =============
export const ambulanceTypes: AmbulanceType[] = [
  {
    id: 'ambtype1',
    name: 'إسعاف عادي',
    description: 'سيارة إسعاف مجهزة للحالات العادية والنقل الطبي',
    baseFee: 50,
    perKmFee: 3,
    equipment: ['إسعافات أولية', 'أكسجين', 'نقالة']
  },
  {
    id: 'ambtype2',
    name: 'إسعاف متقدم',
    description: 'سيارة إسعاف مجهزة بالكامل للحالات الحرجة',
    baseFee: 100,
    perKmFee: 5,
    equipment: ['إسعافات أولية', 'أكسجين', 'جهاز صدمات', 'أجهزة مراقبة', 'أدوية طوارئ']
  },
  {
    id: 'ambtype3',
    name: 'إسعاف العناية المركزة',
    description: 'وحدة عناية مركزة متنقلة للحالات الحرجة جداً',
    baseFee: 200,
    perKmFee: 8,
    equipment: ['جهاز تنفس صناعي', 'أجهزة مراقبة متقدمة', 'طاقم طبي متخصص']
  }
];

// ============= Specialties List (All Required) =============
export const specialties = [
  { id: 1, name: 'عيون', icon: '👁️', nameEn: 'Ophthalmology', fullName: 'طب العيون' },
  { id: 2, name: 'جلدية', icon: '🧴', nameEn: 'Dermatology', fullName: 'طب الجلدية' },
  { id: 3, name: 'قلب', icon: '❤️', nameEn: 'Cardiology', fullName: 'طب القلب' },
  { id: 4, name: 'عظام', icon: '🦴', nameEn: 'Orthopedics', fullName: 'طب العظام' },
  { id: 5, name: 'أطفال', icon: '👶', nameEn: 'Pediatrics', fullName: 'طب الأطفال' },
  { id: 6, name: 'باطنة', icon: '🩺', nameEn: 'Internal Medicine', fullName: 'طب الباطنية' },
  { id: 7, name: 'أسنان', icon: '🦷', nameEn: 'Dentistry', fullName: 'طب الأسنان' },
  { id: 8, name: 'نساء', icon: '👩', nameEn: 'Gynecology', fullName: 'طب النساء' },
  { id: 9, name: 'مخ وأعصاب', icon: '🧠', nameEn: 'Neurology', fullName: 'طب الأعصاب' },
  { id: 10, name: 'نفسية', icon: '🧘', nameEn: 'Psychiatry', fullName: 'الطب النفسي' },
  { id: 11, name: 'طبيب عام', icon: '👨‍⚕️', nameEn: 'General Practice', fullName: 'طب عام' },
];

// Helper to match specialty names
export function matchSpecialty(searchTerm: string, doctorSpecialty: string): boolean {
  const normalizedSearch = searchTerm.toLowerCase();
  const normalizedSpecialty = doctorSpecialty.toLowerCase();
  
  // Direct match
  if (normalizedSpecialty.includes(normalizedSearch)) return true;
  
  // Find matching specialty
  const spec = specialties.find(s => 
    s.name === searchTerm || 
    s.fullName === searchTerm ||
    s.nameEn.toLowerCase() === normalizedSearch
  );
  
  if (spec) {
    return normalizedSpecialty.includes(spec.name) || 
           normalizedSpecialty.includes(spec.fullName || '') ||
           normalizedSpecialty === spec.fullName;
  }
  
  return false;
}

// ============= Helper Functions =============
export function generateTimeSlots(date: Date): { time: string; available: boolean; type: 'regular' | 'urgent' | 'video' }[] {
  const slots = [];
  const hours = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'];
  
  for (const time of hours) {
    slots.push({
      time,
      available: Math.random() > 0.3, // 70% availability
      type: 'regular' as const
    });
  }
  
  return slots;
}

export function getDoctorsByClinic(clinicId: string): Doctor[] {
  return doctors.filter(d => d.clinicId === clinicId);
}

export function getClinicById(clinicId: string): Clinic | undefined {
  return clinics.find(c => c.id === clinicId);
}

export function getDoctorById(doctorId: string): Doctor | undefined {
  return doctors.find(d => d.id === doctorId);
}

export function searchDoctors(filters: {
  query?: string;
  specialty?: string;
  acceptsVideo?: boolean;
  minRating?: number;
}): Doctor[] {
  return doctors.filter(doc => {
    if (filters.query && !doc.name.includes(filters.query) && !doc.specialty.includes(filters.query)) {
      return false;
    }
    if (filters.specialty && doc.specialty !== filters.specialty) {
      return false;
    }
    if (filters.acceptsVideo && !doc.acceptsVideo) {
      return false;
    }
    if (filters.minRating && doc.rating < filters.minRating) {
      return false;
    }
    return true;
  });
}
