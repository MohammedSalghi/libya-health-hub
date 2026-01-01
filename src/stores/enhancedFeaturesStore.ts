// Enhanced Features Store - Smart Medical File, Family Account, Medication Reminder, Post-Visit Follow-Up
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  MedicalRecord,
  MedicalFileAccess,
  AuditLog,
  ChronicCondition,
  FamilyMember,
  FamilyBooking,
  MedicationReminder,
  MedicationLog,
  RefillOrder,
  PostVisitFollowUp,
  FollowUpMessage
} from '@/types/enhancedFeatures';

interface EnhancedFeaturesState {
  // ============= Smart Medical File =============
  medicalRecords: MedicalRecord[];
  accessRequests: MedicalFileAccess[];
  auditLogs: AuditLog[];
  chronicConditions: ChronicCondition[];
  
  addMedicalRecord: (record: MedicalRecord) => void;
  updateMedicalRecord: (id: string, updates: Partial<MedicalRecord>) => void;
  deleteMedicalRecord: (id: string) => void;
  
  addAccessRequest: (request: MedicalFileAccess) => void;
  updateAccessRequest: (id: string, updates: Partial<MedicalFileAccess>) => void;
  approveAccess: (id: string, validUntil: string) => void;
  denyAccess: (id: string) => void;
  revokeAccess: (id: string) => void;
  
  addAuditLog: (log: AuditLog) => void;
  
  addChronicCondition: (condition: ChronicCondition) => void;
  updateChronicCondition: (id: string, updates: Partial<ChronicCondition>) => void;
  
  // ============= Family Account =============
  familyMembers: FamilyMember[];
  familyBookings: FamilyBooking[];
  selectedFamilyMember: string | null;
  
  addFamilyMember: (member: FamilyMember) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  removeFamilyMember: (id: string) => void;
  setSelectedFamilyMember: (id: string | null) => void;
  addFamilyBooking: (booking: FamilyBooking) => void;
  
  // ============= Medication Reminder =============
  medicationReminders: MedicationReminder[];
  medicationLogs: MedicationLog[];
  refillOrders: RefillOrder[];
  
  addMedicationReminder: (reminder: MedicationReminder) => void;
  updateMedicationReminder: (id: string, updates: Partial<MedicationReminder>) => void;
  deleteMedicationReminder: (id: string) => void;
  
  logMedicationTaken: (reminderId: string, scheduledTime: string) => void;
  logMedicationSkipped: (reminderId: string, scheduledTime: string, notes?: string) => void;
  snoozeMedication: (reminderId: string, scheduledTime: string, snoozeMinutes: number) => void;
  
  addRefillOrder: (order: RefillOrder) => void;
  updateRefillOrder: (id: string, updates: Partial<RefillOrder>) => void;
  
  // ============= Post-Visit Follow-Up =============
  followUps: PostVisitFollowUp[];
  followUpMessages: FollowUpMessage[];
  
  createFollowUp: (followUp: PostVisitFollowUp) => void;
  submitPatientResponse: (id: string, response: 'improved' | 'same' | 'worsened', notes?: string) => void;
  submitDoctorAction: (id: string, action: PostVisitFollowUp['doctorAction'], notes?: string, nextFollowUpDate?: string) => void;
  escalateFollowUp: (id: string) => void;
  addFollowUpMessage: (message: FollowUpMessage) => void;
  markMessageRead: (id: string) => void;
}

// Mock data for initial state
const initialMedicalRecords: MedicalRecord[] = [
  {
    id: 'rec-1',
    patientId: 'user1',
    type: 'visit',
    title: 'زيارة عيادة القلب',
    description: 'فحص دوري للقلب والضغط',
    date: '2024-01-15',
    doctorName: 'د. أحمد محمد',
    clinicName: 'مركز طرابلس الطبي',
    isVerified: true,
    source: 'clinic',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'rec-2',
    patientId: 'user1',
    type: 'lab_result',
    title: 'تحليل دم شامل',
    description: 'فحص شامل للدم',
    date: '2024-01-10',
    clinicName: 'مختبر الأمل',
    isVerified: true,
    source: 'lab',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T15:00:00Z'
  },
  {
    id: 'rec-3',
    patientId: 'user1',
    type: 'prescription',
    title: 'وصفة أدوية الضغط',
    description: 'أموكسيسيلين 500mg - 3 مرات يومياً لمدة 7 أيام',
    date: '2024-01-20',
    doctorName: 'د. سارة علي',
    isVerified: true,
    source: 'clinic',
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-20T11:00:00Z'
  }
];

const initialChronicConditions: ChronicCondition[] = [
  {
    id: 'chronic-1',
    patientId: 'user1',
    name: 'ضغط الدم',
    diagnosisDate: '2022-06-15',
    status: 'managed',
    severity: 'mild',
    treatmentPlan: 'أدوية يومية + نظام غذائي',
    medications: ['أملوديبين 5mg'],
    lastCheckup: '2024-01-15',
    nextCheckup: '2024-02-15'
  },
  {
    id: 'chronic-2',
    patientId: 'user1',
    name: 'السكري النوع الثاني',
    diagnosisDate: '2023-01-10',
    status: 'active',
    severity: 'moderate',
    treatmentPlan: 'ميتفورمين + متابعة السكر',
    medications: ['ميتفورمين 500mg'],
    lastCheckup: '2024-01-10',
    nextCheckup: '2024-02-10'
  }
];

const initialFamilyMembers: FamilyMember[] = [];

const initialMedicationReminders: MedicationReminder[] = [
  {
    id: 'med-1',
    patientId: 'user1',
    medicationName: 'أملوديبين',
    genericName: 'Amlodipine',
    dosage: '5mg',
    form: 'tablet',
    frequency: 'once_daily',
    times: ['08:00'],
    startDate: '2024-01-01',
    totalQuantity: 30,
    remainingQuantity: 15,
    refillThreshold: 7,
    doctorName: 'د. أحمد محمد',
    instructions: 'تؤخذ قبل أو بعد الطعام',
    isActive: true,
    autoRefill: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'med-2',
    patientId: 'user1',
    medicationName: 'ميتفورمين',
    genericName: 'Metformin',
    dosage: '500mg',
    form: 'tablet',
    frequency: 'twice_daily',
    times: ['08:00', '20:00'],
    startDate: '2024-01-01',
    totalQuantity: 60,
    remainingQuantity: 8,
    refillThreshold: 10,
    doctorName: 'د. سارة علي',
    instructions: 'تؤخذ مع الطعام',
    isActive: true,
    autoRefill: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const useEnhancedFeaturesStore = create<EnhancedFeaturesState>()(
  persist(
    (set, get) => ({
      // Initial State
      medicalRecords: initialMedicalRecords,
      accessRequests: [],
      auditLogs: [],
      chronicConditions: initialChronicConditions,
      familyMembers: initialFamilyMembers,
      familyBookings: [],
      selectedFamilyMember: null,
      medicationReminders: initialMedicationReminders,
      medicationLogs: [],
      refillOrders: [],
      followUps: [],
      followUpMessages: [],

      // ============= Smart Medical File Actions =============
      addMedicalRecord: (record) => {
        set((state) => ({
          medicalRecords: [...state.medicalRecords, record]
        }));
        // Add audit log
        get().addAuditLog({
          id: `log-${Date.now()}`,
          patientId: record.patientId,
          action: 'create',
          entityType: 'record',
          entityId: record.id,
          performedBy: record.patientId,
          performerType: 'patient',
          details: `تمت إضافة سجل جديد: ${record.title}`,
          timestamp: new Date().toISOString()
        });
      },

      updateMedicalRecord: (id, updates) => {
        set((state) => ({
          medicalRecords: state.medicalRecords.map((rec) =>
            rec.id === id ? { ...rec, ...updates, updatedAt: new Date().toISOString() } : rec
          )
        }));
      },

      deleteMedicalRecord: (id) => {
        const record = get().medicalRecords.find(r => r.id === id);
        if (record) {
          set((state) => ({
            medicalRecords: state.medicalRecords.filter((rec) => rec.id !== id)
          }));
          get().addAuditLog({
            id: `log-${Date.now()}`,
            patientId: record.patientId,
            action: 'delete',
            entityType: 'record',
            entityId: id,
            performedBy: record.patientId,
            performerType: 'patient',
            details: `تم حذف السجل: ${record.title}`,
            timestamp: new Date().toISOString()
          });
        }
      },

      addAccessRequest: (request) => {
        set((state) => ({
          accessRequests: [...state.accessRequests, request]
        }));
      },

      updateAccessRequest: (id, updates) => {
        set((state) => ({
          accessRequests: state.accessRequests.map((req) =>
            req.id === id ? { ...req, ...updates } : req
          )
        }));
      },

      approveAccess: (id, validUntil) => {
        const request = get().accessRequests.find(r => r.id === id);
        if (request) {
          set((state) => ({
            accessRequests: state.accessRequests.map((req) =>
              req.id === id ? { 
                ...req, 
                status: 'approved' as const, 
                validUntil,
                respondedAt: new Date().toISOString()
              } : req
            )
          }));
          get().addAuditLog({
            id: `log-${Date.now()}`,
            patientId: request.patientId,
            action: 'access_granted',
            entityType: 'access',
            entityId: id,
            performedBy: request.patientId,
            performerType: 'patient',
            details: `تمت الموافقة على طلب الوصول من ${request.requesterName}`,
            timestamp: new Date().toISOString()
          });
        }
      },

      denyAccess: (id) => {
        const request = get().accessRequests.find(r => r.id === id);
        if (request) {
          set((state) => ({
            accessRequests: state.accessRequests.map((req) =>
              req.id === id ? { 
                ...req, 
                status: 'denied' as const,
                respondedAt: new Date().toISOString()
              } : req
            )
          }));
          get().addAuditLog({
            id: `log-${Date.now()}`,
            patientId: request.patientId,
            action: 'access_denied',
            entityType: 'access',
            entityId: id,
            performedBy: request.patientId,
            performerType: 'patient',
            details: `تم رفض طلب الوصول من ${request.requesterName}`,
            timestamp: new Date().toISOString()
          });
        }
      },

      revokeAccess: (id) => {
        set((state) => ({
          accessRequests: state.accessRequests.map((req) =>
            req.id === id ? { ...req, status: 'revoked' as const } : req
          )
        }));
      },

      addAuditLog: (log) => {
        set((state) => ({
          auditLogs: [log, ...state.auditLogs]
        }));
      },

      addChronicCondition: (condition) => {
        set((state) => ({
          chronicConditions: [...state.chronicConditions, condition]
        }));
      },

      updateChronicCondition: (id, updates) => {
        set((state) => ({
          chronicConditions: state.chronicConditions.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          )
        }));
      },

      // ============= Family Account Actions =============
      addFamilyMember: (member) => {
        set((state) => ({
          familyMembers: [...state.familyMembers, member]
        }));
      },

      updateFamilyMember: (id, updates) => {
        set((state) => ({
          familyMembers: state.familyMembers.map((m) =>
            m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
          )
        }));
      },

      removeFamilyMember: (id) => {
        set((state) => ({
          familyMembers: state.familyMembers.filter((m) => m.id !== id)
        }));
      },

      setSelectedFamilyMember: (id) => {
        set({ selectedFamilyMember: id });
      },

      addFamilyBooking: (booking) => {
        set((state) => ({
          familyBookings: [...state.familyBookings, booking]
        }));
      },

      // ============= Medication Reminder Actions =============
      addMedicationReminder: (reminder) => {
        // Check for duplicates
        const existing = get().medicationReminders.find(
          r => r.medicationName === reminder.medicationName && r.isActive
        );
        if (existing) {
          throw new Error('هذا الدواء موجود بالفعل في قائمة التذكيرات');
        }
        set((state) => ({
          medicationReminders: [...state.medicationReminders, reminder]
        }));
      },

      updateMedicationReminder: (id, updates) => {
        set((state) => ({
          medicationReminders: state.medicationReminders.map((r) =>
            r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
          )
        }));
      },

      deleteMedicationReminder: (id) => {
        set((state) => ({
          medicationReminders: state.medicationReminders.filter((r) => r.id !== id)
        }));
      },

      logMedicationTaken: (reminderId, scheduledTime) => {
        const reminder = get().medicationReminders.find(r => r.id === reminderId);
        if (reminder) {
          // Add log entry
          const log: MedicationLog = {
            id: `log-${Date.now()}`,
            reminderId,
            scheduledTime,
            status: 'taken',
            takenAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
          };
          set((state) => ({
            medicationLogs: [...state.medicationLogs, log]
          }));

          // Decrease remaining quantity
          get().updateMedicationReminder(reminderId, {
            remainingQuantity: Math.max(0, reminder.remainingQuantity - 1)
          });
        }
      },

      logMedicationSkipped: (reminderId, scheduledTime, notes) => {
        const log: MedicationLog = {
          id: `log-${Date.now()}`,
          reminderId,
          scheduledTime,
          status: 'skipped',
          notes,
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          medicationLogs: [...state.medicationLogs, log]
        }));
      },

      snoozeMedication: (reminderId, scheduledTime, snoozeMinutes) => {
        const snoozeUntil = new Date(Date.now() + snoozeMinutes * 60 * 1000).toISOString();
        const log: MedicationLog = {
          id: `log-${Date.now()}`,
          reminderId,
          scheduledTime,
          status: 'snoozed',
          snoozeUntil,
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          medicationLogs: [...state.medicationLogs, log]
        }));
      },

      addRefillOrder: (order) => {
        set((state) => ({
          refillOrders: [...state.refillOrders, order]
        }));
      },

      updateRefillOrder: (id, updates) => {
        set((state) => ({
          refillOrders: state.refillOrders.map((o) =>
            o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o
          )
        }));
      },

      // ============= Post-Visit Follow-Up Actions =============
      createFollowUp: (followUp) => {
        set((state) => ({
          followUps: [...state.followUps, followUp]
        }));
      },

      submitPatientResponse: (id, response, notes) => {
        set((state) => ({
          followUps: state.followUps.map((f) =>
            f.id === id ? { 
              ...f, 
              patientResponse: response,
              patientNotes: notes,
              responseDate: new Date().toISOString(),
              status: response === 'worsened' ? 'escalated' : response,
              updatedAt: new Date().toISOString()
            } : f
          )
        }));
      },

      submitDoctorAction: (id, action, notes, nextFollowUpDate) => {
        set((state) => ({
          followUps: state.followUps.map((f) =>
            f.id === id ? { 
              ...f, 
              doctorAction: action,
              doctorNotes: notes,
              doctorResponseDate: new Date().toISOString(),
              nextFollowUpDate,
              status: 'completed',
              updatedAt: new Date().toISOString()
            } : f
          )
        }));
      },

      escalateFollowUp: (id) => {
        set((state) => ({
          followUps: state.followUps.map((f) =>
            f.id === id ? { ...f, status: 'escalated', updatedAt: new Date().toISOString() } : f
          )
        }));
      },

      addFollowUpMessage: (message) => {
        set((state) => ({
          followUpMessages: [...state.followUpMessages, message]
        }));
      },

      markMessageRead: (id) => {
        set((state) => ({
          followUpMessages: state.followUpMessages.map((m) =>
            m.id === id ? { ...m, isRead: true } : m
          )
        }));
      }
    }),
    {
      name: 'enhanced-features-store',
      partialize: (state) => ({
        medicalRecords: state.medicalRecords,
        accessRequests: state.accessRequests,
        auditLogs: state.auditLogs,
        chronicConditions: state.chronicConditions,
        familyMembers: state.familyMembers,
        familyBookings: state.familyBookings,
        medicationReminders: state.medicationReminders,
        medicationLogs: state.medicationLogs,
        refillOrders: state.refillOrders,
        followUps: state.followUps,
        followUpMessages: state.followUpMessages
      })
    }
  )
);
