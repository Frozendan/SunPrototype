"use client";

import { useState, useEffect, useRef } from "react";
import { Select, SelectItem, Switch } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ArrowDown, Minus, ArrowUp, ChevronsUp, Edit3 } from "lucide-react";
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
  // State for tracking which field is being edited
  const [editingField, setEditingField] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const priorityOptions = [
    {
      key: "low",
      label: "Thấp",
      icon: ArrowDown,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      key: "medium",
      label: "Bình thường",
      icon: Minus,
      iconColor: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200"
    },
    {
      key: "high",
      label: "Quan trọng",
      icon: ArrowUp,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      key: "urgent",
      label: "Khẩn cấp",
      icon: ChevronsUp,
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    }
  ];

  const importanceOptions = [
    {
      key: "normal",
      label: "Bình thường",
      icon: Minus,
      iconColor: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200"
    },
    {
      key: "important",
      label: "Quan trọng",
      icon: ArrowUp,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      key: "very-important",
      label: "Rất quan trọng",
      icon: ChevronsUp,
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    }
  ];

  // Check if assignee is not current user (show leadership direction toggle)
  const showLeadershipDirection = formData.assigneeId && !isCurrentUser(formData.assigneeId);

  // Get display value for a field
  const getDisplayValue = (fieldKey: string, value: string) => {
    switch (fieldKey) {
      case 'priority':
        const priorityOption = priorityOptions.find(opt => opt.key === value);
        return priorityOption ? {
          label: priorityOption.label,
          icon: priorityOption.icon,
          iconColor: priorityOption.iconColor,
          bgColor: priorityOption.bgColor,
          borderColor: priorityOption.borderColor
        } : {
          label: 'Chưa chọn',
          icon: Minus,
          iconColor: 'text-default-500',
          bgColor: 'bg-default-50',
          borderColor: 'border-default-200'
        };
      case 'importanceLevel':
        const importanceOption = importanceOptions.find(opt => opt.key === value);
        return importanceOption ? {
          label: importanceOption.label,
          icon: importanceOption.icon,
          iconColor: importanceOption.iconColor,
          bgColor: importanceOption.bgColor,
          borderColor: importanceOption.borderColor
        } : {
          label: 'Chưa chọn',
          icon: Minus,
          iconColor: 'text-default-500',
          bgColor: 'bg-default-50',
          borderColor: 'border-default-200'
        };
      default:
        return {
          label: 'Chưa chọn',
          icon: Minus,
          iconColor: 'text-default-500',
          bgColor: 'bg-default-50',
          borderColor: 'border-default-200'
        };
    }
  };

  // Handle field click to enter edit mode
  const handleFieldClick = (fieldKey: string) => {
    setEditingField(fieldKey);
  };

  // Handle field selection change
  const handleFieldChange = (fieldKey: string, value: string | null) => {
    if (fieldKey === 'priority') {
      updateField("priority", value as TaskPriority);
    } else {
      updateField(fieldKey as keyof TaskFormData, value as any);
    }
    setEditingField(null);
  };

  // Handle dropdown close to exit edit mode
  const handleDropdownClose = (fieldKey: string) => {
    // Only close edit mode if no selection was made
    setTimeout(() => {
      if (editingField === fieldKey) {
        setEditingField(null);
      }
    }, 150);
  };

  return (
    <FormSection>
      <div ref={sectionRef} className="grid grid-cols-2 gap-x-6 gap-y-4">
        {/* Priority Level */}
        <div className="flex items-center">
          <label className="text-sm font-medium text-default-700">
            Mức độ ưu tiên
          </label>
        </div>
        <div className="relative">
          {editingField === 'priority' ? (
            <Select
              placeholder="Chọn mức độ ưu tiên"
              selectedKeys={formData.priority ? [formData.priority] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                handleFieldChange('priority', selectedKey);
              }}
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  handleDropdownClose('priority');
                }
              }}
              variant="bordered"
              size="sm"
              autoFocus
              defaultOpen={true}
              renderValue={(items) => {
                return items.map((item) => {
                  const option = priorityOptions.find(opt => opt.key === item.key);
                  const IconComponent = option?.icon || Minus;
                  return (
                    <div key={item.key} className="flex items-center gap-2">
                      <IconComponent size={16} className={option?.iconColor || "text-default-500"} />
                      <span>{option?.label}</span>
                    </div>
                  );
                });
              }}
            >
              {priorityOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <SelectItem
                    key={option.key}
                    value={option.key}
                    startContent={<IconComponent size={16} className={option.iconColor} />}
                  >
                    {option.label}
                  </SelectItem>
                );
              })}
            </Select>
          ) : (
            <motion.div
              className={`min-h-[32px] px-3 py-2 rounded-lg border cursor-pointer transition-all flex items-center text-sm group ${
                formData.priority
                  ? `${getDisplayValue('priority', formData.priority).bgColor} ${getDisplayValue('priority', formData.priority).borderColor} hover:opacity-80`
                  : 'bg-default-50 border-default-200 hover:bg-default-100'
              }`}
              onClick={() => handleFieldClick('priority')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-2">
                {(() => {
                  const displayValue = getDisplayValue('priority', formData.priority);
                  const IconComponent = displayValue.icon;
                  return (
                    <IconComponent
                      size={16}
                      className={formData.priority ? displayValue.iconColor : "text-default-500"}
                    />
                  );
                })()}
                <span className={formData.priority ? "text-default-700 font-medium" : "text-default-500"}>
                  {getDisplayValue('priority', formData.priority).label}
                </span>
              </div>
              <Edit3 size={14} className="ml-auto text-default-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          )}
        </div>

        {/* Importance Level */}
        <div className="flex items-center">
          <label className="text-sm font-medium text-default-700">
            Mức độ quan trọng
          </label>
        </div>
        <div className="relative">
          {editingField === 'importanceLevel' ? (
            <Select
              placeholder="Chọn mức độ quan trọng"
              selectedKeys={formData.importanceLevel ? [formData.importanceLevel] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                handleFieldChange('importanceLevel', selectedKey);
              }}
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  handleDropdownClose('importanceLevel');
                }
              }}
              variant="bordered"
              size="sm"
              autoFocus
              defaultOpen={true}
              renderValue={(items) => {
                return items.map((item) => {
                  const option = importanceOptions.find(opt => opt.key === item.key);
                  const IconComponent = option?.icon || Minus;
                  return (
                    <div key={item.key} className="flex items-center gap-2">
                      <IconComponent size={16} className={option?.iconColor || "text-default-500"} />
                      <span>{option?.label}</span>
                    </div>
                  );
                });
              }}
            >
              {importanceOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <SelectItem
                    key={option.key}
                    value={option.key}
                    startContent={<IconComponent size={16} className={option.iconColor} />}
                  >
                    {option.label}
                  </SelectItem>
                );
              })}
            </Select>
          ) : (
            <motion.div
              className={`min-h-[32px] px-3 py-2 rounded-lg border cursor-pointer transition-all flex items-center text-sm group ${
                formData.importanceLevel
                  ? `${getDisplayValue('importanceLevel', formData.importanceLevel).bgColor} ${getDisplayValue('importanceLevel', formData.importanceLevel).borderColor} hover:opacity-80`
                  : 'bg-default-50 border-default-200 hover:bg-default-100'
              }`}
              onClick={() => handleFieldClick('importanceLevel')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-2">
                {(() => {
                  const displayValue = getDisplayValue('importanceLevel', formData.importanceLevel);
                  const IconComponent = displayValue.icon;
                  return (
                    <IconComponent
                      size={16}
                      className={formData.importanceLevel ? displayValue.iconColor : "text-default-500"}
                    />
                  );
                })()}
                <span className={formData.importanceLevel ? "text-default-700 font-medium" : "text-default-500"}>
                  {getDisplayValue('importanceLevel', formData.importanceLevel).label}
                </span>
              </div>
              <Edit3 size={14} className="ml-auto text-default-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Leadership Direction - Only show when assigning to others */}
      <AnimatePresence>
        {showLeadershipDirection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden mt-4"
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
