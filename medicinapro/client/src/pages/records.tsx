import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Records() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("diagnosis");
  
  // Fetch medical records data
  const { data: records, isLoading } = useQuery({
    queryKey: ["/api/medical-records"],
  });
  
  // Filter records based on active tab
  const filteredRecords = records?.filter(record => record.type === activeTab) || [];
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Handle add new record
  const handleAddRecord = () => {
    toast({
      title: t("records.addNew"),
      description: "This functionality is not implemented in this version",
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "PP", { locale: language === "pt" ? ptBR : enUS });
  };
  
  return (
    <PageLayout title={t("navigation.records")}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-medium text-gray-900 mb-2 md:mb-0">{t("records.medical")}</h1>
        <Button 
          className="flex items-center justify-center"
          onClick={handleAddRecord}
        >
          <span className="material-icons mr-2">add</span>
          {t("records.addNew")}
        </Button>
      </div>
      
      {/* Filter Tabs */}
      <Tabs defaultValue="diagnosis" value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList>
          <TabsTrigger value="diagnosis">{t("records.diagnosis")}</TabsTrigger>
          <TabsTrigger value="procedure">{t("records.procedures")}</TabsTrigger>
          <TabsTrigger value="note">{t("records.notes")}</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Records List */}
      <div>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-8">
            <span className="material-icons text-4xl text-gray-400">folder</span>
            <h3 className="mt-2 text-gray-500">{t("records.noRecords")}</h3>
            <Button 
              onClick={handleAddRecord}
              className="mt-4"
            >
              <span className="material-icons mr-2">add</span>
              {t("records.addNew")}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record, index) => (
              <Card key={record.id} className="shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <div className="border-l-4 border-primary p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{record.title}</h3>
                        <p className="text-gray-500 text-sm mt-1">
                          {record.doctorName && (
                            <span className="flex items-center">
                              <span className="material-icons text-sm mr-1">person</span>
                              {record.doctorName}
                            </span>
                          )}
                          {record.institution && (
                            <span className="flex items-center mt-1">
                              <span className="material-icons text-sm mr-1">location_on</span>
                              {record.institution}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900 font-medium">{formatDate(record.date)}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-gray-700">{record.description}</p>
                    </div>
                    {record.attachments && record.attachments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center text-primary">
                          <span className="material-icons text-sm mr-1">attach_file</span>
                          <span className="text-sm">{record.attachments.length} {t("records.attachments")}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="mt-4 text-center">
              <Button 
                onClick={handleAddRecord}
                variant="outline"
                className="w-full md:w-auto"
              >
                <span className="material-icons mr-2">add</span>
                {t("records.addNew")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
