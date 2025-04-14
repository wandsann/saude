import { useState } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";
import { 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  OAuthProvider,
  signInWithPopup, 
  AuthProvider 
} from "firebase/auth";
import { auth, googleProvider, facebookProvider, appleProvider } from "@/lib/firebase";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SiGoogle, SiFacebook, SiApple } from "react-icons/si";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      setIsSubmitting(true);
      // Usuário regular (funcionário) - o papel será determinado automaticamente no backend
      const success = await login(values.username, values.password);
      if (success) {
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: t("auth.loginError"),
        description: error instanceof Error ? error.message : "Erro desconhecido ao fazer login",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const handleSocialLogin = async (provider: AuthProvider) => {
    try {
      setIsSubmitting(true);
      
      // Social login sempre cria/autentica um paciente
      const result = await signInWithPopup(auth, provider);
      
      // Extrair informações do usuário
      const user = result.user;
      const email = user.email;
      const displayName = user.displayName;
      const photoURL = user.photoURL;
      
      // Aqui você enviaria estas informações para o backend para criar ou autenticar o usuário
      // Como estamos usando autenticação social, assumimos que será um paciente
      const success = await login(email || "", "social-auth-token", "patient", {
        email,
        displayName,
        photoURL,
        isNewUser: result._tokenResponse?.isNewUser,
        providerId: provider.providerId
      });
      
      if (success) {
        navigate("/home");
      }
    } catch (error) {
      console.error("Social login error:", error);
      toast({
        variant: "destructive",
        title: "Erro de autenticação social",
        description: error instanceof Error ? error.message : "Erro desconhecido ao realizar login social",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBiometricLogin = () => {
    toast({
      title: "Biometria",
      description: "Funcionalidade de biometria não disponível nesta versão.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-blue-100 mb-4">
            <span className="material-icons text-4xl text-primary">health_and_safety</span>
          </div>
          <h1 className="text-3xl font-medium text-gray-900 mb-2">{t("app.name")}</h1>
          <p className="text-gray-500">{t("app.tagline")}</p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.username")}</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.password")}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <div className="flex justify-end mt-1">
                        <Button 
                          variant="link" 
                          className="text-sm px-0" 
                          onClick={() => navigate("/forgot-password")}
                        >
                          {t("auth.forgotPassword")}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Tipo de usuário removido - será determinado automaticamente */}
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="material-icons animate-spin">sync</span>
                  ) : (
                    t("auth.login")
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500 mb-3">Ou acesse com</p>
                <div className="flex justify-center space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => handleSocialLogin(googleProvider)}
                    disabled={isSubmitting}
                  >
                    <SiGoogle className="h-5 w-5 text-red-500" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => handleSocialLogin(facebookProvider)}
                    disabled={isSubmitting}
                  >
                    <SiFacebook className="h-5 w-5 text-blue-600" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => handleSocialLogin(appleProvider)}
                    disabled={isSubmitting}
                  >
                    <SiApple className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-500">
                  {t("auth.noAccount")}{" "}
                  <Button 
                    variant="link" 
                    className="text-primary font-medium px-1 py-0" 
                    onClick={() => navigate("/register")}
                  >
                    {t("auth.register")}
                  </Button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Biometric Login Option */}
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-14 w-14" 
            onClick={handleBiometricLogin}
          >
            <span className="material-icons text-2xl text-primary">fingerprint</span>
          </Button>
          <p className="text-sm text-gray-500 mt-2">{t("auth.biometricLogin")}</p>
        </div>
        
        {/* Test Users Link */}
        <div className="mt-4 text-center">
          <Button
            variant="link"
            className="text-primary"
            onClick={() => navigate("/test-users")}
          >
            Acessar usuários de teste
          </Button>
        </div>
      </div>
    </div>
  );
}
