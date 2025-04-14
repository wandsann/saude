import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { MedicationCard } from "@/components/ui/health/MedicationCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Medication {
  id: number;
  name: string;
  dosage: string;
  instructions: string;
  frequency: {
    times: number;
    period: string;
    schedule: string[];
  };
  startDate: string;
  endDate?: string;
  status: string;
  takenToday: number;
  totalDaily: number;
  isLate?: boolean;
}

interface MedicationListProps {
  medications: Medication[];
  onAddNew?: () => void;
  onMarkAsTaken?: (id: number) => void;
}

export function MedicationList({ medications, onAddNew, onMarkAsTaken }: MedicationListProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [localMedications, setLocalMedications] = useState(medications);
  
  const handleMarkAsTaken = async (id: number) => {
    try {
      // In a real implementation, this would call an API to update the medication
      // For now, we'll update the local state to simulate the API call
      setLocalMedications(prev =>
        prev.map(med =>
          med.id === id
            ? { ...med, takenToday: Math.min(med.takenToday + 1, med.totalDaily), isLate: false }
            : med
        )
      );
      
      // Call the parent component's handler if provided
      if (onMarkAsTaken) {
        onMarkAsTaken(id);
      }
      
      toast({
        title: t("medication.markAsTaken"),
        description: t("medication.name"),
      });
    } catch (error) {
      console.error("Error marking medication as taken:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not mark medication as taken",
      });
    }
  };
  
  const getScheduleString = (med: Medication) => {
    if (med.frequency.schedule.length === 0) return "";
    
    return med.frequency.schedule
      .map(time => t(`medication.${time.toLowerCase()}`))
      .join(" and ");
  };
  
  // Show empty state if no medications
  if (medications.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="material-icons text-4xl text-gray-400">medication</span>
        <h3 className="mt-2 text-gray-500">{t("medication.noMedications")}</h3>
        {onAddNew && (
          <Button 
            onClick={onAddNew}
            className="mt-4"
          >
            <span className="material-icons mr-2">add</span>
            {t("medication.addNew")}
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {localMedications.map((medication, index) => (
        <MedicationCard
          key={medication.id}
          id={medication.id}
          name={medication.name}
          dosage={medication.dosage}
          schedule={getScheduleString(medication)}
          takenToday={medication.takenToday}
          totalDaily={medication.totalDaily}
          isLate={medication.isLate}
          onMarkAsTaken={
            medication.takenToday < medication.totalDaily ? handleMarkAsTaken : undefined
          }
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
            {t("medication.addNew")}
          </Button>
        </div>
      )}
    </div>
  );
}
