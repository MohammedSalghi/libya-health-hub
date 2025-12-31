// Home Visit Types - Doctor Home Visit Service

export interface HomeVisitProvider {
  id: string;
  name: string;
  city: 'طرابلس' | 'بنغازي';
  type: 'hospital' | 'clinic' | 'company';
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  description: string;
  logo?: string;
  specialties: string[];
  priceRange: {
    min: number;
    max: number;
  };
  workingHours: string;
  isAvailable: boolean;
  responseTime: string;
  doctors: string[]; // Doctor IDs who work with this provider
}

export interface HomeVisitDoctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  homeVisitFee: number;
  providerId: string;
  providerName: string;
  avatar?: string;
  yearsExperience: number;
  isAvailable: boolean;
  availableSlots: HomeVisitSlot[];
}

export interface HomeVisitSlot {
  date: string;
  time: string;
  available: boolean;
}

export interface HomeVisitBooking {
  id: string;
  patientId: string;
  patientName: string;
  providerId: string;
  provider: HomeVisitProvider;
  doctorId: string;
  doctor: HomeVisitDoctor;
  date: string;
  time: string;
  address: {
    street: string;
    city: string;
    landmark?: string;
    lat?: number;
    lng?: number;
  };
  notes?: string;
  status: 'pending' | 'confirmed' | 'provider_accepted' | 'doctor_en_route' | 'in_progress' | 'completed' | 'cancelled';
  fees: {
    consultationFee: number;
    visitFee: number;
    platformFee: number;
    total: number;
  };
  paymentMethod: 'wallet' | 'libyan_pay' | 'ebank' | 'misrbank' | 'cash';
  paymentStatus: 'pending' | 'paid' | 'cod';
  transactionId?: string;
  doctorPhone?: string;
  estimatedArrival?: string;
  rating?: {
    score: number;
    review?: string;
    date: string;
  };
  createdAt: string;
  updatedAt: string;
}
