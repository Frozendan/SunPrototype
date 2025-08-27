"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
  Breadcrumbs,
  BreadcrumbItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/lib/i18n-context";
import { ThemeSwitch } from "@/components/theme-switch";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SunIcon } from "@/components/sun-logo";
import AppSwitcher from "./app-switcher";
import NotificationsCard from "./notifications-card";
import type { AppType } from "../types";
import { CommandMenuTrigger } from "@/components/command-menu";

interface DashboardNavbarProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
  isCompact?: boolean;
  onToggleCompact?: () => void;
  showLogoAndAppSwitcher?: boolean;
  currentApp?: string;
  onAppChange?: (appId: string) => void;
}

export default function DashboardNavbar({
  onMenuToggle,
  isSidebarOpen,
  isCompact,
  onToggleCompact,
  showLogoAndAppSwitcher = false,
  currentApp,
  onAppChange
}: DashboardNavbarProps) {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Check if we're on a task detail page
  const isTaskDetailPage = () => {
    return location.pathname.match(/^\/task-management\/task\/(.+)$/);
  };

  // Generate task breadcrumbs for task detail pages
  const generateTaskBreadcrumbs = () => {
    const match = location.pathname.match(/^\/task-management\/task\/(.+)$/);
    if (!match) return null;

    const taskId = match[1];

    // Check if this is a subtask (starts with ST.)
    const isSubtask = taskId.startsWith('ST.');

    if (isSubtask) {
      // For subtasks, we need to determine the parent task ID
      // In a real app, this would come from the task data
      // For now, we'll use a simple mapping based on our mock data
      const getParentTaskId = (subtaskId: string) => {
        // This is a simplified mapping - in real app, this would come from API
        if (subtaskId.startsWith('ST.25.')) {
          return 'GV.25.000146';
        }
        return null;
      };

      const parentTaskId = getParentTaskId(taskId);

      if (parentTaskId) {
        return {
          isSubtask: true,
          parentTaskId,
          currentTaskId: taskId
        };
      }
    }

    return {
      isSubtask: false,
      currentTaskId: taskId
    };
  };

    const searchInput = <CommandMenuTrigger />;

  const taskBreadcrumbData = generateTaskBreadcrumbs();

  return (
    <Navbar
      className="bg-background/70 backdrop-blur-md"
      classNames={{
        wrapper: "px-4 sm:px-6",
        brand: "gap-2",
        content: "gap-4",
      }}
      height="64px"
      maxWidth="full"
    >
      {/* Left side - Logo/App Switcher or Menu toggle and breadcrumbs */}
      <NavbarContent className="flex-1 -ml-6" justify="start">
        {showLogoAndAppSwitcher ? (
          <>
            {/* Logo */}
            <NavbarItem>
              <button
                className="flex items-center gap-3 hover:opacity-80 transition-opacity ml-3"
                onClick={() => navigate('/dashboard')}
                aria-label="Go to main dashboard"
              >
                <SunIcon className="text-foreground" size={26} />
              </button>
            </NavbarItem>

            {/* App Switcher */}
            <NavbarItem className="hidden md:flex">
              <div className="w-64">
                <AppSwitcher
                  currentApp={currentApp as AppType}
                  onAppChange={onAppChange!}
                  isCompact={false}
                />
              </div>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem className="lg:hidden">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={onMenuToggle}
                aria-label="Toggle sidebar"
              >
                <Icon
                  icon={isSidebarOpen ? "solar:hamburger-menu-linear" : "solar:hamburger-menu-linear"}
                  width={20}
                />
              </Button>
            </NavbarItem>

            {/* Desktop Sidebar Toggle */}
            <NavbarItem className="hidden lg:flex">
              {onToggleCompact && (
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={onToggleCompact}
                  aria-label={isCompact ? "Expand sidebar" : "Collapse sidebar"}
                >
                  <Icon
                    icon="solar:sidebar-minimalistic-outline"
                    width={18}
                  />
                </Button>
              )}
            </NavbarItem>
          </>
        )}

        {/* Task Breadcrumbs - Show only on task detail pages */}
        {taskBreadcrumbData && (
          <NavbarItem className="hidden sm:flex">
            <Breadcrumbs
              size="sm"
              variant="solid"
              classNames={{
                list: "gap-2",
              }}
              itemClasses={{
                item: "text-small text-default-600 hover:text-primary-600",
                separator: "text-default-400",
              }}
            >
              <BreadcrumbItem
                onPress={() => navigate('/task-management/dashboard')}
                className="cursor-pointer"
              >
                Quản lý công việc
              </BreadcrumbItem>

              {taskBreadcrumbData.isSubtask && taskBreadcrumbData.parentTaskId && (
                <BreadcrumbItem
                  onPress={() => navigate(`/task-management/task/${taskBreadcrumbData.parentTaskId}`)}
                  className="cursor-pointer"
                >
                  {taskBreadcrumbData.parentTaskId}
                </BreadcrumbItem>
              )}

              <BreadcrumbItem isCurrent>
                {taskBreadcrumbData.currentTaskId}
              </BreadcrumbItem>
            </Breadcrumbs>
          </NavbarItem>
        )}
      </NavbarContent>

      {/* Center - Search (optional, can be added later) */}
      <NavbarContent className="hidden md:flex" justify="center">
        {/* Search functionality can be added here */}
          <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
          
      </NavbarContent>

      {/* Right side - Theme switch, language switcher, notifications, user menu */}
      <NavbarContent className="gap-2" justify="end">
        <NavbarItem className="hidden sm:flex">
          <ThemeSwitch />
        </NavbarItem>
        
        <NavbarItem className="hidden sm:flex">
          <LanguageSwitcher />
        </NavbarItem>

        <NavbarItem>
          <Popover offset={12} placement="bottom-start">
            <PopoverTrigger>
              <Button
                disableRipple
                isIconOnly
                className="overflow-visible"
                radius="full"
                variant="light"
                aria-label={t('components.notifications.title')}
              >
                <Badge color="danger" content="5" showOutline={false} size="md">
                  <Icon className="text-default-500" icon="solar:bell-linear" width={22} />
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-[90vw] p-0 sm:max-w-[380px]">
              <NotificationsCard className="w-full shadow-none" />
            </PopoverContent>
          </Popover>
        </NavbarItem>

        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="p-0"
                aria-label="User menu"
              >
                <Avatar
                  className="h-8 w-8"
                  name={user?.name}
                  src={user?.avatar}
                  size="sm"
                />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="User menu actions" variant="flat">
              <DropdownItem
                key="profile"
                className="h-14 gap-2"
                textValue={`Signed in as ${user?.email}`}
              >
                <div className="flex flex-col">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-small text-default-500">{user?.email}</p>
                </div>
              </DropdownItem>
              <DropdownItem
                key="dashboard"
                startContent={<Icon icon="solar:home-2-linear" width={16} />}
                onPress={() => navigate("/dashboard")}
              >
                {t('common.dashboard')}
              </DropdownItem>
              <DropdownItem
                key="settings"
                startContent={<Icon icon="solar:settings-outline" width={16} />}
              >
                {t('common.settings')}
              </DropdownItem>
              <DropdownItem
                key="help"
                startContent={<Icon icon="solar:question-circle-linear" width={16} />}
              >
                Help & Feedback
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                startContent={<Icon icon="solar:logout-2-linear" width={16} />}
                onPress={handleLogout}
              >
                {t('auth.logout')}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
