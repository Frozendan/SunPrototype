import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "@/lib/i18n-context";
import type { Task, TaskStatus } from "@/types/task";
import { CircleChartCard, type ChartData } from "./CircleChartCard";

interface TaskStatusChartCardProps {
  tasks: Task[];
  itemVariants: any;
}

export function TaskStatusChartCard({ tasks, itemVariants }: TaskStatusChartCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Calculate grouped status distribution
  const calculateGroupedStatusDistribution = () => {
    const groupDistribution = {
      activeWork: 0,
      completed: 0,
      pending: 0,
      problems: 0,
      draft: 0
    };

    // Status group mapping
    const statusGroups = {
      activeWork: ['todo', 'inProgress', 'redo'],
      completed: ['done', 'completed', 'approved', 'archiveRecord'],
      pending: ['pendingReceipt', 'pendingConfirmation', 'paused'],
      problems: ['cancelled', 'rejected', 'notApproved', 'cancelledAfterApproval', 'terminated'],
      draft: ['draft']
    };

    // Count tasks by group
    tasks.forEach(task => {
      for (const [group, statuses] of Object.entries(statusGroups)) {
        if (statuses.includes(task.status)) {
          groupDistribution[group as keyof typeof groupDistribution]++;
          break;
        }
      }
    });

    return groupDistribution;
  };

  const groupDistribution = calculateGroupedStatusDistribution();
  const totalTasks = tasks.length;

  // Group label mapping
  const groupLabels = {
    activeWork: t('navigation.taskManagement.statusChart.activeWork' as any),
    completed: t('navigation.taskManagement.statusChart.completed' as any),
    pending: t('navigation.taskManagement.statusChart.pending' as any),
    problems: t('navigation.taskManagement.statusChart.problems' as any),
    draft: t('navigation.taskManagement.statusChart.draft' as any)
  };

  // Group color mapping
  const groupColors = {
    activeWork: '#006fee',  // Blue
    completed: '#17c964',   // Green
    pending: '#f5a524',     // Orange
    problems: '#f31260',    // Red
    draft: '#71717a'        // Gray
  };

  // Prepare chart data - only include groups that have tasks
  const chartData: ChartData[] = Object.entries(groupDistribution)
    .filter(([_, count]) => count > 0)
    .map(([group, count]) => ({
      name: group,
      value: count,
      label: groupLabels[group as keyof typeof groupLabels],
      color: groupColors[group as keyof typeof groupColors]
    }))
    .sort((a, b) => b.value - a.value); // Sort by count descending

  const categories = chartData.map(item => item.label as string);

  const handleChartClick = () => {
    navigate('/task-management/tasks');
  };

  return (
    <motion.div variants={itemVariants}>
      <div onClick={handleChartClick} className="cursor-pointer">
        <CircleChartCard
          title={t('navigation.taskManagement.statusChart.title' as any)}
          total={totalTasks}
          unit={t('navigation.taskManagement.statusChart.unit' as any)}
          color="primary"
          categories={categories}
          chartData={chartData}
          className="hover:shadow-md transition-shadow duration-200"
        />
      </div>
    </motion.div>
  );
}
