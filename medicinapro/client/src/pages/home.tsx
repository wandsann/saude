import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HealthMetricCard } from "@/components/ui/health/HealthMetricCard";
import { AppointmentList } from "@/components/ui/health/AppointmentList";
import { MedicationList } from "@/components/ui/health/MedicationList";
import { AchievementCard } from "@/components/ui/health/AchievementCard";
import { AppointmentDetails } from "@/modals/AppointmentDetails";
import { useModal } from "@/hooks/use-modal";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardRouter from "@/components/dashboards/DashboardRouter";

export default function Home() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { openModal, currentModal, closeModal, modalProps } = useModal();
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  
  // Fetch dashboard data
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/dashboard"],
  });
  
  // Update selected appointment when modal props change
  useEffect(() => {
    if (currentModal === "appointmentDetails" && modalProps?.appointment) {
      setSelectedAppointment(modalProps.appointment);
    }
  }, [currentModal, modalProps]);
  
  const handleViewAllAppointments = () => {
    navigate("/appointments");
  };
  
  const handleViewAllMedications = () => {
    navigate("/medications");
  };
  
  const handleViewAllAchievements = () => {
    // This would navigate to an achievements page in a real app
    console.log("View all achievements");
  };
  
  // Handle loading and error states
  if (error) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <span className="material-icons text-red-500 text-4xl mb-2">error</span>
          <h2 className="text-xl font-medium text-gray-900 mb-1">Error</h2>
          <p className="text-gray-500 mb-4">Failed to load dashboard data</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      {/* Verificar se o usuário está autenticado */}
      {user ? (
        /* Renderizar o dashboard baseado no papel (role) do usuário */
        <DashboardRouter />
      ) : (
        /* Exibir conteúdo padrão para usuários não autenticados */
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="text-center mb-8">
            <div className="inline-block p-4 rounded-full bg-blue-100 mb-4">
              <span className="material-icons text-4xl text-primary">health_and_safety</span>
            </div>
            <h1 className="text-3xl font-medium text-gray-900 mb-2">{t("app.name")}</h1>
            <p className="text-gray-500 mb-6">{t("app.tagline")}</p>
            <Button onClick={() => navigate("/login")} className="px-8">
              {t("auth.login")}
            </Button>
          </div>
        </div>
      )}
      
      {/* Modal for appointment details */}
      {currentModal === "appointmentDetails" && selectedAppointment && (
        <AppointmentDetails
          open={currentModal === "appointmentDetails"}
          onClose={closeModal}
          appointment={selectedAppointment}
        />
      )}
    </PageLayout>
  );
}
