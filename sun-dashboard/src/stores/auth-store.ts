import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

/**
 * User interface for authentication
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  avatar?: string;
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Authentication store interface
 */
export interface AuthStore {
  // State
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * Demo credentials for testing
 */
const DEMO_CREDENTIALS = {
  'admin@acme.com': {
    password: 'admin123',
    user: {
      id: 'admin-001',
      name: 'Admin User',
      email: 'admin@acme.com',
      role: 'admin' as const,
      avatar: 'https://i.pravatar.cc/150?u=admin@acme.com',
    },
  },
  'employee@acme.com': {
    password: 'employee123',
    user: {
      id: 'employee-001',
      name: 'Employee User',
      email: 'employee@acme.com',
      role: 'employee' as const,
      avatar: 'https://i.pravatar.cc/150?u=employee@acme.com',
    },
  },
} as const;

/**
 * Create the authentication store
 */
export const useAuthStore = create<AuthStore>()(
  immer(
    persist(
      (set) => ({
        // State
        user: null,
        isAuthenticated: false,
        isLoggingIn: false,
        isLoading: false,
        error: null,

        // Base actions
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

        // Auth actions
        login: async (credentials: LoginCredentials) => {
          set((state) => {
            state.isLoading = true;
            state.isLoggingIn = true;
            state.error = null;
          });

          try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Check demo credentials
            const demoAccount = DEMO_CREDENTIALS[credentials.email as keyof typeof DEMO_CREDENTIALS];

            if (!demoAccount || demoAccount.password !== credentials.password) {
              throw new Error('Invalid email or password');
            }

            const user = demoAccount.user;

            set((state) => {
              state.user = user;
              state.isAuthenticated = true;
              state.isLoggingIn = false;
              state.isLoading = false;
            });

            return user;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';

            set((state) => {
              state.error = errorMessage;
              state.isLoggingIn = false;
              state.isLoading = false;
            });

            throw error;
          }
        },

        logout: () => {
          set((state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoggingIn = false;
          });
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);



/**
 * Authentication store selectors
 */
export const authSelectors = {
  user: (state: AuthStore) => state.user,
  isAuthenticated: (state: AuthStore) => state.isAuthenticated,
  isLoggingIn: (state: AuthStore) => state.isLoggingIn,
  isLoading: (state: AuthStore) => state.isLoading,
  error: (state: AuthStore) => state.error,
};

/**
 * Demo credentials for reference
 */
export const DEMO_ACCOUNTS = [
  {
    email: 'admin@acme.com',
    password: 'admin123',
    role: 'admin',
    description: 'Administrator account with full access',
  },
  {
    email: 'employee@acme.com',
    password: 'employee123',
    role: 'employee',
    description: 'Employee account with limited access',
  },
] as const;
