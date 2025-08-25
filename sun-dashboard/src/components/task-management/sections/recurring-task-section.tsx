"use client";

import {Switch, Select, SelectItem, Input, DatePicker, Spacer} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { FormSection } from "@/components/ui/form-section";
import type { TaskFormData, TaskFormErrors, UpdateFieldFunction } from "@/types/task-form";

interface RecurringTaskSectionProps {
  formData: TaskFormData;
  errors: TaskFormErrors;
  updateField: UpdateFieldFunction;
}

export function RecurringTaskSection({ formData, errors, updateField }: RecurringTaskSectionProps) {
  const recurringTypes = [
    { key: "daily", label: "Hàng ngày" },
    { key: "weekly", label: "Hàng tuần" },
    { key: "monthly", label: "Hàng tháng" },
    { key: "yearly", label: "Hàng năm" }
  ];

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

        <Spacer y={3} />

      {/* Recurring Settings */}
      {formData.isRecurring && (
        <div className={"space-y-2"}>
          {/* Recurring Type */}
          <Select
            label="Loại định kỳ"
            labelPlacement="outside"
            placeholder="Chọn loại định kỳ"
            selectedKeys={formData.recurringType ? [formData.recurringType] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              updateField("recurringType", selectedKey);
            }}
            variant="bordered"
            isRequired
            isInvalid={!!errors.recurringType}
            errorMessage={errors.recurringType}
          >
            {recurringTypes.map((type) => (
              <SelectItem key={type.key}>{type.label}</SelectItem>
            ))}
          </Select>
            <Spacer y={3} />
          {/* Recurring Interval */}
          <Input
            type="number"
            label="Khoảng cách"
            labelPlacement="outside"
            placeholder="Nhập khoảng cách"
            value={formData.recurringInterval.toString()}
            onValueChange={(value) => updateField("recurringInterval", parseInt(value) || 1)}
            variant="bordered"
            min={1}
            isRequired
            isInvalid={!!errors.recurringInterval}
            errorMessage={errors.recurringInterval}
            description={`Lặp lại mỗi ${formData.recurringInterval} ${
              formData.recurringType === "daily" ? "ngày" :
              formData.recurringType === "weekly" ? "tuần" :
              formData.recurringType === "monthly" ? "tháng" : "năm"
            }`}
          />

          {/* Recurring End Date */}
          <DatePicker
            label="Ngày kết thúc định kỳ"
            labelPlacement="outside"
            value={formData.recurringEndDate ? parseDate(formData.recurringEndDate) : undefined}
            onChange={(date) => updateField("recurringEndDate", date?.toString() || "")}
            variant="bordered"
            isInvalid={!!errors.recurringEndDate}
            errorMessage={errors.recurringEndDate}
            showMonthAndYearPickers
            description="Để trống nếu muốn lặp vô thời hạn"
          />
        </div>
      )}
    </FormSection>
  );
}
