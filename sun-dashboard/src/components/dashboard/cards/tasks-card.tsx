"use client";
import { Card, CardBody, CardHeader, Button, Chip, Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import { useTranslation } from "@/lib/i18n-context";
import type { TasksCardProps, Task } from "@/types/dashboard";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'high':
      return 'danger';
    case 'medium':
      return 'warning';
    case 'low':
      return 'default';
    default:
      return 'default';
  }
};

const getPriorityIcon = (priority: Task['priority']) => {
  switch (priority) {
    case 'high':
      return 'solar:double-alt-arrow-up-bold';
    case 'medium':
      return 'solar:alt-arrow-up-bold';
    case 'low':
      return 'solar:minus-circle-bold';
    default:
      return 'solar:minus-circle-bold';
  }
};

const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'done':
      return 'success';
    case 'inProgress':
      return 'primary';
    case 'review':
      return 'secondary';
    case 'todo':
    default:
      return 'default';
  }
};

export default function TasksCard({ 
  data, 
  state, 
  onViewAllTasks,
  onMarkComplete,
  onViewDetails,
  className 
}: TasksCardProps) {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDateString: string) => {
    const today = new Date();
    const dueDate = new Date(dueDateString);
    return dueDate < today;
  };

  const isDueSoon = (dueDateString: string) => {
    const today = new Date();
    const dueDate = new Date(dueDateString);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  if (state.isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="w-32 h-6 rounded" />
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-3 border border-default-200 rounded-lg">
              <Skeleton className="w-8 h-8 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-3/4 h-4 rounded" />
                <Skeleton className="w-1/2 h-3 rounded" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="w-16 h-6 rounded-full" />
                <Skeleton className="w-8 h-8 rounded" />
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    );
  }

  if (state.error) {
    return (
      <Card className={`w-full ${className}`}>
        <CardBody className="flex items-center justify-center py-8">
          <div className="text-center space-y-3">
            <Icon 
              icon="solar:danger-circle-bold" 
              className="text-danger text-4xl mx-auto" 
            />
            <p className="text-danger text-sm">{state.error}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  const activeTasks = data.filter(task => task.status !== 'done').slice(0, 4);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Icon
                icon="solar:checklist-minimalistic-bold"
                className="text-green-500"
                width={24}
              />
              <h3 className="text-lg font-semibold">{t("dashboard.tasks.title")}</h3>
            </div>
            {data.length > 0 && (
              <Button
                variant="light"
                size="sm"
                onPress={onViewAllTasks}
                endContent={<Icon icon="solar:arrow-right-linear" width={16} />}
              >
                {t("dashboard.tasks.viewAllTasks")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody>
          {activeTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Icon 
                icon="solar:checklist-minimalistic-outline" 
                className="text-default-300 text-4xl mb-3" 
              />
              <p className="text-default-500">{t("dashboard.tasks.noTasks")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 border border-default-200 rounded-lg hover:bg-default-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-default-100 flex items-center justify-center">
                      <Icon
                        icon={getPriorityIcon(task.priority)}
                        className={`${getPriorityColor(task.priority) === 'danger' ? 'text-red-500' : 
                          getPriorityColor(task.priority) === 'warning' ? 'text-orange-500' : 'text-default-500'}`}
                        width={14}
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Chip
                        size="sm"
                        color={getStatusColor(task.status)}
                        variant="flat"
                      >
                        {t(`dashboard.tasks.status.${task.status}`)}
                      </Chip>
                      {task.dueDate && (
                        <span className={`text-xs ${
                          isOverdue(task.dueDate) ? 'text-red-500' :
                          isDueSoon(task.dueDate) ? 'text-orange-500' : 'text-default-500'
                        }`}>
                          {isOverdue(task.dueDate) ? 'Overdue' : `Due ${formatDate(task.dueDate)}`}
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-xs text-default-400 mt-1 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {task.status !== 'done' && (
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => onMarkComplete(task.id)}
                        className="min-w-8 h-8"
                      >
                        <Icon icon="solar:check-circle-bold" width={16} />
                      </Button>
                    )}
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => onViewDetails(task.id)}
                      className="min-w-8 h-8"
                    >
                      <Icon icon="solar:eye-bold" width={16} />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}
