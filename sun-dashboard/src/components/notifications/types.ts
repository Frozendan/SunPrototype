export type NotificationType = "default" | "request" | "file";

export interface NotificationItem {
  id: string;
  isRead?: boolean;
  avatar: string;
  description: string;
  name: string;
  time: string;
  type?: NotificationType;
}

export const NotificationTabs = {
  All: "all",
  Unread: "unread",
  Archive: "archive",
} as const;

export type NotificationTabsType = typeof NotificationTabs[keyof typeof NotificationTabs];

export interface NotificationDropdownProps {
  className?: string;
}

export interface NotificationItemProps extends React.HTMLAttributes<HTMLDivElement> {
  notification: NotificationItem;
  onMarkAsRead?: (id: string) => void;
  onAction?: (id: string, action: 'accept' | 'decline') => void;
}
