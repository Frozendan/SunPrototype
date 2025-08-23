import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Language, TranslationKeyPath, I18nContextType } from '@/types/i18n';
import { 
  getTranslation, 
  getStoredLanguage, 
  storeLanguage, 
  translations,
  DEFAULT_LANGUAGE 
} from '@/lib/i18n';

// Create the i18n context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: React.ReactNode;
}

/**
 * I18n Provider component that manages language state and provides translation functions
 */
export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  // Initialize language from storage on mount
  useEffect(() => {
    const storedLanguage = getStoredLanguage();
    setLanguageState(storedLanguage);
  }, []);

  // Update language and persist to storage
  const setLanguage = useCallback((newLanguage: Language) => {
    setLanguageState(newLanguage);
    storeLanguage(newLanguage);
  }, []);

  // Translation function
  const t = useCallback((key: TranslationKeyPath): string => {
    return getTranslation(language, key);
  }, [language]);

  // Get current translations object
  const currentTranslations = translations[language];

  const contextValue: I18nContextType = {
    language,
    setLanguage,
    t,
    translations: currentTranslations,
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Hook to access i18n context
 * @returns I18n context with language state and translation functions
 */
export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  
  return context;
}

/**
 * Hook to get translation function only (for convenience)
 * @returns Translation function
 */
export function useTranslation() {
  const { t } = useI18n();
  return { t };
}
