import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface MedicationCardProps {
  id: number;
  name: string;
  dosage: string;
  schedule: string;
  takenToday: number;
  totalDaily: number;
  isLate?: boolean;
  onMarkAsTaken?: (id: number) => void;
  delay?: number;
}

export function MedicationCard({
  id,
  name,
  dosage,
  schedule,
  takenToday,
  totalDaily,
  isLate = false,
  onMarkAsTaken,
  delay = 0,
}: MedicationCardProps) {
  const { t } = useLanguage();

  const isComplete = takenToday === totalDaily;
  
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-5 duration-500 shadow-md" style={{ animationDelay: `${delay}ms` }}>
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className="bg-primary-100 rounded-lg p-2 mr-3">
            <span className="material-icons text-primary">medication</span>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{name}</h3>
            <p className="text-gray-500 text-sm">{dosage}</p>
            <div className="flex items-center mt-2">
              <span className={cn(
                "material-icons text-sm mr-1",
                isLate ? "text-red-500" : "text-gray-500"
              )}>
                schedule
              </span>
              <span className={isLate ? "text-red-500 text-sm" : "text-gray-500 text-sm"}>
                {isLate ? t("medication.late") : schedule}
              </span>
            </div>
          </div>
          <div>
            <span className={cn(
              "inline-flex items-center justify-center w-8 h-8 rounded-full font-medium",
              isComplete ? "bg-green-100 text-green-600" : "bg-primary-100 text-primary"
            )}>
              {takenToday}/{totalDaily}
            </span>
          </div>
        </div>
        
        {(!isComplete && onMarkAsTaken) && (
          <div className="mt-3 flex justify-end">
            <Button 
              size="sm" 
              className="bg-primary text-white px-3 py-1 rounded-full flex items-center"
              onClick={() => onMarkAsTaken(id)}
            >
              <span className="material-icons text-sm mr-1">check</span>
              {t("medication.markAsTaken")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
