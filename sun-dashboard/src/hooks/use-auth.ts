import { useCallback } from 'react';
import { useAuthStore, authSelectors } from '@/stores/auth-store';
import type { LoginCredentials, AuthUser } from '@/stores/auth-store';

/**
 * Hook for managing authentication
 */
export function useAuth() {
  const user = useAuthStore(authSelectors.user);
  const isAuthenticated = useAuthStore(authSelectors.isAuthenticated);
  const isLoggingIn = useAuthStore(authSelectors.isLoggingIn);
  const isLoading = useAuthStore(authSelectors.isLoading);
  const error = useAuthStore(authSelectors.error);
  
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const clearError = useAuthStore((state) => state.clearError);

  const handleLogin = useCallback(async (credentials: LoginCredentials): Promise<AuthUser> => {
    return await login(credentials);
  }, [login]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  // Check if user has specific role
  const hasRole = useCallback((role: 'admin' | 'employee'): boolean => {
    return user?.role === role;
  }, [user]);

  // Check if user is admin
  const isAdmin = useCallback((): boolean => {
    return user?.role === 'admin';
  }, [user]);

  // Check if user is employee
  const isEmployee = useCallback((): boolean => {
    return user?.role === 'employee';
  }, [user]);

  return {
    // State
    user,
    isAuthenticated,
    isLoggingIn,
    isLoading,
    error,
    
    // Actions
    login: handleLogin,
    logout: handleLogout,
    clearError: handleClearError,
    
    // Utilities
    hasRole,
    isAdmin,
    isEmployee,
  };
}

/**
 * Hook for checking authentication status
 */
export function useAuthStatus() {
  const isAuthenticated = useAuthStore(authSelectors.isAuthenticated);
  const isLoading = useAuthStore(authSelectors.isLoading);
  const user = useAuthStore(authSelectors.user);

  return {
    isAuthenticated,
    isLoading,
    user,
    isAdmin: user?.role === 'admin',
    isEmployee: user?.role === 'employee',
  };
}

/**
 * Hook for protected routes
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuthStatus();
  
  return {
    isAuthenticated,
    isLoading,
    shouldRedirect: !isLoading && !isAuthenticated,
  };
}
