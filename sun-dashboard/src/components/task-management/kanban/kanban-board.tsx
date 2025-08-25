import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";

import { Task, TaskStatus } from "@/types/task";
import { StatusGroup, statusGroups, getStatusGroup } from "@/lib/task-status-config";
import { KanbanColumn } from "./kanban-column";

interface KanbanBoardProps {
  tasks: Task[];
  isLoading?: boolean;
  onTaskClick: (taskId: string) => void;
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
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

const columnVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 }
};

export function KanbanBoard({ 
  tasks, 
  isLoading, 
  onTaskClick, 
  onTaskStatusChange 
}: KanbanBoardProps) {

  const [dragOverColumn, setDragOverColumn] = useState<StatusGroup | null>(null);

  // Group tasks by status group
  const groupedTasks = useMemo(() => {
    const groups: Record<StatusGroup, Task[]> = {
      draft: [],
      inProgress: [],
      pending: [],
      completed: [],
      cancelled: []
    };

    tasks.forEach(task => {
      const group = getStatusGroup(task.status);
      groups[group].push(task);
    });

    // Sort tasks within each group by priority and due date
    Object.keys(groups).forEach(groupKey => {
      const group = groupKey as StatusGroup;
      groups[group].sort((a, b) => {
        // First sort by priority
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;

        // Then by due date (earliest first)
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;

        // Finally by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    });

    return groups;
  }, [tasks]);

  const handleTaskDrop = (taskId: string, newStatus: TaskStatus) => {
    if (onTaskStatusChange) {
      onTaskStatusChange(taskId, newStatus);
    }
    setDragOverColumn(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardBody className="flex items-center justify-center py-12">
          <Spinner size="lg" label="Đang tải công việc..." />
        </CardBody>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardBody className="text-center py-12">
          <Icon icon="solar:document-linear" width={64} className="text-default-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-default-500 mb-2">
            Không có công việc nào
          </h3>
          <p className="text-default-400">
            Tạo công việc mới để bắt đầu quản lý dự án của bạn
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex gap-4 overflow-x-auto pb-4"
        style={{ minHeight: 'calc(100vh - 300px)' }}
      >
        {Object.entries(statusGroups).map(([groupKey]) => {
          const group = groupKey as StatusGroup;
          const groupTasks = groupedTasks[group];
          
          return (
            <motion.div
              key={group}
              variants={columnVariants}
              onDragEnter={() => setDragOverColumn(group)}
              onDragLeave={(e) => {
                // Only clear if we're leaving the column entirely
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setDragOverColumn(null);
                }
              }}
            >
              <KanbanColumn
                group={group}
                tasks={groupTasks}
                onTaskClick={onTaskClick}
                onTaskDrop={handleTaskDrop}
                isDropTarget={dragOverColumn === group}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
