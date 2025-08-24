import type { TaskPriority } from "./task";

export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  assigneeId: string;
  unitId: string;
  collaboratingUnitId: string;
  assignmentReferenceId: string;
  importanceLevel: string;
  assignmentDate: string;
  expectedEndDate: string;
  requiredDeadline: string;
  isRecurring: boolean;
  recurringType: string;
  recurringInterval: number;
  recurringEndDate: string;
  isLeadershipDirection: boolean;
}

export interface TaskFormErrors {
  title?: string;
  description?: string;
  priority?: string;
  assigneeId?: string;
  unitId?: string;
  collaboratingUnitId?: string;
  assignmentReferenceId?: string;
  importanceLevel?: string;
  assignmentDate?: string;
  expectedEndDate?: string;
  requiredDeadline?: string;
  recurringType?: string;
  recurringInterval?: string;
  recurringEndDate?: string;
}

export type UpdateFieldFunction = (field: keyof TaskFormData, value: any) => void;

export interface MockUnit {
  id: string;
  name: string;
}

export interface MockAssignee {
  id: string;
  name: string;
  avatar: string;
  unitId: string;
}

export interface MockAssignmentReference {
  id: string;
  name: string;
}
