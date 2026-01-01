// Professional Pharmacy Types for Libya-based Healthcare App

export type PrescriptionStatus = 'pending_validation' | 'validated' | 'approved' | 'rejected' | 'expired';
export type PrescriptionSource = 'in_app' | 'uploaded' | 'external';

export interface Prescription {
  id: string;
  patientId: string;
  doctorId?: string;
  doctorName: string;
  doctorSpecialty?: string;
  clinicName?: string;
  source: PrescriptionSource;
  prescriptionDate: string;
  validUntil: string;
  medications: PrescriptionMedication[];
  imageUrl?: string;
  status: PrescriptionStatus;
  validationResult?: ValidationResult;
  pharmacistApproval?: PharmacistApproval;
  isAutoApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionMedication {
  id: string;
  name: string;
  nameEn?: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  maxQuantity: number;
  instructions?: string;
  isSelected: boolean;
  price?: number;
}

export interface ValidationResult {
  isValid: boolean;
  doctorVerified: boolean;
  dateValid: boolean;
  medicationsClarity: boolean;
  isDuplicate: boolean;
  isExpired: boolean;
  validationDate: string;
  issues: string[];
}

export interface PharmacistApproval {
  pharmacistId: string;
  pharmacistName: string;
  approved: boolean;
  notes?: string;
  approvalDate: string;
}

export type OrderStatus = 
  | 'pending_prescription' 
  | 'pending_pharmacy_approval' 
  | 'approved' 
  | 'payment_pending'
  | 'confirmed' 
  | 'preparing' 
  | 'ready' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export type LibyanPaymentMethod = 'mobimall' | 'sadad' | 'cash_on_delivery';

export interface PharmacyOrderProfessional {
  id: string;
  patientId: string;
  prescriptionId: string;
  prescription: Prescription;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyPhone: string;
  selectedMedications: OrderMedication[];
  status: OrderStatus;
  statusHistory: StatusHistoryEntry[];
  paymentMethod?: LibyanPaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'cod' | 'failed';
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  totalAmount: number;
  deliveryAddress: {
    address: string;
    city: string;
    lat?: number;
    lng?: number;
  };
  estimatedDelivery?: string;
  actualDelivery?: string;
  pharmacistNotes?: string;
  auditLog: AuditEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderMedication {
  medicationId: string;
  name: string;
  dosage: string;
  quantity: number;
  maxQuantity: number;
  price: number;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface AuditEntry {
  action: string;
  performedBy: string;
  performerType: 'patient' | 'pharmacist' | 'system';
  timestamp: string;
  details?: string;
}

export interface PharmacyWithStock {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  distance: number;
  rating: number;
  isOpen: boolean;
  deliveryTime: string;
  deliveryFee: number;
  stockAvailability: 'full' | 'partial' | 'none';
  availableMedications: string[];
  unavailableMedications: string[];
}

export const LIBYAN_PAYMENT_METHODS = [
  {
    id: 'mobimall' as LibyanPaymentMethod,
    name: 'موبي مال',
    icon: '📱',
    description: 'الدفع عبر موبي مال',
    color: 'bg-blue-500'
  },
  {
    id: 'sadad' as LibyanPaymentMethod,
    name: 'سداد',
    icon: '💳',
    description: 'الدفع عبر سداد',
    color: 'bg-green-500'
  },
  {
    id: 'cash_on_delivery' as LibyanPaymentMethod,
    name: 'الدفع عند الاستلام',
    icon: '💵',
    description: 'الدفع نقداً عند التوصيل',
    color: 'bg-gray-500'
  }
];

export const ORDER_STATUS_INFO: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  pending_prescription: { label: 'في انتظار الوصفة', color: 'bg-yellow-100 text-yellow-700', icon: 'FileText' },
  pending_pharmacy_approval: { label: 'في انتظار موافقة الصيدلي', color: 'bg-orange-100 text-orange-700', icon: 'Clock' },
  approved: { label: 'تمت الموافقة', color: 'bg-blue-100 text-blue-700', icon: 'CheckCircle' },
  payment_pending: { label: 'في انتظار الدفع', color: 'bg-purple-100 text-purple-700', icon: 'CreditCard' },
  confirmed: { label: 'تم التأكيد', color: 'bg-teal-100 text-teal-700', icon: 'Check' },
  preparing: { label: 'جاري التجهيز', color: 'bg-indigo-100 text-indigo-700', icon: 'Package' },
  ready: { label: 'جاهز للاستلام', color: 'bg-cyan-100 text-cyan-700', icon: 'Box' },
  out_for_delivery: { label: 'في الطريق', color: 'bg-blue-100 text-blue-700', icon: 'Truck' },
  delivered: { label: 'تم التوصيل', color: 'bg-green-100 text-green-700', icon: 'CheckCircle' },
  cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-700', icon: 'X' }
};
