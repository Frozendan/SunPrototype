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
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useTranslation } from "@/lib/i18n-context";

interface CreateButtonProps {
  isCompact?: boolean;
  className?: string;
}

export default function CreateButton({ isCompact = false, className }: CreateButtonProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCreateTask = () => {
    console.log("Navigating to create task page...");
    navigate("/task-management/create-task");
  };

  const handleCreateDocument = () => {
    console.log("Navigating to create document page...");
    navigate("/task-management/create-document");
  };

  const handleAction = (key: React.Key) => {
    console.log("Action triggered:", key);
    if (key === "create-task") {
      handleCreateTask();
    } else if (key === "create-document") {
      handleCreateDocument();
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
          <DropdownSection title="Create New">
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
                <span className="font-medium">Create new task</span>
                <span className="text-small text-default-500">Add new task</span>
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
                <span className="font-medium">Create new document</span>
                <span className="text-small text-default-500">Add new document</span>
              </div>
            </DropdownItem>
          </DropdownSection>
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
                Create
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
        <DropdownSection title="Create New">
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
              <span className="font-semibold text-base">Create new task</span>
              <span className="text-small text-default-500">Add new task</span>
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
              <span className="font-semibold text-base">Create new document</span>
              <span className="text-small text-default-500">Add new document</span>
            </div>
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
