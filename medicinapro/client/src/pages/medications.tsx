import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicationList } from "@/components/ui/health/MedicationList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Medications() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("active");
  
  // Fetch medications data
  const { data: medications, isLoading } = useQuery({
    queryKey: ["/api/medications"],
  });
  
  // Filter medications based on active tab
  const filteredMedications = medications?.filter(medication => {
    if (activeTab === "active") {
      return medication.status === "active";
    } else if (activeTab === "completed") {
      return medication.status === "completed";
    }
    return true;
  }) || [];
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Handle new medication
  const handleNewMedication = () => {
    toast({
      title: t("medication.addNew"),
      description: "This functionality is not implemented in this version",
    });
  };
  
  // Handle mark as taken
  const handleMarkAsTaken = (id: number) => {
    // In a real app, this would call an API to update the medication
    console.log("Mark medication as taken:", id);
  };
  
  return (
    <PageLayout title={t("navigation.medications")}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-medium text-gray-900 mb-2 md:mb-0">{t("navigation.medications")}</h1>
        <Button 
          className="flex items-center justify-center"
          onClick={handleNewMedication}
        >
          <span className="material-icons mr-2">add</span>
          {t("medication.addNew")}
        </Button>
      </div>
      
      {/* Filter Tabs */}
      <Tabs defaultValue="active" value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList>
          <TabsTrigger value="active">{t("medication.active")}</TabsTrigger>
          <TabsTrigger value="completed">{t("medication.completed")}</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Medication Schedule Summary */}
      <div className="mb-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">{t("medication.schedule")}</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="material-icons text-amber-500 mr-2">wb_sunny</span>
                    <span className="text-gray-900">{t("medication.morning")}</span>
                  </div>
                  <span className="text-gray-500 text-sm">8:00 AM</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="material-icons text-blue-500 mr-2">wb_twilight</span>
                    <span className="text-gray-900">{t("medication.afternoon")}</span>
                  </div>
                  <span className="text-gray-500 text-sm">14:00 PM</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="material-icons text-indigo-500 mr-2">nightlight</span>
                    <span className="text-gray-900">{t("medication.evening")}</span>
                  </div>
                  <span className="text-gray-500 text-sm">20:00 PM</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Medication List */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-3">
          {activeTab === "active" ? t("medication.active") : t("medication.completed")}
        </h2>
        
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        ) : (
          <MedicationList 
            medications={filteredMedications.map(medication => {
              // Convert frequency object to a more usable format for the UI
              const frequency = typeof medication.frequency === 'string' 
                ? JSON.parse(medication.frequency) 
                : medication.frequency;
              
              return {
                id: medication.id,
                name: medication.name,
                dosage: medication.dosage,
                instructions: medication.instructions,
                frequency: frequency,
                startDate: medication.startDate,
                endDate: medication.endDate,
                status: medication.status,
                // These would come from a different endpoint in a real app
                takenToday: activeTab === "active" ? Math.floor(Math.random() * (frequency.times + 1)) : frequency.times,
                totalDaily: frequency.times,
                isLate: activeTab === "active" && Math.random() > 0.7
              };
            })}
            onAddNew={handleNewMedication}
            onMarkAsTaken={handleMarkAsTaken}
          />
        )}
      </div>
    </PageLayout>
  );
}
