"use client";

import { DatePicker } from "@heroui/react";
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";
import { FormSection } from "@/components/ui/form-section";
import type { TaskFormData, TaskFormErrors, UpdateFieldFunction } from "@/types/task-form";

interface DateSectionProps {
  formData: TaskFormData;
  errors: TaskFormErrors;
  updateField: UpdateFieldFunction;
}

export function DateSection({ formData, errors, updateField }: DateSectionProps) {
  return (
    <FormSection title="Thời gian">
      {/* Assignment Date */}
      <DatePicker
        label="Ngày giao việc"
        value={formData.assignmentDate ? parseDate(formData.assignmentDate) : today(getLocalTimeZone())}
        onChange={(date) => updateField("assignmentDate", date?.toString() || "")}
        variant="bordered"
        isRequired
        isInvalid={!!errors.assignmentDate}
        errorMessage={errors.assignmentDate}
        showMonthAndYearPickers
      />

      {/* Expected End Date */}
      <DatePicker
        label="Ngày dự kiến hoàn thành"
        value={formData.expectedEndDate ? parseDate(formData.expectedEndDate) : undefined}
        onChange={(date) => updateField("expectedEndDate", date?.toString() || "")}
        variant="bordered"
        isInvalid={!!errors.expectedEndDate}
        errorMessage={errors.expectedEndDate}
        showMonthAndYearPickers
        minValue={formData.assignmentDate ? parseDate(formData.assignmentDate) : today(getLocalTimeZone())}
      />

      {/* Required Deadline */}
      <DatePicker
        label="Hạn hoàn thành bắt buộc"
        value={formData.requiredDeadline ? parseDate(formData.requiredDeadline) : undefined}
        onChange={(date) => updateField("requiredDeadline", date?.toString() || "")}
        variant="bordered"
        isInvalid={!!errors.requiredDeadline}
        errorMessage={errors.requiredDeadline}
        showMonthAndYearPickers
        minValue={formData.assignmentDate ? parseDate(formData.assignmentDate) : today(getLocalTimeZone())}
        description="Ngày này sẽ được sử dụng để nhắc nhở và theo dõi tiến độ"
      />
    </FormSection>
  );
}
