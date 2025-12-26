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
import Appointments from "./pages/patient/Appointments";
import Messages from "./pages/patient/Messages";
import Chat from "./pages/patient/Chat";

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
          <Route path="/patient/appointments" element={<Appointments />} />
          <Route path="/patient/messages" element={<Messages />} />
          <Route path="/patient/chat/:id" element={<Chat />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
