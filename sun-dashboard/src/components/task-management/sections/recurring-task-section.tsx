"use client";

import { useState, useEffect } from "react";
import { Switch, Select, SelectItem, Input, DatePicker, Spacer } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";
import { FormSection } from "@/components/ui/form-section";
import type { TaskFormData, TaskFormErrors, UpdateFieldFunction } from "@/types/task-form";

interface RecurringTaskSectionProps {
  formData: TaskFormData;
  errors: TaskFormErrors;
  updateField: UpdateFieldFunction;
}

export function RecurringTaskSection({ formData, errors, updateField }: RecurringTaskSectionProps) {
  // State for tracking which field is being edited
  const [editingField, setEditingField] = useState<string | null>(null);

  const recurringTypes = [
    { key: "daily", label: "Hàng ngày" },
    { key: "weekly", label: "Hàng tuần" },
    { key: "monthly", label: "Hàng tháng" },
    { key: "yearly", label: "Hàng năm" }
  ];

  // Auto-update recurringStartDate when assignmentDate changes
  useEffect(() => {
    if (formData.assignmentDate && formData.isRecurring) {
      // Only update if recurringStartDate is empty or different from assignmentDate
      if (!formData.recurringStartDate || formData.recurringStartDate !== formData.assignmentDate) {
        updateField("recurringStartDate", formData.assignmentDate);
      }
    }
  }, [formData.assignmentDate, formData.isRecurring, formData.recurringStartDate, updateField]);

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

  // Get display value for recurring type
  const getRecurringTypeDisplay = (value: string) => {
    const type = recurringTypes.find(t => t.key === value);
    return type?.label || 'Chưa chọn';
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
  const handleFieldChange = (fieldKey: string, value: any) => {
    updateField(fieldKey as keyof TaskFormData, value);
    setEditingField(null);
  };

  return (
    <FormSection>
      {/* Recurring Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-default-700">Công việc định kỳ</label>
          <p className="text-xs text-default-500">Tự động tạo công việc theo chu kỳ</p>
        </div>
        <Switch
          isSelected={formData.isRecurring}
          onValueChange={(value) => updateField("isRecurring", value)}
          color="primary"
        />
      </div>

      {/* Recurring Settings */}
      {formData.isRecurring && (
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* Recurring Type */}
            <div className="flex items-center">
              <label className="text-sm font-medium text-default-700">
                Loại định kỳ*
              </label>
            </div>
            <div className="relative">
              {editingField === 'recurringType' ? (
                <Select
                  placeholder="Chọn loại định kỳ"
                  selectedKeys={formData.recurringType ? [formData.recurringType] : []}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    handleFieldChange('recurringType', selectedKey);
                  }}
                  onBlur={handleFieldBlur}
                  variant="bordered"
                  size="sm"
                  isRequired
                  isInvalid={!!errors.recurringType}
                  errorMessage={errors.recurringType}
                  autoFocus
                >
                  {recurringTypes.map((type) => (
                    <SelectItem key={type.key}>{type.label}</SelectItem>
                  ))}
                </Select>
              ) : (
                <motion.div
                  className="min-h-[32px] px-3 py-2 rounded-lg hover:bg-default-100 cursor-pointer transition-colors flex items-center text-sm group"
                  onClick={() => handleFieldClick('recurringType')}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className={formData.recurringType ? "text-default-700" : "text-default-500"}>
                    {getRecurringTypeDisplay(formData.recurringType)}
                  </span>
                  <Icon icon="solar:pen-bold" width={14} className="ml-auto text-default-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              )}
            </div>

            {/* Recurring Interval */}
            <div className="flex items-center">
              <label className="text-sm font-medium text-default-700">
                Khoảng cách*
              </label>
            </div>
            <div className="relative">
              {editingField === 'recurringInterval' ? (
                <Input
                  type="number"
                  placeholder="Nhập khoảng cách"
                  value={formData.recurringInterval.toString()}
                  onValueChange={(value) => handleFieldChange('recurringInterval', parseInt(value) || 1)}
                  onBlur={handleFieldBlur}
                  variant="bordered"
                  size="sm"
                  min={1}
                  isRequired
                  isInvalid={!!errors.recurringInterval}
                  errorMessage={errors.recurringInterval}
                  autoFocus
                />
              ) : (
                <motion.div
                  className="min-h-[32px] px-3 py-2 rounded-lg hover:bg-default-100 cursor-pointer transition-colors flex items-center text-sm group"
                  onClick={() => handleFieldClick('recurringInterval')}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className={formData.recurringInterval ? "text-default-700" : "text-default-500"}>
                    {formData.recurringInterval || 'Chưa chọn'}
                  </span>
                  <Icon icon="solar:pen-bold" width={14} className="ml-auto text-default-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              )}
              {!editingField && formData.recurringInterval && formData.recurringType && (
                <p className="text-xs text-default-500 mt-1">
                  Lặp lại mỗi {formData.recurringInterval} {
                    formData.recurringType === "daily" ? "ngày" :
                    formData.recurringType === "weekly" ? "tuần" :
                    formData.recurringType === "monthly" ? "tháng" : "năm"
                  }
                </p>
              )}
            </div>

            {/* Start Recurrent Date */}
            <div className="flex items-center">
              <label className="text-sm font-medium text-default-700">
                Ngày bắt đầu định kỳ*
              </label>
            </div>
            <div className="relative">
              {editingField === 'recurringStartDate' ? (
                <DatePicker
                  value={formData.recurringStartDate ? parseDate(formData.recurringStartDate) : (formData.assignmentDate ? parseDate(formData.assignmentDate) : today(getLocalTimeZone()))}
                  onChange={(date) => handleFieldChange('recurringStartDate', date?.toString() || "")}
                  onBlur={handleFieldBlur}
                  variant="bordered"
                  size="sm"
                  isRequired
                  isInvalid={!!errors.recurringStartDate}
                  errorMessage={errors.recurringStartDate}
                  showMonthAndYearPickers
                  autoFocus
                />
              ) : (
                <motion.div
                  className="min-h-[32px] px-3 py-2 rounded-lg hover:bg-default-100 cursor-pointer transition-colors flex items-center text-sm group"
                  onClick={() => handleFieldClick('recurringStartDate')}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className={formData.recurringStartDate ? "text-default-700" : "text-default-500"}>
                    {formatDateForDisplay(formData.recurringStartDate || formData.assignmentDate)}
                  </span>
                  <Icon icon="solar:pen-bold" width={14} className="ml-auto text-default-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              )}
            </div>

            {/* Recurring End Date */}
            <div className="flex flex-col items-start">
              <label className="text-sm font-medium text-default-700">
                Ngày kết thúc định kỳ
              </label>
            <p className="text-xs text-default-500 mt-1">
                Để trống nếu muốn lặp vô thời hạn
            </p>
            </div>
            <div className="relative">
              {editingField === 'recurringEndDate' ? (
                <DatePicker
                  value={formData.recurringEndDate ? parseDate(formData.recurringEndDate) : undefined}
                  onChange={(date) => handleFieldChange('recurringEndDate', date?.toString() || "")}
                  onBlur={handleFieldBlur}
                  variant="bordered"
                  size="sm"
                  isInvalid={!!errors.recurringEndDate}
                  errorMessage={errors.recurringEndDate}
                  showMonthAndYearPickers
                  minValue={formData.recurringStartDate ? parseDate(formData.recurringStartDate) : (formData.assignmentDate ? parseDate(formData.assignmentDate) : today(getLocalTimeZone()))}
                  autoFocus
                />
              ) : (
                <motion.div
                  className="min-h-[32px] px-3 py-2 rounded-lg hover:bg-default-100 cursor-pointer transition-colors flex items-center text-sm group"
                  onClick={() => handleFieldClick('recurringEndDate')}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className={formData.recurringEndDate ? "text-default-700" : "text-default-500"}>
                    {formatDateForDisplay(formData.recurringEndDate)}
                  </span>
                  <Icon icon="solar:pen-bold" width={14} className="ml-auto text-default-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              )}
             
            </div>
          </div>
        </div>
      )}
    </FormSection>
  );
}
