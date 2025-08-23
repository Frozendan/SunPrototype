import { create } from 'zustand';
import { StateCreator } from 'zustand';
import type { Language } from '@/types/i18n';
import { createPersistedStore, BaseStore, createBaseStoreSlice } from '@/lib/store-utils';
import { DEFAULT_LANGUAGE } from '@/lib/i18n';

/**
 * Theme types
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Settings store state
 */
export interface SettingsState {
  language: Language;
  theme: Theme;
  sidebarCollapsed: boolean;
  notifications: boolean;
}

/**
 * Settings store actions
 */
export interface SettingsActions {
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setNotifications: (enabled: boolean) => void;
  resetSettings: () => void;
}

/**
 * Combined settings store interface
 */
export interface SettingsStore extends BaseStore, SettingsState, SettingsActions {}

/**
 * Default settings
 */
const defaultSettings: SettingsState = {
  language: DEFAULT_LANGUAGE,
  theme: 'system',
  sidebarCollapsed: false,
  notifications: true,
};

/**
 * Settings store creator
 */
const createSettingsStore: StateCreator<
  SettingsStore,
  [['zustand/immer', never]],
  [],
  SettingsStore
> = (set, get) => ({
  // Base store
  ...createBaseStoreSlice(set, get, {} as any),
  
  // Settings state
  ...defaultSettings,
  
  // Settings actions
  setLanguage: (language: Language) =>
    set((state) => {
      state.language = language;
    }),
    
  setTheme: (theme: Theme) =>
    set((state) => {
      state.theme = theme;
    }),
    
  toggleSidebar: () =>
    set((state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    }),
    
  setSidebarCollapsed: (collapsed: boolean) =>
    set((state) => {
      state.sidebarCollapsed = collapsed;
    }),
    
  setNotifications: (enabled: boolean) =>
    set((state) => {
      state.notifications = enabled;
    }),
    
  resetSettings: () =>
    set((state) => {
      Object.assign(state, defaultSettings);
    }),
});

/**
 * Create the persisted settings store
 */
export const useSettingsStore = create<SettingsStore>()(
  createPersistedStore(createSettingsStore, {
    name: 'settings-store',
    partialize: (state) => ({
      language: state.language,
      theme: state.theme,
      sidebarCollapsed: state.sidebarCollapsed,
      notifications: state.notifications,
    }),
  })
);

/**
 * Settings store selectors for optimized re-renders
 */
export const settingsSelectors = {
  language: (state: SettingsStore) => state.language,
  theme: (state: SettingsStore) => state.theme,
  sidebarCollapsed: (state: SettingsStore) => state.sidebarCollapsed,
  notifications: (state: SettingsStore) => state.notifications,
  isLoading: (state: SettingsStore) => state.isLoading,
  error: (state: SettingsStore) => state.error,
};
