import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TaskFormData, TaskFormErrors } from '@/types/task-form';

interface TaskFormStore {
  // Form data state
  formData: TaskFormData;
  errors: TaskFormErrors;
  
  // Modal state
  isModalOpen: boolean;
  modalParentTaskId?: string;
  
  // Navigation state
  shouldNavigateToFullPage: boolean;
  preservedData: TaskFormData | null;
  
  // Actions
  updateFormData: (data: Partial<TaskFormData>) => void;
  updateField: (field: keyof TaskFormData, value: any) => void;
  setErrors: (errors: TaskFormErrors) => void;
  resetForm: () => void;
  
  // Modal actions
  openModal: (parentTaskId?: string) => void;
  closeModal: () => void;
  
  // Navigation actions
  prepareNavigationToFullPage: () => void;
  clearNavigationData: () => void;
  restoreFromNavigation: () => void;
  
  // Validation
  validateForm: () => boolean;
}

// Default form data
const defaultFormData: TaskFormData = {
  title: '',
  description: '',
  expectedResults: '',
  attachments: [],
  priority: 'normal',
  assigneeId: '',
  labelIds: [],
  unitId: '',
  collaboratingUnitId: '',
  assignmentReferenceId: '',
  importanceLevel: 'normal',
  assignmentDate: '',
  expectedEndDate: '',
  requiredDeadline: '',
  isRecurring: false,
  recurringType: '',
  recurringInterval: 0,
  recurringStartDate: '',
  recurringEndDate: '',
  isLeadershipDirection: false,
  functionalGroupId: '',
  topicId: '',
  taskTypeId: ''
};

// Default errors
const defaultErrors: TaskFormErrors = {};

export const useTaskFormStore = create<TaskFormStore>()(
  persist(
    (set, get) => ({
      // Initial state
      formData: defaultFormData,
      errors: defaultErrors,
      isModalOpen: false,
      modalParentTaskId: undefined,
      shouldNavigateToFullPage: false,
      preservedData: null,

      // Form actions
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      updateField: (field, value) =>
        set((state) => ({
          formData: { ...state.formData, [field]: value },
          // Clear error for this field when user starts typing
          errors: { ...state.errors, [field]: undefined },
        })),

      setErrors: (errors) => set({ errors }),

      resetForm: () =>
        set({
          formData: defaultFormData,
          errors: defaultErrors,
        }),

      // Modal actions
      openModal: (parentTaskId) =>
        set({
          isModalOpen: true,
          modalParentTaskId: parentTaskId,
        }),

      closeModal: () =>
        set({
          isModalOpen: false,
          modalParentTaskId: undefined,
        }),

      // Navigation actions
      prepareNavigationToFullPage: () => {
        const { formData } = get();
        set({
          shouldNavigateToFullPage: true,
          preservedData: { ...formData },
          isModalOpen: false,
        });
      },

      clearNavigationData: () =>
        set({
          shouldNavigateToFullPage: false,
          preservedData: null,
        }),

      restoreFromNavigation: () => {
        const { preservedData } = get();
        if (preservedData) {
          set({
            formData: preservedData,
            shouldNavigateToFullPage: false,
            preservedData: null,
          });
        }
      },

      // Validation
      validateForm: () => {
        const { formData } = get();
        const newErrors: TaskFormErrors = {};

        // Required field validations
        if (!formData.title?.trim()) {
          newErrors.title = 'Tiêu đề là bắt buộc';
        }

        if (!formData.topicId?.trim()) {
          newErrors.topicId = 'Chủ đề là bắt buộc';
        }

        if (!formData.unitId?.trim()) {
          newErrors.unitId = 'Đơn vị là bắt buộc';
        }

        if (!formData.assigneeId?.trim()) {
          newErrors.assigneeId = 'Người được giao là bắt buộc';
        }

        if (!formData.assignmentDate?.trim()) {
          newErrors.assignmentDate = 'Ngày giao việc là bắt buộc';
        }

        if (!formData.requiredDeadline?.trim()) {
          newErrors.requiredDeadline = 'Hạn hoàn thành bắt buộc là bắt buộc';
        }

        // Date validations
        if (formData.assignmentDate && formData.expectedEndDate) {
          const assignmentDate = new Date(formData.assignmentDate);
          const expectedDate = new Date(formData.expectedEndDate);

          if (expectedDate < assignmentDate) {
            newErrors.expectedEndDate = 'Ngày dự kiến hoàn thành không thể trước ngày giao việc';
          }
        }

        if (formData.assignmentDate && formData.requiredDeadline) {
          const assignmentDate = new Date(formData.assignmentDate);
          const mandatoryDate = new Date(formData.requiredDeadline);

          if (mandatoryDate < assignmentDate) {
            newErrors.requiredDeadline = 'Hạn hoàn thành bắt buộc không thể trước ngày giao việc';
          }
        }

        set({ errors: newErrors });
        return Object.keys(newErrors).length === 0;
      },
    }),
    {
      name: 'task-form-store',
      // Only persist form data and navigation state, not modal state
      partialize: (state) => ({
        formData: state.formData,
        preservedData: state.preservedData,
        shouldNavigateToFullPage: state.shouldNavigateToFullPage,
      }),
    }
  )
);
