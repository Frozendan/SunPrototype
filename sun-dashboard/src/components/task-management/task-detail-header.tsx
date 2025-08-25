"use client";

import { useState, useRef } from "react";
import {
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
    useDisclosure,
    Select,
    SelectItem,
    SelectSection,
    Chip
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n-context";
import { useAuth } from "@/hooks/use-auth";
import type { TaskStatus } from "@/types/task";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface TaskDetailHeaderProps {
  onSave: () => void;
  isSaving: boolean;
  taskId: string;
  taskStatus: TaskStatus;
  onStatusChange?: (status: TaskStatus) => void;
  title?: string;
  description?: string;
  showImportActions?: boolean;
  onImportFile?: (importedData: any[]) => Promise<void>;
  isImporting?: boolean;
}

const statusConfig = {
  draft: { color: "default", group: "draft" },
  todo: { color: "default", group: "inProgress" },
  inProgress: { color: "primary", group: "inProgress" },
  redo: { color: "secondary", group: "inProgress" },
  pendingReceipt: { color: "warning", group: "pending" },
  pendingConfirmation: { color: "warning", group: "pending" },
  paused: { color: "warning", group: "pending" },
  done: { color: "success", group: "completed" },
  completed: { color: "success", group: "completed" },
  approved: { color: "success", group: "completed" },
  archiveRecord: { color: "default", group: "completed" },
  cancelled: { color: "danger", group: "cancelled" },
  rejected: { color: "danger", group: "cancelled" },
  notApproved: { color: "danger", group: "cancelled" },
  cancelledAfterApproval: { color: "danger", group: "cancelled" },
  terminated: { color: "danger", group: "cancelled" },
};

export function TaskDetailHeader({
  onSave,
  isSaving,
  taskId,
  taskStatus,
  onStatusChange,
  title = "Chi tiết công việc",
  description,
  showImportActions = false,
  onImportFile,
  isImporting = false
}: TaskDetailHeaderProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingImport, setIsProcessingImport] = useState(false);
  const { isOpen: isActionsOpen, onOpen: onActionsOpen, onClose: onActionsClose } = useDisclosure();

  const isAdmin = user?.role === 'admin';

  // Group statuses by color/category
  const getGroupedStatusOptions = () => {
    const groups: Record<string, Array<{key: string, label: string, color: string}>> = {
      draft: [],
      inProgress: [],
      pending: [],
      completed: [],
      cancelled: []
    };

    Object.entries(statusConfig).forEach(([key, config]) => {
      groups[config.group].push({
        key,
        label: t(`navigation.taskManagement.filters.statuses.${key}` as any),
        color: config.color
      });
    });

    return groups;
  };

  const groupedOptions = getGroupedStatusOptions();

  // Handle file import
  const handleFileImport = async () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onImportFile) return;

    setIsProcessingImport(true);
    try {
      // Process file import logic here
      await onImportFile([]);
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsProcessingImport(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    return statusConfig[status]?.color || 'default';
  };

  const getStatusLabel = (status: TaskStatus) => {
    return t(`navigation.taskManagement.filters.statuses.${status}` as any) || status;
  };

  const getStatusColorClass = (status: TaskStatus) => {
    const color = getStatusColor(status);
    switch (color) {
      case 'default':
        return 'bg-default-500';
      case 'primary':
        return 'bg-primary-500';
      case 'secondary':
        return 'bg-secondary-500';
      case 'success':
        return 'bg-success-500';
      case 'warning':
        return 'bg-warning-500';
      case 'danger':
        return 'bg-danger-500';
      default:
        return 'bg-default-500';
    }
  };

  return (
    <motion.div
      className="sticky top-0 z-20 bg-content1 backdrop-blur-md border-b border-divider px-6 py-4"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between">
        {/* Left side - Title and status */}
        <div className="flex items-center gap-3">
          <div className="space-y-1">
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <div className="flex items-center gap-3 mb-1 flex-wrap w-full">
                <Chip size="lg" variant="bordered" className="text-default-500 flex-shrink-0">
                    {description || `Mã công việc: ${taskId}`}
                </Chip>
              {/* Task Status */}
              {isAdmin && onStatusChange ? (
                <Select
                  size="sm"
                  radius="full"
                  variant="flat"
                  selectedKeys={[taskStatus]}
                  onSelectionChange={(keys) => {
                    const selectedStatus = Array.from(keys)[0] as TaskStatus;
                    onStatusChange(selectedStatus);
                  }}
                  className="w-60 flex-shrink-0"
                  aria-label="Task Status"
                  color={getStatusColor(taskStatus) as any}
                  renderValue={(items) => {
                    return items.map((item) => (
                      <div key={item.key} className="flex items-center gap-2 whitespace-nowrap">
                        <div className={`w-2 h-2 rounded-full bg-${getStatusColor(item.key as TaskStatus)}`} />
                        <span>{getStatusLabel(item.key as TaskStatus)}</span>
                      </div>
                    ));
                  }}
                >
                  {Object.entries(groupedOptions)
                    .filter(([, options]) => options.length > 0)
                    .map(([groupKey, options]) => (
                      <SelectSection
                        key={groupKey}
                        title={t(`navigation.taskManagement.filters.statusGroups.${groupKey}` as any)}
                        className="mb-2"
                      >
                        {options.map((option) => (
                          <SelectItem
                            key={option.key}
                            className="flex items-center gap-2"
                            startContent={
                              <div className={`w-2 h-2 rounded-full bg-${option.color}`} />
                            }
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectSection>
                    ))}
                </Select>
              ) : (
                <div className={`px-3 py-1 rounded-full text-xs font-medium bg-${getStatusColor(taskStatus)}-100 text-${getStatusColor(taskStatus)}-700 dark:bg-${getStatusColor(taskStatus)}-900/30 dark:text-${getStatusColor(taskStatus)}-300`}>
                  {getStatusLabel(taskStatus)}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center bg-content2 p-2 rounded-full gap-2">
          {/* Desktop: Show all actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Import Actions - Utility actions first */}
            {showImportActions && (
              <Dropdown isOpen={isActionsOpen} onOpenChange={(open) => open ? onActionsOpen() : onActionsClose()}>
                <DropdownTrigger>
                  <Button
                    variant="light"
                    radius="full"
                    startContent={<Icon icon="solar:import-bold" width={16} />}
                    endContent={<Icon icon="solar:alt-arrow-down-linear" width={14} />}
                    isLoading={isImporting || isProcessingImport}
                  >
                    Import
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Import actions">
                  <DropdownItem
                    key="import-file"
                    startContent={<Icon icon="solar:file-upload-bold" width={16} />}
                    onPress={handleFileImport}
                  >
                    Import from File
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}

            {/* Separator for visual grouping */}
            {showImportActions && (
              <div className="h-6 w-px bg-divider mx-1" />
            )}

            {/* Primary Action - Save */}
            <Button
              color="primary"
              radius="full"
              onPress={onSave}
              isLoading={isSaving}
              startContent={!isSaving && <Icon icon="solar:diskette-bold" width={18} />}
            >
              {t("common.save")}
            </Button>
          </div>

          {/* Tablet: Group utility actions in dropdown, show main actions */}
          <div className="hidden md:flex lg:hidden items-center gap-2">
            {/* Utility actions dropdown */}
            {showImportActions && (
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="light"
                    radius="full"
                    startContent={<Icon icon="solar:menu-dots-bold" width={16} />}
                  >
                    More
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="More actions">
                  <DropdownSection title="Import/Export">
                    <DropdownItem
                      key="import-file"
                      startContent={<Icon icon="solar:file-upload-bold" width={16} />}
                      onPress={handleFileImport}
                    >
                      Import from File
                    </DropdownItem>
                  </DropdownSection>
                </DropdownMenu>
              </Dropdown>
            )}

            {/* Primary Action - Save */}
            <Button
              color="primary"
              radius="full"
              onPress={onSave}
              isLoading={isSaving}
              startContent={!isSaving && <Icon icon="solar:diskette-bold" width={18} />}
            >
              {t("common.save")}
            </Button>
          </div>

          {/* Mobile: Actions in dropdown, primary action visible */}
          <div className="flex md:hidden items-center gap-2">
            {showImportActions && (
              <Dropdown isOpen={isActionsOpen} onOpenChange={(open) => open ? onActionsOpen() : onActionsClose()}>
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    variant="light"
                    radius="full"
                    aria-label="More actions"
                  >
                    <Icon icon="solar:menu-dots-bold" width={20} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="All actions" className="w-64">
                  <DropdownSection title="Import/Export">
                    <DropdownItem
                      key="import-file"
                      className="h-12"
                      startContent={
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <Icon className="text-blue-600 dark:text-blue-300" icon="solar:file-upload-bold" width={16} />
                        </div>
                      }
                      onPress={handleFileImport}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">Import from File</span>
                        <span className="text-xs text-default-500">Import task data from file</span>
                      </div>
                    </DropdownItem>
                  </DropdownSection>
                </DropdownMenu>
              </Dropdown>
            )}

            {/* Primary Action - Always visible on mobile */}
            <Button
              color="primary"
              radius="full"
              onPress={onSave}
              isLoading={isSaving}
              startContent={!isSaving && <Icon icon="solar:diskette-bold" width={18} />}
            >
              {t("common.save")}
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />
    </motion.div>
  );
}
