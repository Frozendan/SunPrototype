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
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/lib/i18n-context";
import { ThemeSwitch } from "@/components/theme-switch";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SunIcon } from "@/components/sun-logo";
import AppSwitcher from "./app-switcher";
import type { AppType } from "../types";
import {Input} from "@heroui/input";
import {Kbd} from "@heroui/kbd";
import {SearchIcon} from "@/components/icons.tsx";

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

    const searchInput = (
        <Input
            aria-label={t('components.navbar.searchPlaceholder')}
            classNames={{
                inputWrapper: "bg-default-100",
                input: "text-sm",
            }}
            endContent={
                <Kbd className="hidden lg:inline-block" keys={["command"]}>
                    K
                </Kbd>
            }
            labelPlacement="outside"
            placeholder={t('components.navbar.searchPlaceholder')}
            startContent={
                <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
            }
            type="search"
        />
    );

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
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                aria-label="Notifications"
              >
                <Badge color="danger" content="3" showOutline={false} size="sm">
                  <Icon className="text-default-500" icon="solar:bell-linear" width={20} />
                </Badge>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Notifications" variant="flat" className="w-80 p-0">
              <DropdownItem key="header" className="h-14 gap-2 opacity-100" textValue="Notifications">
                <div className="flex items-center justify-between w-full px-2">
                  <h4 className="text-large font-medium">Notifications</h4>
                  <Badge size="sm" variant="flat">3</Badge>
                </div>
              </DropdownItem>
              <DropdownItem key="notification1" className="h-auto py-3 opacity-100" textValue="Tony Reichert requested to join">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-default-50 mx-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Icon icon="solar:user-plus-linear" className="text-primary-600" width={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <strong>Tony Reichert</strong> requested to join your organization.
                    </p>
                    <p className="text-xs text-default-500 mt-1">2 hours ago</p>
                  </div>
                </div>
              </DropdownItem>
              <DropdownItem key="notification2" className="h-auto py-3 opacity-100" textValue="Ben Berman modified file">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-default-50 mx-2">
                  <div className="w-8 h-8 rounded-full bg-warning-100 flex items-center justify-center flex-shrink-0">
                    <Icon icon="solar:file-linear" className="text-warning-600" width={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <strong>Ben Berman</strong> modified the Brand logo file.
                    </p>
                    <p className="text-xs text-default-500 mt-1">7 hours ago</p>
                  </div>
                </div>
              </DropdownItem>
              <DropdownItem key="notification3" className="h-auto py-3 opacity-100" textValue="Jane Doe liked your post">
                <div className="flex items-start gap-3 p-3 rounded-lg mx-2">
                  <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center flex-shrink-0">
                    <Icon icon="solar:heart-linear" className="text-success-600" width={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <strong>Jane Doe</strong> liked your post.
                    </p>
                    <p className="text-xs text-default-500 mt-1">Yesterday</p>
                  </div>
                </div>
              </DropdownItem>
              <DropdownItem key="viewall" className="h-auto py-3 opacity-100" textValue="View All">
                <div className="mx-2 pt-3 border-t border-divider">
                  <Button
                    color="primary"
                    variant="flat"
                    size="sm"
                    className="w-full"
                  >
                    View All Notifications
                  </Button>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
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
