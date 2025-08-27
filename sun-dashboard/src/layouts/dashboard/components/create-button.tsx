"use client";

import { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useTranslation } from "@/lib/i18n-context";
import type { AppType } from "../types";

interface CreateButtonProps {
  isCompact?: boolean;
  className?: string;
}

export default function CreateButton({ isCompact = false, className }: CreateButtonProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current app based on URL
  const getCurrentApp = (): AppType => {
    const path = location.pathname;
    if (path === '/dashboard') return 'myDashboard';
    if (path.startsWith('/news')) return 'news';
    if (path.startsWith('/task-management')) return 'taskManagement';
    if (path.startsWith('/time-management')) return 'timeManagement';
    return 'myDashboard';
  };

  const currentApp = getCurrentApp();

  // Task Management handlers
  const handleCreateTask = () => {
    console.log("Navigating to create task page...");
    navigate("/task-management/create-task");
  };

  const handleCreateDocument = () => {
    console.log("Navigating to create document page...");
    navigate("/task-management/create-document");
  };

  // Time Management handlers
  const handleRequestTimeOff = () => {
    console.log("Navigating to request time off page...");
    navigate("/time-management/request-time-off");
  };

  const handleRequestScheduleChange = () => {
    console.log("Navigating to request schedule change page...");
    navigate("/time-management/request-schedule-change");
  };

  const handleRequestLateArrival = () => {
    console.log("Navigating to request late arrival page...");
    navigate("/time-management/request-late-arrival");
  };

  const handleRequestOvertime = () => {
    console.log("Navigating to request overtime page...");
    navigate("/time-management/request-overtime");
  };

  const handleAction = (key: React.Key) => {
    console.log("Action triggered:", key);

    // Task Management actions
    if (key === "create-task") {
      handleCreateTask();
    } else if (key === "create-document") {
      handleCreateDocument();
    }

    // Time Management actions
    else if (key === "request-time-off") {
      handleRequestTimeOff();
    } else if (key === "request-schedule-change") {
      handleRequestScheduleChange();
    } else if (key === "request-late-arrival") {
      handleRequestLateArrival();
    } else if (key === "request-overtime") {
      handleRequestOvertime();
    }
  };

  if (isCompact) {
    return (
      <Dropdown placement="right-start" className={className}>
        <DropdownTrigger>
          <button
            className="group relative h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-0.5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            aria-label="Create"
          >
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-gray-900 group-hover:bg-transparent transition-all duration-300">
              <Icon
                icon="solar:add-circle-bold"
                width={24}
                className="text-purple-600 group-hover:text-white transition-colors duration-300"
              />
            </div>
          </button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Create options"
          className="w-64"
          onAction={handleAction}
        >
          {currentApp === 'taskManagement' && (
            <DropdownSection title={t('createButton.taskManagement.sectionTitle')}>
              <DropdownItem
                key="create-task"
                className="h-12"
                startContent={
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                    <Icon
                      className="text-green-600 dark:text-green-400"
                      icon="solar:checklist-minimalistic-bold"
                      width={18}
                    />
                  </div>
                }
              >
                <div className="flex flex-col">
                  <span className="font-medium">{t('createButton.taskManagement.createTask')}</span>
                  <span className="text-small text-default-500">{t('createButton.taskManagement.createTaskDesc')}</span>
                </div>
              </DropdownItem>
              <DropdownItem
                key="create-document"
                className="h-12"
                startContent={
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Icon
                      className="text-blue-600 dark:text-blue-400"
                      icon="solar:document-add-bold"
                      width={18}
                    />
                  </div>
                }
              >
                <div className="flex flex-col">
                  <span className="font-medium">{t('createButton.taskManagement.createDocument')}</span>
                  <span className="text-small text-default-500">{t('createButton.taskManagement.createDocumentDesc')}</span>
                </div>
              </DropdownItem>
            </DropdownSection>
          )}

          {currentApp === 'timeManagement' && (
            <DropdownSection title={t('createButton.timeManagement.sectionTitle')}>
              <DropdownItem
                key="request-time-off"
                className="h-12"
                startContent={
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <Icon
                      className="text-orange-600 dark:text-orange-400"
                      icon="solar:calendar-mark-bold"
                      width={18}
                    />
                  </div>
                }
              >
                <div className="flex flex-col">
                  <span className="font-medium">{t('createButton.timeManagement.requestTimeOff')}</span>
                  <span className="text-small text-default-500">{t('createButton.timeManagement.requestTimeOffDesc')}</span>
                </div>
              </DropdownItem>
              <DropdownItem
                key="request-schedule-change"
                className="h-12"
                startContent={
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Icon
                      className="text-purple-600 dark:text-purple-400"
                      icon="solar:calendar-search-bold"
                      width={18}
                    />
                  </div>
                }
              >
                <div className="flex flex-col">
                  <span className="font-medium">{t('createButton.timeManagement.requestScheduleChange')}</span>
                  <span className="text-small text-default-500">{t('createButton.timeManagement.requestScheduleChangeDesc')}</span>
                </div>
              </DropdownItem>
              <DropdownItem
                key="request-late-arrival"
                className="h-12"
                startContent={
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                    <Icon
                      className="text-yellow-600 dark:text-yellow-400"
                      icon="solar:clock-circle-bold"
                      width={18}
                    />
                  </div>
                }
              >
                <div className="flex flex-col">
                  <span className="font-medium">{t('createButton.timeManagement.requestLateArrival')}</span>
                  <span className="text-small text-default-500">{t('createButton.timeManagement.requestLateArrivalDesc')}</span>
                </div>
              </DropdownItem>
              <DropdownItem
                key="request-overtime"
                className="h-12"
                startContent={
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                    <Icon
                      className="text-red-600 dark:text-red-400"
                      icon="solar:clock-square-bold"
                      width={18}
                    />
                  </div>
                }
              >
                <div className="flex flex-col">
                  <span className="font-medium">{t('createButton.timeManagement.requestOvertime')}</span>
                  <span className="text-small text-default-500">{t('createButton.timeManagement.requestOvertimeDesc')}</span>
                </div>
              </DropdownItem>
            </DropdownSection>
          )}
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <Dropdown placement="bottom-start" className={className}>
      <DropdownTrigger>
        <button
          className="group relative w-full h-14 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-0.5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          aria-label="Create"
        >
          <div className="flex h-full w-full items-center justify-between rounded-[10px] bg-white dark:bg-gray-900 px-4 group-hover:bg-transparent transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 group-hover:bg-white/20">
                <Icon
                  icon="solar:add-circle-bold"
                  width={18}
                  className="text-white"
                />
              </div>
              <span className="font-bold text-lg text-gray-800 dark:text-gray-200 group-hover:text-white transition-colors duration-300">
                {t('createButton.buttonText')}
              </span>
            </div>
            <Icon
              icon="solar:alt-arrow-down-linear"
              width={16}
              className="text-gray-500 group-hover:text-white/70 transition-colors duration-300"
            />
          </div>
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Create options"
        className="w-72"
        onAction={handleAction}
      >
        {currentApp === 'taskManagement' && (
          <DropdownSection title={t('createButton.taskManagement.sectionTitle')}>
            <DropdownItem
              key="create-task"
              className="h-14"
              startContent={
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                  <Icon
                    className="text-green-600 dark:text-green-400"
                    icon="solar:checklist-minimalistic-bold"
                    width={20}
                  />
                </div>
              }
            >
              <div className="flex flex-col">
                <span className="font-semibold text-md">{t('createButton.taskManagement.createTask')}</span>
              </div>
            </DropdownItem>
            <DropdownItem
              key="create-document"
              className="h-14"
              startContent={
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <Icon
                    className="text-blue-600 dark:text-blue-400"
                    icon="solar:document-add-bold"
                    width={20}
                  />
                </div>
              }
            >
              <div className="flex flex-col">
                <span className="font-semibold text-md">{t('createButton.taskManagement.createDocument')}</span>
              </div>
            </DropdownItem>
          </DropdownSection>
        )}

        {currentApp === 'timeManagement' && (
          <DropdownSection title={t('createButton.timeManagement.sectionTitle')}>
            <DropdownItem
              key="request-time-off"
              className="h-14"
              startContent={
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
                  <Icon
                    className="text-orange-600 dark:text-orange-400"
                    icon="solar:calendar-mark-bold"
                    width={20}
                  />
                </div>
              }
            >
              <div className="flex flex-col">
                <span className="font-semibold text-md">{t('createButton.timeManagement.requestTimeOff')}</span>
              </div>
            </DropdownItem>
            <DropdownItem
              key="request-schedule-change"
              className="h-14"
              startContent={
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                  <Icon
                    className="text-purple-600 dark:text-purple-400"
                    icon="solar:calendar-search-bold"
                    width={20}
                  />
                </div>
              }
            >
              <div className="flex flex-col">
                <span className="font-semibold text-md">{t('createButton.timeManagement.requestScheduleChange')}</span>
              </div>
            </DropdownItem>
            <DropdownItem
              key="request-late-arrival"
              className="h-14"
              startContent={
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                  <Icon
                    className="text-yellow-600 dark:text-yellow-400"
                    icon="solar:clock-circle-bold"
                    width={20}
                  />
                </div>
              }
            >
              <div className="flex flex-col">
                <span className="font-semibold text-md">{t('createButton.timeManagement.requestLateArrival')}</span>
              </div>
            </DropdownItem>
            <DropdownItem
              key="request-overtime"
              className="h-14"
              startContent={
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
                  <Icon
                    className="text-red-600 dark:text-red-400"
                    icon="solar:clock-square-bold"
                    width={20}
                  />
                </div>
              }
            >
              <div className="flex flex-col">
                <span className="font-semibold text-md">{t('createButton.timeManagement.requestOvertime')}</span>
              </div>
            </DropdownItem>
          </DropdownSection>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
