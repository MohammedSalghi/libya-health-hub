// Libya Healthcare Data - Pharmacies, Labs, Clinics specific to Libya

export interface LibyanPharmacy {
  id: string;
  name: string;
  nameAr: string;
  city: 'طرابلس' | 'بنغازي' | 'مصراتة' | 'سبها';
  address: string;
  phone: string;
  offersDelivery: boolean;
  deliveryFee: number;
  rating: number;
  isOpen24Hours: boolean;
  hasInsurance: boolean;
}

export interface LibyanLab {
  id: string;
  name: string;
  city: 'طرابلس' | 'بنغازي' | 'مصراتة';
  address: string;
  phone: string;
  offersHomeCollection: boolean;
  homeCollectionFee: number;
  rating: number;
  specialties: string[];
}

export interface LibyanClinic {
  id: string;
  name: string;
  city: 'طرابلس' | 'بنغازي';
  address: string;
  phone: string;
  specialties: string[];
  offersHomeVisit: boolean;
  rating: number;
}

// صيدليات ليبية
export const libyanPharmacies: LibyanPharmacy[] = [
  {
    id: 'pharm-ly-1',
    name: 'Al-Salam Pharmacy',
    nameAr: 'صيدلية السلام',
    city: 'طرابلس',
    address: 'شارع الجمهورية، طرابلس',
    phone: '+218 91 123 4567',
    offersDelivery: true,
    deliveryFee: 10,
    rating: 4.8,
    isOpen24Hours: false,
    hasInsurance: true
  },
  {
    id: 'pharm-ly-2',
    name: 'Al-Massa Pharmacy',
    nameAr: 'صيدلية الماسة',
    city: 'طرابلس',
    address: 'شارع النصر، حي الأندلس، طرابلس',
    phone: '+218 91 234 5678',
    offersDelivery: true,
    deliveryFee: 15,
    rating: 4.6,
    isOpen24Hours: true,
    hasInsurance: true
  },
  {
    id: 'pharm-ly-3',
    name: 'Al-Shifa Pharmacy',
    nameAr: 'صيدلية الشفاء',
    city: 'طرابلس',
    address: 'شارع زاوية الدهماني، طرابلس',
    phone: '+218 91 345 6789',
    offersDelivery: true,
    deliveryFee: 12,
    rating: 4.7,
    isOpen24Hours: false,
    hasInsurance: false
  },
  {
    id: 'pharm-ly-4',
    name: 'Al-Nour Pharmacy',
    nameAr: 'صيدلية النور',
    city: 'بنغازي',
    address: 'شارع جمال عبدالناصر، بنغازي',
    phone: '+218 91 456 7890',
    offersDelivery: true,
    deliveryFee: 10,
    rating: 4.5,
    isOpen24Hours: false,
    hasInsurance: true
  },
  {
    id: 'pharm-ly-5',
    name: 'Touches Pharmacy',
    nameAr: 'صيدلية تاتشز',
    city: 'بنغازي',
    address: 'شارع عمر المختار، بنغازي',
    phone: '+218 91 567 8901',
    offersDelivery: true,
    deliveryFee: 15,
    rating: 4.9,
    isOpen24Hours: true,
    hasInsurance: true
  },
  {
    id: 'pharm-ly-6',
    name: 'Al-Hayat Pharmacy',
    nameAr: 'صيدلية الحياة',
    city: 'مصراتة',
    address: 'شارع الزاوية، مصراتة',
    phone: '+218 91 678 9012',
    offersDelivery: true,
    deliveryFee: 8,
    rating: 4.4,
    isOpen24Hours: false,
    hasInsurance: false
  }
];

// مختبرات ليبية
export const libyanLabs: LibyanLab[] = [
  {
    id: 'lab-ly-1',
    name: 'مختبرات الهدى',
    city: 'طرابلس',
    address: 'شارع الفتح، طرابلس',
    phone: '+218 91 111 2222',
    offersHomeCollection: true,
    homeCollectionFee: 20,
    rating: 4.7,
    specialties: ['تحاليل الدم', 'تحاليل الهرمونات', 'تحاليل الجينات']
  },
  {
    id: 'lab-ly-2',
    name: 'مختبر الأمل الطبي',
    city: 'طرابلس',
    address: 'شارع النصر، طرابلس',
    phone: '+218 91 222 3333',
    offersHomeCollection: true,
    homeCollectionFee: 25,
    rating: 4.8,
    specialties: ['تحاليل الدم', 'تحاليل البول', 'تحاليل الكبد والكلى']
  },
  {
    id: 'lab-ly-3',
    name: 'مختبرات بنغازي المركزية',
    city: 'بنغازي',
    address: 'شارع جمال عبدالناصر، بنغازي',
    phone: '+218 91 333 4444',
    offersHomeCollection: true,
    homeCollectionFee: 15,
    rating: 4.6,
    specialties: ['تحاليل شاملة', 'أشعة', 'تحاليل الحمل']
  },
  {
    id: 'lab-ly-4',
    name: 'مختبر الصحة الذهبية',
    city: 'بنغازي',
    address: 'شارع عمر المختار، بنغازي',
    phone: '+218 91 444 5555',
    offersHomeCollection: true,
    homeCollectionFee: 20,
    rating: 4.5,
    specialties: ['تحاليل الدم', 'تحاليل السكر', 'تحاليل الغدة الدرقية']
  },
  {
    id: 'lab-ly-5',
    name: 'مختبر لمسة شفاء',
    city: 'بنغازي',
    address: 'حي السلماني، بنغازي',
    phone: '+218 91 555 6666',
    offersHomeCollection: true,
    homeCollectionFee: 18,
    rating: 4.4,
    specialties: ['تحاليل الأطفال', 'تحاليل الحمل', 'تحاليل الدم']
  }
];

// عيادات ليبية تقدم زيارات منزلية
export const libyanClinics: LibyanClinic[] = [
  {
    id: 'clinic-ly-1',
    name: 'مستشفى طرابلس الجامعي',
    city: 'طرابلس',
    address: 'شارع الجمهورية، طرابلس',
    phone: '+218 21 123 4567',
    specialties: ['طب عام', 'طب الأطفال', 'طب القلب', 'طب الباطنية'],
    offersHomeVisit: true,
    rating: 4.5
  },
  {
    id: 'clinic-ly-2',
    name: 'مصحة السلام الدائم',
    city: 'طرابلس',
    address: 'شارع النصر، طرابلس',
    phone: '+218 21 234 5678',
    specialties: ['طب عام', 'طب النساء', 'طب الأطفال'],
    offersHomeVisit: true,
    rating: 4.6
  },
  {
    id: 'clinic-ly-3',
    name: 'Medilink International',
    city: 'طرابلس',
    address: 'حي الأندلس، طرابلس',
    phone: '+218 21 345 6789',
    specialties: ['طب عام', 'طب الباطنية', 'طب الجلدية'],
    offersHomeVisit: true,
    rating: 4.8
  },
  {
    id: 'clinic-ly-4',
    name: 'مستشفى بنغازي الطبي',
    city: 'بنغازي',
    address: 'شارع جمال عبدالناصر، بنغازي',
    phone: '+218 61 123 4567',
    specialties: ['طب عام', 'طب الأطفال', 'طب العظام'],
    offersHomeVisit: true,
    rating: 4.4
  },
  {
    id: 'clinic-ly-5',
    name: 'عيادة طبيبك إلى منزلك',
    city: 'بنغازي',
    address: 'شارع عمر المختار، بنغازي',
    phone: '+218 61 234 5678',
    specialties: ['طب عام', 'طب الأسرة', 'طب المسنين'],
    offersHomeVisit: true,
    rating: 4.7
  },
  {
    id: 'clinic-ly-6',
    name: 'عيادة تاتشز',
    city: 'بنغازي',
    address: 'حي السلماني، بنغازي',
    phone: '+218 61 345 6789',
    specialties: ['طب عام', 'طب الأطفال', 'طب النساء'],
    offersHomeVisit: true,
    rating: 4.6
  }
];

// أدوية شائعة في ليبيا
export interface LibyanMedication {
  id: string;
  name: string;
  genericName: string;
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'drops' | 'inhaler';
  dosages: string[];
  category: string;
  requiresPrescription: boolean;
  commonInteractions: string[];
  sideEffects: string[];
  averagePrice: number;
}

export const libyanMedications: LibyanMedication[] = [
  {
    id: 'med-ly-1',
    name: 'أملوديبين',
    genericName: 'Amlodipine',
    form: 'tablet',
    dosages: ['2.5mg', '5mg', '10mg'],
    category: 'أدوية الضغط',
    requiresPrescription: true,
    commonInteractions: ['سيمفاستاتين', 'سيكلوسبورين'],
    sideEffects: ['تورم القدمين', 'دوخة', 'صداع'],
    averagePrice: 25
  },
  {
    id: 'med-ly-2',
    name: 'ميتفورمين',
    genericName: 'Metformin',
    form: 'tablet',
    dosages: ['500mg', '850mg', '1000mg'],
    category: 'أدوية السكري',
    requiresPrescription: true,
    commonInteractions: ['الكحول', 'أدوية الكلى'],
    sideEffects: ['غثيان', 'إسهال', 'آلام المعدة'],
    averagePrice: 30
  },
  {
    id: 'med-ly-3',
    name: 'أوميبرازول',
    genericName: 'Omeprazole',
    form: 'capsule',
    dosages: ['20mg', '40mg'],
    category: 'أدوية المعدة',
    requiresPrescription: false,
    commonInteractions: ['كلوبيدوجريل', 'ميثوتريكسات'],
    sideEffects: ['صداع', 'غثيان', 'إمساك'],
    averagePrice: 20
  },
  {
    id: 'med-ly-4',
    name: 'أتورفاستاتين',
    genericName: 'Atorvastatin',
    form: 'tablet',
    dosages: ['10mg', '20mg', '40mg', '80mg'],
    category: 'أدوية الكوليسترول',
    requiresPrescription: true,
    commonInteractions: ['إريثروميسين', 'جيمفيبروزيل'],
    sideEffects: ['آلام العضلات', 'صداع', 'غثيان'],
    averagePrice: 35
  },
  {
    id: 'med-ly-5',
    name: 'باراسيتامول',
    genericName: 'Paracetamol',
    form: 'tablet',
    dosages: ['500mg', '1000mg'],
    category: 'مسكنات',
    requiresPrescription: false,
    commonInteractions: ['الكحول', 'وارفارين'],
    sideEffects: ['نادرة عند الجرعات الصحيحة'],
    averagePrice: 5
  },
  {
    id: 'med-ly-6',
    name: 'أموكسيسيلين',
    genericName: 'Amoxicillin',
    form: 'capsule',
    dosages: ['250mg', '500mg'],
    category: 'مضادات حيوية',
    requiresPrescription: true,
    commonInteractions: ['ميثوتريكسات', 'وارفارين'],
    sideEffects: ['إسهال', 'طفح جلدي', 'غثيان'],
    averagePrice: 15
  }
];

// فحص التفاعلات الدوائية
export const checkDrugInteractions = (
  medications: string[],
  allergies: string[]
): { hasInteraction: boolean; warnings: string[] } => {
  const warnings: string[] = [];
  
  // فحص التفاعلات بين الأدوية
  medications.forEach((med1, i) => {
    medications.forEach((med2, j) => {
      if (i < j) {
        const medication = libyanMedications.find(m => m.name === med1);
        if (medication?.commonInteractions.some(int => med2.includes(int))) {
          warnings.push(`تحذير: قد يوجد تفاعل بين ${med1} و ${med2}`);
        }
      }
    });
  });

  // فحص الحساسية
  medications.forEach(med => {
    const medication = libyanMedications.find(m => m.name === med);
    if (medication) {
      allergies.forEach(allergy => {
        if (med.toLowerCase().includes(allergy.toLowerCase()) ||
            medication.genericName.toLowerCase().includes(allergy.toLowerCase())) {
          warnings.push(`تحذير: قد يسبب ${med} حساسية لديك`);
        }
      });
    }
  });

  return {
    hasInteraction: warnings.length > 0,
    warnings
  };
};

// حساب موعد انتهاء الدواء
export const calculateMedicationEndDate = (
  startDate: string,
  quantity: number,
  dosesPerDay: number
): string => {
  const start = new Date(startDate);
  const daysSupply = Math.floor(quantity / dosesPerDay);
  start.setDate(start.getDate() + daysSupply);
  return start.toISOString().split('T')[0];
};

// تقرير الالتزام بالأدوية
export interface ComplianceReport {
  totalDoses: number;
  takenDoses: number;
  skippedDoses: number;
  complianceRate: number;
  streak: number;
}

export const calculateComplianceReport = (
  logs: { status: 'taken' | 'skipped' | 'pending' | 'snoozed' }[]
): ComplianceReport => {
  const completedLogs = logs.filter(l => l.status !== 'pending');
  const takenDoses = logs.filter(l => l.status === 'taken').length;
  const skippedDoses = logs.filter(l => l.status === 'skipped').length;
  
  // حساب سلسلة الالتزام المتتالية
  let streak = 0;
  for (let i = logs.length - 1; i >= 0; i--) {
    if (logs[i].status === 'taken') {
      streak++;
    } else if (logs[i].status === 'skipped') {
      break;
    }
  }

  return {
    totalDoses: completedLogs.length,
    takenDoses,
    skippedDoses,
    complianceRate: completedLogs.length > 0 ? (takenDoses / completedLogs.length) * 100 : 100,
    streak
  };
};
