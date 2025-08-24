"use client";
import { useLocation } from "react-router-dom";
import { Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

import { useTranslation } from "@/lib/i18n-context";
import Sidebar from "./sidebar";
import type { AppType, AppNavigationItems } from "../types";

interface SidebarListItemsProps {
  currentApp: AppType;
  isCompact?: boolean;
  onSelect?: (key: string) => void;
  className?: string;
}

// Define navigation items for each app
const getAppNavigationItems = (t: (key: any) => string): AppNavigationItems => ({
  myDashboard: [
    {
      key: "my-dashboard",
      href: "/dashboard",
      icon: "solar:home-2-linear",
      title: t('common.dashboard'),
    },
  ],
  news: [
    {
      key: "news-dashboard",
      href: "/news/dashboard",
      icon: "solar:home-2-linear",
      title: t('navigation.news.dashboard'),
    },
    {
      key: "articles",
      href: "/news/articles",
      icon: "solar:document-text-outline",
      title: t('navigation.news.articles'),
      endContent: (
        <Icon className="text-default-400" icon="solar:add-circle-line-duotone" width={24} />
      ),
    },
    {
      key: "categories",
      href: "/news/categories",
      icon: "solar:folder-outline",
      title: t('navigation.news.categories'),
    },
    {
      key: "trending",
      href: "/news/trending",
      icon: "solar:fire-outline",
      title: t('navigation.news.trending'),
      endContent: (
        <Chip size="sm" variant="flat" color="danger">
          Hot
        </Chip>
      ),
    },
    {
      key: "bookmarks",
      href: "/news/bookmarks",
      icon: "solar:bookmark-outline",
      title: t('navigation.news.bookmarks'),
    },
    {
      key: "news-settings",
      href: "/news/settings",
      icon: "solar:settings-outline",
      title: t('navigation.news.settings'),
    },
  ],
  taskManagement: [
    {
      key: "task-dashboard",
      href: "/task-management/dashboard",
      icon: "solar:home-2-linear",
      title: t('navigation.taskManagement.dashboard'),
    },
    {
      key: "tasks",
      href: "/task-management/tasks",
      icon: "solar:checklist-minimalistic-outline",
      title: t('navigation.taskManagement.tasks'),
    },
    {
      key: "projects",
      href: "/task-management/projects",
      icon: "solar:widget-2-outline",
      title: t('navigation.taskManagement.projects'),
      endContent: (
        <Icon className="text-default-400" icon="solar:add-circle-line-duotone" width={24} />
      ),
    },
    {
      key: "team",
      href: "/task-management/team",
      icon: "solar:users-group-two-rounded-outline",
      title: t('navigation.taskManagement.team'),
    },
    {
      key: "calendar",
      href: "/task-management/calendar",
      icon: "solar:calendar-outline",
      title: t('navigation.taskManagement.calendar'),
    },
    {
      key: "task-reports",
      href: "/task-management/reports",
      icon: "solar:chart-outline",
      title: t('navigation.taskManagement.reports'),
    },
    {
      key: "task-settings",
      href: "/task-management/settings",
      icon: "solar:settings-outline",
      title: t('navigation.taskManagement.settings'),
    },
  ],
  timeManagement: [
    {
      key: "time-dashboard",
      href: "/time-management/dashboard",
      icon: "solar:home-2-linear",
      title: t('navigation.timeManagement.dashboard'),
    },
    {
      key: "tracker",
      href: "/time-management/tracker",
      icon: "solar:clock-circle-outline",
      title: t('navigation.timeManagement.tracker'),
      endContent: (
        <Chip size="sm" variant="flat" color="success">
          Live
        </Chip>
      ),
    },
    {
      key: "time-reports",
      href: "/time-management/reports",
      icon: "solar:chart-outline",
      title: t('navigation.timeManagement.reports'),
    },
    {
      key: "time-projects",
      href: "/time-management/projects",
      icon: "solar:widget-2-outline",
      title: t('navigation.timeManagement.projects'),
    },
    {
      key: "analytics",
      href: "/time-management/analytics",
      icon: "solar:graph-outline",
      title: t('navigation.timeManagement.analytics'),
    },
    {
      key: "time-settings",
      href: "/time-management/settings",
      icon: "solar:settings-outline",
      title: t('navigation.timeManagement.settings'),
    },
  ],
});

export default function SidebarListItems({ 
  currentApp, 
  isCompact = false, 
  onSelect,
  className 
}: SidebarListItemsProps) {
  const { t } = useTranslation();
  const location = useLocation();

  // Get navigation items for the current app
  const appNavigationItems = getAppNavigationItems(t);
  const sidebarItems = appNavigationItems[currentApp] || [];

  // Get current path for active sidebar item
  const getCurrentKey = () => {
    const path = location.pathname;
    
    // Find the sidebar item that matches the current path
    const matchingItem = sidebarItems.find(item => item.href === path);
    if (matchingItem) {
      return matchingItem.key;
    }

    // Fallback to app dashboard if no exact match
    return `${currentApp}-dashboard`;
  };

  const currentKey = getCurrentKey();

  return (
    <Sidebar
      isCompact={isCompact}
      defaultSelectedKey={currentKey}
      iconClassName="group-data-[selected=true]:text-primary-foreground"
      itemClasses={{
        base: "data-[selected=true]:bg-primary-400 dark:data-[selected=true]:bg-primary-300 data-[hover=true]:bg-default-300/20 dark:data-[hover=true]:bg-default-200/40",
        title: "group-data-[selected=true]:text-primary-foreground",
      }}
      items={sidebarItems}
      onSelect={onSelect}
      className={className}
    />
  );
}
