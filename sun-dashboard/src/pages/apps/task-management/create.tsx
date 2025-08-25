"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

import DashboardLayout from "@/layouts/dashboard/dashboard-layout";
import { useTranslation } from "@/lib/i18n-context";
import { useTasks } from "@/hooks/use-tasks";
import { useTaskForm } from "@/hooks/use-task";
import { useAuth } from "@/hooks/use-auth";
import { useTaskDraft, useDraftRestoration } from "@/hooks/use-task-draft";
import { useTaskFormStore } from "@/stores/task-form-store";
import { useTaskFormIntegration } from "@/hooks/use-task-form-integration";
import { CreateTaskHeader } from "@/components/task-management/create-task-header";
import { TaskMainContent } from "@/components/task-management/task-main-content";
import { TaskDetailsSidebar } from "@/components/task-management/task-details-sidebar";
import { DraftRestoreDialog, ImportConfirmDialog, ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { convertImportedDataToFormData } from "@/lib/task-import-export";
import { mockUnits, mockAssignees, mockAssignmentReferences, mockFunctionalGroups, mockTopics, mockTaskTypes } from "@/data/mock-task-data";
import type { TaskPriority, CreateTaskRequest } from "@/types/task";
import type { TaskFormData } from "@/types/task-form";
import type { ImportedTaskData } from "@/lib/task-import-export";

export default function CreateTaskPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createTask } = useTasks();

  // Use integrated form hook that handles both local and store data
  const { formData, errors, updateField, validateForm, resetForm, prepareNavigationToFullPage, shouldNavigateToFullPage } = useTaskFormIntegration();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [pendingImportData, setPendingImportData] = useState<ImportedTaskData[]>([]);

  // Draft management
  const updateFormData = (data: Partial<TaskFormData>) => {
    Object.entries(data).forEach(([key, value]) => {
      updateField(key as keyof TaskFormData, value);
    });
  };

  const {
    isDraftSaving,
    hasDraftChanges,
    saveDraft,
    restoreDraft,
    clearDraft,
    hasDraft,
    getDraftAge,
    hasContent
  } = useTaskDraft(formData, updateFormData);

  const {
    showRestoreDialog,
    draftToRestore,
    checkForDraft,
    acceptRestore,
    rejectRestore
  } = useDraftRestoration();

  // Check for existing draft on mount
  useEffect(() => {
    checkForDraft();
  }, [checkForDraft]);

  // Navigation data restoration is now handled by useTaskFormIntegration hook

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setIsSubmitting(true);

    try {
      const createData: CreateTaskRequest = {
        title: formData.title,
        description: formData.description || undefined,
        priority: formData.priority,
        assigneeId: formData.assigneeId || undefined,
        labelIds: formData.labelIds,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : undefined,
        projectId: formData.projectId || undefined,
        // New fields
        unitId: formData.unitId || undefined,
        collaboratingUnitId: formData.collaboratingUnitId || undefined,
        assignmentReferenceId: formData.assignmentReferenceId || undefined,
        importanceLevel: formData.importanceLevel,
        assignmentDate: new Date(formData.assignmentDate),
        expectedEndDate: formData.expectedEndDate ? new Date(formData.expectedEndDate) : undefined,
        requiredDeadline: formData.requiredDeadline || undefined,
        isRecurring: formData.isRecurring,
      };

      await createTask(createData);
      toast.success("Task created successfully!");
      navigate("/task-management/tasks");
    } catch (error) {
      toast.error("Failed to create task");
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle import from file
  const handleImportFile = async (importedData: ImportedTaskData[]) => {
    if (importedData.length === 0) {
      toast.error(t("navigation.taskManagement.actionBar.importError"));
      return;
    }

    // Check if form has existing data
    const hasExistingData = hasContent;

    if (hasExistingData) {
      setPendingImportData(importedData);
      setShowImportConfirm(true);
    } else {
      await processImport(importedData);
    }
  };

  const processImport = async (importedData: ImportedTaskData[]) => {
    setIsImporting(true);
    try {
      // For now, just import the first task
      const firstTask = importedData[0];
      const convertedData = convertImportedDataToFormData(firstTask);
      updateFormData(convertedData);

      toast.success(t("navigation.taskManagement.actionBar.importSuccess"));
      setShowImportConfirm(false);
      setPendingImportData([]);
    } catch (error) {
      console.error('Import processing failed:', error);
      toast.error(t("navigation.taskManagement.actionBar.importError"));
    } finally {
      setIsImporting(false);
    }
  };

  // Handle draft save
  const handleSaveDraft = async () => {
    try {
      await saveDraft();
      toast.success(t("navigation.taskManagement.actionBar.draftSaved"));
    } catch (error) {
      console.error('Draft save failed:', error);
      toast.error("Failed to save draft");
    }
  };

  // Handle draft restore
  const handleRestoreDraft = () => {
    const restored = restoreDraft();
    if (restored) {
      toast.success(t("navigation.taskManagement.actionBar.draftLoaded"));
    }
    acceptRestore();
  };

  // Handle cancel with confirmation if there are unsaved changes
  const handleCancel = () => {
    if (hasContent || hasDraftChanges) {
      setShowCancelConfirm(true);
    } else {
      navigate("/task-management/dashboard");
    }
  };

  const confirmCancel = () => {
    clearDraft();
    navigate("/task-management/dashboard");
  };



  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <CreateTaskHeader
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onImportFile={handleImportFile}
          onSaveDraft={handleSaveDraft}
          isDraftSaving={isDraftSaving}
          hasDraftChanges={hasDraftChanges}
          isImporting={isImporting}
        />

        {/* Scrollable Content */}
        <motion.div
          className="flex-1 px-3 pt-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-full">
            <TaskMainContent
              formData={formData}
              errors={errors}
              updateField={updateField}
            />

            <div>
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

      {/* Confirmation Dialogs */}
      <DraftRestoreDialog
        isOpen={showRestoreDialog}
        onClose={rejectRestore}
        onRestore={handleRestoreDraft}
        onDiscard={rejectRestore}
        draftAge={getDraftAge()}
      />

      <ImportConfirmDialog
        isOpen={showImportConfirm}
        onClose={() => {
          setShowImportConfirm(false);
          setPendingImportData([]);
        }}
        onConfirm={() => processImport(pendingImportData)}
        importCount={pendingImportData.length}
        hasExistingData={hasContent}
        isLoading={isImporting}
      />

      <ConfirmationDialog
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={confirmCancel}
        title="Unsaved Changes"
        message={t("navigation.taskManagement.actionBar.confirmCancel")}
        confirmText="Leave"
        isDangerous={true}
        icon="solar:danger-triangle-bold"
      />
    </DashboardLayout>
  );
}

