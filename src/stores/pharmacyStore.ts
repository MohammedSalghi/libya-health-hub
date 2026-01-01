// Professional Pharmacy Store for Libya-based Healthcare App
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Prescription, 
  PrescriptionMedication,
  PharmacyOrderProfessional,
  PharmacyWithStock,
  OrderStatus,
  LibyanPaymentMethod,
  ValidationResult
} from '@/types/pharmacy';

// Mock prescriptions from in-app doctors
const mockPrescriptions: Prescription[] = [
  {
    id: 'rx-001',
    patientId: 'user1',
    doctorId: 'doc-1',
    doctorName: 'د. أحمد محمد الفيتوري',
    doctorSpecialty: 'طب عام',
    clinicName: 'عيادة الشفاء',
    source: 'in_app',
    prescriptionDate: new Date().toISOString(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    medications: [
      {
        id: 'med-1',
        name: 'أموكسيسيلين',
        nameEn: 'Amoxicillin',
        genericName: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'ثلاث مرات يومياً',
        duration: '7 أيام',
        quantity: 21,
        maxQuantity: 21,
        instructions: 'بعد الأكل',
        isSelected: true,
        price: 25
      },
      {
        id: 'med-2',
        name: 'باراسيتامول',
        nameEn: 'Paracetamol',
        genericName: 'Paracetamol',
        dosage: '500mg',
        frequency: 'عند الحاجة',
        duration: '5 أيام',
        quantity: 10,
        maxQuantity: 20,
        instructions: 'كل 6 ساعات عند الحاجة',
        isSelected: true,
        price: 8
      }
    ],
    status: 'approved',
    isAutoApproved: true,
    validationResult: {
      isValid: true,
      doctorVerified: true,
      dateValid: true,
      medicationsClarity: true,
      isDuplicate: false,
      isExpired: false,
      validationDate: new Date().toISOString(),
      issues: []
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rx-002',
    patientId: 'user1',
    doctorId: 'doc-2',
    doctorName: 'د. فاطمة علي السنوسي',
    doctorSpecialty: 'أمراض الجهاز الهضمي',
    clinicName: 'مستشفى طرابلس المركزي',
    source: 'in_app',
    prescriptionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    validUntil: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    medications: [
      {
        id: 'med-3',
        name: 'أوميبرازول',
        nameEn: 'Omeprazole',
        genericName: 'Omeprazole',
        dosage: '20mg',
        frequency: 'مرة واحدة يومياً',
        duration: '14 يوم',
        quantity: 14,
        maxQuantity: 14,
        instructions: 'قبل الإفطار بنصف ساعة',
        isSelected: true,
        price: 35
      }
    ],
    status: 'approved',
    isAutoApproved: true,
    validationResult: {
      isValid: true,
      doctorVerified: true,
      dateValid: true,
      medicationsClarity: true,
      isDuplicate: false,
      isExpired: false,
      validationDate: new Date().toISOString(),
      issues: []
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Mock Libyan pharmacies with stock info
const mockPharmacies: PharmacyWithStock[] = [
  {
    id: 'ph-001',
    name: 'صيدلية السلام',
    address: 'شارع الجمهورية، طرابلس',
    city: 'طرابلس',
    phone: '091-1234567',
    distance: 1.2,
    rating: 4.8,
    isOpen: true,
    deliveryTime: '30-45 دقيقة',
    deliveryFee: 10,
    stockAvailability: 'full',
    availableMedications: ['med-1', 'med-2', 'med-3'],
    unavailableMedications: []
  },
  {
    id: 'ph-002',
    name: 'صيدلية الماسة',
    address: 'شارع عمر المختار، طرابلس',
    city: 'طرابلس',
    phone: '091-7654321',
    distance: 2.5,
    rating: 4.6,
    isOpen: true,
    deliveryTime: '45-60 دقيقة',
    deliveryFee: 15,
    stockAvailability: 'partial',
    availableMedications: ['med-1', 'med-3'],
    unavailableMedications: ['med-2']
  },
  {
    id: 'ph-003',
    name: 'صيدلية الأمل',
    address: 'شارع الفاتح، بنغازي',
    city: 'بنغازي',
    phone: '091-9876543',
    distance: 3.8,
    rating: 4.5,
    isOpen: true,
    deliveryTime: '60-90 دقيقة',
    deliveryFee: 20,
    stockAvailability: 'full',
    availableMedications: ['med-1', 'med-2', 'med-3'],
    unavailableMedications: []
  },
  {
    id: 'ph-004',
    name: 'صيدلية الشفاء',
    address: 'شارع النصر، مصراتة',
    city: 'مصراتة',
    phone: '091-4567890',
    distance: 0.8,
    rating: 4.9,
    isOpen: false,
    deliveryTime: '20-30 دقيقة',
    deliveryFee: 8,
    stockAvailability: 'full',
    availableMedications: ['med-1', 'med-2', 'med-3'],
    unavailableMedications: []
  }
];

interface PharmacyState {
  // Prescriptions
  prescriptions: Prescription[];
  activePrescription: Prescription | null;
  
  // Orders
  orders: PharmacyOrderProfessional[];
  currentOrder: PharmacyOrderProfessional | null;
  
  // Pharmacies
  pharmacies: PharmacyWithStock[];
  selectedPharmacy: PharmacyWithStock | null;
  
  // Upload state
  uploadedPrescriptionImage: string | null;
  isValidating: boolean;
  
  // Actions - Prescriptions
  uploadPrescription: (imageUrl: string) => Promise<Prescription>;
  selectPrescription: (prescriptionId: string) => void;
  updateMedicationSelection: (prescriptionId: string, medicationId: string, selected: boolean) => void;
  updateMedicationQuantity: (prescriptionId: string, medicationId: string, quantity: number) => void;
  
  // Actions - Pharmacies
  selectPharmacy: (pharmacyId: string) => void;
  getPharmaciesWithStock: (prescriptionId: string) => PharmacyWithStock[];
  
  // Actions - Orders
  createOrder: (prescriptionId: string, pharmacyId: string, paymentMethod: LibyanPaymentMethod) => PharmacyOrderProfessional;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  processPayment: (orderId: string) => Promise<boolean>;
  
  // Actions - Notifications
  addAuditLog: (orderId: string, action: string, performerType: 'patient' | 'pharmacist' | 'system', details?: string) => void;
}

export const usePharmacyStore = create<PharmacyState>()(
  persist(
    (set, get) => ({
      prescriptions: mockPrescriptions,
      activePrescription: null,
      orders: [],
      currentOrder: null,
      pharmacies: mockPharmacies,
      selectedPharmacy: null,
      uploadedPrescriptionImage: null,
      isValidating: false,

      uploadPrescription: async (imageUrl: string) => {
        set({ isValidating: true, uploadedPrescriptionImage: imageUrl });
        
        // Simulate AI validation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const validationResult: ValidationResult = {
          isValid: true,
          doctorVerified: true,
          dateValid: true,
          medicationsClarity: true,
          isDuplicate: false,
          isExpired: false,
          validationDate: new Date().toISOString(),
          issues: []
        };

        const newPrescription: Prescription = {
          id: `rx-${Date.now()}`,
          patientId: 'user1',
          doctorName: 'د. محمد الليبي',
          source: 'uploaded',
          prescriptionDate: new Date().toISOString(),
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          medications: [
            {
              id: `med-${Date.now()}-1`,
              name: 'دواء من الوصفة',
              dosage: '500mg',
              frequency: 'مرتين يومياً',
              duration: '7 أيام',
              quantity: 14,
              maxQuantity: 14,
              isSelected: true,
              price: 30
            }
          ],
          status: 'pending_validation',
          isAutoApproved: false,
          imageUrl,
          validationResult,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set(state => ({
          prescriptions: [...state.prescriptions, newPrescription],
          activePrescription: newPrescription,
          isValidating: false
        }));

        // Auto-approve after pharmacist simulation
        setTimeout(() => {
          set(state => ({
            prescriptions: state.prescriptions.map(p => 
              p.id === newPrescription.id 
                ? { 
                    ...p, 
                    status: 'approved' as const,
                    pharmacistApproval: {
                      pharmacistId: 'pharmacist-1',
                      pharmacistName: 'صيدلي: أحمد',
                      approved: true,
                      approvalDate: new Date().toISOString()
                    }
                  }
                : p
            ),
            activePrescription: state.activePrescription?.id === newPrescription.id
              ? { 
                  ...state.activePrescription, 
                  status: 'approved' as const,
                  pharmacistApproval: {
                    pharmacistId: 'pharmacist-1',
                    pharmacistName: 'صيدلي: أحمد',
                    approved: true,
                    approvalDate: new Date().toISOString()
                  }
                }
              : state.activePrescription
          }));
        }, 3000);

        return newPrescription;
      },

      selectPrescription: (prescriptionId: string) => {
        const prescription = get().prescriptions.find(p => p.id === prescriptionId);
        set({ activePrescription: prescription || null });
      },

      updateMedicationSelection: (prescriptionId: string, medicationId: string, selected: boolean) => {
        set(state => ({
          prescriptions: state.prescriptions.map(p => 
            p.id === prescriptionId 
              ? {
                  ...p,
                  medications: p.medications.map(m => 
                    m.id === medicationId ? { ...m, isSelected: selected } : m
                  )
                }
              : p
          ),
          activePrescription: state.activePrescription?.id === prescriptionId
            ? {
                ...state.activePrescription,
                medications: state.activePrescription.medications.map(m => 
                  m.id === medicationId ? { ...m, isSelected: selected } : m
                )
              }
            : state.activePrescription
        }));
      },

      updateMedicationQuantity: (prescriptionId: string, medicationId: string, quantity: number) => {
        set(state => {
          const prescription = state.prescriptions.find(p => p.id === prescriptionId);
          const medication = prescription?.medications.find(m => m.id === medicationId);
          if (!medication) return state;

          const validQuantity = Math.min(Math.max(1, quantity), medication.maxQuantity);

          return {
            prescriptions: state.prescriptions.map(p => 
              p.id === prescriptionId 
                ? {
                    ...p,
                    medications: p.medications.map(m => 
                      m.id === medicationId ? { ...m, quantity: validQuantity } : m
                    )
                  }
                : p
            ),
            activePrescription: state.activePrescription?.id === prescriptionId
              ? {
                  ...state.activePrescription,
                  medications: state.activePrescription.medications.map(m => 
                    m.id === medicationId ? { ...m, quantity: validQuantity } : m
                  )
                }
              : state.activePrescription
          };
        });
      },

      selectPharmacy: (pharmacyId: string) => {
        const pharmacy = get().pharmacies.find(p => p.id === pharmacyId);
        set({ selectedPharmacy: pharmacy || null });
      },

      getPharmaciesWithStock: (prescriptionId: string) => {
        const prescription = get().prescriptions.find(p => p.id === prescriptionId);
        if (!prescription) return [];

        const selectedMedIds = prescription.medications
          .filter(m => m.isSelected)
          .map(m => m.id);

        return get().pharmacies.map(pharmacy => ({
          ...pharmacy,
          stockAvailability: selectedMedIds.every(id => pharmacy.availableMedications.includes(id))
            ? 'full' as const
            : selectedMedIds.some(id => pharmacy.availableMedications.includes(id))
            ? 'partial' as const
            : 'none' as const
        })).sort((a, b) => a.distance - b.distance);
      },

      createOrder: (prescriptionId: string, pharmacyId: string, paymentMethod: LibyanPaymentMethod) => {
        const prescription = get().prescriptions.find(p => p.id === prescriptionId);
        const pharmacy = get().pharmacies.find(p => p.id === pharmacyId);

        if (!prescription || !pharmacy) {
          throw new Error('Invalid prescription or pharmacy');
        }

        const selectedMedications = prescription.medications
          .filter(m => m.isSelected)
          .map(m => ({
            medicationId: m.id,
            name: m.name,
            dosage: m.dosage,
            quantity: m.quantity,
            maxQuantity: m.maxQuantity,
            price: m.price || 0
          }));

        const subtotal = selectedMedications.reduce((sum, m) => sum + (m.price * m.quantity), 0);
        const serviceFee = 5;
        const totalAmount = subtotal + pharmacy.deliveryFee + serviceFee;

        const order: PharmacyOrderProfessional = {
          id: `order-${Date.now()}`,
          patientId: 'user1',
          prescriptionId,
          prescription,
          pharmacyId,
          pharmacyName: pharmacy.name,
          pharmacyPhone: pharmacy.phone,
          selectedMedications,
          status: paymentMethod === 'cash_on_delivery' ? 'confirmed' : 'payment_pending',
          statusHistory: [{
            status: paymentMethod === 'cash_on_delivery' ? 'confirmed' : 'payment_pending',
            timestamp: new Date().toISOString()
          }],
          paymentMethod,
          paymentStatus: paymentMethod === 'cash_on_delivery' ? 'cod' : 'pending',
          subtotal,
          deliveryFee: pharmacy.deliveryFee,
          serviceFee,
          totalAmount,
          deliveryAddress: {
            address: 'شارع الجمهورية، طرابلس',
            city: 'طرابلس',
            lat: 32.8872,
            lng: 13.1913
          },
          estimatedDelivery: pharmacy.deliveryTime,
          auditLog: [{
            action: 'order_created',
            performedBy: 'user1',
            performerType: 'patient',
            timestamp: new Date().toISOString(),
            details: `تم إنشاء الطلب من الوصفة ${prescriptionId}`
          }],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set(state => ({
          orders: [...state.orders, order],
          currentOrder: order
        }));

        return order;
      },

      updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => {
        set(state => ({
          orders: state.orders.map(order => 
            order.id === orderId 
              ? {
                  ...order,
                  status,
                  statusHistory: [
                    ...order.statusHistory,
                    { status, timestamp: new Date().toISOString(), note }
                  ],
                  updatedAt: new Date().toISOString()
                }
              : order
          ),
          currentOrder: state.currentOrder?.id === orderId
            ? {
                ...state.currentOrder,
                status,
                statusHistory: [
                  ...state.currentOrder.statusHistory,
                  { status, timestamp: new Date().toISOString(), note }
                ],
                updatedAt: new Date().toISOString()
              }
            : state.currentOrder
        }));
      },

      processPayment: async (orderId: string) => {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const success = Math.random() > 0.1; // 90% success rate

        if (success) {
          set(state => ({
            orders: state.orders.map(order => 
              order.id === orderId 
                ? {
                    ...order,
                    paymentStatus: 'paid',
                    status: 'confirmed',
                    statusHistory: [
                      ...order.statusHistory,
                      { status: 'confirmed' as const, timestamp: new Date().toISOString(), note: 'تم الدفع بنجاح' }
                    ],
                    updatedAt: new Date().toISOString()
                  }
                : order
            )
          }));
        }

        return success;
      },

      addAuditLog: (orderId: string, action: string, performerType: 'patient' | 'pharmacist' | 'system', details?: string) => {
        set(state => ({
          orders: state.orders.map(order => 
            order.id === orderId 
              ? {
                  ...order,
                  auditLog: [
                    ...order.auditLog,
                    {
                      action,
                      performedBy: performerType === 'patient' ? 'user1' : performerType,
                      performerType,
                      timestamp: new Date().toISOString(),
                      details
                    }
                  ]
                }
              : order
          )
        }));
      }
    }),
    {
      name: 'pharmacy-store',
      partialize: (state) => ({
        prescriptions: state.prescriptions,
        orders: state.orders
      })
    }
  )
);
