import { useMemo } from "react";
import { Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface DataPoint {
  date: string;
  value: number;
}

interface LineChartProps {
  title: string;
  data: DataPoint[];
  color?: string;
  unit: string;
  yAxisMin?: number;
  yAxisMax?: number;
  average?: number;
  summary?: {
    min: number;
    max: number;
    status?: "normal" | "high" | "low";
  }
}

export function LineChart({
  title,
  data,
  color = "var(--primary)",
  unit,
  yAxisMin,
  yAxisMax,
  average,
  summary
}: LineChartProps) {
  const { t, language } = useLanguage();
  
  // Format date for the tooltip
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return language === "pt" 
      ? new Intl.DateTimeFormat('pt-BR').format(date)
      : new Intl.DateTimeFormat('en-US').format(date);
  };
  
  // Calculate domains if not provided
  const calculatedDomain = useMemo(() => {
    if (data.length === 0) return [0, 100];
    
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
    
    return [
      yAxisMin !== undefined ? yAxisMin : Math.max(0, min - padding),
      yAxisMax !== undefined ? yAxisMax : max + padding
    ];
  }, [data, yAxisMin, yAxisMax]);
  
  const getStatusTranslation = (status?: string) => {
    if (!status) return "";
    return t(`metrics.${status}`);
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-gray-900">{title}</CardTitle>
          {average !== undefined && (
            <div className="text-gray-500 text-sm">
              {t("metrics.average")}: {average} {unit}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 250 }}>
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={data}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={calculatedDomain}
                  tickFormatter={(value) => `${value}`}
                  tick={{ fontSize: 12 }}
                  width={30}
                />
                <Tooltip 
                  formatter={(value) => [`${value} ${unit}`, title]}
                  labelFormatter={formatDate}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  dot={{ r: 4, fill: color }}
                  activeDot={{ r: 6 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <span className="material-icons text-4xl mb-2">show_chart</span>
                <p>{t("metrics.noData")}</p>
              </div>
            </div>
          )}
        </div>
        
        {summary && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">{t("metrics.minimum")}</p>
              <p className="text-gray-900 font-medium">{summary.min} {unit}</p>
              {summary.status && (
                <p className={`text-sm flex items-center ${
                  summary.status === "normal" ? "text-green-600" : 
                  summary.status === "high" ? "text-red-600" : "text-amber-600"
                }`}>
                  <span className="material-icons text-sm mr-1">
                    {summary.status === "normal" ? "check_circle" : "warning"}
                  </span>
                  {getStatusTranslation(summary.status)}
                </p>
              )}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{t("metrics.maximum")}</p>
              <p className="text-gray-900 font-medium">{summary.max} {unit}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
