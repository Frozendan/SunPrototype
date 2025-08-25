"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

import DashboardLayout from "@/layouts/dashboard/dashboard-layout";
import { useTranslation } from "@/lib/i18n-context";
import { useTasks } from "@/hooks/use-tasks";
import { useTaskForm } from "@/hooks/use-task";
import { useAuth } from "@/hooks/use-auth";
import { TaskDetailHeader } from "@/components/task-management/task-detail-header";
import { TaskMainContent } from "@/components/task-management/task-main-content";
import { TaskDetailsSidebar } from "@/components/task-management/task-details-sidebar";
import { ImportConfirmDialog } from "@/components/ui/confirmation-dialog";
import { convertImportedDataToFormData } from "@/lib/task-import-export";
import { mockUnits, mockAssignees, mockAssignmentReferences, mockFunctionalGroups, mockTopics, mockTaskTypes } from "@/data/mock-task-data";
import type { TaskStatus, UpdateTaskRequest } from "@/types/task";
import type { TaskFormData } from "@/types/task-form";
import type { ImportedTaskData } from "@/lib/task-import-export";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Mock task data for demonstration
const mockTasksData: Record<string, TaskFormData & { parentTaskId?: string; parentTaskTitle?: string }> = {
  "GV.25.000146": {
    title: "Phát triển tính năng đăng nhập SSO",
    description: "Triển khai hệ thống đăng nhập Single Sign-On (SSO) để tích hợp với các hệ thống hiện có của công ty. Cần đảm bảo tương thích với LDAP và OAuth 2.0.",
    expectedResults: "Hệ thống SSO hoạt động ổn định, người dùng có thể đăng nhập một lần và truy cập tất cả các ứng dụng được phép. Tài liệu hướng dẫn sử dụng và triển khai hoàn chỉnh.",
    attachments: [],
    priority: "high",
    assigneeId: "emp-001",
    labelIds: ["label-1", "label-2"],
    unitId: "unit-1",
    collaboratingUnitId: "unit-2",
    assignmentReferenceId: "ref-1",
    importanceLevel: "very-important",
    assignmentDate: "2025-08-25",
    expectedEndDate: "2025-09-15",
    requiredDeadline: "2025-09-30",
    isRecurring: false,
    recurringType: "",
    recurringInterval: 1,
    recurringStartDate: "",
    recurringEndDate: "",
    isLeadershipDirection: true,
    functionalGroupId: "1",
    topicId: "1",
    taskTypeId: "1"
  },
  "ST.25.000001": {
    title: "Thiết kế giao diện người dùng",
    description: "Thiết kế giao diện đăng nhập SSO với UX/UI thân thiện và dễ sử dụng. Đảm bảo tương thích với các thiết bị di động và desktop.",
    expectedResults: "Mockup và prototype hoàn chỉnh cho giao diện đăng nhập SSO, được phê duyệt bởi team UX và stakeholders.",
    attachments: [],
    priority: "high",
    assigneeId: "emp-002",
    labelIds: ["label-1"],
    unitId: "unit-1",
    collaboratingUnitId: "",
    assignmentReferenceId: "ref-1",
    importanceLevel: "important",
    assignmentDate: "2025-08-25",
    expectedEndDate: "2025-08-30",
    requiredDeadline: "2025-09-02",
    isRecurring: false,
    recurringType: "",
    recurringInterval: 1,
    recurringStartDate: "",
    recurringEndDate: "",
    isLeadershipDirection: false,
    functionalGroupId: "1",
    topicId: "1",
    taskTypeId: "1",
    parentTaskId: "GV.25.000146",
    parentTaskTitle: "Phát triển tính năng đăng nhập SSO"
  },
  "ST.25.000002": {
    title: "Phát triển API backend",
    description: "Xây dựng API backend cho hệ thống SSO, tích hợp với LDAP và OAuth 2.0. Đảm bảo bảo mật và hiệu suất cao.",
    expectedResults: "API backend hoàn chỉnh với documentation, unit tests và integration tests. Hỗ trợ đầy đủ các flow authentication.",
    attachments: [],
    priority: "urgent",
    assigneeId: "emp-003",
    labelIds: ["label-2"],
    unitId: "unit-1",
    collaboratingUnitId: "",
    assignmentReferenceId: "ref-1",
    importanceLevel: "very-important",
    assignmentDate: "2025-08-25",
    expectedEndDate: "2025-09-05",
    requiredDeadline: "2025-09-10",
    isRecurring: false,
    recurringType: "",
    recurringInterval: 1,
    recurringStartDate: "",
    recurringEndDate: "",
    isLeadershipDirection: true,
    functionalGroupId: "1",
    topicId: "1",
    taskTypeId: "1",
    parentTaskId: "GV.25.000146",
    parentTaskTitle: "Phát triển tính năng đăng nhập SSO"
  },
  "ST.25.000003": {
    title: "Viết unit tests",
    description: "Viết unit tests và integration tests cho toàn bộ hệ thống SSO. Đảm bảo coverage tối thiểu 80%.",
    expectedResults: "Test suite hoàn chỉnh với coverage report, automated testing pipeline và documentation.",
    attachments: [],
    priority: "medium",
    assigneeId: "emp-004",
    labelIds: ["label-3"],
    unitId: "unit-1",
    collaboratingUnitId: "",
    assignmentReferenceId: "ref-1",
    importanceLevel: "normal",
    assignmentDate: "2025-08-25",
    expectedEndDate: "2025-09-10",
    requiredDeadline: "2025-09-15",
    isRecurring: false,
    recurringType: "",
    recurringInterval: 1,
    recurringStartDate: "",
    recurringEndDate: "",
    isLeadershipDirection: false,
    functionalGroupId: "1",
    topicId: "1",
    taskTypeId: "1",
    parentTaskId: "GV.25.000146",
    parentTaskTitle: "Phát triển tính năng đăng nhập SSO"
  }
};

export default function TaskDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateTask } = useTasks();
  const { formData, errors, updateField, validateForm, setFormData } = useTaskForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [pendingImportData, setPendingImportData] = useState<ImportedTaskData[]>([]);
  const [taskStatus, setTaskStatus] = useState<TaskStatus>("inProgress");
  const [isLoading, setIsLoading] = useState(true);
  const [currentTask, setCurrentTask] = useState<(TaskFormData & { parentTaskId?: string; parentTaskTitle?: string }) | null>(null);

  // Load task data on component mount
  useEffect(() => {
    const loadTaskData = async () => {
      if (!id) {
        navigate('/task-management');
        return;
      }

      try {
        setIsLoading(true);
        // In a real app, you would fetch the task data from an API
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

        const taskData = mockTasksData[id];
        if (!taskData) {
          toast.error('Task not found');
          navigate('/task-management');
          return;
        }

        setCurrentTask(taskData);
        setFormData(taskData);
        setTaskStatus("inProgress"); // This would come from the API
      } catch (error) {
        console.error('Failed to load task:', error);
        toast.error('Failed to load task details');
        navigate('/task-management');
      } finally {
        setIsLoading(false);
      }
    };

    loadTaskData();
  }, [id, navigate, setFormData]);

  // Handle form submission (save task)
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error(t("navigation.taskManagement.validation.pleaseFillRequired"));
      return;
    }

    if (!id) return;

    setIsSubmitting(true);
    try {
      const updateRequest: UpdateTaskRequest = {
        id,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: taskStatus,
        assigneeId: formData.assigneeId,
        labelIds: formData.labelIds,
        // Add other fields as needed
      };

      await updateTask(updateRequest);
      toast.success(t("navigation.taskManagement.messages.taskUpdated"));
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error(t("navigation.taskManagement.messages.updateFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle status change
  const handleStatusChange = (newStatus: TaskStatus) => {
    setTaskStatus(newStatus);
  };

  // Handle file import
  const handleImportFile = async (importedData: ImportedTaskData[]) => {
    if (importedData.length === 0) return;

    setPendingImportData(importedData);
    setShowImportConfirm(true);
  };

  // Process import after confirmation
  const processImport = async (importedData: ImportedTaskData[]) => {
    setIsImporting(true);
    try {
      if (importedData.length > 0) {
        const convertedData = convertImportedDataToFormData(importedData[0]);
        Object.entries(convertedData).forEach(([key, value]) => {
          updateField(key as keyof TaskFormData, value);
        });
        toast.success(`Imported data successfully`);
      }
    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Failed to import data');
    } finally {
      setIsImporting(false);
      setShowImportConfirm(false);
      setPendingImportData([]);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-default-600">Loading task details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <TaskDetailHeader
          onSave={handleSubmit}
          isSaving={isSubmitting}
          taskId={id || ""}
          taskStatus={taskStatus}
          onStatusChange={user?.role === 'admin' ? handleStatusChange : undefined}
          onImportFile={handleImportFile}
          isImporting={isImporting}
          showImportActions={true}
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
              taskId={id as string}
              showSubtasks={true}
              mockUnits={mockUnits}
              mockAssignees={mockAssignees}
              mockAssignmentReferences={mockAssignmentReferences}
              mockFunctionalGroups={mockFunctionalGroups}
              mockTopics={mockTopics}
              mockTaskTypes={mockTaskTypes}
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

      {/* Import Confirmation Dialog */}
      <ImportConfirmDialog
        isOpen={showImportConfirm}
        onClose={() => {
          setShowImportConfirm(false);
          setPendingImportData([]);
        }}
        onConfirm={() => processImport(pendingImportData)}
        importCount={pendingImportData.length}
        hasExistingData={true}
        isLoading={isImporting}
      />
    </DashboardLayout>
  );
}
