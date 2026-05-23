"use client";

import React, { createContext, useContext } from "react";
import { Locale } from "@/dictionaries";

interface LanguageContextProps {
  locale: Locale;
  dir: "ltr" | "rtl";
  dictionary: any;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextProps | null>(null);

export function LanguageProvider({
  children,
  locale,
  dictionary,
}: {
  children: React.ReactNode;
  locale: Locale;
  dictionary: any;
}) {
  const dir = locale === "ar" ? "rtl" : "ltr";

  // Translate function that resolves nested keys like 'nav.home'
  const t = (key: string): any => {
    if (!dictionary) return key;
    const parts = key.split(".");
    let current = dictionary;
    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        return key; // Fallback to raw key string if translation is missing
      }
    }
    return current !== undefined ? current : key;
  };

  return (
    <LanguageContext.Provider value={{ locale, dir, dictionary, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
