import { useMemo } from "react";
import { Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface DataPoint {
  date: string;
  systolic: number;
  diastolic: number;
}

interface DualLineChartProps {
  title: string;
  data: DataPoint[];
  unit: string;
  colors?: [string, string];
  yAxisMin?: number;
  yAxisMax?: number;
  latestValue?: string;
  summary?: {
    systolicMax: number;
    diastolicMax: number;
    classification?: string;
  }
}

export function DualLineChart({
  title,
  data,
  unit,
  colors = ["var(--primary)", "var(--chart-2)"],
  yAxisMin,
  yAxisMax,
  latestValue,
  summary
}: DualLineChartProps) {
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
    if (data.length === 0) return [0, 200];
    
    const systolicValues = data.map(d => d.systolic);
    const diastolicValues = data.map(d => d.diastolic);
    const min = Math.min(...diastolicValues);
    const max = Math.max(...systolicValues);
    const padding = (max - min) * 0.1;
    
    return [
      yAxisMin !== undefined ? yAxisMin : Math.max(0, min - padding),
      yAxisMax !== undefined ? yAxisMax : max + padding
    ];
  }, [data, yAxisMin, yAxisMax]);
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-gray-900">{title}</CardTitle>
          {latestValue && (
            <div className="text-gray-500 text-sm">
              {t("metrics.latest")}: {latestValue} {unit}
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
                  formatter={(value, name) => [
                    `${value} ${unit}`, 
                    name === "systolic" ? t("metrics.systolic") : t("metrics.diastolic")
                  ]}
                  labelFormatter={formatDate}
                />
                <Legend 
                  formatter={(value) => t(`metrics.${value}`)}
                />
                <Line
                  name="systolic"
                  type="monotone"
                  dataKey="systolic"
                  stroke={colors[0]}
                  strokeWidth={2}
                  dot={{ r: 3, fill: colors[0] }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  name="diastolic"
                  type="monotone"
                  dataKey="diastolic"
                  stroke={colors[1]}
                  strokeWidth={2}
                  dot={{ r: 3, fill: colors[1] }}
                  activeDot={{ r: 5 }}
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
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-500 text-sm">{t("metrics.systolicMax")}</p>
              <p className="text-gray-900 font-medium">{summary.systolicMax} {unit}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">{t("metrics.diastolicMax")}</p>
              <p className="text-gray-900 font-medium">{summary.diastolicMax} {unit}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">{t("metrics.classification")}</p>
              <p className={`font-medium ${
                summary.classification === "normal" ? "text-green-600" : 
                summary.classification === "high" ? "text-red-600" : "text-amber-600"
              }`}>
                {t(`metrics.${summary.classification || "normal"}`)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
