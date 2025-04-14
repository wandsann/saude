import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";

interface AppointmentCardProps {
  id: number;
  doctorName: string;
  specialty: string;
  date: Date;
  time: string;
  status: "confirmed" | "pending" | "canceled";
  onViewDetails: (id: number) => void;
  onCancel?: (id: number) => void;
  onReschedule?: (id: number) => void;
  onConfirm?: (id: number) => void;
  delay?: number;
}

export function AppointmentCard({
  id,
  doctorName,
  specialty,
  date,
  time,
  status,
  onViewDetails,
  onCancel,
  onReschedule,
  onConfirm,
  delay = 0,
}: AppointmentCardProps) {
  const { t, language } = useLanguage();
  
  const formatDate = (date: Date) => {
    return format(date, "dd/MMM", { locale: language === "pt" ? ptBR : enUS });
  };
  
  const getStatusColor = () => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-amber-500";
      case "canceled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case "confirmed":
        return t("appointment.status.confirmed");
      case "pending":
        return t("appointment.status.pending");
      case "canceled":
        return t("appointment.status.canceled");
      default:
        return "";
    }
  };

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-5 duration-500 shadow-md" style={{ animationDelay: `${delay}ms` }}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <span className={cn("inline-block w-2 h-2 rounded-full mr-2", getStatusColor())}></span>
              <span className="text-sm">{getStatusText()}</span>
            </div>
            <h3 className="font-medium text-gray-900 mt-1">{doctorName}</h3>
            <p className="text-gray-500 text-sm mt-1">{specialty}</p>
          </div>
          <div className="text-right">
            <div className="text-gray-900 font-medium">{formatDate(date)}</div>
            <div className="text-gray-500 text-sm">{time}</div>
          </div>
        </div>
        
        <div className="flex justify-between mt-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary flex items-center"
            onClick={() => onViewDetails(id)}
          >
            <span className="material-icons text-sm mr-1">info</span>
            {t("appointment.details")}
          </Button>
          
          <div className="flex space-x-2">
            {status !== "canceled" && onCancel && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 flex items-center"
                onClick={() => onCancel(id)}
              >
                <span className="material-icons text-sm mr-1">close</span>
                {t("appointment.cancel")}
              </Button>
            )}
            
            {status !== "canceled" && onReschedule && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary flex items-center"
                onClick={() => onReschedule(id)}
              >
                <span className="material-icons text-sm mr-1">event</span>
                {t("appointment.reschedule")}
              </Button>
            )}
            
            {status === "pending" && onConfirm && (
              <Button 
                size="sm" 
                className="bg-green-600 text-white flex items-center rounded-full px-3 py-1 hover:bg-green-700"
                onClick={() => onConfirm(id)}
              >
                <span className="material-icons text-sm mr-1">check</span>
                {t("appointment.confirm")}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
