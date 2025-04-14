import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="absolute top-4 right-4 z-50">
      <div className="flex items-center bg-white rounded-full px-2 py-1 shadow-md text-sm">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "px-2 py-1 rounded-full",
            language === "pt" ? "bg-primary text-white" : "hover:bg-gray-100"
          )}
          onClick={() => changeLanguage("pt")}
        >
          PT
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "px-2 py-1 rounded-full",
            language === "en" ? "bg-primary text-white" : "hover:bg-gray-100"
          )}
          onClick={() => changeLanguage("en")}
        >
          EN
        </Button>
      </div>
    </div>
  );
}
