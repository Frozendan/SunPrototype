import React, { useState } from "react";
import {Card, CardBody, CardHeader, Chip, Button, Avatar, Tooltip, CardFooter, Tabs, Tab} from "@heroui/react";
import { motion } from "framer-motion";
import {
  Plus,
  ArrowRight,
  CheckSquare,
  ArrowDown,
  Minus,
  ArrowUp,
  ChevronsUp,
  User,
  Users
} from "lucide-react";

import { useTranslation } from "@/lib/i18n-context";
import type { Task, TaskStatus } from "@/types/task";

interface RecentTasksCardProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onCreateTask: () => void;
  onViewAll: () => void;
  itemVariants: any;
}

export function RecentTasksCard({
  tasks,
  onTaskClick,
  onCreateTask,
  onViewAll,
  itemVariants
}: RecentTasksCardProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("myTasks");

  // Filter tasks based on active tab
  const getFilteredTasks = () => {
    if (activeTab === "myTasks") {
      // Show tasks assigned to current user or where assignee id is "current-user" or "emp-001"
      return tasks.filter(task =>
        task.assignee && (
          task.assignee.id === "current-user" ||
          task.assignee.id === "emp-001" ||
          task.assignee.name === "Current User"
        )
      );
    } else {
      // Show all department tasks (excluding current user's tasks)
      return tasks.filter(task =>
        task.assignee && !(
          task.assignee.id === "current-user" ||
          task.assignee.id === "emp-001" ||
          task.assignee.name === "Current User"
        )
      );
    }
  };

  const filteredTasks = getFilteredTasks().slice(0, 5);

  // Priority configuration with Lucide icons
  const priorityConfig = {
    low: {
      color: "default" as const,
      icon: ArrowDown,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      label: "Low"
    },
    medium: {
      color: "warning" as const,
      icon: Minus,
      iconColor: "text-gray-600",
      bgColor: "bg-gray-50",
      label: "Medium"
    },
    high: {
      color: "danger" as const,
      icon: ArrowUp,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50",
      label: "High"
    },
    urgent: {
      color: "danger" as const,
      icon: ChevronsUp,
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
      label: "Urgent"
    },
  };

  // Utility functions
  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('navigation.taskManagement.recentTasks.today' as any);
    if (diffDays === 1) return t('navigation.taskManagement.recentTasks.tomorrow' as any);
    if (diffDays === -1) return t('navigation.taskManagement.recentTasks.yesterday' as any);
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const isOverdue = (dueDate: Date, status: TaskStatus) => {
    return dueDate < new Date() && status !== 'done' && status !== 'completed';
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "done":
      case "completed":
      case "approved": 
        return "success";
      case "inProgress":
        return "primary";
      case "todo":
      case "draft":
        return "default";
      case "cancelled":
      case "rejected":
        return "danger";
      case "pendingReceipt":
      case "pendingConfirmation":
        return "warning";
      default: 
        return "default";
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="w-full h-fit">
        <CardHeader className="flex flex-col gap-4 pb-2">
          <div className="flex justify-between items-center w-full">
            <h3 className="text-small text-default-500 font-medium">{t('navigation.taskManagement.recentTasks.title' as any)}</h3>
            <div className="flex items-center gap-2">
              {filteredTasks.length > 0 && (
                <Button
                  variant="light"
                  color="primary"
                  size="sm"
                  onPress={onViewAll}
                  endContent={<ArrowRight size={16} />}
                >
                  {t('navigation.taskManagement.recentTasks.viewAll' as any)}
                </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <Tabs 
            className="self-start"
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
          >
            <Tab
              key="myTasks"
              title={
                <div className="flex items-center gap-2">
                  <span>{t('navigation.taskManagement.recentTasks.myTasks' as any)}</span>
                </div>
              }
            />
            <Tab
              key="departmentTasks"
              title={
                <div className="flex items-center gap-2">
                  <span>{t('navigation.taskManagement.recentTasks.departmentTasks' as any)}</span>
                </div>
              }
            />
          </Tabs>
        </CardHeader>
        <CardBody>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckSquare
                size={48}
                className="text-default-300 mx-auto mb-4"
              />
              <p className="text-default-500 mb-2">
                {activeTab === "myTasks"
                  ? t('navigation.taskManagement.recentTasks.noMyTasks' as any)
                  : t('navigation.taskManagement.recentTasks.noDepartmentTasks' as any)
                }
              </p>
              <p className="text-small text-default-400">
                {activeTab === "myTasks"
                  ? t('navigation.taskManagement.recentTasks.noMyTasksDescription' as any)
                  : t('navigation.taskManagement.recentTasks.noDepartmentTasksDescription' as any)
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="relative "
                  onClick={() => onTaskClick(task.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onTaskClick(task.id);
                    }
                  }}
                  aria-label={`View task: ${task.title}`}
                >

                  {/* Task Content */}
                  <Card className="cursor-pointer">
                    {/* Title and ID */}
                    <CardHeader className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Tooltip content={`${t('navigation.taskManagement.priority' as any)}: ${t(`navigation.taskManagement.filters.priorities.${task.priority}` as any)}`}>
                                <div className={`p-1.5 rounded-md ${priorityConfig[task.priority].bgColor}`}>
                                    {React.createElement(priorityConfig[task.priority].icon, {
                                        size: 16,
                                        className: priorityConfig[task.priority].iconColor
                                    })}
                                </div>
                            </Tooltip>
                          <h4 className="font-semibold text-sm text-default-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                            {task.title}
                          </h4>
                            
                        </div>
                        <Chip
                            size="sm"
                            variant="flat"
                            color={getStatusColor(task.status)}
                        >
                            {t(`navigation.taskManagement.filters.statuses.${task.status}` as any)}
                        </Chip>
                    </CardHeader>
                  

                    {/* Assignee and Status Row */}
                      <CardFooter className="flex items-center justify-between gap-2">
                        {task.assignee ? (
                          <div className="flex items-center gap-2">
                            <Avatar 
                              src={task.assignee.avatar} 
                              size="sm" 
                              className="w-6 h-6"
                            />
                            <span className="text-xs text-default-600">{task.assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-small text-default-400">{t('navigation.taskManagement.recentTasks.unassigned' as any)}</span>
                        )}
                          {task.dueDate && (
                              <span className={`${
                                  isOverdue(task.dueDate, task.status)
                                      ? 'text-danger text-xs font-medium'
                                      : 'text-xs text-default-500'
                              }`}>
                                {isOverdue(task.dueDate, task.status)
                                    ? t('navigation.taskManagement.recentTasks.overdue' as any)
                                    : t('navigation.taskManagement.recentTasks.due' as any)
                                }: {formatDate(task.dueDate)}
                          </span>
                          )}
                      </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </CardBody>
          <CardFooter className="justify-center">
              <Button
                  color="primary"
                  variant="flat"
                  size="sm"
                  startContent={<Plus size={16} />}
                  onPress={onCreateTask}
              >
                  {t('navigation.taskManagement.recentTasks.newTask' as any)}
              </Button>
          </CardFooter>
      </Card>
    </motion.div>
  );
}
