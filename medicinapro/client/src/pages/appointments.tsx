import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarView } from "@/components/ui/calendar/CalendarView";
import { AppointmentList } from "@/components/ui/health/AppointmentList";
import { AppointmentDetails } from "@/modals/AppointmentDetails";
import { useModal } from "@/hooks/use-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Appointments() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { openModal, currentModal, closeModal, modalProps } = useModal();
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  
  // Fetch appointments data
  const { data: appointments, isLoading } = useQuery({
    queryKey: ["/api/appointments"],
  });
  
  // Filter appointments based on active tab
  const filteredAppointments = appointments?.filter(appointment => {
    if (activeTab === "upcoming") {
      return new Date(appointment.date) >= new Date() && appointment.status !== "canceled";
    } else if (activeTab === "past") {
      return new Date(appointment.date) < new Date() && appointment.status !== "canceled";
    } else if (activeTab === "canceled") {
      return appointment.status === "canceled";
    }
    return true;
  }) || [];
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Handle new appointment
  const handleNewAppointment = () => {
    toast({
      title: t("appointment.new"),
      description: "This functionality is not implemented in this version",
    });
  };
  
  // Handle calendar date selection
  const handleDateSelect = (date: Date) => {
    // Find appointments on the selected date
    const appointmentsOnDate = appointments?.filter(
      appointment => new Date(appointment.date).toDateString() === date.toDateString()
    ) || [];
    
    if (appointmentsOnDate.length > 0) {
      // Show a list of appointments for that day
      toast({
        title: `${appointmentsOnDate.length} ${appointmentsOnDate.length === 1 ? t("appointment.single") : t("appointment.multiple")}`,
        description: `${format(date, "PPPP", { locale: language === "pt" ? ptBR : enUS })}`,
      });
    } else {
      // No appointments on this date
      toast({
        title: t("appointment.noAppointmentsOnDate"),
        description: "Select this date to schedule a new appointment",
      });
    }
  };
  
  return (
    <PageLayout title={t("navigation.appointments")}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-medium text-gray-900 mb-2 md:mb-0">{t("navigation.appointments")}</h1>
        <Button 
          className="flex items-center justify-center"
          onClick={handleNewAppointment}
        >
          <span className="material-icons mr-2">add</span>
          {t("appointment.new")}
        </Button>
      </div>
      
      {/* Filter Tabs */}
      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList>
          <TabsTrigger value="upcoming">{t("appointment.upcoming")}</TabsTrigger>
          <TabsTrigger value="past">{t("appointment.past")}</TabsTrigger>
          <TabsTrigger value="canceled">{t("appointment.canceled")}</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Calendar View */}
      <div className="mb-6">
        {isLoading ? (
          <Skeleton className="h-64" />
        ) : (
          <CalendarView
            events={appointments?.map(appointment => ({
              date: new Date(appointment.date),
              type: "appointment",
              status: appointment.status
            }))}
            onDateSelect={handleDateSelect}
          />
        )}
      </div>
      
      {/* Appointment List */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-3">
          {activeTab === "upcoming" ? t("appointment.upcoming") : 
           activeTab === "past" ? t("appointment.past") : 
           t("appointment.canceled")}
        </h2>
        
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        ) : (
          <AppointmentList 
            appointments={filteredAppointments.map(appointment => ({
              id: appointment.id,
              doctorName: appointment.doctorName,
              specialty: appointment.specialty,
              date: new Date(appointment.date),
              time: appointment.time,
              status: appointment.status,
              location: appointment.location,
              address: appointment.address,
              notes: appointment.notes
            }))}
            onAddNew={handleNewAppointment}
          />
        )}
      </div>
      
      {/* Modal for appointment details */}
      {currentModal === "appointmentDetails" && modalProps?.appointment && (
        <AppointmentDetails
          open={true}
          onClose={closeModal}
          appointment={modalProps.appointment}
        />
      )}
    </PageLayout>
  );
}
