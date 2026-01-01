// Enhanced Features Types - Smart Medical File, Family Account, Medication Reminder, Post-Visit Follow-Up

// ============= Smart Medical File Types =============
export interface MedicalRecord {
  id: string;
  patientId: string;
  type: 'visit' | 'lab_result' | 'prescription' | 'diagnosis' | 'vaccination' | 'surgery' | 'imaging';
  title: string;
  description?: string;
  date: string;
  doctorId?: string;
  doctorName?: string;
  clinicId?: string;
  clinicName?: string;
  attachments?: Attachment[];
  isVerified: boolean;
  source: 'clinic' | 'lab' | 'pharmacy' | 'self' | 'hospital';
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  type: 'pdf' | 'image' | 'document';
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
}

export interface MedicalFileAccess {
  id: string;
  patientId: string;
  requesterId: string;
  requesterName: string;
  requesterType: 'doctor' | 'clinic' | 'lab' | 'hospital';
  requesterSpecialty?: string;
  accessType: 'full' | 'partial' | 'appointment_only';
  status: 'pending' | 'approved' | 'denied' | 'expired' | 'revoked';
  accessReason?: string;
  appointmentId?: string;
  validFrom?: string;
  validUntil?: string;
  requestedAt: string;
  respondedAt?: string;
}

export interface AuditLog {
  id: string;
  patientId: string;
  action: 'view' | 'create' | 'update' | 'delete' | 'share' | 'download' | 'access_request' | 'access_granted' | 'access_denied';
  entityType: 'record' | 'access' | 'prescription' | 'lab_result';
  entityId: string;
  performedBy: string;
  performerType: 'patient' | 'doctor' | 'clinic' | 'system';
  details?: string;
  ipAddress?: string;
  timestamp: string;
}

export interface ChronicCondition {
  id: string;
  patientId: string;
  name: string;
  diagnosisDate: string;
  status: 'active' | 'managed' | 'resolved';
  severity: 'mild' | 'moderate' | 'severe';
  treatmentPlan?: string;
  medications?: string[];
  lastCheckup?: string;
  nextCheckup?: string;
  notes?: string;
}

// ============= Family Account Types =============
export interface FamilyMember {
  id: string;
  headOfFamilyId: string;
  name: string;
  relationship: 'spouse' | 'child' | 'parent' | 'sibling' | 'grandparent' | 'other';
  dateOfBirth: string;
  gender: 'male' | 'female';
  bloodType?: string;
  allergies?: string[];
  chronicConditions?: string[];
  emergencyContact?: string;
  avatar?: string;
  isAdult: boolean;
  hasFullAccess: boolean; // Only head of family has full access
  medicalFileId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyBooking {
  id: string;
  familyMemberId: string;
  familyMemberName: string;
  bookingType: 'appointment' | 'lab' | 'pharmacy' | 'ambulance';
  bookingId: string;
  bookedBy: string;
  status: string;
  createdAt: string;
}

// ============= Medication Reminder Types =============
export interface MedicationReminder {
  id: string;
  patientId: string;
  familyMemberId?: string;
  medicationName: string;
  genericName?: string;
  dosage: string;
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'drops' | 'inhaler';
  frequency: 'once_daily' | 'twice_daily' | 'three_times_daily' | 'every_8_hours' | 'every_12_hours' | 'weekly' | 'as_needed';
  times: string[]; // Array of times like ["08:00", "14:00", "20:00"]
  startDate: string;
  endDate?: string;
  totalQuantity: number;
  remainingQuantity: number;
  refillThreshold: number; // Alert when remaining <= this
  prescriptionId?: string;
  doctorId?: string;
  doctorName?: string;
  pharmacyId?: string;
  instructions?: string;
  sideEffects?: string[];
  isActive: boolean;
  autoRefill: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationLog {
  id: string;
  reminderId: string;
  scheduledTime: string;
  status: 'pending' | 'taken' | 'skipped' | 'snoozed';
  takenAt?: string;
  snoozeUntil?: string;
  notes?: string;
  createdAt: string;
}

export interface RefillOrder {
  id: string;
  reminderId: string;
  medicationName: string;
  quantity: number;
  pharmacyId: string;
  pharmacyName: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentMethod: 'mobi_mal' | 'sadad' | 'lypay' | 'gpay' | 'dpay' | 'icash' | 'cash_on_delivery';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'cod';
  totalAmount: number;
  deliveryAddress?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

// ============= Post-Visit Follow-Up Types =============
export interface PostVisitFollowUp {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  visitDate: string;
  followUpType: 'automatic' | 'doctor_initiated' | 'patient_requested';
  status: 'pending_response' | 'improved' | 'same' | 'worsened' | 'completed' | 'escalated' | 'no_response';
  patientResponse?: 'improved' | 'same' | 'worsened';
  patientNotes?: string;
  responseDate?: string;
  doctorAction?: 'no_action' | 'message_sent' | 'appointment_scheduled' | 'treatment_adjusted' | 'urgent_review';
  doctorNotes?: string;
  doctorResponseDate?: string;
  nextFollowUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUpMessage {
  id: string;
  followUpId: string;
  senderId: string;
  senderType: 'patient' | 'doctor' | 'system';
  senderName: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ============= Libyan Payment Types =============
export type LibyanPaymentMethod = 'mobi_mal' | 'sadad' | 'lypay' | 'gpay' | 'dpay' | 'icash' | 'cash_on_delivery' | 'cash_on_visit';

export interface LibyanPaymentInfo {
  method: LibyanPaymentMethod;
  name: string;
  nameAr: string;
  icon: string;
  description: string;
  color: string;
  requiresPhone?: boolean;
  requiresOTP?: boolean;
}

export const LIBYAN_PAYMENT_METHODS: LibyanPaymentInfo[] = [
  {
    method: 'mobi_mal',
    name: 'Mobi Mal',
    nameAr: 'موبي مال',
    icon: '📱',
    description: 'الدفع عبر موبي مال',
    color: 'bg-blue-500',
    requiresPhone: true,
    requiresOTP: true
  },
  {
    method: 'sadad',
    name: 'Sadad',
    nameAr: 'سداد',
    icon: '💳',
    description: 'الدفع عبر سداد',
    color: 'bg-green-500',
    requiresPhone: true,
    requiresOTP: true
  },
  {
    method: 'lypay',
    name: 'LYPay',
    nameAr: 'ليبيا باي',
    icon: '🏦',
    description: 'الدفع عبر ليبيا باي',
    color: 'bg-purple-500',
    requiresPhone: true,
    requiresOTP: true
  },
  {
    method: 'gpay',
    name: 'GPay',
    nameAr: 'جي باي',
    icon: '💰',
    description: 'الدفع عبر جي باي',
    color: 'bg-orange-500',
    requiresPhone: true,
    requiresOTP: true
  },
  {
    method: 'dpay',
    name: 'DPay',
    nameAr: 'دي باي',
    icon: '📲',
    description: 'الدفع عبر دي باي',
    color: 'bg-red-500',
    requiresPhone: true,
    requiresOTP: true
  },
  {
    method: 'icash',
    name: 'iCash',
    nameAr: 'آي كاش',
    icon: '💵',
    description: 'الدفع عبر آي كاش',
    color: 'bg-teal-500',
    requiresPhone: true,
    requiresOTP: true
  },
  {
    method: 'cash_on_delivery',
    name: 'Cash on Delivery',
    nameAr: 'الدفع عند الاستلام',
    icon: '🚚',
    description: 'الدفع نقداً عند التوصيل',
    color: 'bg-gray-500',
    requiresPhone: false,
    requiresOTP: false
  },
  {
    method: 'cash_on_visit',
    name: 'Cash on Visit',
    nameAr: 'الدفع عند الزيارة',
    icon: '🏥',
    description: 'الدفع نقداً في العيادة',
    color: 'bg-gray-500',
    requiresPhone: false,
    requiresOTP: false
  }
];
