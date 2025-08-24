"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

import DashboardLayout from "@/layouts/dashboard/dashboard-layout";
import { useTranslation } from "@/lib/i18n-context";
import { useTasks } from "@/hooks/use-tasks";
import { useTaskForm } from "@/hooks/use-task";
import { useAuth } from "@/hooks/use-auth";
import { CreateTaskHeader } from "@/components/task-management/create-task-header";
import { TaskMainContent } from "@/components/task-management/task-main-content";
import { TaskDetailsSidebar } from "@/components/task-management/task-details-sidebar";
import type { TaskPriority, CreateTaskRequest } from "@/types/task";
import type { TaskFormData, MockUnit, MockAssignee, MockAssignmentReference } from "@/types/task-form";



import { mockUnits, mockAssignees, mockAssignmentReferences } from "@/data/mock-task-data";

export default function CreateTaskPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createTask } = useTasks();
  const { formData, errors, updateField, validateForm, resetForm } = useTaskForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

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

  const handleCancel = () => {
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
              />
            </div>

          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

