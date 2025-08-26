"use client";

import { useState, useRef, useEffect } from "react";
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
  Checkbox,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
} from "@heroui/react";
import {
  ArrowDown,
  Minus,
  ArrowUp,
  ChevronsUp,
  MoreHorizontal,
  CheckCircle,
  Eye,
  Trash2,
  List,
  Grid3X3,
  Settings,
  RotateCcw,
  PlusCircle,
  Search,
  Filter,
  AlertCircle
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import DashboardLayout from "@/layouts/dashboard/dashboard-layout";
import { useTranslation } from "@/lib/i18n-context";
import { useTasks } from "@/hooks/use-tasks";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useToast } from "@/components/toast";
import type { TaskFilter, TaskSort, TaskPriority, TaskStatus, TaskType, DeadlineStatus } from "@/types/task";
import { KanbanBoard } from "@/components/task-management/kanban/kanban-board";
import { statusConfig } from "@/lib/task-status-config";

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



const taskTypeConfig = {
  assignment: { label: "Assignment", color: "primary" },
  supportService: { label: "Support Service", color: "secondary" },
  document: { label: "Document/Record", color: "success" },
};

const deadlineStatusConfig = {
  all: { label: "All" },
  overdue: { label: "Overdue" },
  notOverdue: { label: "Not Overdue" },
};

export default function TaskListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [filter, setFilter] = useState<TaskFilter>({});
  const [sort, setSort] = useState<TaskSort>({ field: "createdAt", direction: "desc" });
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Handle URL parameters for filtering
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newFilter: TaskFilter = {};

    // Handle status filter (can be multiple)
    const statusParams = searchParams.getAll('status');
    if (statusParams.length > 0) {
      newFilter.status = statusParams as TaskStatus[];
    }

    // Handle deadline status filter
    const deadlineStatus = searchParams.get('deadlineStatus');
    if (deadlineStatus) {
      newFilter.deadlineStatus = deadlineStatus as DeadlineStatus;
    }

    // Handle priority filter (can be multiple)
    const priorityParams = searchParams.getAll('priority');
    if (priorityParams.length > 0) {
      newFilter.priority = priorityParams as TaskPriority[];
    }

    // Handle task type filter
    const taskType = searchParams.get('taskType');
    if (taskType) {
      newFilter.taskType = taskType as TaskType;
    }

    // Handle search filter
    const search = searchParams.get('search');
    if (search) {
      newFilter.search = search;
    }

    // Handle unit filter
    const unitId = searchParams.get('unitId');
    if (unitId) {
      newFilter.unitId = unitId;
    }

    // Only update filter if there are URL parameters
    if (Object.keys(newFilter).length > 0) {
      setFilter(newFilter);
    }
  }, [location.search]);
  const [selectedTaskForDelete, setSelectedTaskForDelete] = useState<string | null>(null);
  const [selectedTaskForApprove, setSelectedTaskForApprove] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Column visibility configuration
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    status: true,
    taskType: true,
    assignmentDate: true,
    dueDate: true,
    executingUnit: true,
    priority: true,
    importanceLevel: true,
    assignee: true,
    actions: true,
  });

  const limit = 10;

  const { tasks, isLoading, error } = useTasks({
    filter,
    sort,
    page,
    limit,
  });

  const handleCreateTask = () => {
    navigate("/task-management/create-task");
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

  // Filter panel state
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  // Click outside hook for filter panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(event.target as Node)) {
        setIsFilterPanelOpen(false);
      }
    };

    if (isFilterPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isFilterPanelOpen]);

  // Column configuration functions
  const handleColumnToggle = (columnKey: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey as keyof typeof prev]
    }));
  };

  const resetColumnsToDefault = () => {
    setVisibleColumns({
      title: true,
      status: true,
      taskType: true,
      assignmentDate: true,
      dueDate: true,
      executingUnit: true,
      priority: true,
      importanceLevel: true,
      assignee: true,
      actions: true,
    });
  };

  const clearAllFilters = () => {
    setFilter({
      search: "",
      taskType: undefined,
      status: undefined,
      priority: undefined,
      deadlineStatus: undefined,
    });
    setIsFilterPanelOpen(false);
    showToast({
      title: "Filters cleared",
      type: "success"
    });
  };



  // Generate filter chips
  const getFilterChips = () => {
    const chips = [];

    // Search chip
    if (filter.search) {
      chips.push({
        key: 'search',
        label: `Search: "${filter.search}"`,
        onClose: () => handleFilterChange('search', undefined)
      });
    }

    // Task type chip
    if (filter.taskType) {
      chips.push({
        key: 'taskType',
        label: `Type: ${t(`navigation.taskManagement.filters.taskTypes.${filter.taskType}` as any)}`,
        onClose: () => handleFilterChange('taskType', undefined)
      });
    }

    // Status chips
    if (filter.status && filter.status.length > 0) {
      filter.status.forEach(status => {
        chips.push({
          key: `status-${status}`,
          label: `Status: ${t(`navigation.taskManagement.filters.statuses.${status}` as any)}`,
          onClose: () => {
            const newStatuses = filter.status?.filter(s => s !== status);
            handleFilterChange('status', newStatuses?.length ? newStatuses : undefined);
          }
        });
      });
    }

    // Priority chips
    if (filter.priority && filter.priority.length > 0) {
      filter.priority.forEach(priority => {
        chips.push({
          key: `priority-${priority}`,
          label: `Priority: ${t(`navigation.taskManagement.filters.priorities.${priority}` as any)}`,
          onClose: () => {
            const newPriorities = filter.priority?.filter(p => p !== priority);
            handleFilterChange('priority', newPriorities?.length ? newPriorities : undefined);
          }
        });
      });
    }

    // Deadline status chip
    if (filter.deadlineStatus) {
      chips.push({
        key: 'deadlineStatus',
        label: `Deadline: ${t(`navigation.taskManagement.filters.deadlineStatuses.${filter.deadlineStatus}` as any)}`,
        onClose: () => handleFilterChange('deadlineStatus', undefined)
      });
    }

    return chips;
  };

  const columnConfig = [
    { key: 'title', label: t("navigation.taskManagement.columns.title" as any), required: true },
    { key: 'status', label: t("navigation.taskManagement.columns.status" as any), required: false },
    { key: 'taskType', label: t("navigation.taskManagement.columns.taskType" as any), required: false },
    { key: 'assignmentDate', label: t("navigation.taskManagement.columns.assignmentDate" as any), required: false },
    { key: 'dueDate', label: t("navigation.taskManagement.columns.dueDate" as any), required: false },
    { key: 'executingUnit', label: t("navigation.taskManagement.columns.executingUnit" as any), required: false },
    { key: 'priority', label: t("navigation.taskManagement.columns.priority" as any), required: false },
    { key: 'importanceLevel', label: t("navigation.taskManagement.columns.importanceLevel" as any), required: false },
    { key: 'assignee', label: t("navigation.taskManagement.columns.assignee" as any), required: false },
    { key: 'actions', label: t("navigation.taskManagement.columns.actions" as any), required: true },
  ];

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
            {visibleColumns.title && (
              <TableColumn
                key="title"
                className="cursor-pointer"
                onClick={() => handleSortChange("title")}
              >
                <div className="flex items-center gap-1">
                  {t("navigation.taskManagement.columns.title" as any)}
                  {sort.field === "title" && (
                    <Icon
                      icon={sort.direction === "asc" ? "solar:arrow-up-linear" : "solar:arrow-down-linear"}
                      width={14}
                    />
                  )}
                </div>
              </TableColumn>
            )}
            {visibleColumns.status && (
              <TableColumn key="status">{t("navigation.taskManagement.columns.status" as any)}</TableColumn>
            )}
            {visibleColumns.taskType && (
              <TableColumn key="taskType">{t("navigation.taskManagement.columns.taskType" as any)}</TableColumn>
            )}
            {visibleColumns.assignmentDate && (
              <TableColumn
                key="assignmentDate"
                className="cursor-pointer"
                onClick={() => handleSortChange("assignmentDate")}
              >
                <div className="flex items-center gap-1">
                  {t("navigation.taskManagement.columns.assignmentDate" as any)}
                  {sort.field === "assignmentDate" && (
                    <Icon
                      icon={sort.direction === "asc" ? "solar:arrow-up-linear" : "solar:arrow-down-linear"}
                      width={14}
                    />
                  )}
                </div>
              </TableColumn>
            )}
            {visibleColumns.dueDate && (
              <TableColumn
                key="dueDate"
                className="cursor-pointer"
                onClick={() => handleSortChange("dueDate")}
              >
                <div className="flex items-center gap-1">
                  {t("navigation.taskManagement.columns.dueDate" as any)}
                  {sort.field === "dueDate" && (
                    <Icon
                      icon={sort.direction === "asc" ? "solar:arrow-up-linear" : "solar:arrow-down-linear"}
                      width={14}
                    />
                  )}
                </div>
              </TableColumn>
            )}
            {visibleColumns.executingUnit && (
              <TableColumn key="executingUnit">{t("navigation.taskManagement.columns.executingUnit" as any)}</TableColumn>
            )}
            {visibleColumns.priority && (
              <TableColumn
                key="priority"
                className="cursor-pointer"
                onClick={() => handleSortChange("priority")}
              >
                <div className="flex items-center gap-1">
                  {t("navigation.taskManagement.columns.priority" as any)}
                  {sort.field === "priority" && (
                    <Icon
                      icon={sort.direction === "asc" ? "solar:arrow-up-linear" : "solar:arrow-down-linear"}
                      width={14}
                    />
                  )}
                </div>
              </TableColumn>
            )}
            {visibleColumns.importanceLevel && (
              <TableColumn key="importanceLevel">{t("navigation.taskManagement.columns.importanceLevel" as any)}</TableColumn>
            )}
            {visibleColumns.assignee && (
              <TableColumn key="assignee">{t("navigation.taskManagement.columns.assignee" as any)}</TableColumn>
            )}
            {visibleColumns.actions && (
              <TableColumn key="actions">{t("navigation.taskManagement.columns.actions" as any)}</TableColumn>
            )}
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
                {visibleColumns.title && (
                  <TableCell key="title">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-small text-default-500">
                        {t("navigation.taskManagement.taskId" as any)}: {task.id}
                      </p>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.status && (
                  <TableCell key="status">
                    <Chip
                      color={statusConfig[task.status].color as any}
                      variant="light"
                      size="sm"
                    >
                      {t(`navigation.taskManagement.filters.statuses.${task.status}` as any)}
                    </Chip>
                  </TableCell>
                )}
                {visibleColumns.taskType && (
                  <TableCell key="taskType">
                    <p>
                      {t(`navigation.taskManagement.filters.taskTypes.${task.taskType}` as any)}
                    </p>
                  </TableCell>
                )}
                {visibleColumns.assignmentDate && (
                  <TableCell key="assignmentDate">
                    {task.assignmentDate ? (
                      <span className="text-small text-default-600">
                        {formatDate(task.assignmentDate)}
                      </span>
                    ) : (
                      <span className="text-default-400">-</span>
                    )}
                  </TableCell>
                )}
                {visibleColumns.dueDate && (
                  <TableCell key="dueDate">
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
                )}
                {visibleColumns.executingUnit && (
                  <TableCell key="executingUnit">
                    {task.unitId ? (
                      <span className="text-small text-default-600">
                        {task.unitId === 'unit-1' ? 'Phòng Công nghệ thông tin' :
                         task.unitId === 'unit-2' ? 'Phòng Nhân sự' :
                         task.unitId === 'unit-3' ? 'Phòng Kế toán' :
                         task.unitId}
                      </span>
                    ) : (
                      <span className="text-default-400">-</span>
                    )}
                  </TableCell>
                )}
                {visibleColumns.priority && (
                  <TableCell key="priority">
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
                )}
                {visibleColumns.importanceLevel && (
                  <TableCell key="importanceLevel">
                    {task.importanceLevel ? (
                      <Chip
                        color={task.importanceLevel === 'very-important' ? 'danger' : task.importanceLevel === 'important' ? 'warning' : 'default'}
                        variant="flat"
                        size="sm"
                      >
                        {t(`navigation.taskManagement.importanceLevels.${task.importanceLevel}` as any)}
                      </Chip>
                    ) : (
                      <span className="text-default-400">-</span>
                    )}
                  </TableCell>
                )}
                {visibleColumns.assignee && (
                  <TableCell key="assignee">
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar src={task.assignee.avatar} size="sm" />
                        <span className="text-small">{task.assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-default-400">Unassigned</span>
                    )}
                  </TableCell>
                )}
                {visibleColumns.actions && (
                  <TableCell key="actions">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownSection showDivider>
                          <DropdownItem
                            key="approve"
                            startContent={<CheckCircle size={16} />}
                            onPress={() => handleApproveTask(task.id)}
                          >
                            {t("navigation.taskManagement.approveTask" as any)}
                          </DropdownItem>
                          <DropdownItem
                            key="view"
                            startContent={<Eye size={16} />}
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
                            startContent={<Trash2 size={16} />}
                            onPress={() => handleDeleteTask(task.id)}
                          >
                            {t("navigation.taskManagement.deleteTask" as any)}
                          </DropdownItem>
                        </DropdownSection>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );

  const renderKanbanView = () => (
    <KanbanBoard
      tasks={tasks}
      isLoading={isLoading}
      onTaskClick={handleTaskClick}
      onTaskStatusChange={handleTaskStatusChange}
    />
  );

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    // TODO: Implement task status change logic
    showToast({
      title: "Status Updated",
      type: "success"
    });
  };

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
                Quản lý và theo dõi danh sách công việc của bạn
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
                  <List size={18} />
                </Button>
                <Button
                  variant={viewMode === "cards" ? "solid" : "light"}
                  isIconOnly
                  onPress={() => setViewMode("cards")}
                  aria-label="Cards view"
                >
                  <Grid3X3 size={18} />
                </Button>
              </div>

              {/* Column Settings */}
              <Popover placement="bottom-end">
                <PopoverTrigger>
                  <Button
                    variant="light"
                    isIconOnly
                    aria-label={t("navigation.taskManagement.columnSettings.title" as any)}
                  >
                    <Settings size={18} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60">
                  <div className="w-full px-1 py-2">
                    <div className="w-full flex items-center justify-between mb-3">
                      <h4 className="text-medium font-semibold">
                        {t("navigation.taskManagement.columnSettings.title" as any)}
                      </h4>
                      <Button
                        isIconOnly={true}
                        size="sm"
                        variant="light"
                        onPress={resetColumnsToDefault}
                      >
                          <RotateCcw size={18} />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <p className="text-small text-default-500 mb-2">
                        {t("navigation.taskManagement.columnSettings.showHideColumns" as any)}
                      </p>
                      {columnConfig.map((column) => (
                        <div key={column.key} className="flex items-center justify-between">
                          <span className="text-small">{column.label}</span>
                          <Checkbox
                            isSelected={visibleColumns[column.key as keyof typeof visibleColumns]}
                            onValueChange={() => handleColumnToggle(column.key)}
                            isDisabled={column.required}
                            size="sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              {/* Create Task Button */}
              <Button
                color="primary"
                onPress={handleCreateTask}
                startContent={<PlusCircle size={18} />}
              >
                {t("navigation.taskManagement.createTask" as any)}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Card */}
        <motion.div variants={itemVariants} className="mb-6 relative">
            {isFilterPanelOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 z-50 w-full"
                >
                    <Card className="shadow-lg border border-divider">
                        <CardBody className="p-3">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-medium font-semibold">
                                    {t("navigation.taskManagement.filterSettings.title" as any)}
                                </h4>
                                <Button
                                    size="sm"
                                    variant="light"
                                    onPress={clearAllFilters}
                                >
                                    {t("navigation.taskManagement.filterSettings.clearAll" as any)}
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Task Type Filter */}
                                <div>
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
                                </div>

                                {/* Status Filter with Multiple Selection */}
                                <div>
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
                                </div>

                                {/* Priority Filter */}
                                <div>
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
                                </div>

                                {/* Deadline Status Filter */}
                                <div>
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
                            </div>
                        </CardBody>
                    </Card>
                </motion.div>
            )}
          <Card className="w-full relative">
             
            <CardBody className="relative">
                
              <div className="flex items-center gap-3" ref={filterPanelRef}>
                <Input
                  placeholder="Search tasks..."
                  radius="lg"
                  value={filter.search || ""}
                  onValueChange={(value) => handleFilterChange("search", value)}
                  startContent={<Search size={18} />}
                  aria-label="Search tasks"
                  className="max-w-md"
                />

                {/* Filter Toggle Button */}
                <div className="relative flex items-center gap-2">
                  <Button
                    radius="lg"
                    variant={isFilterPanelOpen ? "solid" : "bordered"}
                    color={isFilterPanelOpen ? "primary" : "default"}
                    startContent={<Filter size={18} />}
                    onPress={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                    aria-label={t("navigation.taskManagement.filterSettings.title" as any)}
                  >
                    {t("navigation.taskManagement.filterSettings.title" as any)}
                  </Button>

                  {/* Reset Filter Button */}
                  {getFilterChips().length > 0 && (
                    <Tooltip content="Clear all filters" placement="bottom">
                      <Button
                        radius="lg"
                        variant="light"
                        isIconOnly
                        startContent={<RotateCcw size={18} />}
                        onPress={clearAllFilters}
                        aria-label="Clear all filters"
                        className="min-w-unit-10"
                      />
                    </Tooltip>
                  )}

                 
                </div>
              </div>

              {/* Filter Chips */}
              {getFilterChips().length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {getFilterChips().map((chip) => (
                    <Chip
                      key={chip.key}
                      onClose={chip.onClose}
                      variant="flat"
                      color="default"
                      size="sm"
                    >
                      {chip.label}
                    </Chip>
                  ))}
                </div>
              )}
            </CardBody>
              {/* Floating Filter Panel */}
              
          </Card>
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants} className="mb-6">
          {error ? (
            <Card>
              <CardBody className="text-center py-8">
                <AlertCircle size={48} className="text-danger mx-auto mb-4" />
                <p className="text-danger">{error}</p>
              </CardBody>
            </Card>
          ) : (
            viewMode === "table" ? renderTableView() : renderKanbanView()
          )}
        </motion.div>

        {/* Pagination */}
        {tasks.length > 0 && viewMode === "table" && (
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
