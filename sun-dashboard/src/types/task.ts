// Task Management Types and Interfaces

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'inProgress' | 'done' | 'cancelled';

export interface TaskLabel {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface TaskAssignee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface TaskComment {
  id: string;
  content: string;
  author: TaskAssignee;
  createdAt: Date;
  updatedAt?: Date;
  parentId?: string; // For nested comments
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedBy: TaskAssignee;
  uploadedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignee?: TaskAssignee;
  reporter: TaskAssignee;
  labels: TaskLabel[];
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  estimatedHours?: number;
  actualHours?: number;
  projectId?: string;
  parentTaskId?: string; // For subtasks
  comments: TaskComment[];
  attachments: TaskAttachment[];
  watchers: TaskAssignee[];
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: TaskPriority;
  assigneeId?: string;
  labelIds: string[];
  dueDate?: Date;
  estimatedHours?: number;
  projectId?: string;
  parentTaskId?: string;
  // New fields from the image
  unitId?: string;
  collaboratingUnitId?: string;
  assignmentReferenceId?: string;
  importanceLevel: 'normal' | 'important' | 'very-important';
  assignmentDate: Date;
  expectedEndDate?: Date;
  requiredDeadline?: string;
  isRecurring: boolean;
}

export interface UpdateTaskRequest {
  id: string;
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assigneeId?: string;
  labelIds?: string[];
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
}

export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assigneeIds?: string[];
  labelIds?: string[];
  projectIds?: string[];
  dueDateFrom?: Date;
  dueDateTo?: Date;
  createdDateFrom?: Date;
  createdDateTo?: Date;
  search?: string;
}

export interface TaskSort {
  field: 'title' | 'priority' | 'status' | 'dueDate' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}

export interface TaskListQuery {
  page?: number;
  limit?: number;
  filter?: TaskFilter;
  sort?: TaskSort;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Project related types
export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  status: 'active' | 'completed' | 'archived';
  owner: TaskAssignee;
  members: TaskAssignee[];
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  color: string;
  memberIds: string[];
  dueDate?: Date;
}

// Form validation types
export interface TaskFormErrors {
  title?: string;
  description?: string;
  priority?: string;
  assignee?: string;
  dueDate?: string;
  labels?: string;
  estimatedHours?: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  assigneeId: string;
  labelIds: string[];
  dueDate: string; // ISO string for form handling
  estimatedHours: string;
  projectId: string;
  // New fields from the image
  unitId: string;
  collaboratingUnitId: string;
  assignmentReferenceId: string;
  importanceLevel: 'normal' | 'important' | 'very-important';
  assignmentDate: string;
  expectedEndDate: string;
  requiredDeadline: string;
  isRecurring: boolean;
}

// Dashboard and analytics types
export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  cancelled: number;
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
}

export interface TaskActivity {
  id: string;
  type: 'created' | 'updated' | 'commented' | 'assigned' | 'completed' | 'deleted';
  taskId: string;
  taskTitle: string;
  user: TaskAssignee;
  description: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

// UI State types
export interface TaskListViewState {
  view: 'list' | 'board' | 'calendar';
  groupBy: 'status' | 'priority' | 'assignee' | 'project' | 'none';
  selectedTasks: string[];
  isLoading: boolean;
  error?: string;
}

export interface TaskDetailViewState {
  isEditing: boolean;
  activeTab: 'details' | 'comments' | 'activity' | 'attachments';
  isLoading: boolean;
  error?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Hook return types
export interface UseTasksReturn {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  createTask: (data: CreateTaskRequest) => Promise<Task>;
  updateTask: (data: UpdateTaskRequest) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

export interface UseTaskReturn {
  task: Task | null;
  isLoading: boolean;
  error: string | null;
  updateTask: (data: Partial<UpdateTaskRequest>) => Promise<Task>;
  deleteTask: () => Promise<void>;
  addComment: (content: string) => Promise<TaskComment>;
  addAttachment: (file: File) => Promise<TaskAttachment>;
}
