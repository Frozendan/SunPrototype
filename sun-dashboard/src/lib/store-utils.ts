import { StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

/**
 * Base interface for all stores with loading and error states
 */
export interface BaseStoreState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Base actions for all stores
 */
export interface BaseStoreActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * Combined base store interface
 */
export interface BaseStore extends BaseStoreState, BaseStoreActions {}

/**
 * Create base store slice with common loading and error handling
 */
export const createBaseStoreSlice: StateCreator<
  BaseStore,
  [['zustand/immer', never]],
  [],
  BaseStore
> = (set, _get, _store) => ({
  isLoading: false,
  error: null,
  
  setLoading: (loading: boolean) =>
    set((state) => {
      state.isLoading = loading;
    }),
    
  setError: (error: string | null) =>
    set((state) => {
      state.error = error;
      state.isLoading = false;
    }),
    
  clearError: () =>
    set((state) => {
      state.error = null;
    }),
});

/**
 * Create a persisted store with immer middleware
 */
export function createPersistedStore<T>(
  storeCreator: StateCreator<T, [['zustand/immer', never]], [], T>,
  persistOptions: PersistOptions<T>
) {
  return persist(immer(storeCreator), persistOptions);
}

/**
 * Utility function to generate unique IDs
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Utility function to simulate API delay for demo purposes
 */
export function simulateApiDelay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generic CRUD operations interface
 */
export interface CrudOperations<T> {
  items: T[];
  getAll: () => T[];
  getById: (id: string) => T | undefined;
  create: (item: Omit<T, 'id'>) => Promise<T>;
  update: (id: string, updates: Partial<T>) => Promise<T>;
  delete: (id: string) => Promise<void>;
}

/**
 * Create CRUD operations for a store
 */
export function createCrudOperations<T extends { id: string }>() {
  return {
    getAll: (items: T[]) => items,
    
    getById: (items: T[], id: string) => 
      items.find(item => item.id === id),
    
    create: async (_items: T[], newItem: Omit<T, 'id'>): Promise<T> => {
      await simulateApiDelay();
      const item = { ...newItem, id: generateId() } as T;
      return item;
    },
    
    update: async (items: T[], id: string, updates: Partial<T>): Promise<T> => {
      await simulateApiDelay();
      const index = items.findIndex(item => item.id === id);
      if (index === -1) {
        throw new Error(`Item with id ${id} not found`);
      }
      const updatedItem = { ...items[index], ...updates };
      return updatedItem;
    },
    
    delete: async (items: T[], id: string): Promise<void> => {
      await simulateApiDelay();
      const index = items.findIndex(item => item.id === id);
      if (index === -1) {
        throw new Error(`Item with id ${id} not found`);
      }
    },
  };
}
