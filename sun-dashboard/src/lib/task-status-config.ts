import { TaskStatus } from "@/types/task";

export interface StatusConfig {
  color: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  group: "draft" | "inProgress" | "pending" | "completed" | "cancelled";
}

export const statusConfig: Record<TaskStatus, StatusConfig> = {
  draft: { color: "default", group: "draft" },
  todo: { color: "default", group: "inProgress" },
  inProgress: { color: "primary", group: "inProgress" },
  redo: { color: "secondary", group: "inProgress" },
  pendingReceipt: { color: "warning", group: "pending" },
  pendingConfirmation: { color: "warning", group: "pending" },
  paused: { color: "warning", group: "pending" },
  done: { color: "success", group: "completed" },
  completed: { color: "success", group: "completed" },
  approved: { color: "success", group: "completed" },
  archiveRecord: { color: "default", group: "completed" },
  cancelled: { color: "danger", group: "cancelled" },
  rejected: { color: "danger", group: "cancelled" },
  notApproved: { color: "danger", group: "cancelled" },
  cancelledAfterApproval: { color: "danger", group: "cancelled" },
  terminated: { color: "danger", group: "cancelled" },
};

export const statusGroups = {
  draft: "draft",
  inProgress: "inProgress", 
  pending: "pending",
  completed: "completed",
  cancelled: "cancelled"
} as const;

export type StatusGroup = keyof typeof statusGroups;

export const getStatusColor = (status: TaskStatus): StatusConfig["color"] => {
  return statusConfig[status]?.color || "default";
};

export const getStatusGroup = (status: TaskStatus): StatusGroup => {
  return statusConfig[status]?.group || "draft";
};

export const getStatusColorClass = (status: TaskStatus): string => {
  const color = getStatusColor(status);
  switch (color) {
    case 'default':
      return 'bg-default-500';
    case 'primary':
      return 'bg-primary-500';
    case 'secondary':
      return 'bg-secondary-500';
    case 'success':
      return 'bg-success-500';
    case 'warning':
      return 'bg-warning-500';
    case 'danger':
      return 'bg-danger-500';
    default:
      return 'bg-default-500';
  }
};

export const getGroupBackgroundColor = (group: StatusGroup): string => {
  switch (group) {
    case 'draft':
      return 'bg-default-100';
    case 'inProgress':
      return 'bg-primary-100';
    case 'pending':
      return 'bg-warning-100';
    case 'completed':
      return 'bg-success-100';
    case 'cancelled':
      return 'bg-danger-100';
    default:
      return 'bg-default-100';
  }
};

export const getGroupTextColor = (group: StatusGroup): string => {
  switch (group) {
    case 'draft':
      return 'text-default-700';
    case 'inProgress':
      return 'text-primary-700';
    case 'pending':
      return 'text-warning-700';
    case 'completed':
      return 'text-success-700';
    case 'cancelled':
      return 'text-danger-700';
    default:
      return 'text-default-700';
  }
};
