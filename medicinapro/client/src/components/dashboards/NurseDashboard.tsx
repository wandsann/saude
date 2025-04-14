import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function NurseDashboard() {
  const { user } = useAuth();
  
  // Buscar tarefas atribuídas ao enfermeiro
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/nurse/tasks'],
    enabled: !!user
  });
  
  // Buscar pacientes para atendimento
  const { data: patients, isLoading: patientsLoading } = useQuery({
    queryKey: ['/api/nurse/patients'],
    enabled: !!user
  });
  
  // Buscar indicadores de desempenho
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/nurse/stats'],
    enabled: !!user
  });

  // Função para formatar prioridade das tarefas
  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta':
      case 'high':
        return <Badge variant="destructive">Alta</Badge>;
      case 'média':
      case 'medium':
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Média</Badge>;
      case 'baixa':
      case 'low':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Baixa</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Enf. {user?.fullName}</h1>
          <p className="text-gray-500">{user?.department}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center">
            <span className="material-icons mr-2 text-sm">filter_list</span>
            Filtrar
          </Button>
          <Button className="flex items-center">
            <span className="material-icons mr-2 text-sm">add</span>
            Nova Tarefa
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Cards de Estatísticas */}
        <Card className="bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-primary/10 mr-4">
                <span className="material-icons text-primary">check_circle</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tarefas Concluídas</p>
                <p className="text-2xl font-bold">{statsLoading ? '-' : stats?.completedTasks || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-primary/10 mr-4">
                <span className="material-icons text-primary">people</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pacientes Atendidos</p>
                <p className="text-2xl font-bold">{statsLoading ? '-' : stats?.patientsAttended || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-primary/10 mr-4">
                <span className="material-icons text-primary">trending_up</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Taxa de Conclusão</p>
                <p className="text-2xl font-bold">{statsLoading ? '-' : `${stats?.completionRate || 0}%`}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-primary/10 mr-4">
                <span className="material-icons text-primary">assignment_late</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tarefas Pendentes</p>
                <p className="text-2xl font-bold">{statsLoading ? '-' : stats?.pendingTasks || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="material-icons mr-2">assignment</span>
                Tarefas Atribuídas
              </CardTitle>
              <CardDescription>Tarefas que precisam ser concluídas</CardDescription>
            </CardHeader>
            <CardContent>
              {tasksLoading ? (
                <div className="flex justify-center py-4">
                  <span className="material-icons animate-spin">sync</span>
                </div>
              ) : tasks?.length ? (
                <div className="space-y-4">
                  {tasks.map((task: any) => (
                    <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        </div>
                        {getPriorityBadge(task.priority)}
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progresso</span>
                          <span>{task.progress || 0}%</span>
                        </div>
                        <Progress value={task.progress || 0} className="h-2" />
                      </div>
                      
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="material-icons text-xs mr-1">schedule</span>
                          Vencimento: {new Date(task.dueDate).toLocaleDateString()}
                          {task.dueTime && ` ${task.dueTime}`}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            <span className="material-icons mr-1 text-sm">edit</span>
                            Atualizar
                          </Button>
                          <Button variant="default" size="sm" className="h-8 text-xs">
                            <span className="material-icons mr-1 text-sm">check</span>
                            Concluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <span className="material-icons text-4xl text-gray-400 mb-2">task_alt</span>
                  <p className="text-gray-500">Nenhuma tarefa pendente para hoje</p>
                  <Button variant="outline" className="mt-4">
                    Ver todas tarefas
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="material-icons mr-2">people</span>
                Pacientes para Atendimento
              </CardTitle>
              <CardDescription>Lista de pacientes aguardando</CardDescription>
            </CardHeader>
            <CardContent>
              {patientsLoading ? (
                <div className="flex justify-center py-4">
                  <span className="material-icons animate-spin">sync</span>
                </div>
              ) : patients?.length ? (
                <div className="space-y-2">
                  {patients.map((patient: any) => (
                    <div key={patient.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <span className="material-icons text-primary">person</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{patient.name}</p>
                        <div className="flex text-xs text-gray-500">
                          <span>Leito: {patient.bedNumber}</span>
                          {patient.status && (
                            <Badge className="ml-2 text-[10px] h-4" variant={
                              patient.status === 'critical' 
                                ? 'destructive' 
                                : patient.status === 'stable' 
                                  ? 'outline' 
                                  : 'secondary'
                            }>
                              {patient.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <span className="material-icons">more_vert</span>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">Nenhum paciente na lista de espera</p>
                </div>
              )}
              
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  Ver todos pacientes
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="material-icons mr-2">insert_chart</span>
                Desempenho da Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tarefas completadas</span>
                    <span className="font-medium">82%</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tempo de resposta</span>
                    <span className="font-medium">93%</span>
                  </div>
                  <Progress value={93} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Satisfação do paciente</span>
                    <span className="font-medium">89%</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}