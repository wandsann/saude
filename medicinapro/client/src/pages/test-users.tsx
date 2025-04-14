import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface TestUser {
  username: string;
  password: string;
  fullName: string;
  role: string;
  description: string;
}

export default function TestUsers() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Lista de usuários de teste disponíveis
  const testUsers: TestUser[] = [
    {
      username: "anasilva",
      password: "password123",
      fullName: "Ana Silva",
      role: "patient",
      description: "Paciente padrão com histórico médico completo"
    },
    {
      username: "drcarlos",
      password: "password123",
      fullName: "Dr. Carlos Oliveira",
      role: "doctor",
      description: "Médico especialista em cardiologia"
    },
    {
      username: "enfmaria",
      password: "password123",
      fullName: "Maria Santos",
      role: "nurse",
      description: "Enfermeira chefe da unidade de terapia intensiva"
    },
    {
      username: "josesilva",
      password: "password123",
      fullName: "José Silva",
      role: "cleaner",
      description: "Funcionário de limpeza e higienização"
    },
    {
      username: "pedroalves",
      password: "password123",
      fullName: "Pedro Alves",
      role: "cook",
      description: "Cozinheiro responsável pelas refeições especiais"
    },
    {
      username: "julianafarmacia",
      password: "password123",
      fullName: "Juliana Souza",
      role: "pharmacist",
      description: "Farmacêutica responsável pelo controle de medicamentos"
    },
    {
      username: "adminsilva",
      password: "password123",
      fullName: "Amanda Silva",
      role: "admin",
      description: "Administradora do sistema com acesso total"
    }
  ];

  const handleLogin = async (username: string, password: string) => {
    try {
      setIsLoading(username);
      
      // O tipo de usuário será determinado automaticamente no sistema
      const success = await login(username, password);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Redirecionando para o dashboard...",
        });
        
        navigate("/home");
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="container py-10 mx-auto">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Usuários de Teste Disponíveis</CardTitle>
          <p className="text-center text-muted-foreground mt-2">
            Selecione um usuário para testar o sistema. Cada tipo de usuário tem acesso a funcionalidades diferentes.
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testUsers.map((user) => (
                <TableRow key={user.username}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'doctor' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'nurse' ? 'bg-green-100 text-green-800' :
                      user.role === 'cleaner' ? 'bg-yellow-100 text-yellow-800' :
                      user.role === 'cook' ? 'bg-orange-100 text-orange-800' :
                      user.role === 'pharmacist' ? 'bg-teal-100 text-teal-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {user.role === 'patient' ? 'Paciente' :
                       user.role === 'doctor' ? 'Médico' :
                       user.role === 'nurse' ? 'Enfermeiro' :
                       user.role === 'cleaner' ? 'Faxineiro' :
                       user.role === 'cook' ? 'Cozinheiro' :
                       user.role === 'pharmacist' ? 'Farmacêutico' :
                       'Administrador'}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{user.description}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLogin(user.username, user.password)}
                      disabled={isLoading === user.username}
                    >
                      {isLoading === user.username ? (
                        <span className="material-icons animate-spin h-4 w-4 mr-1">refresh</span>
                      ) : (
                        <span className="material-icons h-4 w-4 mr-1">login</span>
                      )}
                      Acessar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-6 flex justify-center">
            <Button 
              variant="ghost"
              className="text-muted-foreground"
              onClick={() => navigate("/login")}
            >
              Voltar para login convencional
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}