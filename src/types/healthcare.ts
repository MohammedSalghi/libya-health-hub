// Core Healthcare Types - World-Class Healthcare Super App

// ============= Base Types =============
export interface Location {
  lat: number;
  lng: number;
  address: string;
  city: string;
  district?: string;
}

export interface WorkingHours {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

export interface Insurance {
  id: string;
  name: string;
  logo?: string;
  coveragePercentage: number;
}

export interface Rating {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  review?: string;
  date: string;
  serviceType: 'doctor' | 'clinic' | 'lab' | 'pharmacy' | 'ambulance';
  serviceId: string;
  verified: boolean;
}

export interface Fee {
  type: 'consultation' | 'video' | 'urgent' | 'home_visit' | 'lab_test' | 'medication' | 'ambulance' | 'platform';
  amount: number;
  currency: string;
  description?: string;
}

// ============= Clinic Types =============
export interface Clinic {
  id: string;
  name: string;
  type: 'clinic' | 'hospital' | 'medical_center';
  description?: string;
  location: Location;
  phone: string;
  email?: string;
  workingHours: WorkingHours[];
  services: string[];
  specialties: string[];
  insurances: Insurance[];
  images: string[];
  rating: number;
  reviewCount: number;
  doctorCount: number;
  isVerified: boolean;
  isOpen: boolean;
  fees: Fee[];
}

// ============= Doctor Types =============
export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  subspecialties?: string[];
  clinicId: string;
  clinicName: string;
  qualifications: string[];
  certifications: string[];
  yearsExperience: number;
  languages: string[];
  insurances: Insurance[];
  bio: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  patientCount: number;
  fees: {
    consultation: number;
    video: number;
    urgent: number;
    homeVisit: number;
  };
  availability: DoctorAvailability[];
  services: string[];
  acceptsVideo: boolean;
  acceptsHomeVisit: boolean;
  gender: 'male' | 'female';
  isVerified: boolean;
  isAvailable: boolean;
}

export interface DoctorAvailability {
  date: string;
  slots: TimeSlot[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
  type: 'regular' | 'urgent' | 'video';
}

// ============= Appointment Types =============
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctor: Doctor;
  clinicId: string;
  clinic: Clinic;
  date: string;
  time: string;
  type: 'in_person' | 'video' | 'home_visit';
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  reason?: string;
  notes?: string;
  fees: Fee[];
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'partial';
  rating?: Rating;
  ratingPromptSent: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============= Lab Types =============
export interface Lab {
  id: string;
  name: string;
  location: Location;
  phone: string;
  workingHours: WorkingHours[];
  services: LabTest[];
  insurances: Insurance[];
  images: string[];
  rating: number;
  reviewCount: number;
  offersHomeCollection: boolean;
  homeCollectionFee: number;
  isOpen: boolean;
}

export interface LabTest {
  id: string;
  name: string;
  nameEn?: string;
  category: string;
  description?: string;
  preparationInstructions?: string;
  resultTime: string;
  price: number;
  insuranceCoverage?: number;
  homeCollectionAvailable: boolean;
}

export interface LabBooking {
  id: string;
  patientId: string;
  labId: string;
  lab: Lab;
  tests: LabTest[];
  date: string;
  time: string;
  type: 'in_lab' | 'home_collection';
  address?: Location;
  status: 'pending' | 'confirmed' | 'sample_collected' | 'processing' | 'completed' | 'cancelled';
  results?: LabResult[];
  fees: Fee[];
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  rating?: Rating;
  ratingPromptSent: boolean;
  createdAt: string;
}

export interface LabResult {
  testId: string;
  testName: string;
  result: string;
  unit?: string;
  referenceRange?: string;
  status: 'normal' | 'abnormal' | 'critical';
  pdfUrl?: string;
  aiExplanation?: string;
}

// ============= Pharmacy Types =============
export interface Pharmacy {
  id: string;
  name: string;
  location: Location;
  phone: string;
  workingHours: WorkingHours[];
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  offersDelivery: boolean;
  deliveryFee: number;
  deliveryTime: string;
  insurances: Insurance[];
}

export interface Medication {
  id: string;
  name: string;
  nameEn?: string;
  genericName?: string;
  manufacturer: string;
  dosage: string;
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'drops' | 'inhaler';
  price: number;
  inStock: boolean;
  requiresPrescription: boolean;
  alternatives?: string[];
  sideEffects?: string[];
  interactions?: string[];
}

export interface PharmacyOrder {
  id: string;
  patientId: string;
  pharmacyId: string;
  pharmacy: Pharmacy;
  items: OrderItem[];
  prescriptionImage?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: Location;
  fees: Fee[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'cash' | 'wallet' | 'card';
  paymentStatus: 'pending' | 'paid' | 'cod';
  estimatedDelivery?: string;
  rating?: Rating;
  ratingPromptSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  medicationId: string;
  medication: Medication;
  quantity: number;
  price: number;
}

// ============= Ambulance Types =============
export interface AmbulanceService {
  id: string;
  name: string;
  phone: string;
  types: AmbulanceType[];
  rating: number;
  reviewCount: number;
  averageResponseTime: number;
  isAvailable: boolean;
}

export interface AmbulanceType {
  id: string;
  name: string;
  description: string;
  baseFee: number;
  perKmFee: number;
  equipment: string[];
  image?: string;
}

export interface AmbulanceRequest {
  id: string;
  patientId: string;
  serviceId: string;
  service: AmbulanceService;
  ambulanceType: AmbulanceType;
  pickupLocation: Location;
  destinationLocation?: Location;
  status: 'requested' | 'dispatched' | 'en_route' | 'arrived' | 'transporting' | 'completed' | 'cancelled';
  emergencyType: 'critical' | 'urgent' | 'standard';
  notes?: string;
  estimatedArrival?: string;
  actualArrival?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  distance?: number;
  fees: Fee[];
  totalAmount: number;
  paymentStatus: 'pending' | 'paid';
  rating?: Rating;
  ratingPromptSent: boolean;
  createdAt: string;
}

// ============= Video Consultation Types =============
export interface VideoSession {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled';
  startTime?: string;
  endTime?: string;
  duration?: number;
  recordingUrl?: string;
  aiSummary?: string;
  prescription?: Prescription;
  notes?: string;
}

export interface Prescription {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  date: string;
  medications: PrescriptionItem[];
  notes?: string;
  validUntil: string;
}

export interface PrescriptionItem {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

// ============= Notification Types =============
export interface Notification {
  id: string;
  userId: string;
  type: 'appointment_reminder' | 'appointment_confirmed' | 'lab_result' | 'medication_ready' | 'delivery_update' | 'ambulance_update' | 'rating_request' | 'payment' | 'general';
  title: string;
  message: string;
  data?: {
    serviceType?: 'doctor' | 'clinic' | 'lab' | 'pharmacy' | 'ambulance' | 'video';
    serviceId?: string;
    actionUrl?: string;
  };
  isRead: boolean;
  createdAt: string;
}

// ============= Search & Filter Types =============
export interface SearchFilters {
  query?: string;
  type?: 'doctor' | 'clinic' | 'lab' | 'pharmacy';
  specialty?: string;
  location?: Location;
  maxDistance?: number;
  minRating?: number;
  maxPrice?: number;
  insurance?: string;
  availability?: 'now' | 'today' | 'this_week';
  gender?: 'male' | 'female';
  acceptsVideo?: boolean;
  sortBy?: 'distance' | 'rating' | 'price' | 'availability';
}

// ============= Wallet & Payment Types =============
export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  serviceType?: 'doctor' | 'lab' | 'pharmacy' | 'ambulance';
  serviceId?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface PlatformFee {
  type: string;
  percentage?: number;
  fixedAmount?: number;
  description: string;
}
