import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
  department?: string;
  specialty?: string;
}

interface SocialAuthData {
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  isNewUser?: boolean;
  providerId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string, role?: string, socialAuthData?: SocialAuthData) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/auth/current-user", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string, role?: string, socialAuthData?: SocialAuthData): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Se temos dados de autenticação social, estamos fazendo login/registro via provedor social
      if (socialAuthData) {
        const response = await apiRequest("POST", "/api/auth/social-login", { 
          email: username, // username é o email para login social
          socialAuthData,
          role: role || "patient" // Login social é sempre para pacientes
        });
        
        const data = await response.json();
        setUser(data.user);
        queryClient.invalidateQueries();
        return true;
      } else {
        // Login regular - o papel do usuário será determinado automaticamente no servidor
        const response = await apiRequest("POST", "/api/auth/login", { username, password });
        const data = await response.json();
        
        setUser(data.user);
        // Invalidate any existing queries to refetch data
        queryClient.invalidateQueries();
        return true;
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: error instanceof Error ? error.message : "Credenciais inválidas",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await apiRequest("POST", "/api/auth/logout");
      setUser(null);
      // Clear query cache on logout
      queryClient.clear();
    } catch (error) {
      toast({
        title: "Erro ao fazer logout",
        description: error instanceof Error ? error.message : "Não foi possível fazer o logout",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      await apiRequest("POST", "/api/auth/register", userData);
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Agora você pode fazer login com suas credenciais",
      });
      return true;
    } catch (error) {
      toast({
        title: "Erro ao cadastrar",
        description: error instanceof Error ? error.message : "Não foi possível completar o cadastro",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
