import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Exams() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");
  
  // Fetch medical exams data
  const { data: exams, isLoading } = useQuery({
    queryKey: ["/api/medical-exams"],
  });
  
  // Filter exams based on active tab
  const filteredExams = exams?.filter(exam => {
    if (activeTab === "pending") {
      return exam.status === "pending";
    } else if (activeTab === "completed") {
      return exam.status === "completed";
    }
    return true;
  }) || [];
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Handle add new exam
  const handleAddExam = () => {
    toast({
      title: t("exams.addNew"),
      description: "This functionality is not implemented in this version",
    });
  };
  
  // Handle view results
  const handleViewResults = (id: number) => {
    toast({
      title: t("exams.viewResults"),
      description: "This functionality is not implemented in this version",
    });
  };
  
  // Handle upload results
  const handleUploadResults = (id: number) => {
    toast({
      title: t("exams.uploadResults"),
      description: "This functionality is not implemented in this version",
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "PP", { locale: language === "pt" ? ptBR : enUS });
  };
  
  return (
    <PageLayout title={t("navigation.exams")}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-medium text-gray-900 mb-2 md:mb-0">{t("exams.title")}</h1>
        <Button 
          className="flex items-center justify-center"
          onClick={handleAddExam}
        >
          <span className="material-icons mr-2">add</span>
          {t("exams.addNew")}
        </Button>
      </div>
      
      {/* Filter Tabs */}
      <Tabs defaultValue="pending" value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList>
          <TabsTrigger value="pending">{t("exams.upcoming")}</TabsTrigger>
          <TabsTrigger value="completed">{t("exams.completed")}</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Exams List */}
      <div>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        ) : filteredExams.length === 0 ? (
          <div className="text-center py-8">
            <span className="material-icons text-4xl text-gray-400">science</span>
            <h3 className="mt-2 text-gray-500">{t("exams.noExams")}</h3>
            <Button 
              onClick={handleAddExam}
              className="mt-4"
            >
              <span className="material-icons mr-2">add</span>
              {t("exams.addNew")}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredExams.map((exam) => (
              <Card key={exam.id} className="shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <div className="border-l-4 border-primary p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium text-gray-900">{exam.name}</h3>
                          <Badge variant={exam.status === "pending" ? "secondary" : "outline"} className="ml-2">
                            {exam.status === "pending" ? t("exams.upcoming") : t("exams.completed")}
                          </Badge>
                        </div>
                        <p className="text-gray-500 text-sm mt-1">{exam.type}</p>
                        <p className="text-gray-500 text-sm mt-1">
                          {exam.doctorName && (
                            <span className="flex items-center">
                              <span className="material-icons text-sm mr-1">person</span>
                              {exam.doctorName}
                            </span>
                          )}
                          {exam.institution && (
                            <span className="flex items-center mt-1">
                              <span className="material-icons text-sm mr-1">location_on</span>
                              {exam.institution}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900 font-medium">{formatDate(exam.date)}</p>
                      </div>
                    </div>
                    
                    {exam.status === "completed" && exam.results && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900">{t("exams.results")}</h4>
                        <p className="text-gray-700 mt-1">{exam.results}</p>
                      </div>
                    )}
                    
                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end space-x-2">
                      {exam.status === "completed" ? (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex items-center"
                          onClick={() => handleViewResults(exam.id)}
                        >
                          <span className="material-icons text-sm mr-1">visibility</span>
                          {t("exams.viewResults")}
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex items-center"
                          onClick={() => handleUploadResults(exam.id)}
                        >
                          <span className="material-icons text-sm mr-1">upload</span>
                          {t("exams.uploadResults")}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="mt-4 text-center">
              <Button 
                onClick={handleAddExam}
                variant="outline"
                className="w-full md:w-auto"
              >
                <span className="material-icons mr-2">add</span>
                {t("exams.addNew")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
