import type { Language, TranslationKeys, TranslationKeyPath } from '@/types/i18n';

// Import translation files
import viTranslations from '@/locales/vi.json';
import enTranslations from '@/locales/en.json';

// Default language is Vietnamese as requested
export const DEFAULT_LANGUAGE: Language = 'vi';

// Available languages
export const AVAILABLE_LANGUAGES: Language[] = ['vi', 'en'];

// Translation data
export const translations: Record<Language, TranslationKeys> = {
  vi: viTranslations as TranslationKeys,
  en: enTranslations as TranslationKeys,
};

// Language names for display
export const LANGUAGE_NAMES: Record<Language, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
};

/**
 * Get translation by key path
 * @param language - Current language
 * @param keyPath - Dot-separated key path (e.g., 'common.home')
 * @returns Translated string
 */
export function getTranslation(language: Language, keyPath: TranslationKeyPath): string {
  const keys = keyPath.split('.');
  let value: any = translations[language];
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      // Fallback to default language if key not found
      console.warn(`Translation key "${keyPath}" not found for language "${language}". Falling back to default language.`);
      let fallbackValue: any = translations[DEFAULT_LANGUAGE];
      for (const fallbackKey of keys) {
        if (fallbackValue && typeof fallbackValue === 'object' && fallbackKey in fallbackValue) {
          fallbackValue = fallbackValue[fallbackKey];
        } else {
          console.error(`Translation key "${keyPath}" not found in any language.`);
          return keyPath; // Return the key path as fallback
        }
      }
      return fallbackValue;
    }
  }
  
  return typeof value === 'string' ? value : keyPath;
}

/**
 * Get the browser's preferred language
 * @returns Language code or default language
 */
export function getBrowserLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  const browserLang = navigator.language.toLowerCase();
  
  // Check for exact match
  if (AVAILABLE_LANGUAGES.includes(browserLang as Language)) {
    return browserLang as Language;
  }
  
  // Check for language prefix match (e.g., 'vi-VN' -> 'vi')
  const langPrefix = browserLang.split('-')[0] as Language;
  if (AVAILABLE_LANGUAGES.includes(langPrefix)) {
    return langPrefix;
  }
  
  return DEFAULT_LANGUAGE;
}

/**
 * Get language from localStorage or browser preference
 * @returns Stored or preferred language
 */
export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  try {
    const stored = localStorage.getItem('language') as Language;
    if (stored && AVAILABLE_LANGUAGES.includes(stored)) {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to read language from localStorage:', error);
  }
  
  return getBrowserLanguage();
}

/**
 * Store language preference in localStorage
 * @param language - Language to store
 */
export function storeLanguage(language: Language): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('language', language);
  } catch (error) {
    console.warn('Failed to store language in localStorage:', error);
  }
}
