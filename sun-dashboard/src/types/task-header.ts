import type { ImportedTaskData } from "@/lib/task-import-export";

/**
 * Enhanced props for CreateTaskHeader component
 */
export interface CreateTaskHeaderProps {
  // Existing props
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  title?: string;
  description?: string;

  // New props for enhanced functionality
  onImportFile?: (importedData: ImportedTaskData[]) => Promise<void>;
  onDownloadExample?: () => void;
  onSaveDraft?: () => Promise<void>;
  isDraftSaving?: boolean;
  hasDraftChanges?: boolean;
  importAcceptedTypes?: string[];
  isImporting?: boolean;
  
  // Optional customization
  showImportActions?: boolean;
  showDraftActions?: boolean;
  compactMode?: boolean;
}

/**
 * Action bar button configuration
 */
export interface ActionBarButton {
  key: string;
  label: string;
  icon: string;
  variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  isLoading?: boolean;
  isDisabled?: boolean;
  tooltip?: string;
  onClick: () => void;
}

/**
 * Action group configuration
 */
export interface ActionGroup {
  id: string;
  label?: string;
  buttons: ActionBarButton[];
  isDropdown?: boolean;
  dropdownTriggerIcon?: string;
  dropdownTriggerLabel?: string;
}

/**
 * Import operation result
 */
export interface ImportResult {
  success: boolean;
  data?: ImportedTaskData[];
  error?: string;
  warnings?: string[];
  importedCount?: number;
}

/**
 * Draft operation result
 */
export interface DraftResult {
  success: boolean;
  error?: string;
  lastSaved?: Date;
}

/**
 * File validation result
 */
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  fileType?: string;
  fileSize?: number;
}

/**
 * Action bar state
 */
export interface ActionBarState {
  isImporting: boolean;
  isDraftSaving: boolean;
  isSubmitting: boolean;
  hasDraftChanges: boolean;
  hasFormContent: boolean;
}

/**
 * Responsive breakpoint configuration
 */
export interface ResponsiveConfig {
  mobile: {
    showAllActions: boolean;
    groupInDropdown: string[];
    primaryActions: string[];
  };
  tablet: {
    showAllActions: boolean;
    groupInDropdown: string[];
    primaryActions: string[];
  };
  desktop: {
    showAllActions: boolean;
    groupInDropdown: string[];
    primaryActions: string[];
  };
}

/**
 * Confirmation dialog configuration
 */
export interface ConfirmationConfig {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  isDangerous?: boolean;
}

/**
 * Toast notification configuration
 */
export interface ToastConfig {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

/**
 * Action bar theme configuration
 */
export interface ActionBarTheme {
  spacing: 'sm' | 'md' | 'lg';
  buttonSize: 'sm' | 'md' | 'lg';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  elevation: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Accessibility configuration
 */
export interface AccessibilityConfig {
  announceActions: boolean;
  keyboardNavigation: boolean;
  screenReaderLabels: Record<string, string>;
  focusManagement: boolean;
}
