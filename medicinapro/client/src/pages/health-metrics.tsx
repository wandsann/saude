import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart } from "@/components/ui/charts/LineChart";
import { DualLineChart } from "@/components/ui/charts/DualLineChart";
import { NewMetric } from "@/modals/NewMetric";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export default function HealthMetrics() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("week");
  const [isNewMetricModalOpen, setIsNewMetricModalOpen] = useState(false);
  
  // Fetch health metrics data
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["/api/health-metrics"],
  });
  
  // Mutation for adding new metric
  const addMetricMutation = useMutation({
    mutationFn: (newMetric: any) => {
      return apiRequest("POST", "/api/health-metrics", newMetric);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/health-metrics"] });
      toast({
        title: t("metrics.addSuccess"),
        description: t("metrics.addSuccessDescription"),
      });
      setIsNewMetricModalOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: t("metrics.addError"),
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
  
  // Handle time range change
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };
  
  // Handle add new metric
  const handleAddNewMetric = () => {
    setIsNewMetricModalOpen(true);
  };
  
  // Handle save new metric
  const handleSaveNewMetric = (metricData: any) => {
    addMetricMutation.mutate(metricData);
  };
  
  // Process and filter metric data for charts
  const getChartData = (type: string) => {
    if (!metrics) return [];
    
    const filteredMetrics = metrics
      .filter(metric => metric.type === type)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    // For blood pressure, we need to extract systolic and diastolic values
    if (type === "blood-pressure") {
      return filteredMetrics.map(metric => {
        const [systolic, diastolic] = metric.value.split("/").map(Number);
        return {
          date: new Date(metric.timestamp).toISOString().split("T")[0],
          systolic,
          diastolic
        };
      });
    }
    
    // For other metrics, just return the value
    return filteredMetrics.map(metric => ({
      date: new Date(metric.timestamp).toISOString().split("T")[0],
      value: parseFloat(metric.value)
    }));
  };
  
  // Calculate average for a metric type
  const calculateAverage = (type: string) => {
    if (!metrics) return null;
    
    const filteredMetrics = metrics.filter(metric => metric.type === type);
    if (filteredMetrics.length === 0) return null;
    
    if (type === "blood-pressure") {
      return null; // We don't calculate average for blood pressure
    }
    
    const sum = filteredMetrics.reduce((acc, metric) => acc + parseFloat(metric.value), 0);
    return Math.round(sum / filteredMetrics.length);
  };
  
  // Get min and max values for a metric type
  const getMinMax = (type: string) => {
    if (!metrics) return null;
    
    const filteredMetrics = metrics.filter(metric => metric.type === type);
    if (filteredMetrics.length === 0) return null;
    
    if (type === "blood-pressure") {
      const systolicValues = filteredMetrics.map(metric => parseInt(metric.value.split("/")[0]));
      const diastolicValues = filteredMetrics.map(metric => parseInt(metric.value.split("/")[1]));
      
      return {
        systolicMax: Math.max(...systolicValues),
        diastolicMax: Math.max(...diastolicValues),
        classification: "normal" // This would be calculated based on values in a real app
      };
    }
    
    const values = filteredMetrics.map(metric => parseFloat(metric.value));
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      status: "normal" // This would be calculated based on values in a real app
    };
  };
  
  // Get the latest value for a metric type
  const getLatestValue = (type: string) => {
    if (!metrics) return null;
    
    const filteredMetrics = metrics
      .filter(metric => metric.type === type)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return filteredMetrics[0]?.value || null;
  };
  
  return (
    <PageLayout title={t("navigation.metrics")}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-medium text-gray-900 mb-2 md:mb-0">{t("navigation.metrics")}</h1>
        <Button 
          className="flex items-center justify-center"
          onClick={handleAddNewMetric}
          disabled={addMetricMutation.isPending}
        >
          {addMetricMutation.isPending ? (
            <span className="material-icons animate-spin mr-2">sync</span>
          ) : (
            <span className="material-icons mr-2">add</span>
          )}
          {t("metrics.registerMeasurement")}
        </Button>
      </div>
      
      {/* Time Range Tabs */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex rounded-md shadow-sm">
            <Button 
              variant={timeRange === "week" ? "default" : "outline"}
              className="rounded-l-md rounded-r-none"
              onClick={() => handleTimeRangeChange("week")}
            >
              {t("metrics.week")}
            </Button>
            <Button 
              variant={timeRange === "month" ? "default" : "outline"}
              className="rounded-none border-x-0"
              onClick={() => handleTimeRangeChange("month")}
            >
              {t("metrics.month")}
            </Button>
            <Button 
              variant={timeRange === "year" ? "default" : "outline"}
              className="rounded-r-md rounded-l-none"
              onClick={() => handleTimeRangeChange("year")}
            >
              {t("metrics.year")}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Heart Rate Chart */}
      <div className="mb-6">
        {isLoading ? (
          <Skeleton className="h-80" />
        ) : (
          <LineChart 
            title={t("metrics.heartRate")}
            data={getChartData("heart-rate")}
            unit={t("metrics.bpm")}
            color="var(--primary)"
            average={calculateAverage("heart-rate")}
            summary={getMinMax("heart-rate")}
          />
        )}
      </div>
      
      {/* Blood Pressure Chart */}
      <div className="mb-6">
        {isLoading ? (
          <Skeleton className="h-80" />
        ) : (
          <DualLineChart 
            title={t("metrics.bloodPressure")}
            data={getChartData("blood-pressure") as any}
            unit={t("metrics.mmHg")}
            latestValue={getLatestValue("blood-pressure")}
            summary={getMinMax("blood-pressure") as any}
          />
        )}
      </div>
      
      {/* Weight Chart */}
      <div className="mb-6">
        {isLoading ? (
          <Skeleton className="h-80" />
        ) : (
          <LineChart 
            title={t("metrics.weight")}
            data={getChartData("weight")}
            unit={t("metrics.kg")}
            color="var(--chart-3)"
            average={calculateAverage("weight")}
            summary={getMinMax("weight")}
          />
        )}
      </div>
      
      {/* Add New Metric Button */}
      <div className="text-center mb-8">
        <Button 
          size="lg" 
          className="shadow-md"
          onClick={handleAddNewMetric}
          disabled={addMetricMutation.isPending}
        >
          {addMetricMutation.isPending ? (
            <span className="material-icons animate-spin mr-2">sync</span>
          ) : (
            <span className="material-icons mr-2">add</span>
          )}
          {t("metrics.addNew")}
        </Button>
      </div>
      
      {/* New Metric Modal */}
      <NewMetric 
        open={isNewMetricModalOpen}
        onClose={() => setIsNewMetricModalOpen(false)}
        onSave={handleSaveNewMetric}
      />
    </PageLayout>
  );
}
