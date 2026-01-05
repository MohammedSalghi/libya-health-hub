// Medical AI Store - Manages AI conversation state and medical data
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  AIMessage, 
  AIConversation, 
  HealthAlert, 
  HealthRisk, 
  HealthSummary,
  LifestyleRecommendation,
  SymptomAssessment,
  LabTest,
  MEDICAL_DISCLAIMERS
} from '@/types/medicalAI';
import { 
  sampleLabResults, 
  calculateHealthRisks, 
  generateHealthAlerts,
  generateLifestyleRecommendations,
  AI_RESPONSE_TEMPLATES,
  analyzeSymptoms
} from '@/data/medicalAIData';

interface MedicalAIState {
  // Conversation
  currentConversation: AIConversation | null;
  conversationHistory: AIConversation[];
  isProcessing: boolean;
  
  // Health Data
  labResults: LabTest[];
  healthRisks: HealthRisk[];
  healthAlerts: HealthAlert[];
  healthSummaries: HealthSummary[];
  lifestyleRecommendations: LifestyleRecommendation[];
  
  // Session
  hasUserConsented: boolean;
  lastInteractionTime: string | null;
  
  // Actions
  startNewConversation: () => void;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  processUserMessage: (message: string) => Promise<AIMessage>;
  
  // Health Data Actions
  refreshHealthData: (chronicConditions: string[], medications: { name: string; remainingQuantity: number; refillThreshold: number }[]) => void;
  dismissAlert: (alertId: string) => void;
  markAlertRead: (alertId: string) => void;
  
  // Consent
  setUserConsent: (consented: boolean) => void;
  
  // Analysis
  analyzeLabResults: () => string;
  assessSymptoms: (symptoms: string[]) => SymptomAssessment;
  getHealthTips: () => LifestyleRecommendation[];
}

export const useMedicalAIStore = create<MedicalAIState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentConversation: null,
      conversationHistory: [],
      isProcessing: false,
      labResults: sampleLabResults,
      healthRisks: [],
      healthAlerts: [],
      healthSummaries: [],
      lifestyleRecommendations: [],
      hasUserConsented: false,
      lastInteractionTime: null,

      // Start new conversation
      startNewConversation: () => {
        const newConversation: AIConversation = {
          id: `conv-${Date.now()}`,
          patientId: 'user1',
          startedAt: new Date().toISOString(),
          lastMessageAt: new Date().toISOString(),
          messages: [
            {
              id: `msg-${Date.now()}`,
              role: 'assistant',
              content: AI_RESPONSE_TEMPLATES.greeting,
              timestamp: new Date().toISOString(),
              messageType: 'text',
              hasDisclaimer: true
            }
          ],
          context: {}
        };

        set({ currentConversation: newConversation });
      },

      // Add message to conversation
      addMessage: (content: string, role: 'user' | 'assistant') => {
        const state = get();
        if (!state.currentConversation) {
          get().startNewConversation();
        }

        const newMessage: AIMessage = {
          id: `msg-${Date.now()}`,
          role,
          content,
          timestamp: new Date().toISOString(),
          messageType: 'text'
        };

        set((state) => ({
          currentConversation: state.currentConversation ? {
            ...state.currentConversation,
            messages: [...state.currentConversation.messages, newMessage],
            lastMessageAt: new Date().toISOString()
          } : null,
          lastInteractionTime: new Date().toISOString()
        }));
      },

      // Process user message and generate AI response
      processUserMessage: async (message: string): Promise<AIMessage> => {
        set({ isProcessing: true });
        
        const state = get();
        const lowercaseMsg = message.toLowerCase();
        
        // Add user message
        get().addMessage(message, 'user');

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        let responseContent = '';
        let messageType: AIMessage['messageType'] = 'text';
        let suggestedActions: AIMessage['suggestedActions'] = [];
        let hasDisclaimer = false;

        // Analyze intent and generate response
        if (lowercaseMsg.includes('تحاليل') || lowercaseMsg.includes('نتائج') || lowercaseMsg.includes('فحص')) {
          responseContent = get().analyzeLabResults();
          messageType = 'lab_analysis';
          hasDisclaimer = true;
          suggestedActions = [
            { label: 'عرض كل التحاليل', action: 'view_all_labs', type: 'view_results' },
            { label: 'حجز موعد', action: 'book_appointment', type: 'book_appointment' }
          ];
        } 
        else if (lowercaseMsg.includes('أعراض') || lowercaseMsg.includes('أشعر') || lowercaseMsg.includes('ألم')) {
          const symptoms = extractSymptoms(message);
          const assessment = get().assessSymptoms(symptoms);
          responseContent = formatSymptomAssessment(assessment);
          messageType = 'risk_assessment';
          hasDisclaimer = true;
          suggestedActions = [
            { label: 'حجز موعد طبيب', action: 'book_doctor', type: 'book_appointment' }
          ];
        }
        else if (lowercaseMsg.includes('دواء') || lowercaseMsg.includes('أدوية') || lowercaseMsg.includes('تذكير')) {
          responseContent = `${AI_RESPONSE_TEMPLATES.medicationReminder}\n\nأستطيع مساعدتك في:\n• عرض أدويتك الحالية\n• تفعيل التذكيرات\n• طلب إعادة التعبئة\n\nماذا تحتاج؟`;
          messageType = 'medication_info';
          suggestedActions = [
            { label: 'عرض أدويتي', action: 'view_medications', type: 'view_results' },
            { label: 'تفعيل تذكير', action: 'set_reminder', type: 'set_reminder' }
          ];
        }
        else if (lowercaseMsg.includes('نصائح') || lowercaseMsg.includes('تغذية') || lowercaseMsg.includes('رياضة') || lowercaseMsg.includes('نمط حياة')) {
          const tips = get().getHealthTips();
          responseContent = formatHealthTips(tips);
          messageType = 'health_tip';
        }
        else if (lowercaseMsg.includes('مزمن') || lowercaseMsg.includes('سكري') || lowercaseMsg.includes('ضغط')) {
          responseContent = `${AI_RESPONSE_TEMPLATES.chronicMonitoring}\n\n📋 حالاتك المزمنة المسجلة:\n• ضغط الدم - مستقرة ومُدارة\n• السكري النوع الثاني - يحتاج متابعة\n\nهل تريد:\n• ملخص تطور الحالة؟\n• نصائح مخصصة؟\n• تذكير بموعد الفحص القادم؟`;
          messageType = 'summary';
          hasDisclaimer = true;
        }
        else if (lowercaseMsg.includes('طوارئ') || lowercaseMsg.includes('ألم شديد') || lowercaseMsg.includes('لا أستطيع التنفس')) {
          responseContent = AI_RESPONSE_TEMPLATES.emergencyAdvice;
          messageType = 'risk_assessment';
          suggestedActions = [
            { label: 'اتصال بالإسعاف', action: 'call_ambulance', type: 'book_appointment' }
          ];
        }
        else if (lowercaseMsg.includes('شكر') || lowercaseMsg.includes('ممتاز')) {
          responseContent = 'سعيد بمساعدتك! 😊 صحتك أمانة. لا تتردد في السؤال عن أي شيء آخر.';
        }
        else {
          responseContent = `أفهم. دعني أساعدك.\n\nيمكنني مساعدتك في:\n📊 تحليل نتائج التحاليل\n🩺 فهم الأعراض وتوجيهك للتخصص المناسب\n💊 تذكيرات الأدوية\n🥗 نصائح صحية مخصصة\n📈 متابعة الأمراض المزمنة\n\nاختر موضوعاً أو اسألني مباشرة.`;
        }

        // Add disclaimer to response if needed
        if (hasDisclaimer) {
          responseContent += `\n\n📋 ${MEDICAL_DISCLAIMERS.general}`;
        }

        const aiResponse: AIMessage = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: responseContent,
          timestamp: new Date().toISOString(),
          messageType,
          suggestedActions,
          hasDisclaimer
        };

        set((state) => ({
          currentConversation: state.currentConversation ? {
            ...state.currentConversation,
            messages: [...state.currentConversation.messages, aiResponse],
            lastMessageAt: new Date().toISOString()
          } : null,
          isProcessing: false
        }));

        return aiResponse;
      },

      // Refresh health data
      refreshHealthData: (chronicConditions, medications) => {
        const labResults = get().labResults;
        const risks = calculateHealthRisks(labResults, chronicConditions);
        const alerts = generateHealthAlerts(labResults, medications, []);
        const recommendations = generateLifestyleRecommendations(labResults, chronicConditions);

        set({
          healthRisks: risks,
          healthAlerts: alerts,
          lifestyleRecommendations: recommendations
        });
      },

      // Dismiss alert
      dismissAlert: (alertId: string) => {
        set((state) => ({
          healthAlerts: state.healthAlerts.filter(a => a.id !== alertId)
        }));
      },

      // Mark alert as read
      markAlertRead: (alertId: string) => {
        set((state) => ({
          healthAlerts: state.healthAlerts.map(a => 
            a.id === alertId ? { ...a, readAt: new Date().toISOString() } : a
          )
        }));
      },

      // Set user consent
      setUserConsent: (consented: boolean) => {
        set({ hasUserConsented: consented });
      },

      // Analyze lab results
      analyzeLabResults: (): string => {
        const labResults = get().labResults;
        
        const abnormalResults = labResults.filter(l => l.status !== 'normal');
        const normalResults = labResults.filter(l => l.status === 'normal');
        const improvingResults = labResults.filter(l => l.trend === 'improving');

        let analysis = `${AI_RESPONSE_TEMPLATES.labAnalysisIntro}\n\n`;

        if (improvingResults.length > 0) {
          analysis += `✅ **أخبار جيدة!**\n`;
          improvingResults.forEach(r => {
            analysis += `• ${r.nameAr}: تحسن ملحوظ مقارنة بالفحص السابق\n`;
          });
          analysis += '\n';
        }

        if (normalResults.length > 0) {
          analysis += `🟢 **نتائج طبيعية (${normalResults.length} فحوصات):**\n`;
          normalResults.slice(0, 3).forEach(r => {
            analysis += `• ${r.nameAr}: ${r.value} ${r.unit} ✓\n`;
          });
          if (normalResults.length > 3) {
            analysis += `• و ${normalResults.length - 3} فحوصات أخرى طبيعية\n`;
          }
          analysis += '\n';
        }

        if (abnormalResults.length > 0) {
          analysis += `🟡 **تحتاج متابعة (${abnormalResults.length} فحوصات):**\n\n`;
          abnormalResults.forEach(r => {
            const direction = r.status === 'high' || r.status === 'critical_high' ? '↑ أعلى' : '↓ أقل';
            analysis += `📍 **${r.nameAr}**: ${r.value} ${r.unit}\n`;
            analysis += `   ${direction} من الطبيعي (${r.referenceRange.min}-${r.referenceRange.max})\n`;
            
            // Add simple explanation
            if (r.name === 'glucose_fasting') {
              analysis += `   💡 يُشير إلى احتمالية ما قبل السكري. يُنصح بتقليل السكريات ومراجعة طبيب الغدد.\n`;
            } else if (r.name === 'ldl') {
              analysis += `   💡 الكوليسترول الضار مرتفع. تقليل الدهون المشبعة وممارسة الرياضة يساعدان.\n`;
            } else if (r.name === 'vitamin_d') {
              analysis += `   💡 نقص فيتامين د شائع. التعرض للشمس والمكملات (بإشراف طبي) يساعدان.\n`;
            }
            analysis += '\n';
          });
        }

        return analysis;
      },

      // Assess symptoms
      assessSymptoms: (symptoms: string[]): SymptomAssessment => {
        const specialtyResults = analyzeSymptoms(symptoms);
        
        // Check for red flags
        const redFlags: string[] = [];
        const dangerousSymptoms = ['ألم شديد في الصدر', 'صعوبة التنفس', 'فقدان الوعي'];
        symptoms.forEach(s => {
          if (dangerousSymptoms.some(d => s.includes(d))) {
            redFlags.push(`⚠️ ${s} - يستدعي مراجعة طبية فورية`);
          }
        });

        const urgencyLevel = redFlags.length > 0 ? 'urgent' : 
                            specialtyResults.some(r => r.urgency === 'urgent') ? 'soon' : 'routine';

        return {
          id: `symptom-${Date.now()}`,
          symptoms: symptoms.map(s => ({
            symptom: s,
            severity: 'moderate',
            duration: 'غير محدد',
            frequency: 'intermittent'
          })),
          possibleSpecialties: specialtyResults.map(r => ({
            specialty: r.specialty,
            relevance: r.confidence,
            reason: r.reason
          })),
          urgencyLevel,
          generalAdvice: [
            'راقب تطور الأعراض',
            'سجّل أي أعراض جديدة',
            'لا تتردد في زيارة الطبيب'
          ],
          redFlags,
          disclaimer: MEDICAL_DISCLAIMERS.symptom,
          createdAt: new Date().toISOString()
        };
      },

      // Get health tips
      getHealthTips: (): LifestyleRecommendation[] => {
        return get().lifestyleRecommendations;
      }
    }),
    {
      name: 'medical-ai-storage',
      partialize: (state) => ({
        conversationHistory: state.conversationHistory,
        hasUserConsented: state.hasUserConsented,
        labResults: state.labResults
      })
    }
  )
);

// Helper functions
function extractSymptoms(message: string): string[] {
  const commonSymptoms = [
    'صداع', 'دوخة', 'تعب', 'حمى', 'سعال', 'ألم', 'غثيان', 
    'قيء', 'إسهال', 'إمساك', 'خفقان', 'ضيق التنفس', 'تنميل',
    'حكة', 'طفح', 'تورم', 'ألم البطن', 'ألم الصدر', 'ألم الظهر'
  ];
  
  return commonSymptoms.filter(s => message.includes(s));
}

function formatSymptomAssessment(assessment: SymptomAssessment): string {
  let response = `${AI_RESPONSE_TEMPLATES.symptomCheckerIntro}\n\n`;
  
  if (assessment.redFlags.length > 0) {
    response += `🚨 **تنبيهات مهمة:**\n`;
    assessment.redFlags.forEach(rf => {
      response += `${rf}\n`;
    });
    response += '\n';
  }

  if (assessment.possibleSpecialties.length > 0) {
    response += `🏥 **التخصصات المقترحة:**\n`;
    assessment.possibleSpecialties.slice(0, 3).forEach((s, i) => {
      const icon = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
      response += `${icon} ${s.specialty}\n   ${s.reason}\n`;
    });
    response += '\n';
  }

  const urgencyMessages: Record<string, string> = {
    emergency: '🚑 يُنصح بالتوجه للطوارئ فوراً',
    urgent: '⏰ يُنصح بمراجعة الطبيب خلال 24-48 ساعة',
    soon: '📅 يُنصح بحجز موعد خلال الأسبوع القادم',
    routine: '📋 يمكنك حجز موعد في الوقت المناسب لك'
  };

  response += `**مستوى الاستعجال:** ${urgencyMessages[assessment.urgencyLevel]}\n\n`;
  response += `📋 ${assessment.disclaimer}`;

  return response;
}

function formatHealthTips(tips: LifestyleRecommendation[]): string {
  if (tips.length === 0) {
    return `🌟 **نصائح صحية عامة:**

💧 **الماء**: اشرب 8 أكواب يومياً
🚶 **الحركة**: 30 دقيقة مشي يومياً
😴 **النوم**: 7-8 ساعات نوم منتظم
🥗 **التغذية**: أكثر من الخضروات والفواكه

${MEDICAL_DISCLAIMERS.general}`;
  }

  let response = `🌟 **نصائح صحية مخصصة لك:**\n\n`;
  
  tips.slice(0, 3).forEach(tip => {
    const priorityIcon = tip.priority === 'high' ? '🔴' : tip.priority === 'medium' ? '🟡' : '🟢';
    response += `${priorityIcon} **${tip.title}**\n`;
    response += `${tip.description}\n\n`;
    response += `نصائح:\n`;
    tip.tips.slice(0, 3).forEach(t => {
      response += `• ${t}\n`;
    });
    if (tip.caution) {
      response += `⚠️ ${tip.caution}\n`;
    }
    response += '\n';
  });

  response += `\n${MEDICAL_DISCLAIMERS.general}`;
  return response;
}
