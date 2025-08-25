"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Select,
  SelectItem,
  Chip,
  Avatar,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Pagination,
  Spinner,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { ArrowDown, Minus, ArrowUp, ChevronsUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import DashboardLayout from "@/layouts/dashboard/dashboard-layout";
import { useTranslation } from "@/lib/i18n-context";
import { useTasks } from "@/hooks/use-tasks";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useToast } from "@/components/toast";
import type { TaskFilter, TaskSort, TaskPriority, TaskStatus, TaskType, DeadlineStatus } from "@/types/task";

const priorityConfig = {
  low: {
    color: "default",
    icon: ArrowDown,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    label: "Low"
  },
  medium: {
    color: "warning",
    icon: Minus,
    iconColor: "text-gray-600",
    bgColor: "bg-gray-50",
    label: "Medium"
  },
  high: {
    color: "danger",
    icon: ArrowUp,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-50",
    label: "High"
  },
  urgent: {
    color: "danger",
    icon: ChevronsUp,
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
    label: "Urgent"
  },
};

const statusConfig = {
  todo: { color: "default", label: "To Do" },
  inProgress: { color: "primary", label: "In Progress" },
  done: { color: "success", label: "Done" },
  cancelled: { color: "danger", label: "Cancelled" },
  pendingReceipt: { color: "warning", label: "Pending Receipt" },
  redo: { color: "secondary", label: "Redo" },
  pendingConfirmation: { color: "warning", label: "Pending Confirmation" },
  completed: { color: "success", label: "Completed" },
  approved: { color: "success", label: "Approved" },
  archiveRecord: { color: "default", label: "Archive Record" },
  rejected: { color: "danger", label: "Rejected" },
  notApproved: { color: "danger", label: "Not Approved" },
  cancelledAfterApproval: { color: "danger", label: "Cancelled After Approval" },
  paused: { color: "warning", label: "Paused" },
  terminated: { color: "danger", label: "Terminated" },
  draft: { color: "default", label: "Draft" },
};

const taskTypeConfig = {
  assignment: { label: "Assignment" },
  supportService: { label: "Support Service" },
  document: { label: "Document/Record" },
};

const deadlineStatusConfig = {
  all: { label: "All" },
  overdue: { label: "Overdue" },
  notOverdue: { label: "Not Overdue" },
};

export default function TaskListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [filter, setFilter] = useState<TaskFilter>({});
  const [sort, setSort] = useState<TaskSort>({ field: "createdAt", direction: "desc" });
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [selectedTaskForDelete, setSelectedTaskForDelete] = useState<string | null>(null);
  const [selectedTaskForApprove, setSelectedTaskForApprove] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const limit = 10;

  const { tasks, isLoading, error } = useTasks({
    filter,
    sort,
    page,
    limit,
  });

  const handleCreateTask = () => {
    navigate("/task-management/create");
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/task-management/task/${taskId}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent, taskId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTaskClick(taskId);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilter(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filtering
  };

  const handleSortChange = (field: string) => {
    setSort(prev => ({
      field: field as any,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    setSelectedTaskForDelete(taskId);
  };

  const handleApproveTask = (taskId: string) => {
    setSelectedTaskForApprove(taskId);
  };

  const confirmDeleteTask = async () => {
    if (!selectedTaskForDelete) return;

    setIsDeleting(true);
    try {
      // In a real app, this would make an API call to delete the task
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      showToast({
        type: 'success',
        title: t("navigation.taskManagement.taskDeleted" as any),
      });

      // Refresh tasks list or remove from local state
      // For now, we'll just show the success message
    } catch (error) {
      showToast({
        type: 'error',
        title: t("navigation.taskManagement.deleteTaskFailed" as any),
      });
    } finally {
      setIsDeleting(false);
      setSelectedTaskForDelete(null);
    }
  };

  const confirmApproveTask = async () => {
    if (!selectedTaskForApprove) return;

    setIsApproving(true);
    try {
      // In a real app, this would make an API call to approve the task
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      showToast({
        type: 'success',
        title: t("navigation.taskManagement.taskApproved" as any),
      });

      // Refresh tasks list or update local state
      // For now, we'll just show the success message
    } catch (error) {
      showToast({
        type: 'error',
        title: t("navigation.taskManagement.approveTaskFailed" as any),
      });
    } finally {
      setIsApproving(false);
      setSelectedTaskForApprove(null);
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const renderTableView = () => (
    <Card>
      <CardBody className="p-0">
        <Table
          aria-label="Tasks table"
          isHeaderSticky
          classNames={{
            wrapper: "max-h-[600px]",
          }}
        >
          <TableHeader>
            <TableColumn
              key="title"
              className="cursor-pointer"
              onClick={() => handleSortChange("title")}
            >
              <div className="flex items-center gap-1">
                Title
                {sort.field === "title" && (
                  <Icon
                    icon={sort.direction === "asc" ? "solar:arrow-up-linear" : "solar:arrow-down-linear"}
                    width={14}
                  />
                )}
              </div>
            </TableColumn>
            <TableColumn key="status">Status</TableColumn>
            <TableColumn
              key="priority"
              className="cursor-pointer"
              onClick={() => handleSortChange("priority")}
            >
              <div className="flex items-center gap-1">
                Priority
                {sort.field === "priority" && (
                  <Icon
                    icon={sort.direction === "asc" ? "solar:arrow-up-linear" : "solar:arrow-down-linear"}
                    width={14}
                  />
                )}
              </div>
            </TableColumn>
            <TableColumn key="assignee">Assignee</TableColumn>
            <TableColumn
              key="dueDate"
              className="cursor-pointer"
              onClick={() => handleSortChange("dueDate")}
            >
              <div className="flex items-center gap-1">
                Due Date
                {sort.field === "dueDate" && (
                  <Icon
                    icon={sort.direction === "asc" ? "solar:arrow-up-linear" : "solar:arrow-down-linear"}
                    width={14}
                  />
                )}
              </div>
            </TableColumn>
            <TableColumn key="actions">Actions</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={isLoading}
            loadingContent={<Spinner label="Loading tasks..." />}
            emptyContent="No tasks found"
          >
            {tasks.map((task) => (
              <TableRow
                key={task.id}
                className="cursor-pointer hover:bg-default-50 focus:bg-default-100 focus:outline-none"
                onClick={() => handleTaskClick(task.id)}
                onKeyDown={(e) => handleKeyDown(e, task.id)}
                tabIndex={0}
                role="button"
                aria-label={`View task: ${task.title}`}
              >
                <TableCell>
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-small text-default-500">
                      {t("navigation.taskManagement.taskId" as any)}: {task.id}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    color={statusConfig[task.status].color as any}
                    variant="flat"
                    size="sm"
                  >
                    {t(`navigation.taskManagement.filters.statuses.${task.status}` as any) || statusConfig[task.status].label}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip
                    color={priorityConfig[task.priority].color as any}
                    variant="flat"
                    size="sm"
                    startContent={
                      (() => {
                        const PriorityIcon = priorityConfig[task.priority].icon;
                        return <PriorityIcon size={14} className={priorityConfig[task.priority].iconColor} />;
                      })()
                    }
                  >
                    {t(`navigation.taskManagement.filters.priorities.${task.priority}` as any)}
                  </Chip>
                </TableCell>
                <TableCell>
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar src={task.assignee.avatar} size="sm" />
                      <span className="text-small">{task.assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-default-400">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>
                  {task.dueDate ? (
                    <span className={`text-small ${
                      task.dueDate < new Date() && task.status !== 'done' 
                        ? 'text-danger' 
                        : 'text-default-600'
                    }`}>
                      {formatDate(task.dueDate)}
                    </span>
                  ) : (
                    <span className="text-default-400">No due date</span>
                  )}
                </TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Icon icon="solar:menu-dots-bold" width={16} />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownSection showDivider>
                        <DropdownItem
                          key="approve"
                          startContent={<Icon icon="solar:check-circle-linear" width={16} />}
                          onPress={() => handleApproveTask(task.id)}
                        >
                          {t("navigation.taskManagement.approveTask" as any)}
                        </DropdownItem>
                          <DropdownItem
                              key="view"
                              startContent={<Icon icon="solar:eye-linear" width={16} />}
                              onPress={() => handleTaskClick(task.id)}
                          >
                              Xem công việc
                          </DropdownItem>

                      </DropdownSection>
                      <DropdownSection>
                          <DropdownItem
                              key="delete"
                              className="text-danger"
                              color="danger"
                              startContent={<Icon icon="solar:trash-bin-trash-linear" width={16} />}
                              onPress={() => handleDeleteTask(task.id)}
                          >
                              {t("navigation.taskManagement.deleteTask" as any)}
                          </DropdownItem>
                      </DropdownSection>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );

  return (
    <DashboardLayout>
      <motion.div
        className="h-full px-3 pt-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {t("navigation.taskManagement.tasks" as any)}
              </h1>
              <p className="text-default-500">
                Manage and track all your tasks
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "table" ? "solid" : "light"}
                  isIconOnly
                  onPress={() => setViewMode("table")}
                  aria-label="Table view"
                >
                  <Icon icon="solar:list-linear" width={18} />
                </Button>
                <Button
                  variant={viewMode === "cards" ? "solid" : "light"}
                  isIconOnly
                  onPress={() => setViewMode("cards")}
                  aria-label="Cards view"
                >
                  <Icon icon="solar:widget-2-linear" width={18} />
                </Button>
              </div>

              {/* Create Task Button */}
              <Button
                color="primary"
                onPress={handleCreateTask}
                startContent={<Icon icon="solar:add-circle-outline" width={18} />}
              >
                {t("navigation.taskManagement.createTask" as any)}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="mb-6">
          <Card>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4" role="search" aria-label="Task filters">
                {/* Search Input */}
                <Input
                  placeholder="Search tasks..."
                  value={filter.search || ""}
                  onValueChange={(value) => handleFilterChange("search", value)}
                  startContent={<Icon icon="solar:magnifer-linear" width={18} />}
                  aria-label="Search tasks"
                />

                {/* Task Type Filter */}
                <Select
                  placeholder={t("navigation.taskManagement.filters.taskType" as any)}
                  className="w-full"
                  selectedKeys={filter.taskType ? [filter.taskType] : []}
                  onSelectionChange={(keys) => {
                    const taskType = Array.from(keys)[0] as TaskType;
                    handleFilterChange("taskType", taskType || undefined);
                  }}
                >
                  <SelectItem key="all">
                    {t("navigation.taskManagement.filters.taskTypes.all" as any)}
                  </SelectItem>
                  {Object.entries(taskTypeConfig).map(([key]) => (
                    <SelectItem key={key}>
                      {t(`navigation.taskManagement.filters.taskTypes.${key}` as any)}
                    </SelectItem>
                  ))}
                </Select>

                {/* Status Filter with Multiple Selection */}
                <Select
                  placeholder={t("navigation.taskManagement.filters.status" as any)}
                  className="w-full"
                  selectionMode="multiple"
                  selectedKeys={filter.status ? filter.status : []}
                  onSelectionChange={(keys) => {
                    const keyArray = Array.from(keys);

                    // Handle Toggle Select All
                    if (keyArray.includes("toggle-select-all")) {
                      const allStatusKeys = Object.keys(statusConfig) as TaskStatus[];
                      const currentlySelected = filter.status || [];

                      // If all are selected, deselect all. Otherwise, select all.
                      if (currentlySelected.length === allStatusKeys.length) {
                        handleFilterChange("status", undefined);
                      } else {
                        handleFilterChange("status", allStatusKeys);
                      }
                      return;
                    }

                    // Normal selection
                    const statuses = keyArray.filter(key => key !== "toggle-select-all") as TaskStatus[];
                    handleFilterChange("status", statuses.length ? statuses : undefined);
                  }}
                >
                  {/* Toggle Select All Option */}
                  {(() => {
                    const allStatusKeys = Object.keys(statusConfig) as TaskStatus[];
                    const currentlySelected = filter.status || [];
                    const isAllSelected = currentlySelected.length === allStatusKeys.length;

                    return (
                      <SelectItem
                        key="toggle-select-all"
                        className={`font-medium ${isAllSelected ? 'text-danger' : 'text-primary'}`}
                      >
                        {isAllSelected ? '✗' : '✓'} {isAllSelected
                          ? t("navigation.taskManagement.filters.deselectAll" as any)
                          : t("navigation.taskManagement.filters.selectAll" as any)
                        }
                      </SelectItem>
                    );
                  })()}

                  {/* Divider */}
                  <SelectItem key="divider" isDisabled className="h-px p-0 m-0">
                    <div className="w-full border-t border-divider"></div>
                  </SelectItem>

                  {/* Status Options */}
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key}>
                      {t(`navigation.taskManagement.filters.statuses.${key}` as any) || config.label}
                    </SelectItem>
                  ))}
                </Select>

                {/* Priority Filter */}
                <Select
                  placeholder={t("navigation.taskManagement.filters.priority" as any)}
                  className="w-full"
                  selectionMode="multiple"
                  onSelectionChange={(keys) => {
                    const priorities = Array.from(keys) as TaskPriority[];
                    handleFilterChange("priority", priorities.length ? priorities : undefined);
                  }}
                >
                  {Object.entries(priorityConfig).map(([key, config]) => {
                    const PriorityIcon = config.icon;
                    return (
                      <SelectItem
                        key={key}
                        startContent={<PriorityIcon size={14} className={config.iconColor} />}
                      >
                        {t(`navigation.taskManagement.filters.priorities.${key}` as any)}
                      </SelectItem>
                    );
                  })}
                </Select>

                {/* Deadline Status Filter */}
                <Select
                  placeholder={t("navigation.taskManagement.filters.deadlineStatus" as any)}
                  className="w-full"
                  selectedKeys={filter.deadlineStatus ? [filter.deadlineStatus] : []}
                  onSelectionChange={(keys) => {
                    const deadlineStatus = Array.from(keys)[0] as DeadlineStatus;
                    handleFilterChange("deadlineStatus", deadlineStatus || undefined);
                  }}
                >
                  {Object.entries(deadlineStatusConfig).map(([key]) => (
                    <SelectItem key={key}>
                      {t(`navigation.taskManagement.filters.deadlineStatuses.${key}` as any)}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants} className="mb-6">
          {error ? (
            <Card>
              <CardBody className="text-center py-8">
                <Icon icon="solar:danger-circle-linear" width={48} className="text-danger mx-auto mb-4" />
                <p className="text-danger">{error}</p>
              </CardBody>
            </Card>
          ) : (
            renderTableView()
          )}
        </motion.div>

        {/* Pagination */}
        {tasks.length > 0 && (
          <motion.div variants={itemVariants} className="flex justify-center">
            <Pagination
              total={Math.ceil(tasks.length / limit)}
              page={page}
              onChange={setPage}
              showControls
            />
          </motion.div>
        )}

        {/* Confirmation Dialogs */}
        <ConfirmationDialog
          isOpen={!!selectedTaskForDelete}
          onClose={() => setSelectedTaskForDelete(null)}
          onConfirm={confirmDeleteTask}
          title={t("navigation.taskManagement.deleteTask" as any)}
          message={t("navigation.taskManagement.confirmDeleteTask" as any)}
          confirmText={t("navigation.taskManagement.deleteTask" as any)}
          isDangerous={true}
          isLoading={isDeleting}
        />

        <ConfirmationDialog
          isOpen={!!selectedTaskForApprove}
          onClose={() => setSelectedTaskForApprove(null)}
          onConfirm={confirmApproveTask}
          title={t("navigation.taskManagement.approveTask" as any)}
          message={t("navigation.taskManagement.confirmApproveTask" as any)}
          confirmText={t("navigation.taskManagement.approveTask" as any)}
          isDangerous={false}
          isLoading={isApproving}
          icon="solar:check-circle-bold"
          iconColor="text-success"
        />
      </motion.div>
    </DashboardLayout>
  );
}
