import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
}

export function OnboardingLayout({ children, currentStep, totalSteps }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 pt-6">
        <div className="flex gap-2 max-w-md mx-auto">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                index < currentStep
                  ? "gradient-primary"
                  : index === currentStep
                  ? "bg-primary/50"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col pt-16"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
