"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "@/hooks/use-auth";
import { useSettingsStore, settingsSelectors } from "@/stores/settings-store";

import DashboardSidebar from "./components/dashboard-sidebar";
import DashboardNavbar from "./components/dashboard-navbar";
import {ScrollShadow} from "@heroui/react";
import type { AppType } from "./types";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Use settings store for persistent compact state
  const isCompact = useSettingsStore(settingsSelectors.sidebarCollapsed);
  const toggleSidebar = useSettingsStore((state) => state.toggleSidebar);

  // Check if we're on the main dashboard route
  const isMainDashboard = location.pathname === '/dashboard';

  // Determine current app based on URL
  const getCurrentApp = (): AppType => {
    const path = location.pathname;
    if (path === '/dashboard') return 'myDashboard';
    if (path.startsWith('/news')) return 'news';
    if (path.startsWith('/task-management')) return 'taskManagement';
    if (path.startsWith('/time-management')) return 'timeManagement';
    return 'myDashboard'; // Default app for main dashboard
  };

  const currentApp = getCurrentApp();

  // Handle app change
  const handleAppChange = (appId: AppType) => {
    const routes = {
      myDashboard: '/dashboard',
      news: '/news/dashboard',
      taskManagement: '/task-management/dashboard',
      timeManagement: '/time-management/dashboard',
    };
    navigate(routes[appId]);
  };

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false); // Close mobile sidebar on desktop
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle compact toggle
  const handleCompactToggle = () => {
    toggleSidebar();
  };

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-default-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const overlayVariants = {
    open: {
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar - Hidden on main dashboard */}
      {!isMainDashboard && (
        <aside className="hidden lg:flex lg:flex-shrink-0">
          <DashboardSidebar
            isCompact={isCompact}
          />
        </aside>
      )}

      {/* Mobile Sidebar Overlay - Hidden on main dashboard */}
      {!isMainDashboard && (
        <AnimatePresence>
          {isMobile && isSidebarOpen && (
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={handleOverlayClick}
            />
          )}
        </AnimatePresence>
      )}

      {/* Mobile Sidebar - Hidden on main dashboard */}
      {!isMainDashboard && (
        <AnimatePresence>
          {isMobile && (
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
              variants={sidebarVariants}
              initial="closed"
              animate={isSidebarOpen ? "open" : "closed"}
              exit="closed"
            >
              <DashboardSidebar
                className="h-full bg-background shadow-lg"
                isCompact={false}
              />
            </motion.aside>
          )}
        </AnimatePresence>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation */}
        <DashboardNavbar
          onMenuToggle={handleSidebarToggle}
          isSidebarOpen={isSidebarOpen}
          isCompact={isCompact}
          onToggleCompact={!isMainDashboard ? handleCompactToggle : undefined}
          showLogoAndAppSwitcher={isMainDashboard}
          currentApp={currentApp}
          onAppChange={handleAppChange}
        />

        {/* Main Content */}
        <main className={`flex-1 overflow-hidden px-4 py-0 ${isMainDashboard ? 'pl-4' : 'pl-0'}`}>
          <motion.div
            className="h-full w-full border border-default-100 dark:bg-content1 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          >
              <ScrollShadow className="w-full h-full">
                  {children}
              </ScrollShadow>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
