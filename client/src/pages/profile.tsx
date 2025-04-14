import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { User } from "lucide-react";

// Form schema
const profileFormSchema = z.object({
  fullName: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  healthPlanName: z.string().optional(),
  healthPlanNumber: z.string().optional(),
  language: z.enum(["pt", "en"]),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function Profile() {
  const { t, language, changeLanguage } = useLanguage();
  const { logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    appointments: true,
    medications: true,
    results: true,
    newsletter: false,
  });
  
  // Fetch user data
  const { data: userData, isLoading } = useQuery({
    queryKey: ["/api/users/profile"],
  });
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<ProfileFormValues>) => {
      return apiRequest("PUT", "/api/users/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/profile"] });
      toast({
        title: t("profile.updateSuccess"),
        description: t("profile.updateSuccessDescription"),
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: t("profile.updateError"),
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
  
  // Set up form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      healthPlanName: "",
      healthPlanNumber: "",
      language: "pt",
    },
  });
  
  // Update form values when user data is loaded
  useState(() => {
    if (userData) {
      form.reset({
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone || "",
        address: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
        zipCode: userData.zipCode || "",
        healthPlanName: userData.healthPlanName || "",
        healthPlanNumber: userData.healthPlanNumber || "",
        language: userData.language || "pt",
      });
    }
  });
  
  // Handle form submission
  const onSubmit = (values: ProfileFormValues) => {
    updateProfileMutation.mutate(values);
  };
  
  // Handle language change
  const handleLanguageChange = (value: "pt" | "en") => {
    changeLanguage(value);
    form.setValue("language", value);
  };
  
  // Handle logout
  const handleLogout = async () => {
    await logout();
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <PageLayout title={t("profile.title")}>
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-900 mb-1">{t("profile.title")}</h1>
        <p className="text-gray-500">{t("profile.subtitle")}</p>
      </div>
      
      {/* Profile header with avatar */}
      <div className="mb-6">
        <Card className="shadow-md overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <div className="mb-4 md:mb-0 md:mr-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userData?.profilePicture} alt={userData?.fullName || ""} />
                  <AvatarFallback className="text-lg">
                    {userData?.fullName ? getInitials(userData.fullName) : <User className="h-10 w-10" />}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="text-center md:text-left flex-1">
                {isLoading ? (
                  <>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-6 w-32" />
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-medium text-gray-900">{userData?.fullName}</h2>
                    <p className="text-gray-500">{userData?.email}</p>
                    <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <span className="material-icons text-sm">badge</span>
                        {t("profile.level")} {userData?.level || 1}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <span className="material-icons text-sm">emoji_events</span>
                        {userData?.points || 0} {t("profile.points")}
                      </Badge>
                      {userData?.healthPlanName && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <span className="material-icons text-sm">health_and_safety</span>
                          {userData.healthPlanName}
                        </Badge>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="mt-4 md:mt-0">
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <span className="material-icons text-sm mr-1">logout</span>
                  {t("auth.logout")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Profile tabs */}
      <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="personal">{t("profile.personalInfo")}</TabsTrigger>
          <TabsTrigger value="health">{t("profile.healthInfo")}</TabsTrigger>
          <TabsTrigger value="preferences">{t("profile.preferences")}</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="personal" className="space-y-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>{t("profile.personalInfo")}</CardTitle>
                  <CardDescription>{t("profile.personalInfoDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("register.fullName")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("register.email")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("register.phone")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("register.address")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("register.city")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("register.state")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("register.zipCode")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending ? (
                      <span className="material-icons animate-spin mr-2">sync</span>
                    ) : null}
                    {t("profile.saveChanges")}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="health" className="space-y-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>{t("profile.healthInfo")}</CardTitle>
                  <CardDescription>{t("profile.healthInfoDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="healthPlanName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("register.healthPlan")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="healthPlanNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("register.healthPlanNumber")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending ? (
                      <span className="material-icons animate-spin mr-2">sync</span>
                    ) : null}
                    {t("profile.saveChanges")}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>{t("profile.preferences")}</CardTitle>
                  <CardDescription>{t("profile.preferencesDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Language */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">{t("profile.language")}</h3>
                    <div className="flex items-center space-x-4">
                      <Button 
                        variant={language === "pt" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => handleLanguageChange("pt")}
                      >
                        Português
                      </Button>
                      <Button 
                        variant={language === "en" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => handleLanguageChange("en")}
                      >
                        English
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Notifications */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">{t("profile.notifications")}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{t("profile.appointmentReminders")}</p>
                          <p className="text-sm text-gray-500">{t("profile.appointmentRemindersDescription")}</p>
                        </div>
                        <Switch 
                          checked={notifications.appointments} 
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, appointments: checked }))}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{t("profile.medicationReminders")}</p>
                          <p className="text-sm text-gray-500">{t("profile.medicationRemindersDescription")}</p>
                        </div>
                        <Switch 
                          checked={notifications.medications} 
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, medications: checked }))}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{t("profile.testResults")}</p>
                          <p className="text-sm text-gray-500">{t("profile.testResultsDescription")}</p>
                        </div>
                        <Switch 
                          checked={notifications.results} 
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, results: checked }))}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{t("profile.newsletter")}</p>
                          <p className="text-sm text-gray-500">{t("profile.newsletterDescription")}</p>
                        </div>
                        <Switch 
                          checked={notifications.newsletter} 
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, newsletter: checked }))}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Theme */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">{t("profile.theme")}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t("profile.darkMode")}</p>
                        <p className="text-sm text-gray-500">{t("profile.darkModeDescription")}</p>
                      </div>
                      <Switch 
                        checked={isDarkMode} 
                        onCheckedChange={setIsDarkMode}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="button" onClick={() => toast({ title: t("profile.preferencesUpdated") })}>
                    {t("profile.saveChanges")}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </PageLayout>
  );
}

// Badge component (defined here to avoid circular imports)
interface BadgeProps {
  variant?: "default" | "outline";
  className?: string;
  children: React.ReactNode;
}

function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      variant === "default" 
        ? "bg-primary text-white" 
        : "bg-gray-100 text-gray-800 border border-gray-200"
    } ${className}`}>
      {children}
    </span>
  );
}
