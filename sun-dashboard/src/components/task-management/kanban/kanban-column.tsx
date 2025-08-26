import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { useTranslation } from "@/lib/i18n-context";
import { Task, TaskStatus } from "@/types/task";
import { StatusGroup, getGroupBackgroundColor, getGroupTextColor, getStatusColorClass } from "@/lib/task-status-config";
import { TaskCard } from "./task-card";

interface KanbanColumnProps {
  group: StatusGroup;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onTaskDrop?: (taskId: string, newStatus: TaskStatus) => void;
  isDropTarget?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function KanbanColumn({
  group,
  tasks,
  onTaskClick,
  onTaskDrop,
  isDropTarget
}: KanbanColumnProps) {
  const { t } = useTranslation();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId && onTaskDrop) {
      // For now, we'll use the first status in the group as the target status
      // This could be enhanced to be more specific
      const targetStatus = getDefaultStatusForGroup(group);
      onTaskDrop(taskId, targetStatus);
    }
  };

  const getDefaultStatusForGroup = (group: StatusGroup): TaskStatus => {
    switch (group) {
      case 'draft':
        return 'draft';
      case 'inProgress':
        return 'inProgress';
      case 'pending':
        return 'pendingConfirmation';
      case 'completed':
        return 'completed';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'todo';
    }
  };

  return (
    <Card
      className={`w-96 shadow flex-shrink-0 h-full max-h-[calc(100vh-200px)] ${
        isDropTarget ? 'ring-2 ring-primary-500 ring-opacity-50' : ''
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CardHeader className={`pb-2 ${getGroupBackgroundColor(group)} ${getGroupTextColor(group)}`}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColorClass(getDefaultStatusForGroup(group))}`} />
            <h3 className="font-semibold text-sm">
              {t(`navigation.taskManagement.filters.statusGroups.${group}` as any)}
            </h3>
          </div>
          <Chip 
            size="sm" 
            variant="flat" 
            className={`${getGroupBackgroundColor(group)} ${getGroupTextColor(group)} border-current`}
          >
            {tasks.length}
          </Chip>
        </div>
      </CardHeader>
      
      <CardBody className="p-3 overflow-y-auto scrollbar-hide">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          <AnimatePresence>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <motion.div
                  key={task.id}
                  variants={itemVariants}
                  layout
                  draggable
                  onDragStart={(e: any) => {
                    if (e.dataTransfer) {
                      e.dataTransfer.setData('text/plain', task.id);
                    }
                  }}
                >
                  <TaskCard
                    task={task}
                    onClick={onTaskClick}
                    dragHandleProps={{
                      draggable: true
                    }}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={itemVariants}
                className="text-center py-8"
              >
                <div className="text-default-400 text-sm">
                  Không có công việc nào
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </CardBody>
    </Card>
  );
}
