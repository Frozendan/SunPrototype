import { useState, useCallback, useMemo } from 'react';
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskFilter,
  TaskSort,
  TaskListQuery,
  UseTasksReturn,
  TaskStats,
  TaskPriority,
  TaskStatus,
} from '@/types/task';

// Mock data for development - replace with actual API calls
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Implement user authentication',
    description: 'Add login and registration functionality with JWT tokens',
    priority: 'high',
    status: 'inProgress',
    assignee: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://i.pravatar.cc/150?u=1',
    },
    reporter: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://i.pravatar.cc/150?u=2',
    },
    labels: [
      { id: '1', name: 'Frontend', color: 'blue' },
      { id: '2', name: 'Security', color: 'red' },
    ],
    dueDate: new Date('2024-09-01'),
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2024-08-20'),
    estimatedHours: 16,
    actualHours: 8,
    comments: [],
    attachments: [],
    watchers: [],
  },
  {
    id: '2',
    title: 'Design dashboard layout',
    description: 'Create responsive dashboard with sidebar navigation',
    priority: 'medium',
    status: 'todo',
    assignee: {
      id: '3',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      avatar: 'https://i.pravatar.cc/150?u=3',
    },
    reporter: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://i.pravatar.cc/150?u=2',
    },
    labels: [
      { id: '3', name: 'Design', color: 'purple' },
      { id: '4', name: 'UI/UX', color: 'pink' },
    ],
    dueDate: new Date('2024-08-30'),
    createdAt: new Date('2024-08-10'),
    updatedAt: new Date('2024-08-18'),
    estimatedHours: 12,
    comments: [],
    attachments: [],
    watchers: [],
  },
  {
    id: '3',
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment',
    priority: 'urgent',
    status: 'done',
    assignee: {
      id: '4',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      avatar: 'https://i.pravatar.cc/150?u=4',
    },
    reporter: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://i.pravatar.cc/150?u=1',
    },
    labels: [
      { id: '5', name: 'DevOps', color: 'green' },
      { id: '6', name: 'Infrastructure', color: 'orange' },
    ],
    dueDate: new Date('2024-08-25'),
    createdAt: new Date('2024-08-05'),
    updatedAt: new Date('2024-08-22'),
    completedAt: new Date('2024-08-22'),
    estimatedHours: 20,
    actualHours: 18,
    comments: [],
    attachments: [],
    watchers: [],
  },
];

export function useTasks(query?: TaskListQuery): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter and sort tasks based on query
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (query?.filter) {
      const { filter } = query;

      if (filter.status?.length) {
        result = result.filter(task => filter.status!.includes(task.status));
      }

      if (filter.priority?.length) {
        result = result.filter(task => filter.priority!.includes(task.priority));
      }

      if (filter.assigneeIds?.length) {
        result = result.filter(task => 
          task.assignee && filter.assigneeIds!.includes(task.assignee.id)
        );
      }

      if (filter.labelIds?.length) {
        result = result.filter(task =>
          task.labels.some(label => filter.labelIds!.includes(label.id))
        );
      }

      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        result = result.filter(task =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower)
        );
      }

      if (filter.dueDateFrom) {
        result = result.filter(task =>
          task.dueDate && task.dueDate >= filter.dueDateFrom!
        );
      }

      if (filter.dueDateTo) {
        result = result.filter(task =>
          task.dueDate && task.dueDate <= filter.dueDateTo!
        );
      }
    }

    if (query?.sort) {
      const { field, direction } = query.sort;
      result.sort((a, b) => {
        let aValue: any = a[field];
        let bValue: any = b[field];

        if (field === 'priority') {
          const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
        }

        if (aValue instanceof Date && bValue instanceof Date) {
          return direction === 'asc' 
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return direction === 'asc' ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });
    }

    return result;
  }, [tasks, query]);

  const createTask = useCallback(async (data: CreateTaskRequest): Promise<Task> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newTask: Task = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: 'todo',
        assignee: data.assigneeId ? {
          id: data.assigneeId,
          name: 'Assigned User',
          email: 'user@example.com',
        } : undefined,
        reporter: {
          id: 'current-user',
          name: 'Current User',
          email: 'current@example.com',
        },
        labels: [],
        dueDate: data.dueDate,
        createdAt: new Date(),
        updatedAt: new Date(),
        estimatedHours: data.estimatedHours,
        comments: [],
        attachments: [],
        watchers: [],
      };

      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (data: UpdateTaskRequest): Promise<Task> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedTask = tasks.find(task => task.id === data.id);
      if (!updatedTask) {
        throw new Error('Task not found');
      }

      const updated: Task = {
        ...updatedTask,
        ...data,
        updatedAt: new Date(),
        completedAt: data.status === 'done' ? new Date() : updatedTask.completedAt,
      };

      setTasks(prev => prev.map(task => task.id === data.id ? updated : task));
      return updated;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [tasks]);

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshTasks = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation, fetch fresh data from API
      setTasks(mockTasks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh tasks';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    tasks: filteredTasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks,
  };
}

export function useTaskStats(): TaskStats {
  const { tasks } = useTasks();

  return useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    return {
      total: tasks.length,
      todo: tasks.filter(task => task.status === 'todo').length,
      inProgress: tasks.filter(task => task.status === 'inProgress').length,
      done: tasks.filter(task => task.status === 'done').length,
      cancelled: tasks.filter(task => task.status === 'cancelled').length,
      overdue: tasks.filter(task => 
        task.dueDate && task.dueDate < today && task.status !== 'done'
      ).length,
      dueToday: tasks.filter(task => 
        task.dueDate && 
        task.dueDate >= today && 
        task.dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
      ).length,
      dueThisWeek: tasks.filter(task => 
        task.dueDate && 
        task.dueDate >= today && 
        task.dueDate <= weekFromNow
      ).length,
    };
  }, [tasks]);
}
