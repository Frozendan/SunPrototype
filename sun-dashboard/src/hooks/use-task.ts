import { useState, useCallback, useEffect } from 'react';
import type {
  Task,
  UpdateTaskRequest,
  TaskComment,
  TaskAttachment,
  UseTaskReturn,
  TaskAssignee,
} from '@/types/task';
import type { TaskFormData } from '@/types/task-form';

export function useTask(taskId: string): UseTaskReturn {
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch task data
  useEffect(() => {
    const fetchTask = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock task data - replace with actual API call
        const mockTask: Task = {
          id: taskId,
          title: 'Sample Task',
          description: 'This is a sample task description with detailed information about what needs to be done.',
          priority: 'high',
          status: 'inProgress',
          assignee: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'https://i.pravatar.cc/150?u=1',
            role: 'Developer',
          },
          reporter: {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            avatar: 'https://i.pravatar.cc/150?u=2',
            role: 'Product Manager',
          },
          labels: [
            { id: '1', name: 'Frontend', color: 'blue', description: 'Frontend development tasks' },
            { id: '2', name: 'Urgent', color: 'red', description: 'High priority tasks' },
          ],
          dueDate: new Date('2024-09-01'),
          createdAt: new Date('2024-08-15'),
          updatedAt: new Date('2024-08-20'),
          estimatedHours: 16,
          actualHours: 8,
          comments: [
            {
              id: '1',
              content: 'Started working on this task. Making good progress.',
              author: {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                avatar: 'https://i.pravatar.cc/150?u=1',
              },
              createdAt: new Date('2024-08-18'),
            },
            {
              id: '2',
              content: 'Please make sure to follow the design guidelines.',
              author: {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@example.com',
                avatar: 'https://i.pravatar.cc/150?u=2',
              },
              createdAt: new Date('2024-08-19'),
            },
          ],
          attachments: [
            {
              id: '1',
              name: 'design-mockup.png',
              url: '/attachments/design-mockup.png',
              size: 1024000,
              type: 'image/png',
              uploadedBy: {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@example.com',
                avatar: 'https://i.pravatar.cc/150?u=2',
              },
              uploadedAt: new Date('2024-08-16'),
            },
          ],
          watchers: [
            {
              id: '3',
              name: 'Alice Johnson',
              email: 'alice@example.com',
              avatar: 'https://i.pravatar.cc/150?u=3',
            },
          ],
        };

        setTask(mockTask);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch task';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const updateTask = useCallback(async (data: Partial<UpdateTaskRequest>): Promise<Task> => {
    if (!task) {
      throw new Error('No task to update');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedTask: Task = {
        ...task,
        ...data,
        updatedAt: new Date(),
        completedAt: data.status === 'done' ? new Date() : task.completedAt,
      };

      setTask(updatedTask);
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [task]);

  const deleteTask = useCallback(async (): Promise<void> => {
    if (!task) {
      throw new Error('No task to delete');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // In real implementation, navigate away or show success message
      setTask(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [task]);

  const addComment = useCallback(async (content: string): Promise<TaskComment> => {
    if (!task) {
      throw new Error('No task to add comment to');
    }

    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      const newComment: TaskComment = {
        id: Date.now().toString(),
        content,
        author: {
          id: 'current-user',
          name: 'Current User',
          email: 'current@example.com',
          avatar: 'https://i.pravatar.cc/150?u=current',
        },
        createdAt: new Date(),
      };

      setTask(prev => prev ? {
        ...prev,
        comments: [...prev.comments, newComment],
        updatedAt: new Date(),
      } : null);

      return newComment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add comment';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [task]);

  const addAttachment = useCallback(async (file: File): Promise<TaskAttachment> => {
    if (!task) {
      throw new Error('No task to add attachment to');
    }

    setError(null);

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newAttachment: TaskAttachment = {
        id: Date.now().toString(),
        name: file.name,
        url: URL.createObjectURL(file), // In real implementation, this would be the uploaded file URL
        size: file.size,
        type: file.type,
        uploadedBy: {
          id: 'current-user',
          name: 'Current User',
          email: 'current@example.com',
          avatar: 'https://i.pravatar.cc/150?u=current',
        },
        uploadedAt: new Date(),
      };

      setTask(prev => prev ? {
        ...prev,
        attachments: [...prev.attachments, newAttachment],
        updatedAt: new Date(),
      } : null);

      return newAttachment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload attachment';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [task]);

  return {
    task,
    isLoading,
    error,
    updateTask,
    deleteTask,
    addComment,
    addAttachment,
  };
}

// Hook for managing task form state
export function useTaskForm(initialData?: Partial<Task>) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    expectedResults: '',
    attachments: [],
    priority: initialData?.priority || 'medium' as const,
    assigneeId: initialData?.assignee?.id || '',
    labelIds: initialData?.labels?.map(label => label.id) || [],
    unitId: '',
    collaboratingUnitId: '',
    assignmentReferenceId: '',
    importanceLevel: 'normal' as const,
    assignmentDate: new Date().toISOString().split('T')[0],
    expectedEndDate: '',
    requiredDeadline: '',
    isRecurring: false,
    recurringType: '',
    recurringInterval: 1,
    recurringEndDate: '',
    isLeadershipDirection: false,
    // General Information fields
    functionalGroupId: '',
    topicId: '',
    taskTypeId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    // Validate topic if general information is being used
    if (formData.functionalGroupId || formData.taskTypeId) {
      if (!formData.topicId.trim()) {
        newErrors.topicId = 'Topic is required when using general information';
      }
    }

    if (formData.estimatedHours && isNaN(Number(formData.estimatedHours))) {
      newErrors.estimatedHours = 'Estimated hours must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      expectedResults: '',
      attachments: [],
      priority: 'medium',
      assigneeId: '',
      labelIds: [],
      dueDate: '',
      estimatedHours: '',
      projectId: '',
      unitId: '',
      collaboratingUnitId: '',
      assignmentReferenceId: '',
      importanceLevel: 'normal',
      assignmentDate: new Date().toISOString().split('T')[0],
      expectedEndDate: '',
      requiredDeadline: '',
      isRecurring: false,
      recurringType: '',
      recurringInterval: 1,
      recurringEndDate: '',
      isLeadershipDirection: false,
      functionalGroupId: '',
      topicId: '',
      taskTypeId: '',
    });
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    updateField,
    validateForm,
    resetForm,
    setFormData,
    isValid: Object.keys(errors).length === 0 && formData.title.trim() !== '',
  };
}
