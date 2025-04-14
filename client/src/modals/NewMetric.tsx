import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface NewMetricProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function NewMetric({ open, onClose, onSave }: NewMetricProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [metricType, setMetricType] = useState("heart-rate");
  const [metricValue, setMetricValue] = useState("");
  const [metricUnit, setMetricUnit] = useState("bpm");
  const [metricDate, setMetricDate] = useState(
    format(new Date(), "yyyy-MM-dd'T'HH:mm")
  );
  const [notes, setNotes] = useState("");
  
  // Reset form when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
  
  const handleMetricTypeChange = (value: string) => {
    setMetricType(value);
    
    // Set the appropriate unit based on metric type
    switch (value) {
      case "heart-rate":
        setMetricUnit("bpm");
        break;
      case "blood-pressure":
        setMetricUnit("mmHg");
        break;
      case "weight":
        setMetricUnit("kg");
        break;
      case "glucose":
        setMetricUnit("mg/dL");
        break;
      case "temperature":
        setMetricUnit("°C");
        break;
      default:
        setMetricUnit("");
    }
  };
  
  const validateForm = () => {
    if (!metricType) {
      toast({
        variant: "destructive",
        title: t("modals.error"),
        description: t("modals.selectMetricType"),
      });
      return false;
    }
    
    if (!metricValue) {
      toast({
        variant: "destructive",
        title: t("modals.error"),
        description: t("modals.enterValue"),
      });
      return false;
    }
    
    // Validate blood pressure format (e.g., 120/80)
    if (metricType === "blood-pressure" && !/^\d+\/\d+$/.test(metricValue)) {
      toast({
        variant: "destructive",
        title: t("modals.error"),
        description: t("modals.invalidBloodPressure"),
      });
      return false;
    }
    
    // Validate other metrics are numbers
    if (metricType !== "blood-pressure" && isNaN(Number(metricValue))) {
      toast({
        variant: "destructive",
        title: t("modals.error"),
        description: t("modals.invalidNumber"),
      });
      return false;
    }
    
    if (!metricDate) {
      toast({
        variant: "destructive",
        title: t("modals.error"),
        description: t("modals.selectDateTime"),
      });
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const metricData = {
      type: metricType,
      value: metricValue,
      unit: metricUnit,
      timestamp: new Date(metricDate).toISOString(),
      notes: notes || undefined,
    };
    
    onSave(metricData);
    
    // Reset form
    setMetricValue("");
    setNotes("");
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("modals.newMetric.title")}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="metric-type">{t("modals.newMetric.type")}</Label>
            <Select 
              value={metricType} 
              onValueChange={handleMetricTypeChange}
            >
              <SelectTrigger id="metric-type">
                <SelectValue placeholder={t("modals.newMetric.selectType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="heart-rate">{t("metrics.heartRate")}</SelectItem>
                <SelectItem value="blood-pressure">{t("metrics.bloodPressure")}</SelectItem>
                <SelectItem value="weight">{t("metrics.weight")}</SelectItem>
                <SelectItem value="glucose">{t("metrics.glucose")}</SelectItem>
                <SelectItem value="temperature">{t("metrics.temperature")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="metric-value">{t("modals.newMetric.value")}</Label>
            <div className="flex items-center">
              <Input
                id="metric-value"
                value={metricValue}
                onChange={(e) => setMetricValue(e.target.value)}
                placeholder={metricType === "blood-pressure" ? "120/80" : "0"}
                className="flex-1"
              />
              <span className="ml-2 text-gray-500 min-w-16">{metricUnit}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="metric-date">{t("modals.newMetric.date")}</Label>
            <Input
              id="metric-date"
              type="datetime-local"
              value={metricDate}
              onChange={(e) => setMetricDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="metric-notes">{t("modals.newMetric.notes")}</Label>
            <Textarea
              id="metric-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("modals.newMetric.notesPlaceholder")}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("modals.cancel")}
            </Button>
            <Button type="submit">
              {t("modals.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
