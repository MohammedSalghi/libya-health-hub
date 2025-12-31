import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ProfileSetup from "./pages/auth/ProfileSetup";
import Permissions from "./pages/auth/Permissions";

// Patient Pages
import PatientDashboard from "./pages/patient/Dashboard";
import PatientSearch from "./pages/patient/Search";
import DoctorProfile from "./pages/patient/DoctorProfile";
import ClinicProfile from "./pages/patient/ClinicProfile";
import Appointments from "./pages/patient/Appointments";
import Messages from "./pages/patient/Messages";
import Chat from "./pages/patient/Chat";
import Wallet from "./pages/patient/Wallet";
import Profile from "./pages/patient/Profile";
import HealthRecords from "./pages/patient/HealthRecords";
import AIAssistant from "./pages/patient/AIAssistant";
import Pharmacy from "./pages/patient/Pharmacy";
import Notifications from "./pages/patient/Notifications";
import Settings from "./pages/patient/Settings";
import Ambulance from "./pages/patient/Ambulance";
import VideoConsultation from "./pages/patient/VideoConsultation";
import LabBooking from "./pages/patient/LabBooking";
import HomeVisit from "./pages/patient/HomeVisit";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorSchedule from "./pages/doctor/Schedule";
import DoctorPatients from "./pages/doctor/Patients";
import DoctorPrescriptions from "./pages/doctor/Prescriptions";

// Dashboard Pages
import ClinicDashboard from "./pages/dashboard/ClinicDashboard";
import LabDashboard from "./pages/dashboard/LabDashboard";
import PharmacyDashboard from "./pages/dashboard/PharmacyDashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminFacilities from "./pages/admin/Facilities";
import AdminAnalytics from "./pages/admin/Analytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/verify-otp" element={<VerifyOTP />} />
          <Route path="/auth/profile-setup" element={<ProfileSetup />} />
          <Route path="/auth/permissions" element={<Permissions />} />
          
          {/* Patient Routes */}
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/patient/search" element={<PatientSearch />} />
          <Route path="/patient/doctor/:id" element={<DoctorProfile />} />
          <Route path="/patient/clinic/:id" element={<ClinicProfile />} />
          <Route path="/patient/appointments" element={<Appointments />} />
          <Route path="/patient/messages" element={<Messages />} />
          <Route path="/patient/chat/:id" element={<Chat />} />
          <Route path="/patient/wallet" element={<Wallet />} />
          <Route path="/patient/profile" element={<Profile />} />
          <Route path="/patient/health-records" element={<HealthRecords />} />
          <Route path="/patient/ai-assistant" element={<AIAssistant />} />
          <Route path="/patient/pharmacy" element={<Pharmacy />} />
          <Route path="/patient/notifications" element={<Notifications />} />
          <Route path="/patient/settings" element={<Settings />} />
          <Route path="/patient/services/ambulance" element={<Ambulance />} />
          <Route path="/patient/video-consultation" element={<VideoConsultation />} />
          <Route path="/patient/video-booking/:id" element={<DoctorProfile />} />
          <Route path="/patient/lab/:id" element={<LabBooking />} />
          <Route path="/patient/home-visit" element={<HomeVisit />} />

          {/* Doctor Routes */}
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/doctor/schedule" element={<DoctorSchedule />} />
          <Route path="/doctor/patients" element={<DoctorPatients />} />
          <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />

          {/* Dashboard Routes */}
          <Route path="/clinic" element={<ClinicDashboard />} />
          <Route path="/lab" element={<LabDashboard />} />
          <Route path="/pharmacy-dashboard" element={<PharmacyDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/facilities" element={<AdminFacilities />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
