import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  backTo?: string;
  rightAction?: React.ReactNode;
}

export function PageLayout({
  children,
  title,
  showBackButton = false,
  backTo,
  rightAction,
}: PageLayoutProps) {
  const [location, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      window.history.back();
    }
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen pb-16 md:pb-0 md:pl-64">
      {/* Sidebar navigation - hidden on mobile */}
      <Sidebar isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      
      {/* Top app bar - only visible on mobile */}
      <TopAppBar 
        title={title} 
        onMenuClick={toggleDrawer} 
        showBackButton={showBackButton}
        onBackClick={handleBack}
        rightAction={rightAction}
      />
      
      {/* Main content area */}
      <main className="p-4 md:p-6">
        {children}
      </main>
      
      {/* Bottom navigation - only visible on mobile */}
      <BottomNavigation />
    </div>
  );
}
