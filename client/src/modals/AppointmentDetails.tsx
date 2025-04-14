import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";

interface AppointmentDetailsProps {
  open: boolean;
  onClose: () => void;
  appointment: {
    doctorName: string;
    specialty: string;
    date: Date;
    time: string;
    location: string;
    address?: string;
    notes?: string;
  };
}

export function AppointmentDetails({ open, onClose, appointment }: AppointmentDetailsProps) {
  const { t, language } = useLanguage();
  
  const formatDate = (date: Date) => {
    const locale = language === "pt" ? ptBR : enUS;
    return format(date, "PPP", { locale });
  };
  
  const handleAddToCalendar = () => {
    // In a real app, this would create a calendar event using the device's calendar API
    // For now, we'll just log the action
    console.log("Adding to calendar:", appointment);
    
    // This could be a link to Google Calendar or other calendar service
    const title = `${t("appointment.with")} ${appointment.doctorName}`;
    const details = `${appointment.specialty}\n${appointment.location}\n${appointment.address || ""}\n${appointment.notes || ""}`;
    const startTime = new Date(appointment.date);
    const [hours, minutes] = appointment.time.split(":");
    startTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);
    
    // Create a Google Calendar link
    const googleCalendarUrl = new URL("https://calendar.google.com/calendar/render");
    googleCalendarUrl.searchParams.append("action", "TEMPLATE");
    googleCalendarUrl.searchParams.append("text", title);
    googleCalendarUrl.searchParams.append("details", details);
    googleCalendarUrl.searchParams.append("location", appointment.location);
    googleCalendarUrl.searchParams.append("dates", `${startTime.toISOString().replace(/-|:|\.\d+/g, "")}/${endTime.toISOString().replace(/-|:|\.\d+/g, "")}`);
    
    window.open(googleCalendarUrl.toString(), "_blank");
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("modals.appointmentDetails.title")}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div>
            <h4 className="text-sm text-gray-500 mb-1">{t("appointment.specialty")}</h4>
            <p className="text-gray-900">{appointment.specialty}</p>
          </div>
          
          <div>
            <h4 className="text-sm text-gray-500 mb-1">{t("appointment.doctor")}</h4>
            <p className="text-gray-900">{appointment.doctorName}</p>
          </div>
          
          <div>
            <h4 className="text-sm text-gray-500 mb-1">{t("modals.appointmentDetails.dateTime")}</h4>
            <p className="text-gray-900">{formatDate(appointment.date)}, {appointment.time}</p>
          </div>
          
          <div>
            <h4 className="text-sm text-gray-500 mb-1">{t("appointment.location")}</h4>
            <p className="text-gray-900">{appointment.location}</p>
            {appointment.address && (
              <p className="text-gray-500 text-sm">{appointment.address}</p>
            )}
          </div>
          
          {appointment.notes && (
            <div>
              <h4 className="text-sm text-gray-500 mb-1">{t("appointment.notes")}</h4>
              <p className="text-gray-900">{appointment.notes}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("modals.close")}
          </Button>
          <Button onClick={handleAddToCalendar}>
            {t("appointment.addToCalendar")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
