"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ScrollShadow
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { TaskMainContent } from "./task-main-content";
import { TaskDetailsSidebar } from "./task-details-sidebar";
import { useTaskForm } from "@/hooks/use-task";
import { useTranslation } from "@/lib/i18n-context";
import type { TaskFormData, MockUnit, MockAssignee, MockAssignmentReference, MockFunctionalGroup, MockTopic, MockTaskType } from "@/types/task-form";

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
  const { formData, errors, updateField, validateForm, resetForm } = useTaskForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

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
            
            <ModalFooter>
              <Button 
                variant="light" 
                onPress={handleCancel}
                isDisabled={isSubmitting}
              >
                {t("common.cancel")}
              </Button>
              <Button 
                color="primary"
                onPress={handleSubmit}
                isLoading={isSubmitting}
                startContent={!isSubmitting && <Icon icon="solar:add-circle-bold" width={18} />}
              >
                {parentTaskId ? 'Tạo công việc con' : t("common.create")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
