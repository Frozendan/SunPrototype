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
  useDisclosure
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n-context";
import { importTasksFromFile, downloadExampleFile, validateFileType } from "@/lib/task-import-export";
import type { CreateTaskHeaderProps } from "@/types/task-header";
import type { ImportedTaskData } from "@/lib/task-import-export";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function CreateTaskHeader({
  onCancel,
  onSubmit,
  isSubmitting,
  title,
  description,
  onImportFile,
  onDownloadExample,
  onSaveDraft,
  isDraftSaving = false,
  hasDraftChanges = false,
  showImportActions = true,
  showDraftActions = true,
  isImporting = false
}: CreateTaskHeaderProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingImport, setIsProcessingImport] = useState(false);
  const { isOpen: isActionsOpen, onOpen: onActionsOpen, onClose: onActionsClose } = useDisclosure();

  // Handle file import
  const handleFileImport = async () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onImportFile) return;

    if (!validateFileType(file)) {
      // Handle error - would typically show toast
      console.error(t("navigation.taskManagement.actionBar.invalidFileFormat"));
      return;
    }

    setIsProcessingImport(true);
    try {
      const importedData = await importTasksFromFile(file);
      await onImportFile(importedData);
      // Success feedback would be handled by parent component
    } catch (error) {
      console.error('Import failed:', error);
      // Error feedback would be handled by parent component
    } finally {
      setIsProcessingImport(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle example file download
  const handleDownloadExample = () => {
    if (onDownloadExample) {
      onDownloadExample();
    } else {
      downloadExampleFile(t("navigation.taskManagement.actionBar.exampleFileName"));
    }
  };

  // Handle draft save
  const handleSaveDraft = async () => {
    if (onSaveDraft) {
      try {
        await onSaveDraft();
        // Success feedback would be handled by parent component
      } catch (error) {
        console.error('Draft save failed:', error);
        // Error feedback would be handled by parent component
      }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-20 bg-content1 rounded-t-xl backdrop-blur-md border-b border-divider px-3 py-4"
    >
      <div className="flex items-center justify-between">
        {/* Left side - Back button and title */}
        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            variant="light"
            radius="full"
            onPress={onCancel}
            aria-label={t("common.cancel")}
          >
            <Icon icon="solar:arrow-left-linear" width={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {title || t("navigation.taskManagement.createTask")}
            </h1>
            <p className="text-default-500">
              {description || "Create a new task and assign it to team members"}
            </p>
          </div>
        </div>

        {/* Right side - Action bar */}
        <div className="flex items-center bg-content2 p-2 rounded-full gap-2">
          {/* Desktop: Show all actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Import/Export Actions - Utility actions first */}
            {showImportActions && (
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="light"
                    radius="full"
                    startContent={<Icon icon="solar:import-bold" width={16} />}
                    endContent={<Icon icon="solar:alt-arrow-down-linear" width={14} />}
                    isLoading={isProcessingImport || isImporting}
                  >
                    Import
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Import actions">
                  <DropdownItem
                    key="import-file"
                    startContent={<Icon icon="solar:upload-bold" width={16} />}
                    onPress={handleFileImport}
                  >
                    {t("navigation.taskManagement.actionBar.importFromFile")}
                  </DropdownItem>
                  <DropdownItem
                    key="download-example"
                    startContent={<Icon icon="solar:download-bold" width={16} />}
                    onPress={handleDownloadExample}
                  >
                    {t("navigation.taskManagement.actionBar.downloadExample")}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}

            {/* Separator for visual grouping */}
            {showImportActions && (
              <div className="h-6 w-px bg-divider mx-1" />
            )}

            {/* Cancel Action */}
            <Button variant="light" radius="full" onPress={onCancel}>
              {t("common.cancel")}
            </Button>

            {/* Draft Action - Secondary action */}
            {showDraftActions && (
              <Button
                variant="flat"
                radius="full"
                startContent={<Icon icon="solar:diskette-bold" width={16} />}
                onPress={handleSaveDraft}
                isLoading={isDraftSaving}
                className={hasDraftChanges ? "text-warning" : ""}
                color="primary"
              >
                {t("navigation.taskManagement.actionBar.saveToDraft")}
              </Button>
            )}

            {/* Primary Action - Most important */}
            <Button
              color="primary"
              radius="full"
              onPress={onSubmit}
              isLoading={isSubmitting}
              startContent={!isSubmitting && <Icon icon="solar:add-circle-bold" width={18} />}
            >
              {t("common.create")}
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
                      startContent={<Icon icon="solar:upload-bold" width={16} />}
                      onPress={handleFileImport}
                    >
                      {t("navigation.taskManagement.actionBar.importFromFile")}
                    </DropdownItem>
                    <DropdownItem
                      key="download-example"
                      startContent={<Icon icon="solar:download-bold" width={16} />}
                      onPress={handleDownloadExample}
                    >
                      {t("navigation.taskManagement.actionBar.downloadExample")}
                    </DropdownItem>
                  </DropdownSection>
                </DropdownMenu>
              </Dropdown>
            )}

            {/* Main actions - consistent with desktop */}
            <Button variant="light" radius="full" onPress={onCancel}>
              {t("common.cancel")}
            </Button>

            {showDraftActions && (
              <Button
                variant="light"
                radius="full"
                startContent={<Icon icon="solar:diskette-bold" width={16} />}
                onPress={handleSaveDraft}
                isLoading={isDraftSaving}
                className={hasDraftChanges ? "text-warning" : ""}
              >
                Draft
              </Button>
            )}

            <Button
              color="primary"
              radius="full"
              onPress={onSubmit}
              isLoading={isSubmitting}
              startContent={!isSubmitting && <Icon icon="solar:add-circle-bold" width={18} />}
            >
              {t("common.create")}
            </Button>
          </div>

          {/* Mobile: Actions in dropdown, primary action visible */}
          <div className="flex md:hidden items-center gap-2">
            <Dropdown isOpen={isActionsOpen} onOpenChange={(open) => open ? onActionsOpen() : onActionsClose()}>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  variant="light"
                  radius="full"
                  aria-label={t("navigation.taskManagement.actionBar.actions")}
                >
                  <Icon icon="solar:menu-dots-bold" width={20} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="All actions" className="w-64">
                {showImportActions && (
                  <DropdownSection title="Import/Export">
                    <DropdownItem
                      key="import-file"
                      className="h-12"
                      startContent={
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <Icon className="text-blue-600 dark:text-blue-300" icon="solar:upload-bold" width={16} />
                        </div>
                      }
                      onPress={handleFileImport}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{t("navigation.taskManagement.actionBar.importFromFile")}</span>
                        <span className="text-xs text-default-500">{t("navigation.taskManagement.actionBar.importTooltip")}</span>
                      </div>
                    </DropdownItem>
                    <DropdownItem
                      key="download-example"
                      className="h-12"
                      startContent={
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                          <Icon className="text-emerald-600 dark:text-emerald-300" icon="solar:download-bold" width={16} />
                        </div>
                      }
                      onPress={handleDownloadExample}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{t("navigation.taskManagement.actionBar.downloadExample")}</span>
                        <span className="text-xs text-default-500">{t("navigation.taskManagement.actionBar.downloadTooltip")}</span>
                      </div>
                    </DropdownItem>
                  </DropdownSection>
                )}
                {showDraftActions && (
                  <DropdownSection title="Draft">
                    <DropdownItem
                      key="save-draft"
                      className="h-12"
                      startContent={
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                          <Icon className="text-amber-600 dark:text-amber-300" icon="solar:diskette-bold" width={16} />
                        </div>
                      }
                      onPress={handleSaveDraft}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{t("navigation.taskManagement.actionBar.saveToDraft")}</span>
                        <span className="text-xs text-default-500">{t("navigation.taskManagement.actionBar.draftTooltip")}</span>
                      </div>
                    </DropdownItem>
                  </DropdownSection>
                )}
                <DropdownSection title="Actions">
                  <DropdownItem
                    key="cancel"
                    className="h-12"
                    startContent={
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/30">
                        <Icon className="text-rose-600 dark:text-rose-300" icon="solar:close-circle-bold" width={16} />
                      </div>
                    }
                    onPress={onCancel}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{t("common.cancel")}</span>
                      <span className="text-xs text-default-500">Discard changes</span>
                    </div>
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
            <Button
              color="primary"
              radius="full"
              onPress={onSubmit}
              isLoading={isSubmitting}
              startContent={!isSubmitting && <Icon icon="solar:add-circle-bold" width={18} />}
            >
              {t("common.create")}
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={handleFileChange}
        className="hidden"
        aria-label={t("navigation.taskManagement.actionBar.importFromFile")}
      />
    </motion.div>
  );
}
