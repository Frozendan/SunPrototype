import { useEffect } from 'react';
import { useTaskForm } from './use-task';
import { useTaskFormStore } from '@/stores/task-form-store';
import type { TaskFormData } from '@/types/task-form';

/**
 * Hook to integrate Zustand store with existing useTaskForm hook
 * This allows seamless data transfer between modal and full page
 */
export function useTaskFormIntegration() {
  const localForm = useTaskForm();
  const store = useTaskFormStore();

  // Sync store data to local form when navigation occurs
  useEffect(() => {
    if (store.shouldNavigateToFullPage && store.preservedData) {
      // Update local form with preserved data
      Object.entries(store.preservedData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          localForm.updateField(key as keyof TaskFormData, value);
        }
      });

      // Clear navigation data after restoration
      store.clearNavigationData();
    }
  }, [store.shouldNavigateToFullPage, store.preservedData, localForm.updateField, store.clearNavigationData]);

  // Sync local form changes to store for real-time updates (but only if local form data exists)
  useEffect(() => {
    if (localForm.formData && localForm.formData.title !== undefined) {
      store.updateFormData(localForm.formData);
    }
  }, [localForm.formData, store.updateFormData]);

  return {
    // Return local form methods and data as primary interface
    ...localForm,
    // Add store methods for navigation
    prepareNavigationToFullPage: store.prepareNavigationToFullPage,
    shouldNavigateToFullPage: store.shouldNavigateToFullPage,
  };
}
