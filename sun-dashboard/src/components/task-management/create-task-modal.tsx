"use client";

import { useState, useRef, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ScrollShadow,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  useDisclosure
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { TaskMainContent } from "./task-main-content";
import { TaskDetailsSidebar } from "./task-details-sidebar";
import { useTaskForm } from "@/hooks/use-task";
import { useTaskFormStore } from "@/stores/task-form-store";
import { useTaskDraft } from "@/hooks/use-task-draft";
import { useTranslation } from "@/lib/i18n-context";
import { downloadExampleFile, importTasksFromFile, convertImportedDataToFormData } from "@/lib/task-import-export";
import type { TaskFormData, MockUnit, MockAssignee, MockAssignmentReference, MockFunctionalGroup, MockTopic, MockTaskType } from "@/types/task-form";
import type { ImportedTaskData } from "@/lib/task-import-export";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (taskData: TaskFormData) => void;
  parentTaskId?: string;
  mockUnits: MockUnit[];
  mockAssignees: MockAssignee[];
  mockAssignmentReferences: MockAssignmentReference[];
  mockFunctionalGroups: MockFunctionalGroup[];
  mockTopics: MockTopic[];
  mockTaskTypes: MockTaskType[];
}

export function CreateTaskModal({
  isOpen,
  onClose,
  onTaskCreated,
  parentTaskId,
  mockUnits,
  mockAssignees,
  mockAssignmentReferences,
  mockFunctionalGroups,
  mockTopics,
  mockTaskTypes
}: CreateTaskModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Use local hook for form management in modal
  const { formData, errors, updateField, validateForm, resetForm } = useTaskForm();

  // Use store for navigation functionality
  const { prepareNavigationToFullPage, updateFormData } = useTaskFormStore();

  // Local state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isImporting, setIsImporting] = useState(false);

  // Helper function to update form data
  const updateFormDataHelper = useCallback((data: Partial<TaskFormData>) => {
    Object.entries(data).forEach(([key, value]) => {
      updateField(key as keyof TaskFormData, value);
    });
  }, [updateField]);

  // Create a safe default formData to prevent undefined errors
  const safeFormData = formData || {
    title: '',
    description: '',
    expectedResults: '',
    attachments: [],
    priority: 'medium' as const,
    assigneeId: '',
    labelIds: [],
    unitId: '',
    collaboratingUnitId: '',
    assignmentReferenceId: '',
    importanceLevel: 'normal' as const,
    assignmentDate: '',
    expectedEndDate: '',
    requiredDeadline: '',
    isRecurring: false,
    recurringType: '',
    recurringInterval: 0,
    recurringStartDate: '',
    recurringEndDate: '',
    isLeadershipDirection: false,
    functionalGroupId: '',
    topicId: '',
    taskTypeId: ''
  };

  // Draft functionality
  const { saveDraft, isDraftSaving, hasDraftChanges } = useTaskDraft(safeFormData, updateFormDataHelper);

  // File input ref for import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dropdown state
  const { isOpen: isActionsOpen, onOpen: onActionsOpen, onClose: onActionsClose } = useDisclosure();

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Validate form
      const isValid = validateForm();

      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      // In real app, this would make an API call to create the subtask
      const taskData = {
        ...formData,
        parentTaskId: parentTaskId // Set parent task ID for subtask
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Call the callback with the new task data
      onTaskCreated(taskData);

      // Reset form and close modal
      resetForm();
      onClose();

    } catch (error) {
      console.error('Error creating subtask:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    resetForm();
    onClose();
  };

  // Handle navigation to full create task page
  const handleNavigateToFullPage = () => {
    // Ensure formData exists before proceeding
    if (!formData) {
      console.warn('Form data not available for navigation');
      return;
    }

    // Set parent task ID in form data if creating subtask
    const dataToSave = { ...formData };
    if (parentTaskId) {
      dataToSave.parentTaskId = parentTaskId;
    }

    // Update store with current form data
    updateFormData(dataToSave);

    // Prepare navigation with current form data
    prepareNavigationToFullPage();

    // Navigate to create task page
    navigate('/task-management/create-task');

    // Close modal
    onClose();
  };

  // Handle file import
  const handleFileImport = async () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const importedData = await importTasksFromFile(file);
      if (importedData.length > 0) {
        // For modal, we'll just take the first imported task and convert it to form data
        const firstTask = importedData[0];
        const formData = convertImportedDataToFormData(firstTask);
        updateFormData(formData);
      }
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle example file download
  const handleDownloadExample = () => {
    downloadExampleFile(t("navigation.taskManagement.actionBar.exampleFileName"));
  };

  // Handle draft save
  const handleSaveDraft = async () => {
    try {
      await saveDraft(formData);
    } catch (error) {
      console.error('Draft save failed:', error);
    }
  };

  // Don't render modal if formData is not available
  if (!formData) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      placement="center"
      backdrop="blur"
      scrollBehavior="inside"
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        base: "border-[1px] border-default-200 dark:border-default-100",
        header: "border-b-[1px] border-divider",
        footer: "border-t-[1px] border-divider",
        closeButton: "hover:bg-white/5 active:bg-white/10",
      }}
    >
      <ModalContent className="max-h-[90vh]">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                  <Icon 
                    icon="solar:add-square-bold" 
                    width={24} 
                    className="text-primary-600 dark:text-primary-400"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {parentTaskId ? 'Tạo công việc con' : 'Tạo công việc mới'}
                  </h3>
                  {parentTaskId && (
                    <p className="text-sm text-default-500">
                      Công việc con của: {parentTaskId}
                    </p>
                  )}
                </div>
              </div>
            </ModalHeader>
            
            <ModalBody className="p-0">
              <ScrollShadow className="h-full">
                <div className="p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                      {/* Main Content */}
                      <div className="lg:col-span-2">
                        <TaskMainContent
                          formData={formData}
                          errors={errors}
                          updateField={updateField}
                        />
                      </div>

                      {/* Sidebar */}
                      <div className="lg:col-span-1">
                        <TaskDetailsSidebar
                          formData={formData}
                          errors={errors}
                          updateField={updateField}
                          isExpanded={isSidebarExpanded}
                          onToggleExpanded={() => setIsSidebarExpanded(!isSidebarExpanded)}
                          mockUnits={mockUnits}
                          mockAssignees={mockAssignees}
                          mockAssignmentReferences={mockAssignmentReferences}
                          mockFunctionalGroups={mockFunctionalGroups}
                          mockTopics={mockTopics}
                          mockTaskTypes={mockTaskTypes}
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </ScrollShadow>
            </ModalBody>
            
            <ModalFooter className="flex flex-col gap-3">
              {/* Action Buttons Row */}
              <div className="flex items-center justify-between w-full">
                {/* Left side - Utility Actions */}
                <div className="flex items-center gap-2">
                  {/* Import Dropdown */}
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="light"
                        size="sm"
                        startContent={<Icon icon="solar:import-bold" width={16} />}
                        endContent={<Icon icon="solar:alt-arrow-down-linear" width={14} />}
                        isLoading={isImporting}
                        isDisabled={isSubmitting}
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

                  {/* Save to Draft */}
                  <Button
                    variant="flat"
                    size="sm"
                    startContent={<Icon icon="solar:diskette-bold" width={16} />}
                    onPress={handleSaveDraft}
                    isLoading={isDraftSaving}
                    isDisabled={isSubmitting}
                    className={hasDraftChanges ? "text-warning" : ""}
                    color="primary"
                  >
                    {t("navigation.taskManagement.actionBar.saveToDraft")}
                  </Button>

                  {/* Navigate to Full Page */}
                  <Button
                    variant="bordered"
                    size="sm"
                    startContent={<Icon icon="solar:external-link-bold" width={16} />}
                    onPress={handleNavigateToFullPage}
                    isDisabled={isSubmitting}
                  >
                    Mở trang đầy đủ
                  </Button>
                </div>

                {/* Right side - Primary Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="light"
                    size="sm"
                    onPress={handleCancel}
                    isDisabled={isSubmitting}
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    onPress={handleSubmit}
                    isLoading={isSubmitting}
                    startContent={!isSubmitting && <Icon icon="solar:add-circle-bold" width={18} />}
                  >
                    {parentTaskId ? 'Tạo công việc con' : t("common.create")}
                  </Button>
                </div>
              </div>
            </ModalFooter>

            {/* Hidden file input for import */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
