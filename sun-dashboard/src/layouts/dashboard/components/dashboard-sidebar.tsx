"use client";

import { useState, useEffect } from "react";
import {
  ScrollShadow,
  Spacer,
} from "@heroui/react";
import { useLocation } from "react-router-dom";

import { SunIcon } from "@/components/sun-logo";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/lib/i18n-context";

import AppSwitcher from "./app-switcher";
import SidebarListItems from "./sidebar-list-items";
import type { AppType } from "../types";



interface DashboardSidebarProps {
  className?: string;
  isCompact?: boolean;
}

export default function DashboardSidebar({ className, isCompact = false }: DashboardSidebarProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  // Determine current app based on URL
  const getCurrentApp = (): AppType => {
    const path = location.pathname;
    if (path.startsWith('/dashboard/news')) return 'news';
    if (path.startsWith('/dashboard/tasks')) return 'taskManagement';
    if (path.startsWith('/dashboard/time')) return 'timeManagement';
    return 'taskManagement'; // Default app
  };

  const [currentApp, setCurrentApp] = useState<AppType>(getCurrentApp());

  // Update current app when location changes
  useEffect(() => {
    setCurrentApp(getCurrentApp());
  }, [location.pathname]);

  const handleAppChange = (appId: AppType) => {
    setCurrentApp(appId);
  };

  const handleSidebarSelect = (key: string) => {
    // Navigation is handled by the href in sidebar items
    console.log(`Selected sidebar item: ${key}`);
  };



  if (!user) {
    return null;
  }

  return (
    <div className={`border-divider relative flex h-full flex-1 flex-col py-2 px-3.5 transition-all duration-300 ${
      isCompact ? 'w-20' : 'w-72'
    } ${className}`}>
      
      
      {/*<Spacer y={4} />*/}

      {!isCompact && (
        <div className="flex w-full gap-2">
            <div className={`flex items-center gap-2 px-2 ${isCompact ? 'justify-center py-1 w-full' : ''}`}>
                <div className="flex items-center justify-center">
                    <SunIcon className="text-foreground" size={isCompact ? 20 : 26} />
                </div>
            </div>
            <div className="flex-1">
                <AppSwitcher
                    currentApp={currentApp}
                    onAppChange={handleAppChange}
                    isCompact={isCompact}
                />
            </div>
        </div>
      )}

      {isCompact && (
        <div className="flex flex-col items-center gap-2">
          <AppSwitcher
            currentApp={currentApp}
            onAppChange={handleAppChange}
            isCompact={isCompact}
          />
        </div>
      )}

      <ScrollShadow className={`h-full max-h-full py-6 ${isCompact ? '-mr-2 pr-2' : '-mr-6 pr-6'}`}>
        <SidebarListItems
          currentApp={currentApp}
          isCompact={isCompact}
          onSelect={handleSidebarSelect}
        />
        <Spacer y={8} />
        
      </ScrollShadow>
    </div>
  );
}
