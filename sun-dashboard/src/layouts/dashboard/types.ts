import type { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export enum SidebarItemType {
  Nest = "nest",
}

export type SidebarItem = {
  key: string;
  title: string;
  icon?: string;
  href?: string;
  type?: SidebarItemType.Nest;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  items?: SidebarItem[];
  className?: string;
};

export type NotificationType = "default" | "request" | "file";

export type NotificationItem = {
  id: string;
  isRead?: boolean;
  avatar: string;
  description: string;
  name: string;
  time: string;
  type?: NotificationType;
};

export type Workspace = {
  value: string;
  label: string;
  items?: WorkspaceItem[];
};

export type WorkspaceItem = {
  value: string;
  label: string;
};

export type DashboardUser = {
  id: number;
  name: string;
  role: string;
  team: string;
  avatar: string;
  email: string;
};

export type AppType = 'news' | 'taskManagement' | 'timeManagement';

export type App = {
  id: AppType;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  route: string;
};

export type AppNavigationItems = {
  [K in AppType]: SidebarItem[];
};
