"use client";

import { useState, useRef } from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Tooltip,
  useDisclosure,
  Select,
  SelectItem
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

const statusOptions = [
  { key: 'todo', label: 'Todo', color: 'default' },
  { key: 'inProgress', label: 'In Progress', color: 'primary' },
  { key: 'done', label: 'Done', color: 'success' },
  { key: 'cancelled', label: 'Declined', color: 'danger' }
];

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
  const currentStatus = statusOptions.find(option => option.key === taskStatus);

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
    const option = statusOptions.find(opt => opt.key === status);
    return option?.color || 'default';
  };

  const getStatusLabel = (status: TaskStatus) => {
    const option = statusOptions.find(opt => opt.key === status);
    return option?.label || status;
  };

  return (
    <motion.div
      className="flex flex-col gap-4 p-6 bg-background border-b border-divider"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Content */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {/* Task Status */}
            {isAdmin && onStatusChange ? (
              <Select
                size="sm"
                variant="bordered"
                selectedKeys={[taskStatus]}
                onSelectionChange={(keys) => {
                  const selectedStatus = Array.from(keys)[0] as TaskStatus;
                  onStatusChange(selectedStatus);
                }}
                className="w-32"
                aria-label="Task Status"
              >
                {statusOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            ) : (
              <div className={`px-3 py-1 rounded-full text-xs font-medium bg-${getStatusColor(taskStatus)}-100 text-${getStatusColor(taskStatus)}-700 dark:bg-${getStatusColor(taskStatus)}-900/30 dark:text-${getStatusColor(taskStatus)}-300`}>
                {getStatusLabel(taskStatus)}
              </div>
            )}
          </div>
          <p className="text-default-600 text-sm">
            {description || `Mã công việc: ${taskId}`}
          </p>
        </div>

        {/* Action Buttons - Same design as create page */}
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
