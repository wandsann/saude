import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export default function CleanerDashboard() {
  const { user } = useAuth();
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  
  // Buscar tarefas de limpeza
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/cleaner/tasks'],
    enabled: !!user
  });
  
  // Buscar áreas para limpeza
  const { data: areas, isLoading: areasLoading } = useQuery({
    queryKey: ['/api/cleaner/areas'],
    enabled: !!user
  });
  
  // Buscar estatísticas
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/cleaner/stats'],
    enabled: !!user
  });

  // Filtrar tarefas com base no estado de conclusão
  const filteredTasks = tasks?.filter((task: any) => 
    showCompletedTasks || task.status !== 'completed'
  ) || [];

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
          <h1 className="text-3xl font-bold">{user?.fullName}</h1>
          <p className="text-gray-500">Equipe de Limpeza · {user?.department}</p>
        </div>
        <Button className="flex items-center">
          <span className="material-icons mr-2 text-sm">report_problem</span>
          Reportar Problema
        </Button>
      </div>
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <span className="material-icons text-blue-600">task_alt</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tarefas Concluídas</p>
                <p className="text-2xl font-bold">{statsLoading ? '-' : stats?.completedTasks || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <span className="material-icons text-green-600">verified</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Taxa de Conclusão</p>
                <p className="text-2xl font-bold">{statsLoading ? '-' : `${stats?.completionRate || 0}%`}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                <span className="material-icons text-amber-600">pending</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tarefas Pendentes</p>
                <p className="text-2xl font-bold">{statsLoading ? '-' : stats?.pendingTasks || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <span className="material-icons text-purple-600">cleaning_services</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Áreas Atendidas</p>
                <p className="text-2xl font-bold">{statsLoading ? '-' : stats?.areasServiced || 0}</p>
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
                <CardTitle className="flex items-center">
                  <span className="material-icons mr-2">checklist</span>
                  Tarefas de Limpeza
                </CardTitle>
                
                <div className="flex items-center">
                  <Checkbox 
                    id="showCompleted" 
                    checked={showCompletedTasks}
                    onCheckedChange={(checked) => setShowCompletedTasks(!!checked)}
                  />
                  <label htmlFor="showCompleted" className="ml-2 text-sm">
                    Mostrar concluídas
                  </label>
                </div>
              </div>
              <CardDescription>Lista de tarefas atribuídas a você</CardDescription>
            </CardHeader>
            
            <CardContent>
              {tasksLoading ? (
                <div className="flex justify-center py-4">
                  <span className="material-icons animate-spin">sync</span>
                </div>
              ) : filteredTasks.length ? (
                <div className="space-y-4">
                  {filteredTasks.map((task: any) => (
                    <div 
                      key={task.id} 
                      className={`p-4 border rounded-lg ${
                        task.status === 'completed' 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <Checkbox 
                            className="mt-1" 
                            checked={task.status === 'completed'} 
                          />
                          <div className="ml-3">
                            <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                              {task.title}
                            </h3>
                            <p className={`text-sm mt-1 ${task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'}`}>
                              {task.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                <span className="material-icons text-xs mr-1">location_on</span>
                                {task.location}
                              </Badge>
                              {task.status === 'completed' ? (
                                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                                  Concluída
                                </Badge>
                              ) : (
                                <>
                                  {getPriorityBadge(task.priority)}
                                  <Badge variant="outline" className="text-xs">
                                    <span className="material-icons text-xs mr-1">schedule</span>
                                    {new Date(task.dueDate).toLocaleDateString()}
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {task.status !== 'completed' && (
                          <Button size="sm">
                            Concluir
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <span className="material-icons text-4xl text-gray-400 mb-2">task_alt</span>
                  <p className="text-gray-500">Nenhuma tarefa encontrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <span className="material-icons mr-2">map</span>
                Áreas para Limpeza
              </CardTitle>
              <CardDescription>Status atual das áreas</CardDescription>
            </CardHeader>
            
            <CardContent>
              {areasLoading ? (
                <div className="flex justify-center py-4">
                  <span className="material-icons animate-spin">sync</span>
                </div>
              ) : areas?.length ? (
                <div className="space-y-4">
                  {areas.map((area: any) => (
                    <div key={area.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{area.name}</h3>
                          <p className="text-xs text-gray-500 mt-1">Último serviço: {new Date(area.lastCleanedAt).toLocaleDateString()}</p>
                        </div>
                        <Badge 
                          variant={
                            area.status === 'clean' 
                              ? 'outline' 
                              : area.status === 'needs_attention' 
                                ? 'destructive' 
                                : 'secondary'
                          }
                          className="text-xs"
                        >
                          {area.status === 'clean' 
                            ? 'Limpo' 
                            : area.status === 'needs_attention' 
                              ? 'Atenção' 
                              : 'Pendente'
                          }
                        </Badge>
                      </div>
                      
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Status de limpeza</span>
                          <span>{area.cleanlinessLevel}%</span>
                        </div>
                        <Progress 
                          value={area.cleanlinessLevel} 
                          className="h-2" 
                          color={
                            area.cleanlinessLevel > 70 
                              ? 'bg-green-500' 
                              : area.cleanlinessLevel > 40 
                                ? 'bg-amber-500' 
                                : 'bg-red-500'
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 py-4 text-center">Nenhuma área cadastrada.</p>
              )}
            </CardContent>
            
            <CardFooter>
              <Button variant="outline" className="w-full">
                Ver todas áreas
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <span className="material-icons mr-2">tips_and_updates</span>
                Dicas de Limpeza
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex p-2 border-b">
                  <span className="material-icons text-blue-500 mr-2">water_drop</span>
                  <p className="text-sm">Use produtos adequados para diferentes superfícies</p>
                </div>
                <div className="flex p-2 border-b">
                  <span className="material-icons text-blue-500 mr-2">warning</span>
                  <p className="text-sm">Atenção aos sinais de piso molhado em áreas de circulação</p>
                </div>
                <div className="flex p-2 border-b">
                  <span className="material-icons text-blue-500 mr-2">sanitizer</span>
                  <p className="text-sm">Dê atenção especial aos banheiros e áreas comuns</p>
                </div>
                <div className="flex p-2">
                  <span className="material-icons text-blue-500 mr-2">recycling</span>
                  <p className="text-sm">Separe corretamente os resíduos hospitalares</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}