import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [activeTabKey, setActiveTabKey] = useState("appointments");
  
  // Buscar as consultas do dia
  const { data: todayAppointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/doctor/appointments/today'],
    enabled: !!user
  });
  
  // Buscar tarefas atribuídas ao médico
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/doctor/tasks'],
    enabled: !!user
  });
  
  // Buscar pacientes recentes
  const { data: recentPatients, isLoading: patientsLoading } = useQuery({
    queryKey: ['/api/doctor/patients/recent'],
    enabled: !!user
  });

  // Função para formatar o status da consulta
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Agendada</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Em andamento</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Concluída</Badge>;
      case 'canceled':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dr. {user?.fullName}</h1>
          <p className="text-gray-500">{user?.specialty} · {user?.department}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center">
            <span className="material-icons mr-2 text-sm">today</span>
            Agenda
          </Button>
          <Button className="flex items-center">
            <span className="material-icons mr-2 text-sm">add</span>
            Nova Consulta
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTabKey} onValueChange={setActiveTabKey} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="appointments" className="flex items-center">
                  <span className="material-icons mr-2 text-sm">calendar_today</span>
                  Consultas
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex items-center">
                  <span className="material-icons mr-2 text-sm">assignment</span>
                  Tarefas
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center">
                <span className="text-gray-500 mr-2 text-sm">Filtrar:</span>
                <select className="text-sm border rounded p-1">
                  <option>Todos</option>
                  <option>Hoje</option>
                  <option>Esta semana</option>
                </select>
              </div>
            </div>
            
            <TabsContent value="appointments">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Consultas de hoje</CardTitle>
                  <CardDescription>Lista de pacientes agendados para hoje</CardDescription>
                </CardHeader>
                <CardContent>
                  {appointmentsLoading ? (
                    <div className="flex justify-center py-4">
                      <span className="material-icons animate-spin">sync</span>
                    </div>
                  ) : todayAppointments?.length ? (
                    <div className="space-y-3">
                      {todayAppointments.map((appointment: any) => (
                        <div key={appointment.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex-shrink-0 mr-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="material-icons text-primary">person</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{appointment.patientName}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="material-icons text-xs mr-1">schedule</span>
                              {appointment.time}
                            </div>
                          </div>
                          <div className="ml-2">
                            {getStatusBadge(appointment.status)}
                          </div>
                          <Button variant="ghost" size="icon" className="ml-2">
                            <span className="material-icons">more_vert</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <span className="material-icons text-4xl mb-2">event_busy</span>
                      <p>Nenhuma consulta agendada para hoje</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tasks">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Suas Tarefas</CardTitle>
                  <CardDescription>Tarefas atribuídas a você</CardDescription>
                </CardHeader>
                <CardContent>
                  {tasksLoading ? (
                    <div className="flex justify-center py-4">
                      <span className="material-icons animate-spin">sync</span>
                    </div>
                  ) : tasks?.length ? (
                    <div className="space-y-3">
                      {tasks.map((task: any) => (
                        <div key={task.id} className="p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{task.title}</h3>
                            <Badge variant={task.priority === 'high' ? 'destructive' : 'outline'}>
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-xs text-gray-500">
                              Vencimento: {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              Concluir
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <span className="material-icons text-4xl mb-2">task_alt</span>
                      <p>Nenhuma tarefa pendente</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pacientes Recentes</CardTitle>
              <CardDescription>Pacientes atendidos recentemente</CardDescription>
            </CardHeader>
            <CardContent>
              {patientsLoading ? (
                <div className="flex justify-center py-4">
                  <span className="material-icons animate-spin">sync</span>
                </div>
              ) : recentPatients?.length ? (
                <div className="space-y-3">
                  {recentPatients.map((patient: any) => (
                    <div key={patient.id} className="flex items-center p-2 border-b">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="material-icons text-primary">person</span>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-xs text-gray-500">{new Date(patient.lastVisit).toLocaleDateString()}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="ml-auto">
                        <span className="material-icons text-gray-500">chevron_right</span>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 py-4 text-center">Nenhum paciente recente.</p>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Indicadores</CardTitle>
              <CardDescription>Resumo da semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Pacientes Atendidos</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <span className="material-icons text-blue-500">people</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Consultas Realizadas</p>
                    <p className="text-2xl font-bold">18</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                    <span className="material-icons text-green-500">check_circle</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Tarefas Pendentes</p>
                    <p className="text-2xl font-bold">7</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
                    <span className="material-icons text-amber-500">assignment_late</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}