// Healthcare State Management Store
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Appointment, 
  LabBooking, 
  PharmacyOrder, 
  AmbulanceRequest,
  Notification,
  Rating,
  WalletTransaction,
  Doctor,
  Clinic
} from '@/types/healthcare';

interface HealthcareState {
  // User
  userId: string;
  userName: string;
  userLocation: { lat: number; lng: number } | null;
  walletBalance: number;
  
  // Appointments
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  
  // Lab Bookings
  labBookings: LabBooking[];
  addLabBooking: (booking: LabBooking) => void;
  updateLabBooking: (id: string, updates: Partial<LabBooking>) => void;
  
  // Pharmacy Orders
  pharmacyOrders: PharmacyOrder[];
  addPharmacyOrder: (order: PharmacyOrder) => void;
  updatePharmacyOrder: (id: string, updates: Partial<PharmacyOrder>) => void;
  
  // Ambulance Requests
  ambulanceRequests: AmbulanceRequest[];
  addAmbulanceRequest: (request: AmbulanceRequest) => void;
  updateAmbulanceRequest: (id: string, updates: Partial<AmbulanceRequest>) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Ratings
  ratings: Rating[];
  addRating: (rating: Rating) => void;
  pendingRatings: { serviceType: string; serviceId: string; serviceName: string }[];
  addPendingRating: (rating: { serviceType: string; serviceId: string; serviceName: string }) => void;
  removePendingRating: (serviceId: string) => void;
  
  // Wallet
  transactions: WalletTransaction[];
  addTransaction: (transaction: WalletTransaction) => void;
  updateWalletBalance: (amount: number) => void;
  
  // Favorites
  favoriteDoctors: string[];
  toggleFavoriteDoctor: (doctorId: string) => void;
  favoriteClinics: string[];
  toggleFavoriteClinic: (clinicId: string) => void;
  
  // Cart (for pharmacy)
  cart: { medicationId: string; quantity: number }[];
  addToCart: (medicationId: string, quantity?: number) => void;
  removeFromCart: (medicationId: string) => void;
  updateCartQuantity: (medicationId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Location
  setUserLocation: (location: { lat: number; lng: number }) => void;
}

export const useHealthcareStore = create<HealthcareState>()(
  persist(
    (set, get) => ({
      // Initial State
      userId: 'user1',
      userName: 'محمد',
      userLocation: null,
      walletBalance: 500,
      
      appointments: [],
      labBookings: [],
      pharmacyOrders: [],
      ambulanceRequests: [],
      notifications: [],
      ratings: [],
      pendingRatings: [],
      transactions: [],
      favoriteDoctors: [],
      favoriteClinics: [],
      cart: [],
      
      // Appointments
      addAppointment: (appointment) => set((state) => ({
        appointments: [...state.appointments, appointment]
      })),
      
      updateAppointment: (id, updates) => set((state) => ({
        appointments: state.appointments.map((apt) =>
          apt.id === id ? { ...apt, ...updates, updatedAt: new Date().toISOString() } : apt
        )
      })),
      
      cancelAppointment: (id) => set((state) => ({
        appointments: state.appointments.map((apt) =>
          apt.id === id ? { ...apt, status: 'cancelled', updatedAt: new Date().toISOString() } : apt
        )
      })),
      
      // Lab Bookings
      addLabBooking: (booking) => set((state) => ({
        labBookings: [...state.labBookings, booking]
      })),
      
      updateLabBooking: (id, updates) => set((state) => ({
        labBookings: state.labBookings.map((booking) =>
          booking.id === id ? { ...booking, ...updates } : booking
        )
      })),
      
      // Pharmacy Orders
      addPharmacyOrder: (order) => set((state) => ({
        pharmacyOrders: [...state.pharmacyOrders, order]
      })),
      
      updatePharmacyOrder: (id, updates) => set((state) => ({
        pharmacyOrders: state.pharmacyOrders.map((order) =>
          order.id === id ? { ...order, ...updates, updatedAt: new Date().toISOString() } : order
        )
      })),
      
      // Ambulance Requests
      addAmbulanceRequest: (request) => set((state) => ({
        ambulanceRequests: [...state.ambulanceRequests, request]
      })),
      
      updateAmbulanceRequest: (id, updates) => set((state) => ({
        ambulanceRequests: state.ambulanceRequests.map((req) =>
          req.id === id ? { ...req, ...updates } : req
        )
      })),
      
      // Notifications
      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications]
      })),
      
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        )
      })),
      
      clearNotifications: () => set({ notifications: [] }),
      
      // Ratings
      addRating: (rating) => set((state) => ({
        ratings: [...state.ratings, rating]
      })),
      
      addPendingRating: (rating) => set((state) => ({
        pendingRatings: [...state.pendingRatings, rating]
      })),
      
      removePendingRating: (serviceId) => set((state) => ({
        pendingRatings: state.pendingRatings.filter((r) => r.serviceId !== serviceId)
      })),
      
      // Wallet
      addTransaction: (transaction) => set((state) => ({
        transactions: [transaction, ...state.transactions]
      })),
      
      updateWalletBalance: (amount) => set((state) => ({
        walletBalance: state.walletBalance + amount
      })),
      
      // Favorites
      toggleFavoriteDoctor: (doctorId) => set((state) => ({
        favoriteDoctors: state.favoriteDoctors.includes(doctorId)
          ? state.favoriteDoctors.filter((id) => id !== doctorId)
          : [...state.favoriteDoctors, doctorId]
      })),
      
      toggleFavoriteClinic: (clinicId) => set((state) => ({
        favoriteClinics: state.favoriteClinics.includes(clinicId)
          ? state.favoriteClinics.filter((id) => id !== clinicId)
          : [...state.favoriteClinics, clinicId]
      })),
      
      // Cart
      addToCart: (medicationId, quantity = 1) => set((state) => {
        const existing = state.cart.find((item) => item.medicationId === medicationId);
        if (existing) {
          return {
            cart: state.cart.map((item) =>
              item.medicationId === medicationId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          };
        }
        return { cart: [...state.cart, { medicationId, quantity }] };
      }),
      
      removeFromCart: (medicationId) => set((state) => ({
        cart: state.cart.filter((item) => item.medicationId !== medicationId)
      })),
      
      updateCartQuantity: (medicationId, quantity) => set((state) => ({
        cart: state.cart.map((item) =>
          item.medicationId === medicationId ? { ...item, quantity } : item
        )
      })),
      
      clearCart: () => set({ cart: [] }),
      
      // Location
      setUserLocation: (location) => set({ userLocation: location }),
    }),
    {
      name: 'healthcare-store',
      partialize: (state) => ({
        appointments: state.appointments,
        labBookings: state.labBookings,
        pharmacyOrders: state.pharmacyOrders,
        notifications: state.notifications,
        ratings: state.ratings,
        pendingRatings: state.pendingRatings,
        transactions: state.transactions,
        favoriteDoctors: state.favoriteDoctors,
        favoriteClinics: state.favoriteClinics,
        cart: state.cart,
        walletBalance: state.walletBalance,
      })
    }
  )
);

// Helper function to trigger rating notification
export function triggerRatingNotification(
  serviceType: 'doctor' | 'clinic' | 'lab' | 'pharmacy' | 'ambulance',
  serviceId: string,
  serviceName: string
) {
  const store = useHealthcareStore.getState();
  
  // Add pending rating
  store.addPendingRating({ serviceType, serviceId, serviceName });
  
  // Add notification
  const notification = {
    id: `notif-${Date.now()}`,
    userId: store.userId,
    type: 'rating_request' as const,
    title: 'كيف كانت تجربتك؟',
    message: `قيم تجربتك مع ${serviceName}`,
    data: {
      serviceType,
      serviceId,
      actionUrl: `/patient/rate/${serviceType}/${serviceId}`
    },
    isRead: false,
    createdAt: new Date().toISOString()
  };
  
  store.addNotification(notification);
}
