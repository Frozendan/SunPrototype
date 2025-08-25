"use client";

import { useState } from "react";
import { DatePicker } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";
import { FormSection } from "@/components/ui/form-section";
import type { TaskFormData, TaskFormErrors, UpdateFieldFunction } from "@/types/task-form";

interface DateSectionProps {
  formData: TaskFormData;
  errors: TaskFormErrors;
  updateField: UpdateFieldFunction;
}

export function DateSection({ formData, errors, updateField }: DateSectionProps) {
  // State for tracking which field is being edited
  const [editingField, setEditingField] = useState<string | null>(null);

  // Format date for display
  const formatDateForDisplay = (dateString: string | undefined) => {
    if (!dateString) return 'Chưa chọn';
    try {
      const date = parseDate(dateString);
      return `${date.day.toString().padStart(2, '0')}/${date.month.toString().padStart(2, '0')}/${date.year}`;
    } catch {
      return 'Chưa chọn';
    }
  };

  // Handle field click to enter edit mode
  const handleFieldClick = (fieldKey: string) => {
    setEditingField(fieldKey);
  };

  // Handle field blur to exit edit mode
  const handleFieldBlur = () => {
    setEditingField(null);
  };

  // Handle field change and exit edit mode
  const handleFieldChange = (fieldKey: string, date: any) => {
    updateField(fieldKey as keyof TaskFormData, date?.toString() || "");
    setEditingField(null);
  };

  return (
    <FormSection title="Thời gian">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {/* Assignment Date */}
        <div className="flex items-center">
          <label className="text-sm font-medium text-default-700">
            Ngày giao việc*
          </label>
        </div>
        <div className="relative">
          {editingField === 'assignmentDate' ? (
            <DatePicker
              value={formData.assignmentDate ? parseDate(formData.assignmentDate) : today(getLocalTimeZone())}
              onChange={(date) => handleFieldChange('assignmentDate', date)}
              onBlur={handleFieldBlur}
              variant="bordered"
              size="sm"
              isRequired
              isInvalid={!!errors.assignmentDate}
              errorMessage={errors.assignmentDate}
              showMonthAndYearPickers
              autoFocus
            />
          ) : (
            <motion.div
              className="min-h-[32px] px-3 py-2 rounded-lg hover:bg-default-100 cursor-pointer transition-colors flex items-center text-sm group"
              onClick={() => handleFieldClick('assignmentDate')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className={formData.assignmentDate ? "text-default-700" : "text-default-500"}>
                {formatDateForDisplay(formData.assignmentDate)}
              </span>
              <Icon icon="solar:pen-bold" width={14} className="ml-auto text-default-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          )}
        </div>

        {/* Expected End Date */}
        <div className="flex items-center">
          <label className="text-sm font-medium text-default-700">
            Ngày dự kiến hoàn thành
          </label>
        </div>
        <div className="relative">
          {editingField === 'expectedEndDate' ? (
            <DatePicker
              value={formData.expectedEndDate ? parseDate(formData.expectedEndDate) : undefined}
              onChange={(date) => handleFieldChange('expectedEndDate', date)}
              onBlur={handleFieldBlur}
              variant="bordered"
              size="sm"
              isInvalid={!!errors.expectedEndDate}
              errorMessage={errors.expectedEndDate}
              showMonthAndYearPickers
              minValue={formData.assignmentDate ? parseDate(formData.assignmentDate) : today(getLocalTimeZone())}
              autoFocus
            />
          ) : (
            <motion.div
              className="min-h-[32px] px-3 py-2 rounded-lg hover:bg-default-100 cursor-pointer transition-colors flex items-center text-sm group"
              onClick={() => handleFieldClick('expectedEndDate')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className={formData.expectedEndDate ? "text-default-700" : "text-default-500"}>
                {formatDateForDisplay(formData.expectedEndDate)}
              </span>
              <Icon icon="solar:pen-bold" width={14} className="ml-auto text-default-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          )}
        </div>

        {/* Required Deadline */}
        <div className="flex items-center">
          <label className="text-sm font-medium text-default-700">
            Hạn hoàn thành bắt buộc*
          </label>
        </div>
        <div className="relative">
          {editingField === 'requiredDeadline' ? (
            <DatePicker
              value={formData.requiredDeadline ? parseDate(formData.requiredDeadline) : undefined}
              onChange={(date) => handleFieldChange('requiredDeadline', date)}
              onBlur={handleFieldBlur}
              variant="bordered"
              size="sm"
              isRequired
              isInvalid={!!errors.requiredDeadline}
              errorMessage={errors.requiredDeadline}
              showMonthAndYearPickers
              minValue={formData.assignmentDate ? parseDate(formData.assignmentDate) : today(getLocalTimeZone())}
              description="Ngày này sẽ được sử dụng để nhắc nhở và theo dõi tiến độ"
              autoFocus
            />
          ) : (
            <motion.div
              className="min-h-[32px] px-3 py-2 rounded-lg hover:bg-default-100 cursor-pointer transition-colors flex items-center text-sm group"
              onClick={() => handleFieldClick('requiredDeadline')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className={formData.requiredDeadline ? "text-default-700" : "text-default-500"}>
                {formatDateForDisplay(formData.requiredDeadline)}
              </span>
              <Icon icon="solar:pen-bold" width={14} className="ml-auto text-default-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          )}
          {!editingField && formData.requiredDeadline && (
            <p className="text-xs text-default-500 mt-1">
              Ngày này sẽ được sử dụng để nhắc nhở và theo dõi tiến độ
            </p>
          )}
        </div>
      </div>
    </FormSection>
  );
}
