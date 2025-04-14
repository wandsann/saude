import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
  active: boolean;
}

function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <li className="mb-1">
      <Link href={href}>
        <a className={cn(
          "flex items-center px-4 py-2 hover:bg-gray-100 rounded-md transition-colors",
          active ? "text-primary bg-primary/10" : "text-gray-700"
        )}>
          <span className={cn("material-icons mr-3", active ? "text-primary" : "text-gray-500")}>{icon}</span>
          <span>{label}</span>
        </a>
      </Link>
    </li>
  );
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  // Get user data with more details
  const { data: userData } = useQuery({
    queryKey: ["/api/users/profile"],
    enabled: !!user,
  });

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkSize();
    window.addEventListener("resize", checkSize);
    
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // On mobile, close sidebar after navigation
  const handleNavigation = () => {
    if (isMobile) {
      onClose();
    }
  };
  
  const handleLogout = async () => {
    await logout();
  };

  const navigationItems = [
    { href: "/home", icon: "dashboard", label: t("navigation.home") },
    { href: "/appointments", icon: "event", label: t("navigation.appointments") },
    { href: "/medications", icon: "medication", label: t("navigation.medications") },
    { href: "/records", icon: "folder", label: t("navigation.records") },
    { href: "/exams", icon: "science", label: t("navigation.exams") },
    { href: "/health-metrics", icon: "monitoring", label: t("navigation.metrics") },
  ];

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
      isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
    )}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="material-icons text-primary text-2xl">health_and_safety</span>
            <h2 className="text-lg font-medium">{t("app.name")}</h2>
          </div>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
              <span className="material-icons">close</span>
            </Button>
          )}
        </div>
        
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userData?.profilePicture} alt={user?.fullName || ""} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="font-medium text-gray-900">{user?.fullName}</p>
              <p className="text-sm text-gray-500">{userData?.healthPlanName || t("profile.defaultPlan")}</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul>
            {navigationItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={location === item.href}
              />
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <Button 
            variant="ghost" 
            className="flex items-center w-full justify-start px-4 py-2 rounded-md hover:bg-gray-100"
            onClick={handleLogout}
          >
            <span className="material-icons mr-3">logout</span>
            <span>{t("auth.logout")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
