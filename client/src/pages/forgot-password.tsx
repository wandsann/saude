import { useState } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPassword() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);
      // In a real app, we would call an API to send the reset email
      console.log("Reset password for:", values.email);
      
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      toast({
        title: "Email de recuperação enviado",
        description: "Se o email existir em nossa base de dados, você receberá instruções para redefinir sua senha.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar o email de recuperação. Tente novamente mais tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/login")}>
          <span className="material-icons">arrow_back</span>
        </Button>
        <h1 className="text-2xl font-medium text-gray-900 ml-2">{t("auth.forgotPassword")}</h1>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            {!submitted ? (
              <>
                <p className="text-gray-500 mb-6">
                  Digite seu email para receber instruções sobre como redefinir sua senha.
                </p>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.email")}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="material-icons animate-spin">sync</span>
                      ) : (
                        "Enviar instruções"
                      )}
                    </Button>
                  </form>
                </Form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="mb-4 text-green-500">
                  <span className="material-icons text-4xl">check_circle</span>
                </div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">Email enviado</h2>
                <p className="text-gray-500 mb-6">
                  Se o email existir em nossa base de dados, você receberá instruções para redefinir sua senha.
                </p>
                <Button onClick={() => navigate("/login")}>
                  Voltar para o login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
