import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { translations, type Language } from "@/lib/translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "es";
  const stored = window.localStorage.getItem("linkedgol_lang");
  if (stored === "es" || stored === "en") return stored;
  // Default to the browser's language if it's English, otherwise Spanish
  // (Linkedgol's primary market is Spanish-speaking).
  return navigator.language?.toLowerCase().startsWith("en") ? "en" : "es";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem("linkedgol_lang", language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => setLanguageState(lang);

  // Looks up "namespace.key" (e.g. "home.heroTitle") in the current
  // language's dictionary. Falls back to the key itself if not found, so
  // missing translations are visible/obvious instead of crashing.
  const t = (path: string): string => {
    const parts = path.split(".");
    let node: any = translations[language];
    for (const part of parts) {
      node = node?.[part];
      if (node === undefined) return path;
    }
    return typeof node === "string" ? node : path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
