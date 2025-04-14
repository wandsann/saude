import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AppointmentCard } from "@/components/ui/health/AppointmentCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useModal } from "@/hooks/use-modal";

interface Appointment {
  id: number;
  doctorName: string;
  specialty: string;
  date: Date;
  time: string;
  status: "confirmed" | "pending" | "canceled";
  location: string;
  address?: string;
  notes?: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
  onAddNew?: () => void;
  emptyMessage?: string;
}

export function AppointmentList({ 
  appointments, 
  onAddNew,
  emptyMessage 
}: AppointmentListProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { openModal } = useModal();
  const [localAppointments, setLocalAppointments] = useState(appointments);
  
  const handleViewDetails = (id: number) => {
    const appointment = localAppointments.find(a => a.id === id);
    if (appointment) {
      openModal("appointmentDetails", { appointment });
    }
  };
  
  const handleCancelAppointment = (id: number) => {
    // In a real app, this would call an API to cancel the appointment
    setLocalAppointments(prev =>
      prev.map(app =>
        app.id === id ? { ...app, status: "canceled" as const } : app
      )
    );
    
    toast({
      title: t("appointment.cancelSuccess"),
      description: t("appointment.cancelDescription"),
    });
  };
  
  const handleRescheduleAppointment = (id: number) => {
    // In a real app, this would open a reschedule dialog/form
    toast({
      title: t("appointment.reschedule"),
      description: "Functionality not implemented in this version",
    });
  };
  
  const handleConfirmAppointment = (id: number) => {
    // In a real app, this would call an API to confirm the appointment
    setLocalAppointments(prev =>
      prev.map(app =>
        app.id === id ? { ...app, status: "confirmed" as const } : app
      )
    );
    
    toast({
      title: t("appointment.confirmSuccess"),
      description: t("appointment.confirmDescription"),
    });
  };
  
  // Show empty state if no appointments
  if (localAppointments.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="material-icons text-4xl text-gray-400">event</span>
        <h3 className="mt-2 text-gray-500">{emptyMessage || t("appointment.noAppointments")}</h3>
        {onAddNew && (
          <Button 
            onClick={onAddNew}
            className="mt-4"
          >
            <span className="material-icons mr-2">add</span>
            {t("appointment.new")}
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {localAppointments.map((appointment, index) => (
        <AppointmentCard
          key={appointment.id}
          id={appointment.id}
          doctorName={appointment.doctorName}
          specialty={appointment.specialty}
          date={appointment.date}
          time={appointment.time}
          status={appointment.status}
          onViewDetails={handleViewDetails}
          onCancel={appointment.status !== "canceled" ? handleCancelAppointment : undefined}
          onReschedule={appointment.status !== "canceled" ? handleRescheduleAppointment : undefined}
          onConfirm={appointment.status === "pending" ? handleConfirmAppointment : undefined}
          delay={index * 100}
        />
      ))}
      
      {onAddNew && (
        <div className="mt-4 text-center">
          <Button 
            onClick={onAddNew}
            variant="outline"
            className="w-full"
          >
            <span className="material-icons mr-2">add</span>
            {t("appointment.new")}
          </Button>
        </div>
      )}
    </div>
  );
}
