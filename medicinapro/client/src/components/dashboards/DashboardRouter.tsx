import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { UserRole } from "@shared/schema";

// Importação dos diferentes dashboards
import PatientDashboard from "./PatientDashboard";
import DoctorDashboard from "./DoctorDashboard";
import NurseDashboard from "./NurseDashboard";
import CleanerDashboard from "./CleanerDashboard";
import CookDashboard from "./CookDashboard";
import AdminDashboard from "./AdminDashboard";

/**
 * Componente que decide qual dashboard renderizar com base no papel do usuário autenticado
 */
export default function DashboardRouter() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64 mb-8" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  // Se não tivermos um usuário ou papel, exibir mensagem de erro
  if (!user || !user.role) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="material-icons text-yellow-400">warning</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Não foi possível identificar seu tipo de usuário. Por favor, faça login novamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Roteie para o dashboard correto com base no papel do usuário
  switch (user.role) {
    case UserRole.PATIENT:
      return <PatientDashboard />;
    case UserRole.DOCTOR:
      return <DoctorDashboard />;
    case UserRole.NURSE:
      return <NurseDashboard />;
    case UserRole.CLEANER:
      return <CleanerDashboard />;
    case UserRole.COOK:
      return <CookDashboard />;
    case UserRole.ADMIN:
      return <AdminDashboard />;
    default:
      // Interface padrão se o papel não for reconhecido
      return (
        <div className="container mx-auto p-6">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="material-icons text-blue-400">info</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Bem-vindo, {user.fullName}! O dashboard para o seu tipo de usuário ({user.role}) está em desenvolvimento.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
  }
}