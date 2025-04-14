import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTabKey, setActiveTabKey] = useState("overview");
  
  // Buscar resumo do hospital
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['/api/admin/overview'],
    enabled: !!user
  });
  
  // Buscar equipes
  const { data: teams, isLoading: teamsLoading } = useQuery({
    queryKey: ['/api/admin/teams'],
    enabled: !!user && activeTabKey === "teams"
  });
  
  // Buscar estatísticas
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
    enabled: !!user
  });
  
  // Buscar notificações
  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['/api/admin/notifications'],
    enabled: !!user
  });

  // Função para formatar datas relativas
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d atrás`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-gray-500">{user?.fullName} · {user?.department}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center">
            <span className="material-icons mr-2 text-sm">settings</span>
            Configurações
          </Button>
          <Button className="flex items-center">
            <span className="material-icons mr-2 text-sm">add</span>
            Novo Usuário
          </Button>
        </div>
      </div>
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <span className="material-icons text-blue-600">people</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Funcionários</p>
                <p className="text-2xl font-bold">{statsLoading ? '-' : stats?.totalEmployees || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                <span className="material-icons text-emerald-600">local_hospital</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pacientes Ativos</p>
                <p className="text-2xl font-bold">{statsLoading ? '-' : stats?.activePatients || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <span className="material-icons text-purple-600">event_available</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Consultas Hoje</p>
                <p className="text-2xl font-bold">{statsLoading ? '-' : stats?.todayAppointments || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                <span className="material-icons text-amber-600">notifications</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Notificações</p>
                <p className="text-2xl font-bold">{notificationsLoading ? '-' : notifications?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Gestão do Hospital</CardTitle>
                <Button variant="ghost" size="sm" className="flex items-center">
                  <span className="material-icons text-sm mr-1">refresh</span>
                  Atualizar
                </Button>
              </div>
            </CardHeader>
            
            <div className="px-6">
              <Tabs defaultValue="overview" value={activeTabKey} onValueChange={setActiveTabKey}>
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="overview">Resumo</TabsTrigger>
                  <TabsTrigger value="teams">Equipes</TabsTrigger>
                  <TabsTrigger value="resources">Recursos</TabsTrigger>
                  <TabsTrigger value="reports">Relatórios</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="pt-4 pb-1">
                  {overviewLoading ? (
                    <div className="flex justify-center py-6">
                      <span className="material-icons animate-spin">sync</span>
                    </div>
                  ) : overview ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium flex items-center">
                            <span className="material-icons mr-2 text-primary">hotel</span>
                            Ocupação de Leitos
                          </h3>
                          <div className="mt-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Total</span>
                              <span className="font-medium">{overview.bedOccupancy.occupiedBeds}/{overview.bedOccupancy.totalBeds} ({overview.bedOccupancy.occupancyRate}%)</span>
                            </div>
                            <Progress value={overview.bedOccupancy.occupancyRate} className="h-2" />
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                            <div className="border rounded-md p-2">
                              <p className="text-gray-500">UTI</p>
                              <p className="font-medium">{overview.bedOccupancy.departments.icu.occupied}/{overview.bedOccupancy.departments.icu.total}</p>
                            </div>
                            <div className="border rounded-md p-2">
                              <p className="text-gray-500">Enfermaria</p>
                              <p className="font-medium">{overview.bedOccupancy.departments.ward.occupied}/{overview.bedOccupancy.departments.ward.total}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium flex items-center">
                            <span className="material-icons mr-2 text-primary">schedule</span>
                            Eficiência Operacional
                          </h3>
                          <div className="mt-3 space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Tempo médio de espera</span>
                                <span className="font-medium">{overview.operationalEfficiency.avgWaitTime} min</span>
                              </div>
                              <Progress 
                                value={
                                  100 - Math.min(100, (overview.operationalEfficiency.avgWaitTime / 60) * 100)
                                } 
                                className="h-2" 
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Taxa de conclusão de tarefas</span>
                                <span className="font-medium">{overview.operationalEfficiency.taskCompletionRate}%</span>
                              </div>
                              <Progress 
                                value={overview.operationalEfficiency.taskCompletionRate} 
                                className="h-2" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium flex items-center mb-3">
                          <span className="material-icons mr-2 text-primary">insights</span>
                          Estatísticas de Atendimento
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="text-center border-r last:border-r-0">
                            <p className="text-3xl font-bold text-blue-600">{overview.serviceStats.admissions}</p>
                            <p className="text-sm text-gray-500">Admissões esta semana</p>
                          </div>
                          <div className="text-center border-r last:border-r-0">
                            <p className="text-3xl font-bold text-green-600">{overview.serviceStats.discharges}</p>
                            <p className="text-sm text-gray-500">Altas esta semana</p>
                          </div>
                          <div className="text-center border-r last:border-r-0">
                            <p className="text-3xl font-bold text-amber-600">{overview.serviceStats.emergencies}</p>
                            <p className="text-sm text-gray-500">Atendimentos de emergência</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">Dados não disponíveis</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="teams" className="pt-4 pb-1">
                  {teamsLoading ? (
                    <div className="flex justify-center py-6">
                      <span className="material-icons animate-spin">sync</span>
                    </div>
                  ) : teams?.length ? (
                    <div className="space-y-4">
                      {teams.map((team: any) => (
                        <div key={team.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{team.name}</h3>
                              <p className="text-sm text-gray-500">{team.department}</p>
                            </div>
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              {team.members.length} membros
                            </Badge>
                          </div>
                          
                          <div className="mt-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Desempenho da equipe</span>
                              <span>{team.performanceRate}%</span>
                            </div>
                            <Progress value={team.performanceRate} className="h-2" />
                          </div>
                          
                          <div className="mt-3">
                            {team.members.slice(0, 3).map((member: any) => (
                              <div key={member.id} className="flex items-center mt-2 text-sm">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                                  <span className="material-icons text-sm text-primary">person</span>
                                </div>
                                <span>{member.name}</span>
                                <span className="ml-2 text-gray-500">{member.role}</span>
                              </div>
                            ))}
                            {team.members.length > 3 && (
                              <div className="mt-2 text-sm text-center">
                                <Button variant="link" size="sm" className="h-auto p-0">
                                  Ver todos os {team.members.length} membros
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">Nenhuma equipe encontrada</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="resources" className="pt-4 pb-1">
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <span className="material-icons text-4xl text-gray-400 mb-2">inventory</span>
                    <p className="text-gray-500">Módulo de recursos em desenvolvimento</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="reports" className="pt-4 pb-1">
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <span className="material-icons text-4xl text-gray-400 mb-2">summarize</span>
                    <p className="text-gray-500">Módulo de relatórios em desenvolvimento</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <CardFooter className="pt-0 pb-4">
              <Button variant="outline" className="w-full">
                Ver dados detalhados
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <span className="material-icons mr-2">task</span>
                  Requisições do Sistema
                </CardTitle>
                <Badge className="bg-amber-50 text-amber-600 border-amber-200">
                  {stats?.pendingRequests || 0} pendentes
                </Badge>
              </div>
              <CardDescription>Requisições que precisam de atenção</CardDescription>
            </CardHeader>
            
            <CardContent>
              {statsLoading ? (
                <div className="flex justify-center py-4">
                  <span className="material-icons animate-spin">sync</span>
                </div>
              ) : stats?.recentRequests?.length ? (
                <div className="space-y-4">
                  {stats.recentRequests.map((request: any) => (
                    <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{request.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <span className="material-icons text-xs mr-1">person</span>
                            Solicitado por: {request.requestedBy}
                          </div>
                        </div>
                        <Badge variant={
                          request.status === 'approved' 
                            ? 'outline' 
                            : request.status === 'pending' 
                              ? 'secondary' 
                              : 'destructive'
                        }>
                          {request.status === 'approved' 
                            ? 'Aprovado' 
                            : request.status === 'pending' 
                              ? 'Pendente' 
                              : 'Rejeitado'
                          }
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3">
                        <div className="text-xs text-gray-500">
                          Solicitado em: {new Date(request.requestedAt).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Rejeitar</Button>
                          <Button size="sm">Aprovar</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">Nenhuma requisição pendente</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <span className="material-icons mr-2">notifications</span>
                Notificações
              </CardTitle>
              <CardDescription>Atualizações do sistema</CardDescription>
            </CardHeader>
            
            <CardContent>
              {notificationsLoading ? (
                <div className="flex justify-center py-4">
                  <span className="material-icons animate-spin">sync</span>
                </div>
              ) : notifications?.length ? (
                <div className="space-y-4">
                  {notifications.map((notification: any) => (
                    <div key={notification.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-start">
                        <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                          notification.type === 'alert' 
                            ? 'bg-red-100' 
                            : notification.type === 'warning' 
                              ? 'bg-amber-100' 
                              : 'bg-blue-100'
                        }`}>
                          <span className={`material-icons text-sm ${
                            notification.type === 'alert' 
                              ? 'text-red-600' 
                              : notification.type === 'warning' 
                                ? 'text-amber-600' 
                                : 'text-blue-600'
                          }`}>
                            {notification.type === 'alert' 
                              ? 'error' 
                              : notification.type === 'warning' 
                                ? 'warning' 
                                : 'info'
                            }
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <div className="flex justify-between mt-2">
                            <div className="text-xs text-gray-500">
                              {formatRelativeTime(notification.createdAt)}
                            </div>
                            {!notification.read && (
                              <Badge variant="outline" className="text-xs h-5">
                                Não lida
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">Nenhuma notificação recente</p>
                </div>
              )}
              
              <Button variant="outline" className="w-full mt-4">
                Ver todas notificações
              </Button>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <span className="material-icons mr-2">speed</span>
                Status do Sistema
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Servidor Principal</span>
                    <div className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                      <span>Operacional</span>
                    </div>
                  </div>
                  <Progress value={98} className="h-2 bg-gray-100" />
                  <p className="text-xs text-gray-500 mt-1">Uptime: 99.8% no último mês</p>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Banco de Dados</span>
                    <div className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                      <span>Operacional</span>
                    </div>
                  </div>
                  <Progress value={95} className="h-2 bg-gray-100" />
                  <p className="text-xs text-gray-500 mt-1">Latência: 45ms</p>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Sistema de Arquivos</span>
                    <div className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-amber-500 mr-1"></span>
                      <span>Performance reduzida</span>
                    </div>
                  </div>
                  <Progress value={72} className="h-2 bg-gray-100" />
                  <p className="text-xs text-gray-500 mt-1">Espaço disponível: 28%</p>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>API Externa</span>
                    <div className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                      <span>Operacional</span>
                    </div>
                  </div>
                  <Progress value={99} className="h-2 bg-gray-100" />
                  <p className="text-xs text-gray-500 mt-1">Resposta média: 120ms</p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-6">
                <span className="material-icons mr-2 text-sm">settings_backup_restore</span>
                Executar diagnóstico
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}