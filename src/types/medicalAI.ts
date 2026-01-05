// Medical AI Assistant Types - Professional Medical-Grade

// ============= Lab Results Analysis =============
export interface LabTest {
  id: string;
  name: string;
  nameAr: string;
  value: number;
  unit: string;
  referenceRange: {
    min: number;
    max: number;
    ageAdjusted?: boolean;
    genderSpecific?: boolean;
  };
  category: LabCategory;
  date: string;
  status: 'normal' | 'low' | 'high' | 'critical_low' | 'critical_high';
  trend?: 'improving' | 'stable' | 'worsening';
  previousValues?: { value: number; date: string }[];
}

export type LabCategory = 
  | 'blood_count'      // تعداد الدم
  | 'liver_function'   // وظائف الكبد
  | 'kidney_function'  // وظائف الكلى
  | 'lipid_profile'    // الدهون
  | 'diabetes'         // السكري
  | 'thyroid'          // الغدة الدرقية
  | 'vitamins'         // الفيتامينات
  | 'hormones'         // الهرمونات
  | 'electrolytes'     // الأملاح
  | 'cardiac'          // القلب
  | 'inflammatory';    // الالتهابات

// ============= Risk Classification =============
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface HealthRisk {
  id: string;
  category: string;
  level: RiskLevel;
  title: string;
  description: string;
  factors: string[];
  recommendations: string[];
  requiresUrgentAttention: boolean;
  relatedTests?: string[];
  lastAssessed: string;
}

// ============= Smart Alerts =============
export type AlertType = 'informational' | 'warning' | 'urgent' | 'critical';

export interface HealthAlert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  category: 'lab_result' | 'medication' | 'appointment' | 'chronic' | 'lifestyle';
  actionRequired?: string;
  dismissible: boolean;
  createdAt: string;
  readAt?: string;
  linkedEntityId?: string;
  linkedEntityType?: string;
}

// ============= Health Summary =============
export interface HealthSummary {
  id: string;
  patientId: string;
  period: 'weekly' | 'monthly' | 'quarterly';
  startDate: string;
  endDate: string;
  
  // Overall Status
  overallStatus: 'excellent' | 'good' | 'needs_attention' | 'concerning';
  
  // Key Metrics
  metrics: {
    labTestsCount: number;
    normalResults: number;
    abnormalResults: number;
    medicationAdherence: number;
    appointmentsAttended: number;
    appointmentsMissed: number;
  };
  
  // Highlights
  positiveHighlights: string[];
  areasOfConcern: string[];
  
  // Recommendations
  recommendations: string[];
  
  // Chronic Condition Updates
  chronicUpdates: {
    conditionName: string;
    status: 'improved' | 'stable' | 'worsened';
    notes: string;
  }[];
  
  createdAt: string;
}

// ============= AI Conversation =============
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  
  // Enhanced message types
  messageType?: 'text' | 'lab_analysis' | 'risk_assessment' | 'medication_info' | 'health_tip' | 'summary' | 'reminder';
  
  // Attached data
  attachedData?: {
    type: 'lab_result' | 'risk' | 'medication' | 'appointment' | 'chronic';
    data: any;
  };
  
  // Quick actions
  suggestedActions?: {
    label: string;
    action: string;
    type: 'book_appointment' | 'view_results' | 'set_reminder' | 'learn_more';
  }[];
  
  // Medical disclaimer flag
  hasDisclaimer?: boolean;
}

export interface AIConversation {
  id: string;
  patientId: string;
  startedAt: string;
  lastMessageAt: string;
  messages: AIMessage[];
  context: AIConversationContext;
}

export interface AIConversationContext {
  currentTopic?: string;
  mentionedSymptoms?: string[];
  mentionedMedications?: string[];
  referencedLabTests?: string[];
  patientConcerns?: string[];
  sessionGoal?: string;
}

// ============= Symptom Checker =============
export interface SymptomEntry {
  symptom: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  frequency: 'constant' | 'intermittent' | 'occasional';
  associatedFactors?: string[];
}

export interface SymptomAssessment {
  id: string;
  symptoms: SymptomEntry[];
  possibleSpecialties: {
    specialty: string;
    relevance: 'high' | 'medium' | 'low';
    reason: string;
  }[];
  urgencyLevel: 'routine' | 'soon' | 'urgent' | 'emergency';
  generalAdvice: string[];
  redFlags: string[];
  disclaimer: string;
  createdAt: string;
}

// ============= Lifestyle Recommendations =============
export interface LifestyleRecommendation {
  id: string;
  category: 'nutrition' | 'exercise' | 'sleep' | 'stress' | 'habits';
  title: string;
  description: string;
  basedOn: string[]; // What health data this is based on
  priority: 'high' | 'medium' | 'low';
  tips: string[];
  caution?: string;
}

// ============= Reference Ranges =============
export const LAB_REFERENCE_RANGES: Record<string, {
  nameAr: string;
  unit: string;
  male: { min: number; max: number };
  female: { min: number; max: number };
  criticalLow?: number;
  criticalHigh?: number;
  category: LabCategory;
}> = {
  hemoglobin: {
    nameAr: 'الهيموجلوبين',
    unit: 'g/dL',
    male: { min: 13.5, max: 17.5 },
    female: { min: 12.0, max: 16.0 },
    criticalLow: 7.0,
    criticalHigh: 20.0,
    category: 'blood_count'
  },
  wbc: {
    nameAr: 'كريات الدم البيضاء',
    unit: '×10³/µL',
    male: { min: 4.5, max: 11.0 },
    female: { min: 4.5, max: 11.0 },
    criticalLow: 2.0,
    criticalHigh: 30.0,
    category: 'blood_count'
  },
  platelets: {
    nameAr: 'الصفائح الدموية',
    unit: '×10³/µL',
    male: { min: 150, max: 400 },
    female: { min: 150, max: 400 },
    criticalLow: 50,
    criticalHigh: 1000,
    category: 'blood_count'
  },
  glucose_fasting: {
    nameAr: 'السكر الصائم',
    unit: 'mg/dL',
    male: { min: 70, max: 100 },
    female: { min: 70, max: 100 },
    criticalLow: 40,
    criticalHigh: 400,
    category: 'diabetes'
  },
  hba1c: {
    nameAr: 'السكر التراكمي',
    unit: '%',
    male: { min: 4.0, max: 5.6 },
    female: { min: 4.0, max: 5.6 },
    criticalHigh: 14.0,
    category: 'diabetes'
  },
  cholesterol_total: {
    nameAr: 'الكوليسترول الكلي',
    unit: 'mg/dL',
    male: { min: 0, max: 200 },
    female: { min: 0, max: 200 },
    criticalHigh: 300,
    category: 'lipid_profile'
  },
  ldl: {
    nameAr: 'الكوليسترول الضار',
    unit: 'mg/dL',
    male: { min: 0, max: 100 },
    female: { min: 0, max: 100 },
    criticalHigh: 190,
    category: 'lipid_profile'
  },
  hdl: {
    nameAr: 'الكوليسترول النافع',
    unit: 'mg/dL',
    male: { min: 40, max: 60 },
    female: { min: 50, max: 60 },
    criticalLow: 20,
    category: 'lipid_profile'
  },
  triglycerides: {
    nameAr: 'الدهون الثلاثية',
    unit: 'mg/dL',
    male: { min: 0, max: 150 },
    female: { min: 0, max: 150 },
    criticalHigh: 500,
    category: 'lipid_profile'
  },
  creatinine: {
    nameAr: 'الكرياتينين',
    unit: 'mg/dL',
    male: { min: 0.7, max: 1.3 },
    female: { min: 0.6, max: 1.1 },
    criticalHigh: 10.0,
    category: 'kidney_function'
  },
  bun: {
    nameAr: 'يوريا الدم',
    unit: 'mg/dL',
    male: { min: 7, max: 20 },
    female: { min: 7, max: 20 },
    criticalHigh: 100,
    category: 'kidney_function'
  },
  alt: {
    nameAr: 'إنزيم الكبد ALT',
    unit: 'U/L',
    male: { min: 7, max: 56 },
    female: { min: 7, max: 45 },
    criticalHigh: 1000,
    category: 'liver_function'
  },
  ast: {
    nameAr: 'إنزيم الكبد AST',
    unit: 'U/L',
    male: { min: 10, max: 40 },
    female: { min: 9, max: 32 },
    criticalHigh: 1000,
    category: 'liver_function'
  },
  tsh: {
    nameAr: 'هرمون الغدة الدرقية',
    unit: 'mIU/L',
    male: { min: 0.4, max: 4.0 },
    female: { min: 0.4, max: 4.0 },
    criticalLow: 0.01,
    criticalHigh: 20.0,
    category: 'thyroid'
  },
  vitamin_d: {
    nameAr: 'فيتامين د',
    unit: 'ng/mL',
    male: { min: 30, max: 100 },
    female: { min: 30, max: 100 },
    criticalLow: 10,
    category: 'vitamins'
  },
  vitamin_b12: {
    nameAr: 'فيتامين ب12',
    unit: 'pg/mL',
    male: { min: 200, max: 900 },
    female: { min: 200, max: 900 },
    criticalLow: 100,
    category: 'vitamins'
  },
  iron: {
    nameAr: 'الحديد',
    unit: 'µg/dL',
    male: { min: 65, max: 175 },
    female: { min: 50, max: 170 },
    criticalLow: 30,
    category: 'blood_count'
  },
  sodium: {
    nameAr: 'الصوديوم',
    unit: 'mEq/L',
    male: { min: 136, max: 145 },
    female: { min: 136, max: 145 },
    criticalLow: 120,
    criticalHigh: 160,
    category: 'electrolytes'
  },
  potassium: {
    nameAr: 'البوتاسيوم',
    unit: 'mEq/L',
    male: { min: 3.5, max: 5.0 },
    female: { min: 3.5, max: 5.0 },
    criticalLow: 2.5,
    criticalHigh: 6.5,
    category: 'electrolytes'
  },
  crp: {
    nameAr: 'بروتين الالتهاب',
    unit: 'mg/L',
    male: { min: 0, max: 3 },
    female: { min: 0, max: 3 },
    criticalHigh: 100,
    category: 'inflammatory'
  }
};

// ============= Medical Disclaimers =============
export const MEDICAL_DISCLAIMERS = {
  general: 'هذه المعلومات للتوعية الصحية فقط ولا تُغني عن استشارة الطبيب المختص. يُرجى مراجعة طبيبك لأي قرار طبي.',
  labResult: 'تفسير نتائج التحاليل هو للتوعية فقط. النتائج النهائية يجب أن يُقيّمها الطبيب المختص.',
  symptom: 'تقييم الأعراض لا يُعد تشخيصًا طبيًا. إذا كانت أعراضك شديدة أو مستمرة، يُرجى مراجعة الطبيب فورًا.',
  medication: 'لا تُغيّر جرعات الأدوية أو تتوقف عنها دون استشارة طبيبك أو الصيدلي.',
  emergency: '⚠️ في حالات الطوارئ، اتصل بالإسعاف فورًا أو توجه لأقرب مستشفى.',
  chronicDisease: 'متابعة الأمراض المزمنة تتطلب زيارات دورية للطبيب. هذه المعلومات مساعدة وليست بديلاً عن الرعاية الطبية.',
};

// ============= Specialty Recommendations =============
export const SPECIALTY_SYMPTOMS_MAP: Record<string, string[]> = {
  'طب الباطنية': ['تعب عام', 'حمى', 'فقدان الوزن', 'ألم البطن', 'غثيان', 'قيء'],
  'طب القلب': ['ألم الصدر', 'ضيق التنفس', 'خفقان', 'تورم القدمين', 'دوخة'],
  'طب الأعصاب': ['صداع شديد', 'تنميل', 'ضعف العضلات', 'اضطراب التوازن', 'فقدان الذاكرة'],
  'طب العظام': ['ألم المفاصل', 'تورم المفاصل', 'ألم الظهر', 'صعوبة الحركة'],
  'طب الجهاز الهضمي': ['حرقة المعدة', 'انتفاخ', 'إمساك', 'إسهال', 'ألم البطن'],
  'طب الغدد الصماء': ['عطش شديد', 'تبول متكرر', 'تغير الوزن', 'تعب مزمن'],
  'طب الكلى': ['تورم الوجه والقدمين', 'تغير لون البول', 'ألم الخاصرة'],
  'طب الصدرية': ['سعال مزمن', 'ضيق التنفس', 'صفير الصدر'],
  'طب الجلدية': ['طفح جلدي', 'حكة', 'تغير لون الجلد', 'تساقط الشعر'],
  'طب العيون': ['ضعف النظر', 'ألم العين', 'احمرار العين', 'رؤية ضبابية'],
  'طب النفسية': ['قلق', 'اكتئاب', 'اضطراب النوم', 'تغير المزاج'],
};

// ============= Red Flag Symptoms =============
export const RED_FLAG_SYMPTOMS = [
  { symptom: 'ألم شديد في الصدر', action: 'طوارئ فورية' },
  { symptom: 'صعوبة شديدة في التنفس', action: 'طوارئ فورية' },
  { symptom: 'فقدان الوعي', action: 'طوارئ فورية' },
  { symptom: 'نزيف حاد', action: 'طوارئ فورية' },
  { symptom: 'شلل مفاجئ', action: 'طوارئ فورية' },
  { symptom: 'صداع شديد مفاجئ', action: 'طوارئ فورية' },
  { symptom: 'حمى شديدة مع طفح', action: 'مراجعة عاجلة' },
  { symptom: 'ألم بطن شديد', action: 'مراجعة عاجلة' },
  { symptom: 'تقيؤ دم', action: 'طوارئ فورية' },
  { symptom: 'براز أسود', action: 'مراجعة عاجلة' },
];
