import { useLocation, Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  const [location] = useLocation();
  const { t } = useLanguage();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-10">
      <div className="flex justify-around">
        <Link href="/home">
          <a className={cn(
            "flex flex-col items-center p-2",
            isActive("/home") ? "text-primary" : "text-gray-500"
          )}>
            <span className="material-icons">dashboard</span>
            <span className="text-xs mt-1">{t("navigation.home")}</span>
          </a>
        </Link>
        
        <Link href="/appointments">
          <a className={cn(
            "flex flex-col items-center p-2",
            isActive("/appointments") ? "text-primary" : "text-gray-500"
          )}>
            <span className="material-icons">event</span>
            <span className="text-xs mt-1">{t("navigation.appointments")}</span>
          </a>
        </Link>
        
        <Link href="/medications">
          <a className={cn(
            "flex flex-col items-center p-2",
            isActive("/medications") ? "text-primary" : "text-gray-500"
          )}>
            <span className="material-icons">medication</span>
            <span className="text-xs mt-1">{t("navigation.medications")}</span>
          </a>
        </Link>
        
        <Link href="/health-metrics">
          <a className={cn(
            "flex flex-col items-center p-2",
            isActive("/health-metrics") ? "text-primary" : "text-gray-500"
          )}>
            <span className="material-icons">monitoring</span>
            <span className="text-xs mt-1">{t("navigation.metrics")}</span>
          </a>
        </Link>
        
        <Link href="/profile">
          <a className={cn(
            "flex flex-col items-center p-2",
            isActive("/profile") ? "text-primary" : "text-gray-500"
          )}>
            <span className="material-icons">person</span>
            <span className="text-xs mt-1">{t("navigation.profile")}</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
