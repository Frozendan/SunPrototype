"use client";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
    Card,
    CardBody, DropdownSection,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "@/lib/i18n-context";
import type { App, AppType } from "../types";

interface AppSwitcherProps {
  currentApp: AppType;
  onAppChange: (appId: AppType) => void;
  isCompact?: boolean;
}

const apps: App[] = [
  {
    id: "news",
    name: "apps.news.name",
    description: "apps.news.description",
    icon: "solar:document-text-bold",
    iconColor: "text-blue-500",
    route: "/dashboard/news",
  },
  {
    id: "taskManagement",
    name: "apps.taskManagement.name",
    description: "apps.taskManagement.description",
    icon: "solar:checklist-minimalistic-bold",
    iconColor: "text-green-500",
    route: "/dashboard/tasks",
  },
  {
    id: "timeManagement",
    name: "apps.timeManagement.name",
    description: "apps.timeManagement.description",
    icon: "solar:clock-circle-bold",
    iconColor: "text-purple-500",
    route: "/dashboard/time",
  },
];

export default function AppSwitcher({ currentApp, onAppChange, isCompact = false }: AppSwitcherProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const currentAppData = apps.find(app => app.id === currentApp);

  const handleAppSelect = (appId: AppType) => {
    const selectedApp = apps.find(app => app.id === appId);
    if (selectedApp) {
      onAppChange(appId);
      navigate(selectedApp.route);
    }
  };

  // Get background color based on app icon color with dark mode support
  const getBackgroundColor = (iconColor: string) => {
    switch (iconColor) {
      case "text-blue-500":
        return "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/40";
      case "text-green-500":
        return "bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-800/40";
      case "text-purple-500":
        return "bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-800/40";
      default:
        return "bg-default-100 hover:bg-default-200 dark:bg-default-800/30 dark:hover:bg-default-700/40";
    }
  };

  if (isCompact) {
    return (
      <Dropdown placement="right-start">
        <DropdownTrigger>
          <Button
            isIconOnly
            className={`h-11 w-11 min-w-11 ${getBackgroundColor(currentAppData?.iconColor || "text-default-500")}`}
            variant="light"
            aria-label="Switch application"
          >
            <Icon
              className={currentAppData?.iconColor || "text-default-500"}
              icon={currentAppData?.icon || "solar:apps-outline"}
              width={24}
            />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Application switcher"
          className="w-80"
          onAction={(key) => handleAppSelect(key as AppType)}
        >
          {apps.map((app) => (
            <DropdownItem
              key={app.id}
              className="h-16"
              startContent={
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-default-100">
                  <Icon
                    className={app.iconColor}
                    icon={app.icon}
                    width={24}
                  />
                </div>
              }
            >
              <div className="flex flex-col">
                <span className="text-small font-medium">{t(app.name as any)}</span>
                <span className="text-tiny text-default-400">{t(app.description as any)}</span>
              </div>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <Dropdown className={ "w-full" } placement="bottom-start">
      <DropdownTrigger>
        <Button
          className="h-12 w-full justify-start bg-transparent border-small border-default-200 dark:border-default-100 hover:border-default-500 dark:hover:border-default-200 hover:bg-transparent px-0"
          variant="light"
          endContent={
              <Icon className="text-default-400 ml-auto mr-2" icon="lucide:chevrons-up-down" width={16} />
          }
          startContent={
            <div className="flex h-10 w-10 items-center justify-center rounded-lg">
              <Icon
                className={currentAppData?.iconColor || "text-default-500"}
                icon={currentAppData?.icon || "solar:apps-outline"}
                width={24}
              />
            </div>
          }
        >
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-small font-medium">
              {currentAppData ? t(currentAppData.name as any) : "Select App"}
            </span>
          </div>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Application switcher"
        className="w-96"
        itemClasses={{
          base: "gap-4 p-4 data-[hover=true]:bg-default-100",
        }}
        onAction={(key) => handleAppSelect(key as AppType)}
      >
          <DropdownSection title="Switch Application">
              <DropdownItem key="apps-grid" className="h-auto p-0" isReadOnly>
                  <div className="grid grid-cols-3 gap-3 p-3">
                      {apps.map((app) => (
                          <Card
                              key={app.id}
                              className={`cursor-pointer transition-all shadow hover:scale-105 hover:shadow-md ${
                                  currentApp === app.id ? "ring-2 ring-primary" : ""
                              }`}
                              isPressable
                              onPress={() => handleAppSelect(app.id)}
                          >
                              <CardBody className="flex flex-col items-center gap-2 p-3">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-default-100">
                                      <Icon
                                          className={app.iconColor}
                                          icon={app.icon}
                                          width={28}
                                      />
                                  </div>
                                  <div className="text-center">
                                      <p className="text-xs font-medium">{t(app.name as any)}</p>
                                  </div>
                              </CardBody>
                          </Card>
                      ))}
                  </div>
              </DropdownItem>
          </DropdownSection>
        
      </DropdownMenu>
    </Dropdown>
  );
}
