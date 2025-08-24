"use client";

import { ButtonGroup, Button, Switch } from "@heroui/react";
import { Minus, ChevronUp, ChevronsUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FormSection } from "@/components/ui/form-section";
import { isCurrentUser } from "@/data/mock-task-data";
import type { TaskFormData, UpdateFieldFunction } from "@/types/task-form";
import type { TaskPriority } from "@/types/task";

interface PrioritySectionProps {
  formData: TaskFormData;
  updateField: UpdateFieldFunction;
}

export function PrioritySection({ formData, updateField }: PrioritySectionProps) {
  const priorityOptions = [
    { value: "medium", label: "Bình thường", color: "default", icon: Minus },
    { value: "high", label: "Quan trọng", color: "warning", icon: ChevronUp }
  ];

  const importanceOptions = [
    { value: "normal", label: "Bình thường", color: "default", icon: Minus },
    { value: "important", label: "Quan trọng", color: "warning", icon: ChevronUp },
    { value: "very-important", label: "Rất quan trọng", color: "danger", icon: ChevronsUp }
  ];

  // Check if assignee is not current user (show leadership direction toggle)
  const showLeadershipDirection = formData.assigneeId && !isCurrentUser(formData.assigneeId);

  return (
    <FormSection title="Mức độ ưu tiên">
      {/* Priority */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-default-700">Mức độ ưu tiên</label>
        <ButtonGroup variant="bordered" className="w-full">
          {priorityOptions.map((option) => (
            <Button
              key={option.value}
              className="flex-1"
              color={formData.priority === option.value ? option.color as any : "default"}
              variant={formData.priority === option.value ? "solid" : "bordered"}
              onPress={() => updateField("priority", option.value as TaskPriority)}
              startContent={
                <option.icon
                  size={16}
                  className={formData.priority === option.value ? "text-white" :
                           option.color === "default" ? "text-default-500" :
                           option.color === "warning" ? "text-warning" : "text-danger"}
                />
              }
            >
              {option.label}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {/* Importance Level */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-default-700">Mức độ quan trọng</label>
        <ButtonGroup variant="bordered" className="w-full">
          {importanceOptions.map((option) => (
            <Button
              key={option.value}
              className="flex-1"
              color={formData.importanceLevel === option.value ? option.color as any : "default"}
              variant={formData.importanceLevel === option.value ? "solid" : "bordered"}
              onPress={() => updateField("importanceLevel", option.value)}
              startContent={
                <option.icon
                  size={16}
                  className={formData.importanceLevel === option.value ? "text-white" :
                           option.color === "default" ? "text-default-500" :
                           option.color === "warning" ? "text-warning" : "text-danger"}
                />
              }
            >
              {option.label}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {/* Leadership Direction - Only show when assigning to others */}
      <AnimatePresence>
        {showLeadershipDirection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div>
                <label className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Chỉ đạo từ lãnh đạo
                </label>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Công việc được giao trực tiếp từ lãnh đạo
                </p>
              </div>
              <Switch
                isSelected={formData.isLeadershipDirection}
                onValueChange={(value) => updateField("isLeadershipDirection", value)}
                color="primary"
                size="sm"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </FormSection>
  );
}
