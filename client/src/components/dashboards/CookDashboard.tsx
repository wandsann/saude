import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function CookDashboard() {
  const { user } = useAuth();
  const [activeDay, setActiveDay] = useState("today");
  
  // Buscar tarefas da cozinha
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/cook/tasks'],
    enabled: !!user
  });
  
  // Buscar cardápio do dia
  const { data: menu, isLoading: menuLoading } = useQuery({
    queryKey: ['/api/cook/menu', activeDay],
    enabled: !!user
  });
  
  // Buscar estatísticas
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/cook/stats'],
    enabled: !!user
  });
  
  // Buscar restrições alimentares de pacientes
  const { data: dietaryRestrictions, isLoading: restrictionsLoading } = useQuery({
    queryKey: ['/api/cook/dietary-restrictions'],
    enabled: !!user
  });

  // Função para obter o badge de restrição alimentar
  const getRestrictionBadge = (restriction: string) => {
    switch (restriction.toLowerCase()) {
      case 'gluten':
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Sem Glúten</Badge>;
      case 'lactose':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Sem Lactose</Badge>;
      case 'sugar':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Sem Açúcar</Badge>;
      case 'vegan':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Vegano</Badge>;
      case 'vegetarian':
        return <Badge variant="outline" className="bg-lime-50 text-lime-600 border-lime-200">Vegetariano</Badge>;
      case 'salt':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">Baixo Sódio</Badge>;
      default:
        return <Badge variant="outline">{restriction}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{user?.fullName}</h1>
          <p className="text-gray-500">Equipe de Nutrição · {user?.department}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center">
            <span className="material-icons mr-2 text-sm">print</span>
            Imprimir Cardápio
          </Button>
          <Button className="flex items-center">
            <span className="material-icons mr-2 text-sm">restaurant_menu</span>
            Planejar Refeições
          </Button>
        </div>
      </div>
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                <span className="material-icons text-emerald-600">restaurant</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Refeições Preparadas</p>
                <p className="text-2xl font-bold">{statsLoading ? '-' : stats?.mealsPrepared || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                <span className="material-icons text-indigo-600">people</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pacientes Atendidos</p>
                <p className="text-2xl font-bold">{statsLoading ? '-' : stats?.patientsServed || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                <span className="material-icons text-amber-600">no_meals</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dietas Especiais</p>
                <p className="text-2xl font-bold">{statsLoading ? '-' : stats?.specialDiets || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <span className="material-icons text-green-600">thumb_up</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Satisfação</p>
                <p className="text-2xl font-bold">{statsLoading ? '-' : `${stats?.satisfactionRate || 0}%`}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <span className="material-icons mr-2">restaurant_menu</span>
                Cardápio
              </CardTitle>
              <CardDescription>Refeições planejadas</CardDescription>
            </CardHeader>
            
            <div className="px-6">
              <Tabs defaultValue="today" value={activeDay} onValueChange={setActiveDay}>
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="today">Hoje</TabsTrigger>
                  <TabsTrigger value="tomorrow">Amanhã</TabsTrigger>
                  <TabsTrigger value="week">Semana</TabsTrigger>
                </TabsList>
                
                <TabsContent value="today" className="pt-4 pb-1">
                  {menuLoading ? (
                    <div className="flex justify-center py-6">
                      <span className="material-icons animate-spin">sync</span>
                    </div>
                  ) : menu?.meals?.length ? (
                    <div className="space-y-6">
                      {menu.meals.map((mealGroup: any) => (
                        <div key={mealGroup.type} className="border rounded-lg p-4">
                          <h3 className="font-medium text-lg mb-3 flex items-center">
                            <span className="material-icons mr-2 text-primary">
                              {mealGroup.type === 'breakfast' ? 'free_breakfast' : 
                               mealGroup.type === 'lunch' ? 'lunch_dining' : 
                               mealGroup.type === 'snack' ? 'bakery_dining' : 'dinner_dining'}
                            </span>
                            {mealGroup.type === 'breakfast' ? 'Café da Manhã' : 
                             mealGroup.type === 'lunch' ? 'Almoço' : 
                             mealGroup.type === 'snack' ? 'Lanche' : 'Jantar'}
                            <span className="text-sm text-gray-500 ml-2">
                              ({mealGroup.time})
                            </span>
                          </h3>
                          
                          <div className="space-y-3">
                            {mealGroup.items.map((item: any, index: number) => (
                              <div key={index} className="flex justify-between">
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-600">{item.description}</p>
                                  {item.restrictions?.length > 0 && (
                                    <div className="flex gap-1 mt-1 flex-wrap">
                                      {item.restrictions.map((restriction: string, i: number) => (
                                        <span key={i}>{getRestrictionBadge(restriction)}</span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-500">{item.servings} porções</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                      <span className="material-icons text-4xl text-gray-400 mb-2">no_meals</span>
                      <p className="text-gray-500">Nenhuma refeição planejada para hoje</p>
                      <Button variant="outline" className="mt-4">
                        Planejar refeições
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="tomorrow" className="pt-4 pb-1">
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <span className="material-icons text-4xl text-gray-400 mb-2">event_note</span>
                    <p className="text-gray-500">Cardápio de amanhã em elaboração</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="week" className="pt-4 pb-1">
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <span className="material-icons text-4xl text-gray-400 mb-2">calendar_month</span>
                    <p className="text-gray-500">Planejamento semanal disponível em breve</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <CardFooter className="pt-2 pb-4">
              <Button variant="outline" className="w-full">
                Ver cardápio completo
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <span className="material-icons mr-2">checklist</span>
                Tarefas da Cozinha
              </CardTitle>
              <CardDescription>Tarefas atribuídas à sua equipe</CardDescription>
            </CardHeader>
            
            <CardContent>
              {tasksLoading ? (
                <div className="flex justify-center py-4">
                  <span className="material-icons animate-spin">sync</span>
                </div>
              ) : tasks?.length ? (
                <div className="space-y-4">
                  {tasks.map((task: any) => (
                    <div key={task.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        </div>
                        <Badge variant={
                          task.status === 'completed' 
                            ? 'outline' 
                            : task.priority === 'high' 
                              ? 'destructive' 
                              : 'secondary'
                        }>
                          {task.status === 'completed' 
                            ? 'Concluída' 
                            : task.priority === 'high' 
                              ? 'Alta Prioridade' 
                              : task.priority}
                        </Badge>
                      </div>
                      
                      {task.progress !== undefined && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progresso</span>
                            <span>{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="h-2" />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="material-icons text-xs mr-1">schedule</span>
                          Vencimento: {new Date(task.dueDate).toLocaleDateString()}
                          {task.dueTime && ` ${task.dueTime}`}
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
                <div className="text-center py-6">
                  <p className="text-gray-500">Nenhuma tarefa pendente</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <span className="material-icons mr-2">medical_information</span>
                Restrições Alimentares
              </CardTitle>
              <CardDescription>Pacientes com dietas especiais</CardDescription>
            </CardHeader>
            
            <CardContent>
              {restrictionsLoading ? (
                <div className="flex justify-center py-4">
                  <span className="material-icons animate-spin">sync</span>
                </div>
              ) : dietaryRestrictions?.length ? (
                <div className="space-y-3">
                  {dietaryRestrictions.map((patient: any) => (
                    <div key={patient.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <span className="material-icons text-primary">person</span>
                          </div>
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-xs text-gray-500">Quarto: {patient.room} · Leito: {patient.bed}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {patient.restrictions.map((restriction: string, i: number) => (
                          <span key={i}>{getRestrictionBadge(restriction)}</span>
                        ))}
                      </div>
                      
                      {patient.notes && (
                        <p className="mt-2 text-sm text-gray-600 border-t pt-2">{patient.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">Nenhuma restrição alimentar registrada</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <span className="material-icons mr-2">inventory</span>
                Estoque de Insumos
              </CardTitle>
              <CardDescription>Itens com baixo estoque</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 border-b">
                  <div className="flex items-center">
                    <span className="material-icons text-red-500 mr-2">error</span>
                    <p>Leite Integral</p>
                  </div>
                  <Badge variant="destructive">Crítico</Badge>
                </div>
                <div className="flex justify-between items-center p-2 border-b">
                  <div className="flex items-center">
                    <span className="material-icons text-amber-500 mr-2">warning</span>
                    <p>Farinha de Trigo</p>
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Baixo</Badge>
                </div>
                <div className="flex justify-between items-center p-2 border-b">
                  <div className="flex items-center">
                    <span className="material-icons text-amber-500 mr-2">warning</span>
                    <p>Óleo de Oliva</p>
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Baixo</Badge>
                </div>
                
                <Button variant="outline" className="w-full mt-2">
                  <span className="material-icons mr-2 text-sm">shopping_cart</span>
                  Solicitar Compras
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <span className="material-icons mr-2">tips_and_updates</span>
                Dicas Nutricionais
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex p-2 border-b">
                  <span className="material-icons text-green-500 mr-2">eco</span>
                  <p className="text-sm">Priorize alimentos frescos e sazonais</p>
                </div>
                <div className="flex p-2 border-b">
                  <span className="material-icons text-green-500 mr-2">local_fire_department</span>
                  <p className="text-sm">Controle o sal e gorduras em preparações</p>
                </div>
                <div className="flex p-2 border-b">
                  <span className="material-icons text-green-500 mr-2">water_drop</span>
                  <p className="text-sm">Mantenha a hidratação dos pacientes</p>
                </div>
                <div className="flex p-2">
                  <span className="material-icons text-green-500 mr-2">volunteer_activism</span>
                  <p className="text-sm">Adapte as porções às necessidades individuais</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}