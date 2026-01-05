// Medical AI Data - Lab Results, Health Tips, and AI Responses
import { LabTest, HealthRisk, HealthAlert, LifestyleRecommendation, LAB_REFERENCE_RANGES } from '@/types/medicalAI';

// ============= Sample Lab Results =============
export const sampleLabResults: LabTest[] = [
  {
    id: 'lab-1',
    name: 'hemoglobin',
    nameAr: 'الهيموجلوبين',
    value: 14.2,
    unit: 'g/dL',
    referenceRange: { min: 13.5, max: 17.5 },
    category: 'blood_count',
    date: '2024-01-15',
    status: 'normal',
    trend: 'stable',
    previousValues: [
      { value: 14.0, date: '2023-10-15' },
      { value: 13.8, date: '2023-07-15' }
    ]
  },
  {
    id: 'lab-2',
    name: 'glucose_fasting',
    nameAr: 'السكر الصائم',
    value: 118,
    unit: 'mg/dL',
    referenceRange: { min: 70, max: 100 },
    category: 'diabetes',
    date: '2024-01-15',
    status: 'high',
    trend: 'stable',
    previousValues: [
      { value: 115, date: '2023-10-15' },
      { value: 108, date: '2023-07-15' }
    ]
  },
  {
    id: 'lab-3',
    name: 'hba1c',
    nameAr: 'السكر التراكمي',
    value: 6.2,
    unit: '%',
    referenceRange: { min: 4.0, max: 5.6 },
    category: 'diabetes',
    date: '2024-01-15',
    status: 'high',
    trend: 'stable',
    previousValues: [
      { value: 6.1, date: '2023-10-15' },
      { value: 5.9, date: '2023-07-15' }
    ]
  },
  {
    id: 'lab-4',
    name: 'cholesterol_total',
    nameAr: 'الكوليسترول الكلي',
    value: 185,
    unit: 'mg/dL',
    referenceRange: { min: 0, max: 200 },
    category: 'lipid_profile',
    date: '2024-01-15',
    status: 'normal',
    trend: 'improving',
    previousValues: [
      { value: 210, date: '2023-10-15' },
      { value: 225, date: '2023-07-15' }
    ]
  },
  {
    id: 'lab-5',
    name: 'ldl',
    nameAr: 'الكوليسترول الضار',
    value: 125,
    unit: 'mg/dL',
    referenceRange: { min: 0, max: 100 },
    category: 'lipid_profile',
    date: '2024-01-15',
    status: 'high',
    trend: 'improving',
    previousValues: [
      { value: 140, date: '2023-10-15' },
      { value: 155, date: '2023-07-15' }
    ]
  },
  {
    id: 'lab-6',
    name: 'vitamin_d',
    nameAr: 'فيتامين د',
    value: 22,
    unit: 'ng/mL',
    referenceRange: { min: 30, max: 100 },
    category: 'vitamins',
    date: '2024-01-15',
    status: 'low',
    trend: 'stable',
    previousValues: [
      { value: 20, date: '2023-10-15' },
      { value: 18, date: '2023-07-15' }
    ]
  },
  {
    id: 'lab-7',
    name: 'creatinine',
    nameAr: 'الكرياتينين',
    value: 1.0,
    unit: 'mg/dL',
    referenceRange: { min: 0.7, max: 1.3 },
    category: 'kidney_function',
    date: '2024-01-15',
    status: 'normal',
    trend: 'stable'
  },
  {
    id: 'lab-8',
    name: 'tsh',
    nameAr: 'هرمون الغدة الدرقية',
    value: 2.5,
    unit: 'mIU/L',
    referenceRange: { min: 0.4, max: 4.0 },
    category: 'thyroid',
    date: '2024-01-15',
    status: 'normal',
    trend: 'stable'
  }
];

// ============= Health Risks =============
export const calculateHealthRisks = (labResults: LabTest[], chronicConditions: string[]): HealthRisk[] => {
  const risks: HealthRisk[] = [];

  // Check diabetes risk
  const glucoseTest = labResults.find(l => l.name === 'glucose_fasting');
  const hba1cTest = labResults.find(l => l.name === 'hba1c');
  
  if (glucoseTest?.status === 'high' || hba1cTest?.status === 'high') {
    const isPrediabetic = (glucoseTest?.value || 0) >= 100 && (glucoseTest?.value || 0) < 126;
    const isDiabetic = chronicConditions.includes('السكري') || (glucoseTest?.value || 0) >= 126;
    
    risks.push({
      id: 'risk-diabetes',
      category: 'السكري',
      level: isDiabetic ? 'high' : isPrediabetic ? 'medium' : 'low',
      title: isDiabetic ? 'متابعة السكري' : 'خطر مرحلة ما قبل السكري',
      description: isDiabetic 
        ? 'مستوى السكر يحتاج متابعة مستمرة مع الطبيب'
        : 'مستوى السكر أعلى من الطبيعي، يُنصح بتعديل نمط الحياة',
      factors: ['مستوى السكر الصائم مرتفع', 'السكر التراكمي أعلى من الطبيعي'],
      recommendations: [
        'تقليل الكربوهيدرات والسكريات',
        'ممارسة الرياضة 30 دقيقة يومياً',
        'متابعة السكر بانتظام',
        'مراجعة طبيب الغدد الصماء'
      ],
      requiresUrgentAttention: isDiabetic,
      relatedTests: ['glucose_fasting', 'hba1c'],
      lastAssessed: new Date().toISOString()
    });
  }

  // Check lipid risk
  const ldlTest = labResults.find(l => l.name === 'ldl');
  const cholesterolTest = labResults.find(l => l.name === 'cholesterol_total');
  
  if (ldlTest?.status === 'high' || cholesterolTest?.status === 'high') {
    risks.push({
      id: 'risk-lipid',
      category: 'الدهون',
      level: (ldlTest?.value || 0) > 160 ? 'high' : 'medium',
      title: 'ارتفاع الكوليسترول',
      description: 'مستوى الدهون يحتاج اهتماماً لتقليل خطر أمراض القلب',
      factors: ['ارتفاع الكوليسترول الضار LDL'],
      recommendations: [
        'تقليل الدهون المشبعة في الطعام',
        'زيادة الألياف والخضروات',
        'ممارسة الرياضة بانتظام',
        'مراجعة طبيب القلب إذا استمر الارتفاع'
      ],
      requiresUrgentAttention: false,
      relatedTests: ['ldl', 'cholesterol_total', 'hdl', 'triglycerides'],
      lastAssessed: new Date().toISOString()
    });
  }

  // Check vitamin D deficiency
  const vitDTest = labResults.find(l => l.name === 'vitamin_d');
  if (vitDTest?.status === 'low') {
    risks.push({
      id: 'risk-vitd',
      category: 'نقص الفيتامينات',
      level: (vitDTest?.value || 0) < 20 ? 'medium' : 'low',
      title: 'نقص فيتامين د',
      description: 'مستوى فيتامين د منخفض، شائع في المنطقة ويحتاج علاجاً',
      factors: ['قلة التعرض لأشعة الشمس', 'نقص في النظام الغذائي'],
      recommendations: [
        'التعرض للشمس 15-20 دقيقة يومياً',
        'تناول مكملات فيتامين د (بإشراف الطبيب)',
        'تناول الأطعمة الغنية بفيتامين د'
      ],
      requiresUrgentAttention: false,
      relatedTests: ['vitamin_d'],
      lastAssessed: new Date().toISOString()
    });
  }

  return risks;
};

// ============= Health Alerts =============
export const generateHealthAlerts = (
  labResults: LabTest[], 
  medications: { name: string; remainingQuantity: number; refillThreshold: number }[],
  appointments: { date: string; doctorName: string }[]
): HealthAlert[] => {
  const alerts: HealthAlert[] = [];
  
  // Critical lab results
  labResults.forEach(lab => {
    if (lab.status === 'critical_high' || lab.status === 'critical_low') {
      alerts.push({
        id: `alert-lab-${lab.id}`,
        type: 'critical',
        title: `⚠️ قيمة حرجة: ${lab.nameAr}`,
        message: `نتيجة ${lab.nameAr} (${lab.value} ${lab.unit}) خارج النطاق الآمن. يُرجى مراجعة الطبيب فوراً.`,
        category: 'lab_result',
        actionRequired: 'مراجعة طبية عاجلة',
        dismissible: false,
        createdAt: new Date().toISOString(),
        linkedEntityId: lab.id,
        linkedEntityType: 'lab_result'
      });
    } else if (lab.status === 'high' || lab.status === 'low') {
      alerts.push({
        id: `alert-lab-${lab.id}`,
        type: 'warning',
        title: `تنبيه: ${lab.nameAr}`,
        message: `نتيجة ${lab.nameAr} (${lab.value} ${lab.unit}) ${lab.status === 'high' ? 'أعلى' : 'أقل'} من الطبيعي. يُنصح بمتابعة مع الطبيب.`,
        category: 'lab_result',
        dismissible: true,
        createdAt: new Date().toISOString(),
        linkedEntityId: lab.id,
        linkedEntityType: 'lab_result'
      });
    }
  });

  // Low medication stock
  medications.forEach(med => {
    if (med.remainingQuantity <= med.refillThreshold) {
      alerts.push({
        id: `alert-med-${med.name}`,
        type: med.remainingQuantity <= 3 ? 'urgent' : 'warning',
        title: `📦 ${med.name} - كمية منخفضة`,
        message: `متبقي ${med.remainingQuantity} جرعات فقط. يُنصح بإعادة التعبئة قريباً.`,
        category: 'medication',
        actionRequired: 'إعادة تعبئة الدواء',
        dismissible: true,
        createdAt: new Date().toISOString()
      });
    }
  });

  return alerts;
};

// ============= Lifestyle Recommendations =============
export const generateLifestyleRecommendations = (
  labResults: LabTest[],
  chronicConditions: string[]
): LifestyleRecommendation[] => {
  const recommendations: LifestyleRecommendation[] = [];

  // Diabetes-related recommendations
  const hasHighSugar = labResults.some(l => 
    (l.name === 'glucose_fasting' || l.name === 'hba1c') && 
    (l.status === 'high' || l.status === 'critical_high')
  );
  
  if (hasHighSugar || chronicConditions.includes('السكري')) {
    recommendations.push({
      id: 'rec-diabetes-nutrition',
      category: 'nutrition',
      title: 'نظام غذائي لتنظيم السكر',
      description: 'تعديلات غذائية تساعد في التحكم بمستوى السكر في الدم',
      basedOn: ['نتائج السكر', 'السكر التراكمي'],
      priority: 'high',
      tips: [
        'تناول وجبات صغيرة متكررة بدلاً من وجبات كبيرة',
        'اختر الكربوهيدرات المعقدة (الحبوب الكاملة، البقوليات)',
        'تجنب السكريات البسيطة والحلويات',
        'أضف البروتين لكل وجبة لتبطئ امتصاص السكر',
        'تناول الخضروات الورقية بكثرة'
      ],
      caution: 'استشر طبيبك قبل إجراء تغييرات كبيرة في نظامك الغذائي'
    });

    recommendations.push({
      id: 'rec-diabetes-exercise',
      category: 'exercise',
      title: 'الرياضة ومستوى السكر',
      description: 'النشاط البدني يساعد في تحسين حساسية الجسم للأنسولين',
      basedOn: ['نتائج السكر'],
      priority: 'high',
      tips: [
        'المشي 30 دقيقة يومياً يحسن مستوى السكر',
        'ابدأ تدريجياً وزد المدة بالتدريج',
        'افحص السكر قبل وبعد التمرين',
        'احمل معك سكريات سريعة الامتصاص احتياطياً'
      ],
      caution: 'تجنب التمرين الشديد إذا كان السكر مرتفعاً جداً (>250 mg/dL)'
    });
  }

  // Vitamin D recommendations
  const hasLowVitD = labResults.some(l => l.name === 'vitamin_d' && l.status === 'low');
  if (hasLowVitD) {
    recommendations.push({
      id: 'rec-vitd',
      category: 'nutrition',
      title: 'تحسين مستوى فيتامين د',
      description: 'فيتامين د ضروري لصحة العظام والمناعة',
      basedOn: ['نتيجة فيتامين د'],
      priority: 'medium',
      tips: [
        'التعرض للشمس 15-20 دقيقة يومياً (قبل 10 صباحاً أو بعد 3 عصراً)',
        'تناول الأسماك الدهنية (سلمون، تونة، سردين)',
        'البيض والحليب المدعم مصادر جيدة',
        'المكملات الغذائية بإشراف الطبيب'
      ]
    });
  }

  // Cholesterol recommendations
  const hasHighLipids = labResults.some(l => 
    (l.name === 'ldl' || l.name === 'cholesterol_total') && l.status === 'high'
  );
  if (hasHighLipids) {
    recommendations.push({
      id: 'rec-lipids',
      category: 'nutrition',
      title: 'نظام غذائي صحي للقلب',
      description: 'تعديلات غذائية لتحسين مستوى الدهون',
      basedOn: ['نتائج الدهون'],
      priority: 'high',
      tips: [
        'قلل الدهون المشبعة (اللحوم الدهنية، الزبدة)',
        'استخدم زيت الزيتون بدلاً من الزيوت الأخرى',
        'تناول الأسماك مرتين أسبوعياً على الأقل',
        'أكثر من الألياف (الشوفان، البقوليات)',
        'تناول المكسرات النيئة باعتدال'
      ]
    });
  }

  // General wellness
  recommendations.push({
    id: 'rec-sleep',
    category: 'sleep',
    title: 'النوم الصحي',
    description: 'النوم الجيد أساس الصحة العامة',
    basedOn: ['صحة عامة'],
    priority: 'medium',
    tips: [
      'نم 7-8 ساعات يومياً',
      'حافظ على موعد نوم ثابت',
      'تجنب الشاشات قبل النوم بساعة',
      'اجعل غرفة النوم مظلمة وهادئة'
    ]
  });

  return recommendations;
};

// ============= AI Response Templates =============
export const AI_RESPONSE_TEMPLATES = {
  greeting: `أهلاً بك! أنا مساعدك الصحي الذكي. 
أستطيع مساعدتك في:
• فهم نتائج تحاليلك
• متابعة حالتك الصحية
• تذكيرك بأدويتك
• تقديم نصائح صحية مخصصة

كيف يمكنني مساعدتك اليوم؟`,

  labAnalysisIntro: `سأقوم بتحليل نتائج تحاليلك الأخيرة وشرحها لك بطريقة مبسطة.

⚕️ تذكير مهم: هذا التحليل للتوعية فقط ولا يُغني عن رأي الطبيب المختص.`,

  symptomCheckerIntro: `سأساعدك في فهم أعراضك وتوجيهك للتخصص المناسب.

⚠️ ملاحظة: هذا لا يُعد تشخيصًا طبيًا. إذا كانت أعراضك شديدة، يُرجى مراجعة الطبيب فوراً.

أخبرني عن الأعراض التي تشعر بها:`,

  medicationReminder: `تذكير بموعد الدواء 💊

هذا الدواء موصوف من طبيبك. إذا كان لديك أي استفسار عن الجرعة أو التوقيت، يُرجى استشارة طبيبك أو الصيدلي.`,

  chronicMonitoring: `سأساعدك في متابعة حالتك المزمنة.

📊 المتابعة المنتظمة مع طبيبك أساسية. هذه المعلومات مساعدة وليست بديلاً عن الزيارات الدورية.`,

  emergencyAdvice: `⚠️ أعراضك تستدعي اهتماماً فورياً!

يُرجى:
1. الاتصال بالطوارئ فوراً
2. أو التوجه لأقرب مستشفى
3. لا تتأخر في طلب المساعدة

هل تريدني أن أساعدك في طلب سيارة إسعاف؟`,

  positiveReinforcement: `ممتاز! 🌟 نتائجك تُظهر تحسناً واضحاً.

استمر في:
• الالتزام بنظامك الغذائي
• ممارسة الرياضة
• تناول أدويتك بانتظام

طبيبك سيكون سعيداً بهذا التقدم!`,

  calmingMessage: `أفهم أن رؤية نتائج غير طبيعية قد تُسبب قلقاً. دعني أُطمئنك:

• كثير من القيم غير الطبيعية يمكن تحسينها بتعديلات بسيطة
• طبيبك سيساعدك في وضع خطة علاجية مناسبة
• أنت تتخذ خطوة إيجابية بمتابعة صحتك

هل لديك أسئلة محددة تريد أن أُجيب عنها؟`
};

// ============= Symptom to Specialty Mapping =============
export const analyzeSymptoms = (symptoms: string[]): {
  specialty: string;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
  urgency: 'routine' | 'soon' | 'urgent' | 'emergency';
}[] => {
  const SPECIALTY_SYMPTOMS: Record<string, { symptoms: string[]; urgency: 'routine' | 'soon' | 'urgent' | 'emergency' }> = {
    'طب الباطنية': { symptoms: ['تعب', 'حمى', 'فقدان الوزن', 'ألم البطن', 'غثيان'], urgency: 'routine' },
    'طب القلب': { symptoms: ['ألم الصدر', 'ضيق التنفس', 'خفقان', 'تورم القدمين'], urgency: 'urgent' },
    'طب الأعصاب': { symptoms: ['صداع', 'تنميل', 'دوخة', 'ضعف العضلات'], urgency: 'soon' },
    'طب العظام': { symptoms: ['ألم المفاصل', 'ألم الظهر', 'تورم المفاصل'], urgency: 'routine' },
    'طب الجهاز الهضمي': { symptoms: ['حرقة المعدة', 'انتفاخ', 'إمساك', 'إسهال'], urgency: 'routine' },
    'طب الغدد الصماء': { symptoms: ['عطش شديد', 'تبول متكرر', 'تعب مزمن'], urgency: 'soon' },
  };

  const results: {
    specialty: string;
    confidence: 'high' | 'medium' | 'low';
    reason: string;
    urgency: 'routine' | 'soon' | 'urgent' | 'emergency';
  }[] = [];

  Object.entries(SPECIALTY_SYMPTOMS).forEach(([specialty, data]) => {
    const matchingSymptoms = symptoms.filter(s => 
      data.symptoms.some(ds => s.includes(ds) || ds.includes(s))
    );

    if (matchingSymptoms.length > 0) {
      const confidence = matchingSymptoms.length >= 2 ? 'high' : matchingSymptoms.length === 1 ? 'medium' : 'low';
      results.push({
        specialty,
        confidence,
        reason: `بناءً على: ${matchingSymptoms.join('، ')}`,
        urgency: data.urgency
      });
    }
  });

  return results.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.confidence] - order[b.confidence];
  });
};
