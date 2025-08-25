"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { TaskFormData } from "@/types/task-form";

/**
 * Interface for draft metadata
 */
interface DraftMetadata {
  lastSaved: string;
  version: number;
}

/**
 * Interface for stored draft
 */
interface StoredDraft {
  data: TaskFormData;
  metadata: DraftMetadata;
}

/**
 * Draft management hook for task forms
 */
export function useTaskDraft(formData: TaskFormData, updateFormData: (data: Partial<TaskFormData>) => void) {
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [hasDraftChanges, setHasDraftChanges] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastFormDataRef = useRef<string>('');

  const DRAFT_KEY = 'task-form-draft';
  const AUTO_SAVE_DELAY = 30000; // 30 seconds

  /**
   * Check if form data has meaningful content
   */
  const hasContent = useCallback((data: TaskFormData): boolean => {
    return !!(
      data.title?.trim() ||
      data.description?.trim() ||
      data.assigneeId ||
      data.unitId ||
      data.labelIds?.length > 0
    );
  }, []);

  /**
   * Save draft to localStorage
   */
  const saveDraft = useCallback(async (): Promise<void> => {
    if (!hasContent(formData)) {
      return;
    }

    setIsDraftSaving(true);

    try {
      // Simulate async operation for consistency with other operations
      await new Promise(resolve => setTimeout(resolve, 500));

      const draft: StoredDraft = {
        data: formData,
        metadata: {
          lastSaved: new Date().toISOString(),
          version: 1
        }
      };

      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setLastSavedTime(new Date());
      setHasDraftChanges(false);
    } catch (error) {
      console.error('Failed to save draft:', error);
      throw new Error('Failed to save draft');
    } finally {
      setIsDraftSaving(false);
    }
  }, [formData, hasContent]);

  /**
   * Load draft from localStorage
   */
  const loadDraft = useCallback((): StoredDraft | null => {
    try {
      const stored = localStorage.getItem(DRAFT_KEY);
      if (!stored) return null;

      const draft: StoredDraft = JSON.parse(stored);
      
      // Validate draft structure
      if (!draft.data || !draft.metadata) {
        console.warn('Invalid draft structure, removing...');
        localStorage.removeItem(DRAFT_KEY);
        return null;
      }

      return draft;
    } catch (error) {
      console.error('Failed to load draft:', error);
      localStorage.removeItem(DRAFT_KEY);
      return null;
    }
  }, []);

  /**
   * Restore draft data to form
   */
  const restoreDraft = useCallback((): boolean => {
    const draft = loadDraft();
    if (!draft) return false;

    updateFormData(draft.data);
    setLastSavedTime(new Date(draft.metadata.lastSaved));
    setHasDraftChanges(false);
    return true;
  }, [loadDraft, updateFormData]);

  /**
   * Clear draft from localStorage
   */
  const clearDraft = useCallback((): void => {
    localStorage.removeItem(DRAFT_KEY);
    setLastSavedTime(null);
    setHasDraftChanges(false);
  }, []);

  /**
   * Check if draft exists
   */
  const hasDraft = useCallback((): boolean => {
    return loadDraft() !== null;
  }, [loadDraft]);

  /**
   * Get draft age in minutes
   */
  const getDraftAge = useCallback((): number | null => {
    const draft = loadDraft();
    if (!draft) return null;

    const savedTime = new Date(draft.metadata.lastSaved);
    const now = new Date();
    return Math.floor((now.getTime() - savedTime.getTime()) / (1000 * 60));
  }, [loadDraft]);

  /**
   * Auto-save functionality
   */
  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      if (hasDraftChanges && hasContent(formData)) {
        saveDraft().catch(console.error);
      }
    }, AUTO_SAVE_DELAY);
  }, [hasDraftChanges, hasContent, formData, saveDraft]);

  /**
   * Detect form changes
   */
  useEffect(() => {
    const currentFormDataString = JSON.stringify(formData);
    
    if (lastFormDataRef.current && lastFormDataRef.current !== currentFormDataString) {
      setHasDraftChanges(true);
      scheduleAutoSave();
    }
    
    lastFormDataRef.current = currentFormDataString;
  }, [formData, scheduleAutoSave]);

  /**
   * Load draft on mount
   */
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setLastSavedTime(new Date(draft.metadata.lastSaved));
      // Don't auto-restore, let the user decide
    }
  }, [loadDraft]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Manual save with user feedback
   */
  const saveDraftManually = useCallback(async (): Promise<void> => {
    if (!hasContent(formData)) {
      throw new Error('No content to save');
    }

    await saveDraft();
  }, [formData, hasContent, saveDraft]);

  return {
    // State
    isDraftSaving,
    hasDraftChanges,
    lastSavedTime,

    // Actions
    saveDraft: saveDraftManually,
    loadDraft,
    restoreDraft,
    clearDraft,

    // Utilities
    hasDraft,
    getDraftAge,
    hasContent: hasContent(formData)
  };
}

/**
 * Hook for draft restoration dialog
 */
export function useDraftRestoration() {
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [draftToRestore, setDraftToRestore] = useState<StoredDraft | null>(null);

  const checkForDraft = useCallback(() => {
    try {
      const stored = localStorage.getItem('task-form-draft');
      if (stored) {
        const draft: StoredDraft = JSON.parse(stored);
        setDraftToRestore(draft);
        setShowRestoreDialog(true);
        return true;
      }
    } catch (error) {
      console.error('Failed to check for draft:', error);
    }
    return false;
  }, []);

  const acceptRestore = useCallback(() => {
    setShowRestoreDialog(false);
    return draftToRestore;
  }, [draftToRestore]);

  const rejectRestore = useCallback(() => {
    setShowRestoreDialog(false);
    setDraftToRestore(null);
    // Optionally clear the draft
    localStorage.removeItem('task-form-draft');
  }, []);

  return {
    showRestoreDialog,
    draftToRestore,
    checkForDraft,
    acceptRestore,
    rejectRestore
  };
}
