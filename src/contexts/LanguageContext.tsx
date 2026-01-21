import { createContext, useContext, useState, ReactNode } from 'react';
import { Language, t, TranslationKey } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getDefaultLanguage(): Language {
  const browserLang = navigator.language || (navigator as any).userLanguage || 'en';
  // If browser language starts with 'en', use English; otherwise default to Ukrainian
  return browserLang.toLowerCase().startsWith('en') ? 'en' : 'uk';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getDefaultLanguage);

  const translate = (key: TranslationKey) => t(key, language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}