import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface HealthMetricCardProps {
  title: string;
  value: string;
  unit: string;
  icon: string;
  trend?: {
    direction: "up" | "down" | "none";
    value: string;
    isGood: boolean;
  };
  delay?: number;
}

export function HealthMetricCard({
  title,
  value,
  unit,
  icon,
  trend,
  delay = 0,
}: HealthMetricCardProps) {
  const { t } = useLanguage();
  
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-5 duration-500 shadow-md" style={{ animationDelay: `${delay}ms` }}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-500 font-medium">{title}</h3>
          <span className="material-icons text-primary">{icon}</span>
        </div>
        <div className="flex items-end">
          <span className="text-3xl font-medium text-gray-900">{value}</span>
          <span className="ml-1 text-gray-500">{unit}</span>
        </div>
        {trend && (
          <div className="mt-2 text-sm">
            <span className={cn(
              "flex items-center",
              trend.isGood ? "text-green-600" : trend.direction === "none" ? "text-amber-500" : "text-red-500"
            )}>
              <span className="material-icons text-sm mr-1">
                {trend.direction === "up" ? "arrow_drop_up" : 
                 trend.direction === "down" ? "arrow_drop_down" : "check_circle"}
              </span>
              {trend.value}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
