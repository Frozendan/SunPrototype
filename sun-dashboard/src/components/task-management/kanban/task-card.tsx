import React from "react";
import { motion } from "framer-motion";
import {
    Card,
    CardBody,
    Avatar,
    Chip,
    Tooltip, CardFooter,
} from "@heroui/react";
import { Minus, ArrowUp, ChevronsUp, User, Crown, Calendar } from "lucide-react";
import { useTranslation } from "@/lib/i18n-context";
import { Task } from "@/types/task";
import { getStatusColorClass } from "@/lib/task-status-config";

interface TaskCardProps {
  task: Task;
  onClick: (taskId: string) => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}

const priorityConfig = {
  low: {
    icon: Minus,
    color: "default" as const,
    label: "Thấp"
  },
  medium: {
    icon: ArrowUp,
    color: "warning" as const,
    label: "Trung bình"
  },
  high: {
    icon: ChevronsUp,
    color: "danger" as const,
    label: "Cao"
  },
  urgent: {
    icon: ChevronsUp,
    color: "danger" as const,
    label: "Khẩn cấp"
  }
};

export function TaskCard({ task, onClick, isDragging, dragHandleProps }: TaskCardProps) {
  const { t } = useTranslation();

  const handleClick = () => {
    onClick(task.id);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(task.id);
    }
  };

  const getDueDateStatus = () => {
    if (!task.dueDate) return null;

    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

    if (dueDate < today) {
      return { status: 'overdue', color: 'danger' as const, text: 'Quá hạn' };
    } else if (dueDate < threeDaysFromNow) {
      return { status: 'approaching', color: 'warning' as const, text: 'Sắp đến hạn' };
    }
    return { status: 'normal', color: 'default' as const, text: 'Bình thường' };
  };

  const dueDateStatus = getDueDateStatus();
  const priorityInfo = priorityConfig[task.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`${isDragging ? 'opacity-50' : ''}`}
      {...dragHandleProps}
    >
      <Card
        isPressable
        onPress={handleClick}
        className="w-full hover:shadow-md transition-shadow cursor-pointer border border-default-200"
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={`View task: ${task.title}`}
      >
        <CardBody className="p-3 space-y-3">
          {/* Status Indicator and Priority Icon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColorClass(task.status)}`} />
              <span className="text-xs text-foreground-500  uppercase tracking-wide">
                {t(`navigation.taskManagement.filters.statuses.${task.status}` as any)}
              </span>
            </div>
            {/* Priority Icon */}
            <priorityInfo.icon
              size={16}
              className={`${
                priorityInfo.color === 'danger' ? 'text-danger-500' :
                priorityInfo.color === 'warning' ? 'text-warning-500' :
                'text-default-400'
              }`}
            />
          </div>

          {/* Title */}
          <div>
            <Tooltip content={task.title} placement="top" showArrow>
              <h3 className="font-semibold text-sm line-clamp-2 text-foreground">
                {task.title}
              </h3>
            </Tooltip>
            <p className="text-xs text-default-500 mt-1">
              {t("navigation.taskManagement.taskId" as any)}: {task.id}
            </p>
          </div>

          {/* Leadership Direction */}
          {task.isLeadershipDirection && (
            <div className="flex items-center gap-2">
              <Tooltip content="Chỉ đạo từ lãnh đạo" placement="top">
                <Crown
                  size={16}
                  className="text-warning-500"
                />
              </Tooltip>
              <span className="text-xs text-warning-600">Chỉ đạo từ lãnh đạo</span>
            </div>
          )}



          

          {/* Labels */}
          {task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.labels.slice(0, 2).map((label) => (
                <Chip
                  key={label.id}
                  size="sm"
                  variant="flat"
                  color="default"
                  className="text-xs"
                >
                  {label.name}
                </Chip>
              ))}
              {task.labels.length > 2 && (
                <Chip size="sm" variant="flat" color="default" className="text-xs">
                  +{task.labels.length - 2}
                </Chip>
              )}
            </div>
          )}
        </CardBody>
          <CardFooter className="flex justify-between items-center">
              {/* Due Date */}
              {task.dueDate && (
                  <div className="flex items-center gap-2">
                      <Calendar
                          size={14}
                          className={dueDateStatus?.status === 'overdue' ? 'text-danger-500' :
                              dueDateStatus?.status === 'approaching' ? 'text-warning-500' :
                                  'text-default-500'}
                      />
                      <span className={`text-xs ${
                          dueDateStatus?.status === 'overdue' ? 'text-danger-500 font-medium' :
                              dueDateStatus?.status === 'approaching' ? 'text-warning-500 font-medium' :
                                  'text-default-500'
                      }`}>
                {new Date(task.dueDate).toLocaleDateString('vi-VN')}
              </span>
                      {dueDateStatus?.status !== 'normal' && dueDateStatus && (
                          <Chip
                              size="sm"
                              variant="flat"
                              color={dueDateStatus.color}
                              className="text-xs"
                          >
                              {dueDateStatus.text}
                          </Chip>
                      )}
                  </div>
              )}
              {/* Assignee */}
              <div className="flex items-center gap-2">
                  {task.assignee ? (
                      <>
                          <Avatar
                              src={task.assignee.avatar}
                              size="sm"
                              className="w-6 h-6"
                          />
                          <span className="text-xs text-default-600 truncate">
                  {task.assignee.name}
                </span>
                      </>
                  ) : (
                      <>
                          <Avatar
                              size="sm"
                              className="w-6 h-6 bg-default-200"
                              icon={<User size={12} />}
                          />
                          <span className="text-xs text-default-400">
                  {t("navigation.taskManagement.unassigned" as any)}
                </span>
                      </>
                  )}
              </div>
          </CardFooter>
      </Card>
    </motion.div>
  );
}
