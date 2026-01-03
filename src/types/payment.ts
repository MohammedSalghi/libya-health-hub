// =====================================================
// نظام الدفع الموحد - أنواع البيانات
// Unified Payment System - Type Definitions
// =====================================================

// أنواع وسائل الدفع الإلكترونية والنقدية
export type PaymentMethodType = 
  | 'wallet'           // محفظة التطبيق
  | 'mobicash'         // موبي كاش
  | 'aman_pay'         // أمان باي - مصرف الأمان
  | 'jumhuriya_pay'    // Pay - مصرف الجمهورية
  | 'wahda_bank'       // مصرف الوحدة
  | 'sadad'            // سداد
  | 'madar_wallet'     // محفظة المدار
  | 'libyana_wallet'   // محفظة ليبيانا
  | 'bank_wallet'      // المحافظ الرقمية المصرفية
  | 'qr_code'          // الدفع عبر QR Code
  | 'cash_visit'       // الدفع نقدًا عند الزيارة
  | 'cash_delivery';   // الدفع نقدًا عند الاستلام

// حالة وسيلة الدفع
export type PaymentMethodStatus = 'active' | 'inactive' | 'maintenance';

// تعريف وسيلة الدفع
export interface PaymentMethod {
  id: PaymentMethodType;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
  type: 'electronic' | 'cash';
  status: PaymentMethodStatus;
  commissionRate: number; // نسبة العمولة
  minAmount: number;
  maxAmount: number;
  requiresPhone: boolean;
  requiresOtp: boolean;
  processingTime: string; // الوقت المتوقع للمعالجة
}

// أنواع الخدمات التي يغطيها نظام الدفع
export type ServiceType = 
  | 'appointment'      // حجز موعد
  | 'consultation'     // استشارة
  | 'video_call'       // مكالمة فيديو
  | 'pharmacy'         // صيدلية
  | 'lab'              // تحاليل مخبرية
  | 'home_visit'       // زيارة منزلية
  | 'ambulance'        // إسعاف
  | 'subscription'     // اشتراك
  | 'wallet_topup'     // شحن المحفظة
  | 'other';           // أخرى

// حالة المعاملة
export type TransactionStatus = 
  | 'pending'          // قيد الانتظار
  | 'processing'       // قيد المعالجة
  | 'completed'        // مكتملة
  | 'failed'           // فاشلة
  | 'refunded'         // مستردة
  | 'cancelled';       // ملغاة

// حالة الدفع النقدي
export type CashPaymentStatus = 
  | 'pending_collection'  // في انتظار التحصيل
  | 'collected'           // تم التحصيل
  | 'not_collected';      // لم يتم التحصيل

// المعاملة المالية
export interface PaymentTransaction {
  id: string;
  userId: string;
  
  // تفاصيل الخدمة
  serviceType: ServiceType;
  serviceId: string;
  serviceName: string;
  
  // المبالغ
  amount: number;              // المبلغ الإجمالي
  serviceFee: number;          // رسوم الخدمة
  platformFee: number;         // عمولة المنصة
  providerAmount: number;      // صافي مستحق مقدم الخدمة
  
  // بيانات الدفع
  paymentMethod: PaymentMethodType;
  status: TransactionStatus;
  cashStatus?: CashPaymentStatus;
  
  // بيانات مقدم الخدمة
  providerId: string;
  providerName: string;
  providerType: 'doctor' | 'clinic' | 'lab' | 'pharmacy' | 'ambulance';
  
  // بيانات الإيصال
  receiptNumber: string;
  receiptUrl?: string;
  
  // التوقيت
  createdAt: string;
  processedAt?: string;
  completedAt?: string;
  
  // بيانات إضافية
  phoneNumber?: string;
  otpVerified?: boolean;
  errorMessage?: string;
  notes?: string;
}

// إيصال الدفع
export interface PaymentReceipt {
  id: string;
  transactionId: string;
  receiptNumber: string;
  
  // المستخدم
  userName: string;
  userPhone: string;
  
  // الخدمة
  serviceName: string;
  serviceType: ServiceType;
  
  // مقدم الخدمة
  providerName: string;
  
  // المبالغ
  subtotal: number;
  fees: { label: string; amount: number }[];
  total: number;
  
  // طريقة الدفع
  paymentMethod: string;
  paymentStatus: TransactionStatus;
  
  // التوقيت
  date: string;
  time: string;
  
  // QR code للإيصال
  qrCode?: string;
}

// محفظة التطبيق (محفظة المستخدم)
export interface UserWallet {
  id: string;
  userId: string;
  balance: number;
  pendingBalance: number;     // رصيد معلق
  loyaltyPoints: number;      // نقاط الولاء
  lastTopup?: string;
  createdAt: string;
  updatedAt: string;
}

// محفظة مقدم الخدمة
export interface ProviderWallet {
  id: string;
  providerId: string;
  providerType: 'doctor' | 'clinic' | 'lab' | 'pharmacy' | 'ambulance';
  providerName: string;
  
  balance: number;            // الرصيد المتاح
  pendingBalance: number;     // رصيد معلق
  totalEarnings: number;      // إجمالي الأرباح
  totalWithdrawn: number;     // إجمالي المسحوبات
  
  // إعدادات التحويل
  autoTransferEnabled: boolean;
  autoTransferFrequency: 'daily' | 'weekly' | 'monthly';
  autoTransferDay?: number;   // يوم التحويل (1-31 أو 0-6)
  bankDetails?: BankDetails;
  
  createdAt: string;
  updatedAt: string;
}

// بيانات الحساب البنكي
export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  iban?: string;
}

// طلب التحويل
export interface TransferRequest {
  id: string;
  providerWalletId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  bankDetails: BankDetails;
  requestedAt: string;
  processedAt?: string;
  completedAt?: string;
  notes?: string;
}

// إعدادات الدفع (Admin)
export interface PaymentSettings {
  // وسائل الدفع
  enabledMethods: PaymentMethodType[];
  methodSettings: Record<PaymentMethodType, PaymentMethodSettings>;
  
  // العمولات
  defaultCommissionRate: number;
  serviceCommissions: Record<ServiceType, number>;
  
  // إعدادات عامة
  minTopupAmount: number;
  maxTopupAmount: number;
  autoApproveTimeout: number; // بالدقائق
  
  // التحويلات
  minWithdrawAmount: number;
  maxDailyWithdraw: number;
}

// إعدادات وسيلة دفع محددة
export interface PaymentMethodSettings {
  isEnabled: boolean;
  commissionRate: number;
  minAmount: number;
  maxAmount: number;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
}

// طلب الدفع (للاستخدام مع PaymentDialog)
export interface PaymentRequest {
  serviceType: ServiceType;
  serviceId: string;
  serviceName: string;
  providerId: string;
  providerName: string;
  providerType: 'doctor' | 'clinic' | 'lab' | 'pharmacy' | 'ambulance';
  amount: number;
  fees?: { label: string; amount: number }[];
  allowCash?: boolean;
  allowedMethods?: PaymentMethodType[];
}

// نتيجة الدفع
export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  receiptNumber?: string;
  paymentMethod: PaymentMethodType;
  status: TransactionStatus;
  errorMessage?: string;
}

// إشعار الدفع
export interface PaymentNotification {
  id: string;
  transactionId: string;
  recipientType: 'user' | 'provider' | 'admin';
  recipientId: string;
  type: 'payment_success' | 'payment_failed' | 'refund' | 'transfer' | 'topup';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// التقارير المالية
export interface FinancialReport {
  period: { start: string; end: string };
  
  // ملخص
  totalTransactions: number;
  totalAmount: number;
  totalFees: number;
  totalCommission: number;
  totalProviderPayouts: number;
  
  // حسب طريقة الدفع
  byPaymentMethod: Record<PaymentMethodType, {
    count: number;
    amount: number;
    commission: number;
  }>;
  
  // حسب نوع الخدمة
  byServiceType: Record<ServiceType, {
    count: number;
    amount: number;
    commission: number;
  }>;
  
  // حسب الحالة
  byStatus: Record<TransactionStatus, number>;
}
