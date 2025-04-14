import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/layout/LanguageSelector";

// Auth pages
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgot-password";
import TestUsers from "@/pages/test-users";

// Main app pages
import Home from "@/pages/home";
import Appointments from "@/pages/appointments";
import Medications from "@/pages/medications";
import Records from "@/pages/records";
import Exams from "@/pages/exams";
import HealthMetrics from "@/pages/health-metrics";
import Profile from "@/pages/profile";

// Fallback
import NotFound from "@/pages/not-found";
import { useAuth } from "./contexts/AuthContext";

// Protected route component
function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType<any>, [key: string]: any }) {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, isLoading, setLocation]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <span className="material-icons animate-spin text-4xl text-primary">sync</span>
          <p className="mt-2 text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <Component {...rest} /> : null;
}

function AppRoutes() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/test-users" component={TestUsers} />
      
      {/* Protected routes */}
      <Route path="/home">
        <ProtectedRoute component={Home} />
      </Route>
      <Route path="/appointments">
        <ProtectedRoute component={Appointments} />
      </Route>
      <Route path="/medications">
        <ProtectedRoute component={Medications} />
      </Route>
      <Route path="/records">
        <ProtectedRoute component={Records} />
      </Route>
      <Route path="/exams">
        <ProtectedRoute component={Exams} />
      </Route>
      <Route path="/health-metrics">
        <ProtectedRoute component={HealthMetrics} />
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={Profile} />
      </Route>
      
      {/* Default route - redirect to login or home */}
      <Route path="/">
        <RedirectHandler />
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Component to redirect based on auth state
function RedirectHandler() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      setLocation(isAuthenticated ? "/home" : "/login");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <span className="material-icons animate-spin text-4xl text-primary">sync</span>
        <p className="mt-2 text-gray-500">Redirecionando...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <LanguageSelector />
            <AppRoutes />
          </div>
          <Toaster />
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
