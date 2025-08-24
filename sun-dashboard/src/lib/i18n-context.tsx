import React, { createContext, useContext, useCallback } from 'react';
import type { Language, TranslationKeyPath, I18nContextType } from '@/types/i18n';
import {
  getTranslation,
  translations,
} from '@/lib/i18n';
import { useSettingsStore } from '@/stores/settings-store';

// Create the i18n context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: React.ReactNode;
}

/**
 * I18n Provider component that provides translation functions
 * Language state is managed by the Settings Store
 */
export function I18nProvider({ children }: I18nProviderProps) {
  // Get language from Settings Store instead of managing our own state
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);

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
