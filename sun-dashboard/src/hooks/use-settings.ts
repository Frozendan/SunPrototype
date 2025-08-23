import { useCallback } from 'react';
import { useSettingsStore, settingsSelectors } from '@/stores/settings-store';
import type { Language } from '@/types/i18n';
import type { Theme } from '@/stores/settings-store';

/**
 * Hook for managing application settings
 */
export function useSettings() {
  const language = useSettingsStore(settingsSelectors.language);
  const theme = useSettingsStore(settingsSelectors.theme);
  const sidebarCollapsed = useSettingsStore(settingsSelectors.sidebarCollapsed);
  const notifications = useSettingsStore(settingsSelectors.notifications);
  const isLoading = useSettingsStore(settingsSelectors.isLoading);
  const error = useSettingsStore(settingsSelectors.error);
  
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const toggleSidebar = useSettingsStore((state) => state.toggleSidebar);
  const setSidebarCollapsed = useSettingsStore((state) => state.setSidebarCollapsed);
  const setNotifications = useSettingsStore((state) => state.setNotifications);
  const resetSettings = useSettingsStore((state) => state.resetSettings);
  const clearError = useSettingsStore((state) => state.clearError);

  return {
    // State
    language,
    theme,
    sidebarCollapsed,
    notifications,
    isLoading,
    error,
    
    // Actions
    setLanguage,
    setTheme,
    toggleSidebar,
    setSidebarCollapsed,
    setNotifications,
    resetSettings,
    clearError,
  };
}

/**
 * Hook for language management specifically
 */
export function useLanguage() {
  const language = useSettingsStore(settingsSelectors.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  
  const changeLanguage = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
  }, [setLanguage]);

  return {
    language,
    setLanguage: changeLanguage,
  };
}

/**
 * Hook for theme management specifically
 */
export function useTheme() {
  const theme = useSettingsStore(settingsSelectors.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  
  const changeTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, [setTheme]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [theme, setTheme]);

  return {
    theme,
    setTheme: changeTheme,
    toggleTheme,
  };
}

/**
 * Hook for sidebar management specifically
 */
export function useSidebar() {
  const sidebarCollapsed = useSettingsStore(settingsSelectors.sidebarCollapsed);
  const toggleSidebar = useSettingsStore((state) => state.toggleSidebar);
  const setSidebarCollapsed = useSettingsStore((state) => state.setSidebarCollapsed);

  return {
    isCollapsed: sidebarCollapsed,
    toggle: toggleSidebar,
    setCollapsed: setSidebarCollapsed,
  };
}
