import { useState } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registrationSchema, formatCPF } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function Register() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      cpf: "",
      birthDate: "",
      gender: "prefer_not_to_say",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value);
    form.setValue("cpf", formattedCPF);
  };

  const nextStep = async () => {
    let isValid = false;
    
    if (step === 1) {
      isValid = await form.trigger(['fullName', 'cpf', 'birthDate', 'gender']);
      if (isValid) {
        setStep(2);
        setProgress(66);
      }
    } else if (step === 2) {
      isValid = await form.trigger(['email', 'username']);
      if (isValid) {
        setStep(3);
        setProgress(100);
      }
    } else if (step === 3) {
      isValid = await form.trigger(['password', 'confirmPassword']);
      if (isValid) {
        handleSubmit();
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(step === 3 ? 66 : 33);
    }
  };

  const handleSubmit = async () => {
    if (await form.trigger()) {
      const values = form.getValues();
      
      try {
        const success = await register(values);
        if (success) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Registration error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/login")}>
          <span className="material-icons">arrow_back</span>
        </Button>
        <h1 className="text-2xl font-medium text-gray-900 ml-2">{t("register.title")}</h1>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            {step === 1 ? t("register.step1") : step === 2 ? t("register.step2") : t("register.step3")}
          </span>
          <span className="text-sm text-primary font-medium">
            {step === 1 
              ? t("register.step1Title") 
              : step === 2 
                ? t("register.step2Title") 
                : t("register.step3Title")}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form className="space-y-4">
              {step === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("register.fullName")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("register.fullName")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("register.cpf")}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="000.000.000-00" 
                            {...field} 
                            onChange={(e) => {
                              handleCPFChange(e);
                              field.onChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("register.birthDate")}</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("register.gender")}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("register.gender")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">{t("register.male")}</SelectItem>
                            <SelectItem value="female">{t("register.female")}</SelectItem>
                            <SelectItem value="other">{t("register.other")}</SelectItem>
                            <SelectItem value="prefer_not_to_say">{t("register.preferNotToSay")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              
              {step === 2 && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("register.email")}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
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
                </>
              )}
              
              {step === 3 && (
                <>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.password")}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.confirmPassword")}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              
              <div className="flex justify-between pt-4">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    {t("register.back")}
                  </Button>
                )}
                
                <Button 
                  type="button" 
                  className={step === 1 ? "w-full" : ""}
                  onClick={nextStep}
                >
                  {step < 3 ? t("register.continue") : t("register.finish")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
