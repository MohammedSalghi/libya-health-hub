import { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";

interface PatientLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export const PatientLayout = ({ children, hideNav = false }: PatientLayoutProps) => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="max-w-lg mx-auto">
        {children}
      </main>
      {!hideNav && <BottomNavigation />}
    </div>
  );
};
