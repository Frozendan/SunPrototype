"use client";

import { useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Input,
    Textarea,
    Select,
    SelectItem,
    Chip,
    Avatar,
    Divider,
    DatePicker,
    Spacer,
    RadioGroup,
    Radio,
    Checkbox,
    Autocomplete,
    AutocompleteItem,
    Switch,
    ButtonGroup, ScrollShadow,
} from "@heroui/react";
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

import DashboardLayout from "@/layouts/dashboard/dashboard-layout";
import { useTranslation } from "@/lib/i18n-context";
import { useTasks } from "@/hooks/use-tasks";
import { useTaskForm } from "@/hooks/use-task";
import { useAuth } from "@/hooks/use-auth";
import type { TaskPriority, CreateTaskRequest } from "@/types/task";

const priorityOptions = [
  { key: "low", label: "Low", color: "default", icon: "solar:arrow-down-linear" },
  { key: "medium", label: "Medium", color: "warning", icon: "solar:minus-linear" },
  { key: "high", label: "High", color: "danger", icon: "solar:arrow-up-linear" },
  { key: "urgent", label: "Urgent", color: "danger", icon: "solar:double-alt-arrow-up-bold" },
];

const mockAssignees = [
  { id: "current-user", name: "Current User", email: "current@example.com", avatar: "https://i.pravatar.cc/150?u=current" },
  { id: "1", name: "John Doe", email: "john@example.com", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", avatar: "https://i.pravatar.cc/150?u=2" },
  { id: "3", name: "Alice Johnson", email: "alice@example.com", avatar: "https://i.pravatar.cc/150?u=3" },
  { id: "4", name: "Bob Wilson", email: "bob@example.com", avatar: "https://i.pravatar.cc/150?u=4" },
];

const mockLabels = [
  { id: "1", name: "Frontend", color: "blue" },
  { id: "2", name: "Backend", color: "green" },
  { id: "3", name: "Design", color: "purple" },
  { id: "4", name: "Bug", color: "red" },
  { id: "5", name: "Feature", color: "yellow" },
];

const mockUnits = [
  { id: "1", name: "Phòng Công nghệ thông tin" },
  { id: "2", name: "Phòng Nhân sự" },
  { id: "3", name: "Phòng Kế toán" },
  { id: "4", name: "Phòng Marketing" },
  { id: "5", name: "Phòng Kinh doanh" },
];

const mockAssignmentReferences = [
  { id: "1", name: "Nhiệm vụ trọng tâm" },
  { id: "2", name: "Nhiệm vụ chức năng" },
  { id: "3", name: "Khác" },
];

export default function CreateTaskPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createTask } = useTasks();
  const { formData, errors, updateField, validateForm, resetForm } = useTaskForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recurringType, setRecurringType] = useState<string>("");
  const [recurringStartDate, setRecurringStartDate] = useState<string>("");
  const [recurringEndDate, setRecurringEndDate] = useState<string>("");
  const [isLeadershipDirective, setIsLeadershipDirective] = useState(false);
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

  const handleAssignToMe = () => {
    // Use the current-user ID that exists in mockAssignees
    updateField("assigneeId", "current-user");
    // Auto-update unit based on current user
    updateField("unitId", "1"); // Assuming current user is from IT department
    updateField("collaboratingUnitId", "");
    // Show leadership directive toggle when assigning to self
    setIsLeadershipDirective(false);
  };

  const handleAssigneeChange = (assigneeId: string | null) => {
    updateField("assigneeId", assigneeId);
    if (assigneeId) {
      // Auto-update unit based on selected assignee
      const assignee = mockAssignees.find(a => a.id === assigneeId);
      if (assignee) {
        // Map assignee to their department
        const unitMapping: Record<string, string> = {
          "current-user": "1", // Current User -> IT Department
          "1": "1", // John Doe -> IT Department
          "2": "2", // Jane Smith -> HR Department
          "3": "4", // Alice Johnson -> Marketing Department
          "4": "5", // Bob Wilson -> Sales Department
        };
        updateField("unitId", unitMapping[assigneeId] || "");
      }
    }
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
      <motion.div
        className="flex flex-col h-full px-3 pt-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                isIconOnly
                variant="light"
                onPress={handleCancel}
                aria-label="Go back"
              >
                <Icon icon="solar:arrow-left-linear" width={20} />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {t("navigation.taskManagement.createTask")}
                </h1>
                <p className="text-default-500">
                  Create a new task and assign it to team members
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="light" onPress={handleCancel}>
                {t("common.cancel")}
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={isSubmitting}
                startContent={!isSubmitting && <Icon icon="solar:add-circle-outline" width={18} />}
              >
                {t("common.create")}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 flex-1">
          {/* Main Content */}
          <motion.div variants={itemVariants} className="h-full pb-3 lg:col-span-2">
            <Card className=" flex flex-col">
             
              <CardBody className="space-y-6 overflow-y-auto flex-1" role="region" aria-labelledby="task-details-heading">
                {/* Title */}
                <Input
                  label={t("navigation.taskManagement.taskTitle")}
                  placeholder="Enter task title"
                  value={formData.title}
                  onValueChange={(value) => updateField("title", value)}
                  isInvalid={!!errors.title}
                  errorMessage={errors.title}
                  isRequired
                  variant="bordered"
                  aria-describedby={errors.title ? "title-error" : undefined}
                  autoFocus
                />

                {/* Description */}
                <Textarea
                  label={t("navigation.taskManagement.taskDescription")}
                  placeholder="Describe what needs to be done..."
                  value={formData.description}
                  onValueChange={(value) => updateField("description", value)}
                  minRows={6}
                  variant="bordered"
                  aria-label="Task description"
                />
              </CardBody>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div variants={itemVariants} className=" px-3 py-3 -mt-3 rounded-lg">
            <Card className="flex flex-col">
              <CardHeader onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} className="cursor-pointer flex flex-row items-center justify-between py-4 flex-shrink-0">
                <h3 className="text-sm font-semibold">Chi tiết công việc</h3>
                  <motion.div
                      animate={{ rotate: isSidebarExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                  >
                      <Icon icon="solar:alt-arrow-right-linear" width={20} />
                  </motion.div>
              </CardHeader>

              <motion.div
                initial={false}
                animate={{
                  height: isSidebarExpanded ? "auto" : 0,
                  opacity: isSidebarExpanded ? 1 : 0,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                style={{ overflow: "hidden" }}
                className="flex flex-col"
              >
                <CardBody className="space-y-6 pt-0 overflow-y-auto flex-1">
                  {/* Basic Information Section */}
                      <div className="space-y-4">
                          <div>
                              <label className="text-sm font-medium text-default-700 mb-2 block">
                                  {t("navigation.taskManagement.unit")} *
                              </label>
                              <Autocomplete
                                  placeholder={t("navigation.taskManagement.selectUnit")}
                                  selectedKey={formData.unitId}
                                  onSelectionChange={(key) => updateField("unitId", key)}
                                  variant="bordered"
                                  allowsCustomValue
                              >
                                  {mockUnits.map((unit) => (
                                      <AutocompleteItem key={unit.id} value={unit.id}>
                                          {unit.name}
                                      </AutocompleteItem>
                                  ))}
                              </Autocomplete>
                          </div>

                          <div>
                              <div className="flex items-center justify-between mb-2">
                                  <label className="text-sm font-medium text-default-700">
                                      {t("navigation.taskManagement.assignedPerson")} *
                                  </label>
                                  <Button
                                      variant="flat"
                                      size="sm"
                                      color="primary"
                                      onPress={handleAssignToMe}
                                      startContent={<Icon icon="solar:user-linear" width={14} />}
                                      className="text-xs px-3 py-1 h-6"
                                  >
                                      {t("navigation.taskManagement.assignToMe")}
                                  </Button>
                              </div>
                              <Autocomplete
                                  placeholder={t("navigation.taskManagement.selectAssignedPerson")}
                                  selectedKey={formData.assigneeId}
                                  onSelectionChange={handleAssigneeChange}
                                  variant="bordered"
                                  allowsCustomValue
                              >
                                  {mockAssignees.map((assignee) => (
                                      <AutocompleteItem
                                          key={assignee.id}
                                          value={assignee.id}
                                          startContent={<Avatar src={assignee.avatar} size="sm" />}
                                      >
                                          {assignee.name}
                                      </AutocompleteItem>
                                  ))}
                              </Autocomplete>

                              {/* Leadership Directive Toggle - Show when assigned to self */}
                              {formData.assigneeId === "current-user" && (
                                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                      <div className="flex items-center justify-between">
                                          <label className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                              {t("navigation.taskManagement.leadershipDirective")}
                                          </label>
                                          <Switch
                                              isSelected={isLeadershipDirective}
                                              onValueChange={setIsLeadershipDirective}
                                              size="sm"
                                              color="primary"
                                          />
                                      </div>
                                  </div>
                              )}
                          </div>

                          <div>
                              <label className="text-sm font-medium text-default-700 mb-2 block">
                                  {t("navigation.taskManagement.collaboratingUnit")}
                              </label>
                              <Autocomplete
                                  placeholder={t("navigation.taskManagement.selectCollaboratingUnit")}
                                  selectedKey={formData.collaboratingUnitId}
                                  onSelectionChange={(key) => updateField("collaboratingUnitId", key)}
                                  variant="bordered"
                                  allowsCustomValue
                              >
                                  {mockUnits.map((unit) => (
                                      <AutocompleteItem key={unit.id} value={unit.id}>
                                          {unit.name}
                                      </AutocompleteItem>
                                  ))}
                              </Autocomplete>
                          </div>

                          <div>
                              <label className="text-sm font-medium text-default-700 mb-2 block">
                                  {t("navigation.taskManagement.assignmentReference")}
                              </label>
                              <Autocomplete
                                  placeholder={t("navigation.taskManagement.selectAssignmentReference")}
                                  selectedKey={formData.assignmentReferenceId}
                                  onSelectionChange={(key) => updateField("assignmentReferenceId", key)}
                                  variant="bordered"
                                  allowsCustomValue
                              >
                                  {mockAssignmentReferences.map((ref) => (
                                      <AutocompleteItem key={ref.id} value={ref.id}>
                                          {ref.name}
                                      </AutocompleteItem>
                                  ))}
                              </Autocomplete>
                          </div>
                      </div>

                      <Divider />

                      {/* Priority and Importance Section */}
                      <div className="space-y-4">
                          <div>
                              <label className="text-sm font-medium text-default-700 mb-3 block">
                                  {t("navigation.taskManagement.priorityLevel")}
                              </label>
                              <ButtonGroup variant="bordered" className="w-full">
                                  <Button
                                      className={`flex-1 ${formData.priority === 'normal' ? 'bg-secondary text-primary-foreground' : ''}`}
                                      onPress={() => updateField("priority", "normal")}
                                      startContent={<Icon
                                          icon="solar:arrow-right-outline"
                                          width={16}
                                          className={formData.priority === 'normal' ? '' : 'text-secondary'}
                                      />}
                                  >
                                      {t("navigation.taskManagement.normal")}
                                  </Button>
                                  <Button
                                      className={`flex-1 ${formData.priority === 'urgent' ? 'bg-danger text-primary-foreground' : ''}`}
                                      onPress={() => updateField("priority", "urgent")}
                                      startContent={<Icon
                                          icon="solar:arrow-up-outline"
                                          width={16}
                                          className={formData.priority === 'urgent' ? '' : 'text-warning'}
                                      />}
                                  >
                                      {t("navigation.taskManagement.urgent")}
                                  </Button>
                              </ButtonGroup>
                          </div>

                          <div>
                              <label className="text-sm font-medium text-default-700 mb-3 block">
                                  {t("navigation.taskManagement.importanceLevel")}
                              </label>
                              <ButtonGroup variant="bordered" className="w-full">
                                  <Button
                                      className={`flex-1 ${formData.importanceLevel === 'normal' ? 'bg-secondary text-primary-foreground' : ''}`}
                                      onPress={() => updateField("importanceLevel", "normal")}
                                      startContent={
                                          <Icon
                                              icon="solar:arrow-right-outline"
                                              width={16}
                                              className={formData.importanceLevel === 'normal' ? '' : 'text-secondary'}
                                          />
                                      }
                                  >
                                      {t("navigation.taskManagement.normalImportance")}
                                  </Button>
                                  <Button
                                      className={`flex-1 ${formData.importanceLevel === 'important' ? 'bg-warning text-primary-foreground' : ''}`}
                                      onPress={() => updateField("importanceLevel", "important")}
                                      startContent={
                                          <Icon
                                              icon="solar:arrow-right-up-linear"
                                              width={16}
                                              className={formData.importanceLevel === 'important' ? '' : 'text-orange-500'}
                                          />
                                      }
                                  >
                                      {t("navigation.taskManagement.important")}
                                  </Button>
                                  <Button
                                      className={`flex-1 ${formData.importanceLevel === 'very-important' ? 'bg-danger text-primary-foreground' : ''}`}
                                      onPress={() => updateField("importanceLevel", "very-important")}
                                      startContent={
                                          <Icon
                                              icon="solar:arrow-up-linear"
                                              width={16}
                                              className={formData.importanceLevel === 'very-important' ? '' : 'text-red-500'}
                                          />
                                      }
                                  >
                                      {t("navigation.taskManagement.veryImportant")}
                                  </Button>
                              </ButtonGroup>
                          </div>
                      </div>

                      <Divider />

                      {/* Dates Section */}
                      <div className="space-y-4">
                          <div>
                              <label className="text-sm font-medium text-default-700 mb-2 block">
                                  {t("navigation.taskManagement.assignmentDate")} *
                              </label>
                              <DatePicker
                                  value={formData.assignmentDate ? parseDate(formData.assignmentDate) : today(getLocalTimeZone())}
                                  onChange={(date) => updateField("assignmentDate", date?.toString())}
                                  variant="bordered"
                                  showMonthAndYearPickers
                                  className="w-full"
                              />
                          </div>

                          <div>
                              <label className="text-sm font-medium text-default-700 mb-2 block">
                                  {t("navigation.taskManagement.expectedEndDate")} *
                              </label>
                              <DatePicker
                                  value={formData.expectedEndDate ? parseDate(formData.expectedEndDate) : null}
                                  onChange={(date) => updateField("expectedEndDate", date?.toString())}
                                  variant="bordered"
                                  showMonthAndYearPickers
                                  className="w-full"
                              />
                          </div>

                          <div>
                              <label className="text-sm font-medium text-default-700 mb-2 block">
                                  {t("navigation.taskManagement.requiredDeadline")} *
                              </label>
                              <Input
                                  placeholder={t("navigation.taskManagement.deadlineRequired")}
                                  value={formData.requiredDeadline}
                                  onValueChange={(value) => updateField("requiredDeadline", value)}
                                  variant="bordered"
                              />
                          </div>
                      </div>

                      <Divider />

                      {/* Recurring Task Section */}
                      <div className="space-y-4">
                          <div className="flex items-center justify-between">
                              <label className="text-sm font-medium text-default-700">
                                  {t("navigation.taskManagement.createRecurringTask")}
                              </label>
                              <Switch
                                  isSelected={formData.isRecurring}
                                  onValueChange={(checked) => updateField("isRecurring", checked)}
                                  size="sm"
                              />
                          </div>

                          {formData.isRecurring && (
                              <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                                  <div>
                                      <label className="text-sm font-medium text-default-700 mb-2 block">
                                          {t("navigation.taskManagement.recurringType")}
                                      </label>
                                      <Select
                                          placeholder="Select recurring type"
                                          selectedKeys={recurringType ? [recurringType] : []}
                                          onSelectionChange={(keys) => setRecurringType(Array.from(keys)[0] as string)}
                                          variant="bordered"
                                      >
                                          <SelectItem key="daily">{t("navigation.taskManagement.daily")}</SelectItem>
                                          <SelectItem key="weekly">{t("navigation.taskManagement.weekly")}</SelectItem>
                                          <SelectItem key="monthly">{t("navigation.taskManagement.monthly")}</SelectItem>
                                      </Select>
                                  </div>

                                  <div>
                                      <label className="text-sm font-medium text-default-700 mb-2 block">
                                          {t("navigation.taskManagement.recurringStartDate")}
                                      </label>
                                      <DatePicker
                                          value={recurringStartDate ? parseDate(recurringStartDate) : null}
                                          onChange={(date) => setRecurringStartDate(date?.toString() || "")}
                                          variant="bordered"
                                          showMonthAndYearPickers
                                          className="w-full"
                                      />
                                  </div>

                                  <div>
                                      <label className="text-sm font-medium text-default-700 mb-2 block">
                                          {t("navigation.taskManagement.recurringEndDate")}
                                      </label>
                                      <DatePicker
                                          value={recurringEndDate ? parseDate(recurringEndDate) : null}
                                          onChange={(date) => setRecurringEndDate(date?.toString() || "")}
                                          variant="bordered"
                                          showMonthAndYearPickers
                                          className="w-full"
                                      />
                                  </div>
                              </div>
                          )}
                      </div>
                </CardBody>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
