import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Language } from "@/lib/i18n";

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({} as LanguageContextType);

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get language from localStorage or use browser language
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "pt" || savedLanguage === "en")) {
      return savedLanguage;
    }
    
    // Check browser language
    const browserLang = navigator.language.split("-")[0];
    return browserLang === "pt" ? "pt" : "en";
  });

  // Translation function
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        // Fallback to English if key not found in current language
        let fallbackValue = translations["en"];
        for (const fallbackKey of keys) {
          if (fallbackValue && fallbackValue[fallbackKey]) {
            fallbackValue = fallbackValue[fallbackKey];
          } else {
            return key; // Return the key if not found in fallback either
          }
        }
        return typeof fallbackValue === "string" ? fallbackValue : key;
      }
    }
    
    return typeof value === "string" ? value : key;
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    
    // Set document language for accessibility
    document.documentElement.lang = lang;
  };

  // Set document language on initial load
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    language,
    changeLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
