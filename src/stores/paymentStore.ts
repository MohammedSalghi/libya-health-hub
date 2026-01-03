// =====================================================
// نظام الدفع الموحد - متجر الحالة
// Unified Payment System - State Store
// =====================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  PaymentMethodType,
  PaymentMethod,
  PaymentTransaction,
  TransactionStatus,
  ServiceType,
  UserWallet,
  ProviderWallet,
  PaymentReceipt,
  PaymentSettings,
  TransferRequest,
  PaymentNotification,
} from '@/types/payment';

// وسائل الدفع المتاحة في ليبيا
export const LIBYAN_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'wallet',
    name: 'محفظة التطبيق',
    nameEn: 'App Wallet',
    description: 'الدفع من رصيد المحفظة مباشرة',
    icon: 'wallet',
    color: 'bg-primary',
    type: 'electronic',
    status: 'active',
    commissionRate: 0,
    minAmount: 1,
    maxAmount: 10000,
    requiresPhone: false,
    requiresOtp: false,
    processingTime: 'فوري',
  },
  {
    id: 'mobicash',
    name: 'موبي كاش',
    nameEn: 'MobiCash',
    description: 'الدفع عبر خدمة موبي كاش',
    icon: 'smartphone',
    color: 'bg-orange-500',
    type: 'electronic',
    status: 'active',
    commissionRate: 1.5,
    minAmount: 5,
    maxAmount: 5000,
    requiresPhone: true,
    requiresOtp: true,
    processingTime: '1-2 دقيقة',
  },
  {
    id: 'aman_pay',
    name: 'أمان باي',
    nameEn: 'Aman Pay',
    description: 'الدفع عبر مصرف الأمان',
    icon: 'shield',
    color: 'bg-green-600',
    type: 'electronic',
    status: 'active',
    commissionRate: 1.5,
    minAmount: 10,
    maxAmount: 10000,
    requiresPhone: true,
    requiresOtp: true,
    processingTime: '1-3 دقائق',
  },
  {
    id: 'jumhuriya_pay',
    name: 'مصرف الجمهورية',
    nameEn: 'Jumhuriya Pay',
    description: 'الدفع عبر تطبيق مصرف الجمهورية',
    icon: 'building',
    color: 'bg-blue-600',
    type: 'electronic',
    status: 'active',
    commissionRate: 1.5,
    minAmount: 10,
    maxAmount: 10000,
    requiresPhone: true,
    requiresOtp: true,
    processingTime: '1-3 دقائق',
  },
  {
    id: 'wahda_bank',
    name: 'مصرف الوحدة',
    nameEn: 'Wahda Bank',
    description: 'الدفع عبر مصرف الوحدة',
    icon: 'landmark',
    color: 'bg-indigo-600',
    type: 'electronic',
    status: 'active',
    commissionRate: 1.5,
    minAmount: 10,
    maxAmount: 10000,
    requiresPhone: true,
    requiresOtp: true,
    processingTime: '1-3 دقائق',
  },
  {
    id: 'sadad',
    name: 'سداد',
    nameEn: 'SADAD',
    description: 'نظام سداد للدفع الإلكتروني',
    icon: 'credit-card',
    color: 'bg-purple-600',
    type: 'electronic',
    status: 'active',
    commissionRate: 2,
    minAmount: 5,
    maxAmount: 5000,
    requiresPhone: true,
    requiresOtp: true,
    processingTime: '1-2 دقيقة',
  },
  {
    id: 'madar_wallet',
    name: 'محفظة المدار',
    nameEn: 'Madar Wallet',
    description: 'الدفع عبر محفظة المدار الإلكترونية',
    icon: 'smartphone',
    color: 'bg-red-500',
    type: 'electronic',
    status: 'active',
    commissionRate: 1.5,
    minAmount: 5,
    maxAmount: 3000,
    requiresPhone: true,
    requiresOtp: true,
    processingTime: '1-2 دقيقة',
  },
  {
    id: 'libyana_wallet',
    name: 'محفظة ليبيانا',
    nameEn: 'Libyana Wallet',
    description: 'الدفع عبر محفظة ليبيانا',
    icon: 'smartphone',
    color: 'bg-yellow-500',
    type: 'electronic',
    status: 'active',
    commissionRate: 1.5,
    minAmount: 5,
    maxAmount: 3000,
    requiresPhone: true,
    requiresOtp: true,
    processingTime: '1-2 دقيقة',
  },
  {
    id: 'bank_wallet',
    name: 'محفظة بنكية',
    nameEn: 'Bank Wallet',
    description: 'المحافظ الرقمية المعتمدة من المصارف',
    icon: 'wallet',
    color: 'bg-teal-600',
    type: 'electronic',
    status: 'active',
    commissionRate: 1.5,
    minAmount: 10,
    maxAmount: 10000,
    requiresPhone: true,
    requiresOtp: true,
    processingTime: '1-3 دقائق',
  },
  {
    id: 'qr_code',
    name: 'QR Code',
    nameEn: 'QR Code',
    description: 'امسح الكود للدفع الفوري',
    icon: 'qr-code',
    color: 'bg-gray-700',
    type: 'electronic',
    status: 'active',
    commissionRate: 1,
    minAmount: 5,
    maxAmount: 5000,
    requiresPhone: false,
    requiresOtp: false,
    processingTime: 'فوري',
  },
  {
    id: 'cash_visit',
    name: 'نقداً عند الزيارة',
    nameEn: 'Cash on Visit',
    description: 'الدفع نقداً عند الوصول للموعد',
    icon: 'banknote',
    color: 'bg-amber-600',
    type: 'cash',
    status: 'active',
    commissionRate: 0,
    minAmount: 1,
    maxAmount: 50000,
    requiresPhone: false,
    requiresOtp: false,
    processingTime: 'عند الوصول',
  },
  {
    id: 'cash_delivery',
    name: 'نقداً عند الاستلام',
    nameEn: 'Cash on Delivery',
    description: 'الدفع نقداً عند استلام الطلب',
    icon: 'truck',
    color: 'bg-amber-700',
    type: 'cash',
    status: 'active',
    commissionRate: 0,
    minAmount: 1,
    maxAmount: 50000,
    requiresPhone: false,
    requiresOtp: false,
    processingTime: 'عند الاستلام',
  },
];

// نسب العمولة حسب نوع الخدمة
export const SERVICE_COMMISSIONS: Record<ServiceType, number> = {
  appointment: 5,
  consultation: 5,
  video_call: 7,
  pharmacy: 3,
  lab: 4,
  home_visit: 6,
  ambulance: 2,
  subscription: 10,
  wallet_topup: 0,
  other: 5,
};

// معاملات تجريبية
const mockTransactions: PaymentTransaction[] = [
  {
    id: 'txn_001',
    userId: 'user1',
    serviceType: 'appointment',
    serviceId: 'apt_001',
    serviceName: 'استشارة د. أحمد محمد',
    amount: 100,
    serviceFee: 10,
    platformFee: 5,
    providerAmount: 85,
    paymentMethod: 'wallet',
    status: 'completed',
    providerId: 'doc1',
    providerName: 'د. أحمد محمد',
    providerType: 'doctor',
    receiptNumber: 'RCP-2024-001',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'txn_002',
    userId: 'user1',
    serviceType: 'pharmacy',
    serviceId: 'ord_001',
    serviceName: 'طلب أدوية - صيدلية السلام',
    amount: 150,
    serviceFee: 5,
    platformFee: 4.5,
    providerAmount: 140.5,
    paymentMethod: 'sadad',
    status: 'completed',
    providerId: 'pharm1',
    providerName: 'صيدلية السلام',
    providerType: 'pharmacy',
    receiptNumber: 'RCP-2024-002',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    completedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'txn_003',
    userId: 'user1',
    serviceType: 'lab',
    serviceId: 'lab_001',
    serviceName: 'تحليل دم شامل - مختبرات الهدى',
    amount: 80,
    serviceFee: 5,
    platformFee: 3.2,
    providerAmount: 71.8,
    paymentMethod: 'cash_visit',
    status: 'completed',
    cashStatus: 'collected',
    providerId: 'lab1',
    providerName: 'مختبرات الهدى',
    providerType: 'lab',
    receiptNumber: 'RCP-2024-003',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    completedAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

interface PaymentState {
  // المعاملات
  transactions: PaymentTransaction[];
  
  // المحفظة
  userWallet: UserWallet;
  
  // محافظ مقدمي الخدمة
  providerWallets: ProviderWallet[];
  
  // طلبات التحويل
  transferRequests: TransferRequest[];
  
  // الإشعارات
  paymentNotifications: PaymentNotification[];
  
  // الإعدادات
  settings: PaymentSettings;
  
  // Actions
  
  // إنشاء معاملة جديدة
  createTransaction: (transaction: Omit<PaymentTransaction, 'id' | 'receiptNumber' | 'createdAt'>) => PaymentTransaction;
  
  // تحديث حالة المعاملة
  updateTransactionStatus: (transactionId: string, status: TransactionStatus, errorMessage?: string) => void;
  
  // شحن المحفظة
  topupWallet: (amount: number, method: PaymentMethodType) => void;
  
  // خصم من المحفظة
  deductFromWallet: (amount: number) => boolean;
  
  // استرداد مبلغ
  refundTransaction: (transactionId: string) => void;
  
  // إضافة رصيد لمقدم الخدمة
  addToProviderWallet: (providerId: string, amount: number, providerName: string, providerType: 'doctor' | 'clinic' | 'lab' | 'pharmacy' | 'ambulance') => void;
  
  // طلب تحويل
  requestTransfer: (providerWalletId: string, amount: number) => void;
  
  // إضافة إشعار
  addPaymentNotification: (notification: Omit<PaymentNotification, 'id' | 'createdAt'>) => void;
  
  // تحديث إعدادات
  updateSettings: (settings: Partial<PaymentSettings>) => void;
  
  // تبديل حالة وسيلة الدفع
  togglePaymentMethod: (methodId: PaymentMethodType, enabled: boolean) => void;
  
  // الحصول على وسائل الدفع النشطة
  getActivePaymentMethods: (allowCash?: boolean) => PaymentMethod[];
  
  // الحصول على معاملات المستخدم
  getUserTransactions: (userId: string) => PaymentTransaction[];
  
  // إنشاء إيصال
  generateReceipt: (transactionId: string) => PaymentReceipt | null;
  
  // حساب العمولة
  calculateCommission: (amount: number, serviceType: ServiceType, paymentMethod: PaymentMethodType) => {
    platformFee: number;
    providerAmount: number;
    paymentFee: number;
  };
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      
      userWallet: {
        id: 'wallet_user1',
        userId: 'user1',
        balance: 500,
        pendingBalance: 0,
        loyaltyPoints: 150,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      
      providerWallets: [],
      
      transferRequests: [],
      
      paymentNotifications: [],
      
      settings: {
        enabledMethods: [
          'wallet', 'mobicash', 'aman_pay', 'jumhuriya_pay', 
          'wahda_bank', 'sadad', 'madar_wallet', 'libyana_wallet',
          'bank_wallet', 'qr_code', 'cash_visit', 'cash_delivery'
        ],
        methodSettings: {} as Record<PaymentMethodType, any>,
        defaultCommissionRate: 5,
        serviceCommissions: SERVICE_COMMISSIONS,
        minTopupAmount: 10,
        maxTopupAmount: 10000,
        autoApproveTimeout: 5,
        minWithdrawAmount: 100,
        maxDailyWithdraw: 50000,
      },
      
      createTransaction: (transactionData) => {
        const transaction: PaymentTransaction = {
          ...transactionData,
          id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          receiptNumber: `RCP-${new Date().getFullYear()}-${String(get().transactions.length + 1).padStart(4, '0')}`,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        }));
        
        return transaction;
      },
      
      updateTransactionStatus: (transactionId, status, errorMessage) => {
        set((state) => ({
          transactions: state.transactions.map((txn) =>
            txn.id === transactionId
              ? {
                  ...txn,
                  status,
                  errorMessage,
                  processedAt: status === 'processing' ? new Date().toISOString() : txn.processedAt,
                  completedAt: status === 'completed' ? new Date().toISOString() : txn.completedAt,
                }
              : txn
          ),
        }));
      },
      
      topupWallet: (amount, method) => {
        set((state) => ({
          userWallet: {
            ...state.userWallet,
            balance: state.userWallet.balance + amount,
            lastTopup: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        }));
        
        // إنشاء معاملة الشحن
        get().createTransaction({
          userId: get().userWallet.userId,
          serviceType: 'wallet_topup',
          serviceId: `topup_${Date.now()}`,
          serviceName: 'شحن المحفظة',
          amount,
          serviceFee: 0,
          platformFee: 0,
          providerAmount: 0,
          paymentMethod: method,
          status: 'completed',
          providerId: 'platform',
          providerName: 'المنصة',
          providerType: 'clinic',
        });
      },
      
      deductFromWallet: (amount) => {
        const currentBalance = get().userWallet.balance;
        if (currentBalance < amount) {
          return false;
        }
        
        set((state) => ({
          userWallet: {
            ...state.userWallet,
            balance: state.userWallet.balance - amount,
            updatedAt: new Date().toISOString(),
          },
        }));
        
        return true;
      },
      
      refundTransaction: (transactionId) => {
        const transaction = get().transactions.find((t) => t.id === transactionId);
        if (!transaction) return;
        
        // إعادة المبلغ للمحفظة
        if (transaction.paymentMethod === 'wallet') {
          set((state) => ({
            userWallet: {
              ...state.userWallet,
              balance: state.userWallet.balance + transaction.amount,
              updatedAt: new Date().toISOString(),
            },
          }));
        }
        
        get().updateTransactionStatus(transactionId, 'refunded');
        
        // خصم من محفظة مقدم الخدمة
        const providerWallet = get().providerWallets.find((w) => w.providerId === transaction.providerId);
        if (providerWallet) {
          set((state) => ({
            providerWallets: state.providerWallets.map((w) =>
              w.providerId === transaction.providerId
                ? { ...w, balance: w.balance - transaction.providerAmount }
                : w
            ),
          }));
        }
      },
      
      addToProviderWallet: (providerId, amount, providerName, providerType) => {
        const existingWallet = get().providerWallets.find((w) => w.providerId === providerId);
        
        if (existingWallet) {
          set((state) => ({
            providerWallets: state.providerWallets.map((w) =>
              w.providerId === providerId
                ? {
                    ...w,
                    balance: w.balance + amount,
                    totalEarnings: w.totalEarnings + amount,
                    updatedAt: new Date().toISOString(),
                  }
                : w
            ),
          }));
        } else {
          const newWallet: ProviderWallet = {
            id: `pw_${providerId}`,
            providerId,
            providerType,
            providerName,
            balance: amount,
            pendingBalance: 0,
            totalEarnings: amount,
            totalWithdrawn: 0,
            autoTransferEnabled: false,
            autoTransferFrequency: 'weekly',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          set((state) => ({
            providerWallets: [...state.providerWallets, newWallet],
          }));
        }
      },
      
      requestTransfer: (providerWalletId, amount) => {
        const wallet = get().providerWallets.find((w) => w.id === providerWalletId);
        if (!wallet || wallet.balance < amount) return;
        
        const request: TransferRequest = {
          id: `tr_${Date.now()}`,
          providerWalletId,
          amount,
          status: 'pending',
          bankDetails: wallet.bankDetails || { bankName: '', accountNumber: '', accountHolderName: '' },
          requestedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          transferRequests: [...state.transferRequests, request],
          providerWallets: state.providerWallets.map((w) =>
            w.id === providerWalletId
              ? {
                  ...w,
                  balance: w.balance - amount,
                  pendingBalance: w.pendingBalance + amount,
                }
              : w
          ),
        }));
      },
      
      addPaymentNotification: (notification) => {
        const newNotification: PaymentNotification = {
          ...notification,
          id: `pn_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          paymentNotifications: [newNotification, ...state.paymentNotifications],
        }));
      },
      
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
      
      togglePaymentMethod: (methodId, enabled) => {
        set((state) => ({
          settings: {
            ...state.settings,
            enabledMethods: enabled
              ? [...state.settings.enabledMethods, methodId]
              : state.settings.enabledMethods.filter((m) => m !== methodId),
          },
        }));
      },
      
      getActivePaymentMethods: (allowCash = false) => {
        const enabledMethods = get().settings.enabledMethods;
        return LIBYAN_PAYMENT_METHODS.filter(
          (m) =>
            enabledMethods.includes(m.id) &&
            m.status === 'active' &&
            (allowCash || m.type !== 'cash')
        );
      },
      
      getUserTransactions: (userId) => {
        return get().transactions.filter((t) => t.userId === userId);
      },
      
      generateReceipt: (transactionId) => {
        const transaction = get().transactions.find((t) => t.id === transactionId);
        if (!transaction) return null;
        
        return {
          id: `receipt_${transaction.id}`,
          transactionId: transaction.id,
          receiptNumber: transaction.receiptNumber,
          userName: 'المستخدم',
          userPhone: transaction.phoneNumber || '',
          serviceName: transaction.serviceName,
          serviceType: transaction.serviceType,
          providerName: transaction.providerName,
          subtotal: transaction.amount - transaction.serviceFee - transaction.platformFee,
          fees: [
            { label: 'رسوم الخدمة', amount: transaction.serviceFee },
            { label: 'رسوم المنصة', amount: transaction.platformFee },
          ],
          total: transaction.amount,
          paymentMethod: LIBYAN_PAYMENT_METHODS.find((m) => m.id === transaction.paymentMethod)?.name || transaction.paymentMethod,
          paymentStatus: transaction.status,
          date: new Date(transaction.createdAt).toLocaleDateString('ar-LY'),
          time: new Date(transaction.createdAt).toLocaleTimeString('ar-LY'),
        };
      },
      
      calculateCommission: (amount, serviceType, paymentMethod) => {
        const serviceCommission = SERVICE_COMMISSIONS[serviceType] || 5;
        const methodInfo = LIBYAN_PAYMENT_METHODS.find((m) => m.id === paymentMethod);
        const methodCommission = methodInfo?.commissionRate || 0;
        
        const platformFee = (amount * serviceCommission) / 100;
        const paymentFee = (amount * methodCommission) / 100;
        const providerAmount = amount - platformFee - paymentFee;
        
        return {
          platformFee: Math.round(platformFee * 100) / 100,
          providerAmount: Math.round(providerAmount * 100) / 100,
          paymentFee: Math.round(paymentFee * 100) / 100,
        };
      },
    }),
    {
      name: 'payment-store',
      partialize: (state) => ({
        transactions: state.transactions,
        userWallet: state.userWallet,
        providerWallets: state.providerWallets,
        transferRequests: state.transferRequests,
        settings: state.settings,
      }),
    }
  )
);
