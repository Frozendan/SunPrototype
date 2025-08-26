import React from "react";
import { Card, CardBody, CardHeader, Progress, Chip, Avatar, AvatarGroup, Button } from "@heroui/react";
import { motion } from "framer-motion";
import { Users, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "@/lib/i18n-context";
import type { Task } from "@/types/task";
import { mockUnits, mockAssignees } from "@/data/mock-task-data";

export interface DepartmentAnalytics {
  unitId: string;
  unitName: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  completionRate: number;
  members: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
}

interface DepartmentAnalyticsCardProps {
  tasks: Task[];
  itemVariants: any;
}

export function DepartmentAnalyticsCard({ tasks, itemVariants }: DepartmentAnalyticsCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Calculate analytics by department/unit
  const calculateDepartmentAnalytics = (): DepartmentAnalytics[] => {
    const unitAnalytics = new Map<string, DepartmentAnalytics>();

    // Initialize analytics for all units
    mockUnits.forEach(unit => {
      const unitMembers = mockAssignees.filter(assignee => assignee.unitId === unit.id);
      unitAnalytics.set(unit.id, {
        unitId: unit.id,
        unitName: unit.name,
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        overdueTasks: 0,
        completionRate: 0,
        members: unitMembers.map(member => ({
          id: member.id,
          name: member.name,
          avatar: member.avatar
        }))
      });
    });

    // Calculate task statistics for each unit
    tasks.forEach(task => {
      if (task.assignee && task.unitId) {
        const analytics = unitAnalytics.get(task.unitId);
        if (analytics) {
          analytics.totalTasks++;

          // Count completed tasks
          if (['done', 'completed', 'approved', 'archiveRecord'].includes(task.status)) {
            analytics.completedTasks++;
          }

          // Count in-progress tasks
          if (['todo', 'inProgress', 'redo', 'pendingReceipt', 'pendingConfirmation', 'paused'].includes(task.status)) {
            analytics.inProgressTasks++;
          }

          // Count overdue tasks
          if (task.dueDate &&
              task.dueDate < new Date() &&
              !['done', 'completed', 'approved', 'archiveRecord', 'cancelled', 'rejected', 'notApproved', 'cancelledAfterApproval', 'terminated'].includes(task.status)) {
            analytics.overdueTasks++;
          }

          // Calculate completion rate
          analytics.completionRate = analytics.totalTasks > 0
            ? Math.round((analytics.completedTasks / analytics.totalTasks) * 100)
            : 0;
        }
      }
    });

    // Return only top 3 units that have tasks, sorted by total tasks
    return Array.from(unitAnalytics.values())
      .filter(analytics => analytics.totalTasks > 0)
      .sort((a, b) => b.totalTasks - a.totalTasks)
      .slice(0, 3);
  };

  const departmentAnalytics = calculateDepartmentAnalytics();

  const handleDepartmentClick = (unitId: string) => {
    // Navigate to tasks page with unit filter
    const searchParams = new URLSearchParams();
    searchParams.set('unitId', unitId);
    navigate(`/task-management/tasks?${searchParams.toString()}`);
  };

  const getProgressColor = (completionRate: number) => {
    if (completionRate >= 80) return "success";
    if (completionRate >= 60) return "primary";
    if (completionRate >= 40) return "warning";
    return "danger";
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="w-full h-fit">
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{t('navigation.taskManagement.analytics.departmentAnalytics' as any)}</h3>
          <Button
            variant="light"
            color="primary"
            size="sm"
            startContent={<TrendingUp size={16} />}
            onPress={() => navigate('/task-management/analytics')}
          >
            {t('navigation.taskManagement.analytics.viewDetails' as any)}
          </Button>
        </CardHeader>
        <CardBody>
          {departmentAnalytics.length === 0 ? (
            <div className="text-center py-8">
              <Users size={48} className="text-default-300 mx-auto mb-4" />
              <p className="text-default-500 mb-2">{t('navigation.taskManagement.analytics.noDepartmentData' as any)}</p>
              <p className="text-small text-default-400">{t('navigation.taskManagement.analytics.assignTasksToDepartments' as any)}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {departmentAnalytics.map((dept) => (
                <Card
                  key={dept.unitId}
                  className="space-y-3 p-4 border border-default-200 rounded-lg hover:bg-default-50 hover:border-default-300 transition-all duration-200 cursor-pointer"
                  onPress={() => handleDepartmentClick(dept.unitId)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleDepartmentClick(dept.unitId);
                    }
                  }}
                >
                  {/* Department Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-default-900 mb-1">{dept.unitName}</h4>
                      <div className="flex items-center gap-4 text-small text-default-500">
                        <span className="flex items-center gap-1">
                          <CheckCircle size={14} />
                          {dept.completedTasks}/{dept.totalTasks} {t('navigation.taskManagement.analytics.tasksCompleted' as any)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {dept.members.length} {t('navigation.taskManagement.analytics.members' as any)}
                        </span>
                      </div>
                    </div>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={getProgressColor(dept.completionRate)}
                    >
                      {dept.completionRate}%
                    </Chip>
                  </div>

                  {/* Progress Bar */}
                  <Progress
                    value={dept.completionRate}
                    color={getProgressColor(dept.completionRate)}
                    className="w-full"
                    size="sm"
                  />

                  {/* Task Statistics */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-small">
                      <span className="flex items-center gap-1 text-primary">
                        <Clock size={12} />
                        {dept.inProgressTasks} {t('navigation.taskManagement.analytics.inProgress' as any)}
                      </span>
                      {dept.overdueTasks > 0 && (
                        <span className="flex items-center gap-1 text-danger">
                          <Clock size={12} />
                          {dept.overdueTasks} {t('navigation.taskManagement.analytics.overdue' as any)}
                        </span>
                      )}
                    </div>

                    {/* Team Members Avatars */}
                    <AvatarGroup
                      isBordered
                      max={3}
                      size="sm"
                      className="justify-end"
                    >
                      {dept.members.slice(0, 4).map((member) => (
                        <Avatar
                          key={member.id}
                          src={member.avatar}
                          name={member.name}
                          size="sm"
                        />
                      ))}
                    </AvatarGroup>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}
