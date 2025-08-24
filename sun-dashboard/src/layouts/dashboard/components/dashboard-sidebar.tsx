"use client";

import { useState, useEffect } from "react";
import {
  ScrollShadow,
  Spacer,
} from "@heroui/react";
import { useLocation, useNavigate } from "react-router-dom";

import { SunIcon } from "@/components/sun-logo";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/lib/i18n-context";

import AppSwitcher from "./app-switcher";
import SidebarListItems from "./sidebar-list-items";
import CreateButton from "./create-button";
import type { AppType } from "../types";



interface DashboardSidebarProps {
  className?: string;
  isCompact?: boolean;
}

export default function DashboardSidebar({ className, isCompact = false }: DashboardSidebarProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine current app based on URL
  const getCurrentApp = (): AppType => {
    const path = location.pathname;
    if (path === '/dashboard') return 'myDashboard';
    if (path.startsWith('/news')) return 'news';
    if (path.startsWith('/task-management')) return 'taskManagement';
    if (path.startsWith('/time-management')) return 'timeManagement';
    // If on main dashboard, default to myDashboard for sidebar display
    return 'myDashboard';
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

  const handleLogoClick = () => {
    navigate('/dashboard');
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
                <button
                  className="flex items-center justify-center hover:opacity-80 transition-opacity"
                  onClick={handleLogoClick}
                  aria-label="Go to main dashboard"
                >
                    <SunIcon className="text-foreground" size={isCompact ? 20 : 26} />
                </button>
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
          <CreateButton isCompact={isCompact} />
        </div>
      )}

      {!isCompact && (
        <div className="px-2 py-4">
          <CreateButton isCompact={isCompact} />
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
