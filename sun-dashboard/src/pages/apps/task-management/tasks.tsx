"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
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
  Pagination,
  Spinner,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import DashboardLayout from "@/layouts/dashboard/dashboard-layout";
import { useTranslation } from "@/lib/i18n-context";
import { useTasks } from "@/hooks/use-tasks";
import type { TaskFilter, TaskSort, TaskPriority, TaskStatus } from "@/types/task";

const priorityConfig = {
  low: { color: "default", icon: "solar:arrow-down-linear" },
  medium: { color: "warning", icon: "solar:minus-linear" },
  high: { color: "danger", icon: "solar:arrow-up-linear" },
  urgent: { color: "danger", icon: "solar:double-alt-arrow-up-bold" },
};

const statusConfig = {
  todo: { color: "default", label: "To Do" },
  inProgress: { color: "primary", label: "In Progress" },
  done: { color: "success", label: "Done" },
  cancelled: { color: "danger", label: "Cancelled" },
};

export default function TaskListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [filter, setFilter] = useState<TaskFilter>({});
  const [sort, setSort] = useState<TaskSort>({ field: "createdAt", direction: "desc" });
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
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
                    {task.description && (
                      <p className="text-small text-default-500 truncate max-w-xs">
                        {task.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    color={statusConfig[task.status].color as any}
                    variant="flat"
                    size="sm"
                  >
                    {statusConfig[task.status].label}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip
                    color={priorityConfig[task.priority].color as any}
                    variant="flat"
                    size="sm"
                    startContent={
                      <Icon icon={priorityConfig[task.priority].icon} width={14} />
                    }
                  >
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
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
                      <DropdownItem
                        key="view"
                        startContent={<Icon icon="solar:eye-linear" width={16} />}
                        onPress={() => handleTaskClick(task.id)}
                      >
                        View Details
                      </DropdownItem>
                      <DropdownItem
                        key="edit"
                        startContent={<Icon icon="solar:pen-linear" width={16} />}
                      >
                        Edit Task
                      </DropdownItem>
                      <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                        startContent={<Icon icon="solar:trash-bin-trash-linear" width={16} />}
                      >
                        Delete Task
                      </DropdownItem>
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
                {t("navigation.taskManagement.tasks")}
              </h1>
              <p className="text-default-500">
                Manage and track all your tasks
              </p>
            </div>
            <Button
              color="primary"
              onPress={handleCreateTask}
              startContent={<Icon icon="solar:add-circle-outline" width={18} />}
            >
              {t("navigation.taskManagement.createTask")}
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="mb-6">
          <Card>
            <CardBody>
              <div className="flex flex-wrap gap-4 items-end" role="search" aria-label="Task filters">
                <Input
                  placeholder="Search tasks..."
                  value={filter.search || ""}
                  onValueChange={(value) => handleFilterChange("search", value)}
                  startContent={<Icon icon="solar:magnifer-linear" width={18} />}
                  className="max-w-xs sm:max-w-sm"
                  aria-label="Search tasks"
                />
                
                <Select
                  placeholder="Filter by status"
                  className="max-w-xs"
                  selectionMode="multiple"
                  onSelectionChange={(keys) => {
                    const statuses = Array.from(keys) as TaskStatus[];
                    handleFilterChange("status", statuses.length ? statuses : undefined);
                  }}
                >
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  placeholder="Filter by priority"
                  className="max-w-xs"
                  selectionMode="multiple"
                  onSelectionChange={(keys) => {
                    const priorities = Array.from(keys) as TaskPriority[];
                    handleFilterChange("priority", priorities.length ? priorities : undefined);
                  }}
                >
                  {Object.entries(priorityConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </SelectItem>
                  ))}
                </Select>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "table" ? "solid" : "light"}
                    isIconOnly
                    onPress={() => setViewMode("table")}
                  >
                    <Icon icon="solar:list-linear" width={18} />
                  </Button>
                  <Button
                    variant={viewMode === "cards" ? "solid" : "light"}
                    isIconOnly
                    onPress={() => setViewMode("cards")}
                  >
                    <Icon icon="solar:widget-2-linear" width={18} />
                  </Button>
                </div>
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
      </motion.div>
    </DashboardLayout>
  );
}
