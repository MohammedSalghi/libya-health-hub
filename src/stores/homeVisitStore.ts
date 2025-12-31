// Home Visit Store - State Management for Home Visit Bookings
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HomeVisitBooking, HomeVisitProvider, HomeVisitDoctor } from '@/types/homeVisit';

interface HomeVisitState {
  // Bookings
  bookings: HomeVisitBooking[];
  addBooking: (booking: HomeVisitBooking) => void;
  updateBooking: (id: string, updates: Partial<HomeVisitBooking>) => void;
  cancelBooking: (id: string) => void;
  getBookingById: (id: string) => HomeVisitBooking | undefined;
  
  // Active booking flow
  selectedCity: 'طرابلس' | 'بنغازي' | null;
  selectedProvider: HomeVisitProvider | null;
  selectedDoctor: HomeVisitDoctor | null;
  selectedDate: string | null;
  selectedTime: string | null;
  homeAddress: {
    street: string;
    city: string;
    landmark?: string;
    lat?: number;
    lng?: number;
  } | null;
  notes: string;
  
  // Actions
  setCity: (city: 'طرابلس' | 'بنغازي') => void;
  setProvider: (provider: HomeVisitProvider | null) => void;
  setDoctor: (doctor: HomeVisitDoctor | null) => void;
  setDateTime: (date: string, time: string) => void;
  setHomeAddress: (address: HomeVisitState['homeAddress']) => void;
  setNotes: (notes: string) => void;
  resetFlow: () => void;
}

export const useHomeVisitStore = create<HomeVisitState>()(
  persist(
    (set, get) => ({
      // Initial State
      bookings: [],
      selectedCity: null,
      selectedProvider: null,
      selectedDoctor: null,
      selectedDate: null,
      selectedTime: null,
      homeAddress: null,
      notes: '',
      
      // Bookings
      addBooking: (booking) => set((state) => ({
        bookings: [...state.bookings, booking]
      })),
      
      updateBooking: (id, updates) => set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
        )
      })),
      
      cancelBooking: (id) => set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === id ? { ...b, status: 'cancelled', updatedAt: new Date().toISOString() } : b
        )
      })),
      
      getBookingById: (id) => {
        return get().bookings.find((b) => b.id === id);
      },
      
      // Flow Actions
      setCity: (city) => set({ selectedCity: city, selectedProvider: null, selectedDoctor: null }),
      
      setProvider: (provider) => set({ selectedProvider: provider, selectedDoctor: null }),
      
      setDoctor: (doctor) => set({ selectedDoctor: doctor }),
      
      setDateTime: (date, time) => set({ selectedDate: date, selectedTime: time }),
      
      setHomeAddress: (address) => set({ homeAddress: address }),
      
      setNotes: (notes) => set({ notes }),
      
      resetFlow: () => set({
        selectedCity: null,
        selectedProvider: null,
        selectedDoctor: null,
        selectedDate: null,
        selectedTime: null,
        homeAddress: null,
        notes: ''
      })
    }),
    {
      name: 'home-visit-store',
      partialize: (state) => ({
        bookings: state.bookings
      })
    }
  )
);
