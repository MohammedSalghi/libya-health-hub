import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { WelcomeStep } from "@/components/onboarding/steps/WelcomeStep";
import { HowItWorksStep } from "@/components/onboarding/steps/HowItWorksStep";
import { BookingServicesStep } from "@/components/onboarding/steps/BookingServicesStep";
import { HealthRecordStep } from "@/components/onboarding/steps/HealthRecordStep";
import { AIAssistantStep } from "@/components/onboarding/steps/AIAssistantStep";
import { SecurityStep } from "@/components/onboarding/steps/SecurityStep";
import { LanguageSetupStep } from "@/components/onboarding/steps/LanguageSetupStep";
import { CompletionStep } from "@/components/onboarding/steps/CompletionStep";

const TOTAL_STEPS = 8;

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Save onboarding completion to localStorage
    localStorage.setItem("onboardingComplete", "true");
    navigate("/auth/login");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={handleNext} />;
      case 1:
        return <HowItWorksStep onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <BookingServicesStep onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <HealthRecordStep onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <AIAssistantStep onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <SecurityStep onNext={handleNext} onBack={handleBack} />;
      case 6:
        return <LanguageSetupStep onNext={handleNext} onBack={handleBack} />;
      case 7:
        return <CompletionStep onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout currentStep={currentStep} totalSteps={TOTAL_STEPS}>
      {renderStep()}
    </OnboardingLayout>
  );
}
