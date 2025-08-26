import React from "react";
import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import {
  CheckSquare,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "@/lib/i18n-context";
import type { Task, TaskStatus } from "@/types/task";

export interface TaskStat {
  key: string;
  titleKey: string;
  value: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bgColor: string;
  filterType?: 'status' | 'overdue';
  filterValue?: TaskStatus[] | 'overdue';
}

interface TaskStatsCardsProps {
  tasks: Task[];
  itemVariants: any;
}

export function TaskStatsCards({ tasks, itemVariants }: TaskStatsCardsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Calculate stats from tasks data
  const calculateStats = (): TaskStat[] => {
    const total = tasks.length;
    const inProgress = tasks.filter(task =>
      ['todo', 'inProgress', 'redo', 'pendingReceipt', 'pendingConfirmation', 'paused'].includes(task.status)
    ).length;
    const completed = tasks.filter(task =>
      ['done', 'completed', 'approved', 'archiveRecord'].includes(task.status)
    ).length;
    const overdue = tasks.filter(task =>
      task.dueDate &&
      task.dueDate < new Date() &&
      !['done', 'completed', 'approved', 'archiveRecord', 'cancelled', 'rejected', 'notApproved', 'cancelledAfterApproval', 'terminated'].includes(task.status)
    ).length;

    return [
      {
        key: "total",
        titleKey: "navigation.taskManagement.stats.totalTasks",
        value: total,
        icon: CheckSquare,
        color: "text-green-500",
        bgColor: "bg-green-100",
      },
      {
        key: "inProgress",
        titleKey: "navigation.taskManagement.stats.inProgress",
        value: inProgress,
        icon: Clock,
        color: "text-blue-500",
        bgColor: "bg-blue-100",
        filterType: 'status',
        filterValue: ['todo', 'inProgress', 'redo', 'pendingReceipt', 'pendingConfirmation', 'paused'] as TaskStatus[],
      },
      {
        key: "completed",
        titleKey: "navigation.taskManagement.stats.completed",
        value: completed,
        icon: CheckCircle,
        color: "text-success-500",
        bgColor: "bg-success-100",
        filterType: 'status',
        filterValue: ['done', 'completed', 'approved', 'archiveRecord'] as TaskStatus[],
      },
      {
        key: "overdue",
        titleKey: "navigation.taskManagement.stats.overdue",
        value: overdue,
        icon: AlertCircle,
        color: "text-danger-500",
        bgColor: "bg-danger-100",
        filterType: 'overdue',
        filterValue: 'overdue',
      },
    ];
  };

  const stats = calculateStats();

  const handleStatClick = (stat: TaskStat) => {
    const searchParams = new URLSearchParams();

    if (stat.filterType === 'status' && Array.isArray(stat.filterValue)) {
      // Navigate with status filter
      stat.filterValue.forEach(status => {
        searchParams.append('status', status);
      });
    } else if (stat.filterType === 'overdue') {
      // Navigate with overdue filter
      searchParams.set('deadlineStatus', 'overdue');
    }

    navigate(`/task-management/tasks?${searchParams.toString()}`);
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={itemVariants}
    >
      {stats.map((stat) => (
        <Card
          key={stat.key}
          className="w-full cursor-pointer hover:shadow-md transition-shadow duration-200"
          isPressable
          onPress={() => handleStatClick(stat)}
        >
          <CardBody className="flex flex-row items-center gap-4 p-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              {React.createElement(stat.icon, {
                size: 24,
                className: stat.color
              })}
            </div>
            <div className="flex flex-col">
              <p className="text-small text-default-500">{t(stat.titleKey as any)}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </CardBody>
        </Card>
      ))}
    </motion.div>
  );
}
