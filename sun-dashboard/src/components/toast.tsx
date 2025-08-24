import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Button } from '@heroui/react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-hide toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, newToast.duration);
    }
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'solar:check-circle-bold';
      case 'error':
        return 'solar:close-circle-bold';
      case 'warning':
        return 'solar:danger-triangle-bold';
      case 'info':
        return 'solar:info-circle-bold';
      default:
        return 'solar:info-circle-bold';
    }
  };

  const getToastColors = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-success-50 border-success-200',
          icon: 'text-success-600',
          title: 'text-success-900',
          message: 'text-success-700',
        };
      case 'error':
        return {
          bg: 'bg-danger-50 border-danger-200',
          icon: 'text-danger-600',
          title: 'text-danger-900',
          message: 'text-danger-700',
        };
      case 'warning':
        return {
          bg: 'bg-warning-50 border-warning-200',
          icon: 'text-warning-600',
          title: 'text-warning-900',
          message: 'text-warning-700',
        };
      case 'info':
        return {
          bg: 'bg-primary-50 border-primary-200',
          icon: 'text-primary-600',
          title: 'text-primary-900',
          message: 'text-primary-700',
        };
      default:
        return {
          bg: 'bg-default-50 border-default-200',
          icon: 'text-default-600',
          title: 'text-default-900',
          message: 'text-default-700',
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast, clearAllToasts }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => {
            const colors = getToastColors(toast.type);
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 300, scale: 0.3 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 300, scale: 0.5 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`p-4 rounded-lg border shadow-lg backdrop-blur-sm ${colors.bg}`}
              >
                <div className="flex items-start gap-3">
                  <Icon
                    icon={getToastIcon(toast.type)}
                    className={`text-xl flex-shrink-0 mt-0.5 ${colors.icon}`}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold text-sm ${colors.title}`}>
                      {toast.title}
                    </h4>
                    {toast.message && (
                      <p className={`text-sm mt-1 ${colors.message}`}>
                        {toast.message}
                      </p>
                    )}
                    {toast.action && (
                      <Button
                        size="sm"
                        variant="flat"
                        color={toast.type === 'error' ? 'danger' : 'primary'}
                        className="mt-2"
                        onPress={toast.action.onClick}
                      >
                        {toast.action.label}
                      </Button>
                    )}
                  </div>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="text-default-400 hover:text-default-600"
                    onPress={() => hideToast(toast.id)}
                  >
                    <Icon icon="solar:close-linear" className="text-lg" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// Convenience hooks for different toast types
export function useSuccessToast() {
  const { showToast } = useToast();
  return useCallback((title: string, message?: string) => {
    showToast({ type: 'success', title, message });
  }, [showToast]);
}

export function useErrorToast() {
  const { showToast } = useToast();
  return useCallback((title: string, message?: string) => {
    showToast({ type: 'error', title, message });
  }, [showToast]);
}

export function useWarningToast() {
  const { showToast } = useToast();
  return useCallback((title: string, message?: string) => {
    showToast({ type: 'warning', title, message });
  }, [showToast]);
}

export function useInfoToast() {
  const { showToast } = useToast();
  return useCallback((title: string, message?: string) => {
    showToast({ type: 'info', title, message });
  }, [showToast]);
}
