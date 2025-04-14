import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { HealthMetricCard } from "@/components/ui/health/HealthMetricCard";
import { AppointmentList } from "@/components/ui/health/AppointmentList";
import { MedicationList } from "@/components/ui/health/MedicationList";
import { AchievementCard } from "@/components/ui/health/AchievementCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function PatientDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  
  // Buscar dados do dashboard
  const { data, isLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    enabled: !!user
  });
  
  // Buscar métricas de saúde
  const { data: healthMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/health-metrics'],
    enabled: !!user
  });
  
  // Buscar consultas médicas
  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/appointments'],
    enabled: !!user
  });
  
  // Buscar medicações
  const { data: medications, isLoading: medicationsLoading } = useQuery({
    queryKey: ['/api/medications'],
    enabled: !!user
  });

  const handleViewAllAppointments = () => {
    navigate("/appointments");
  };
  
  const handleViewAllMedications = () => {
    navigate("/medications");
  };
  
  const handleViewAllMetrics = () => {
    navigate("/health-metrics");
  };
  
  const handleViewAllRecords = () => {
    navigate("/records");
  };

  return (
    <div>
      {/* Cabeçalho e resumo */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-900 mb-1">
          {t("home.greeting")}, {user?.fullName.split(" ")[0]}!
        </h1>
        <p className="text-gray-500">{t("home.subtitle")}</p>
      </div>
      
      {/* Health Summary Cards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-gray-900">{t("home.healthSummary")}</h2>
          <Button 
            variant="link" 
            size="sm" 
            className="text-primary flex items-center"
            onClick={handleViewAllMetrics}
          >
            {t("home.viewAll")}
            <span className="material-icons text-sm ml-1">arrow_forward</span>
          </Button>
        </div>
        
        {metricsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        ) : healthMetrics?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {healthMetrics.slice(0, 3).map((metric: any) => (
              <HealthMetricCard
                key={metric.id}
                title={metric.type === "heart-rate" ? t("metrics.heartRate") : 
                       metric.type === "blood-pressure" ? t("metrics.bloodPressure") :
                       metric.type === "weight" ? t("metrics.weight") : metric.type}
                value={metric.value}
                unit={metric.unit}
                icon={metric.type === "heart-rate" ? "favorite" : 
                      metric.type === "blood-pressure" ? "speed" :
                      metric.type === "weight" ? "monitor_weight" : "straighten"}
                trend={metric.trend || {
                  direction: "none",
                  value: t("metrics.normal"),
                  isGood: true
                }}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-gray-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gray-200 flex items-center justify-center mx-auto rounded-full mb-3">
                <span className="material-icons text-gray-400">favorite</span>
              </div>
              <h3 className="text-gray-900 font-medium mb-1">{t("metrics.noMetricsTitle")}</h3>
              <p className="text-gray-500 mb-4">{t("metrics.noMetricsDescription")}</p>
              <Button variant="outline" size="sm">
                {t("metrics.recordFirst")}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Upcoming Appointments */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-gray-900">{t("home.upcomingAppointments")}</h2>
          <Button 
            variant="link" 
            size="sm" 
            className="text-primary flex items-center"
            onClick={handleViewAllAppointments}
          >
            {t("home.viewAll")}
            <span className="material-icons text-sm ml-1">arrow_forward</span>
          </Button>
        </div>
        
        {appointmentsLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        ) : appointments?.length ? (
          <AppointmentList 
            appointments={appointments.slice(0, 3).map((appointment: any) => ({
              id: appointment.id,
              doctorName: appointment.doctorName,
              specialty: appointment.specialty,
              date: new Date(appointment.date),
              time: appointment.time,
              status: appointment.status,
              location: appointment.location,
              address: appointment.address,
              notes: appointment.notes
            }))}
            emptyMessage={t("appointment.noUpcoming")}
          />
        ) : (
          <Card className="bg-gray-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gray-200 flex items-center justify-center mx-auto rounded-full mb-3">
                <span className="material-icons text-gray-400">event</span>
              </div>
              <h3 className="text-gray-900 font-medium mb-1">{t("appointment.noUpcoming")}</h3>
              <p className="text-gray-500 mb-4">{t("appointment.scheduleNew")}</p>
              <Button variant="outline" size="sm">
                {t("appointment.bookAppointment")}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Medication Reminders */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-gray-900">{t("home.medications")}</h2>
          <Button 
            variant="link" 
            size="sm" 
            className="text-primary flex items-center"
            onClick={handleViewAllMedications}
          >
            {t("home.viewAll")}
            <span className="material-icons text-sm ml-1">arrow_forward</span>
          </Button>
        </div>
        
        {medicationsLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        ) : medications?.length ? (
          <MedicationList 
            medications={medications.slice(0, 3).map((medication: any) => {
              // Convert frequency object if it's a string
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
                takenToday: medication.takenToday || 0,
                totalDaily: frequency.times || 1,
                isLate: medication.isLate || false
              };
            })}
          />
        ) : (
          <Card className="bg-gray-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gray-200 flex items-center justify-center mx-auto rounded-full mb-3">
                <span className="material-icons text-gray-400">medication</span>
              </div>
              <h3 className="text-gray-900 font-medium mb-1">{t("medications.noMedications")}</h3>
              <p className="text-gray-500 mb-4">{t("medications.noActiveDescription")}</p>
              <Button variant="outline" size="sm">
                {t("medications.addMedication")}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Achievements and Gamification */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-gray-900">{t("home.achievements")}</h2>
          <Button 
            variant="link" 
            size="sm" 
            className="text-primary flex items-center"
          >
            {t("achievements.viewAll")}
            <span className="material-icons text-sm ml-1">arrow_forward</span>
          </Button>
        </div>
        
        {isLoading ? (
          <Skeleton className="h-64" />
        ) : (
          <AchievementCard
            level={user?.level || 1}
            points={user?.points || 0}
            nextLevelPoints={1000}
            achievements={[
              {
                id: 1,
                name: t("achievements.appointmentStreak"),
                icon: "local_hospital",
                backgroundColor: "bg-amber-100",
                iconColor: "text-amber-500",
                isPulsing: true
              },
              {
                id: 2,
                name: t("achievements.exerciseStreak"),
                icon: "fitness_center",
                backgroundColor: "bg-green-100",
                iconColor: "text-green-500"
              },
              {
                id: 3,
                name: t("achievements.hydrationGoal"),
                icon: "water_drop",
                backgroundColor: "bg-gray-200",
                iconColor: "text-gray-400",
                isLocked: true
              }
            ]}
          />
        )}
      </div>
    </div>
  );
}