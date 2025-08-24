"use client";

import { Autocomplete, AutocompleteItem, Avatar, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { FormSection } from "@/components/ui/form-section";
import { useTranslation } from "@/lib/i18n-context";
import { getUserUnitMapping, isCurrentUser } from "@/data/mock-task-data";
import type { TaskFormData, TaskFormErrors, UpdateFieldFunction, MockUnit, MockAssignee, MockAssignmentReference } from "@/types/task-form";

interface BasicInformationSectionProps {
  formData: TaskFormData;
  errors: TaskFormErrors;
  updateField: UpdateFieldFunction;
  mockUnits: MockUnit[];
  mockAssignees: MockAssignee[];
  mockAssignmentReferences: MockAssignmentReference[];
}

export function BasicInformationSection({
  formData,
  errors,
  updateField,
  mockUnits,
  mockAssignees,
  mockAssignmentReferences
}: BasicInformationSectionProps) {
  const { t } = useTranslation();

  // Handle assignee change with auto-update unit
  const handleAssigneeChange = (assigneeId: string | null) => {
    if (assigneeId) {
      updateField("assigneeId", assigneeId);

      // Auto-update unit based on assignee
      const unitId = getUserUnitMapping(assigneeId);
      if (unitId) {
        updateField("unitId", unitId);
      }
    } else {
      updateField("assigneeId", "");
    }
  };

  // Handle "Assign to Me" button
  const handleAssignToMe = () => {
    handleAssigneeChange("current-user");
  };

  return (
    <FormSection>
      {/* Unit */}
      <Autocomplete
        label="Đơn vị"
        labelPlacement="outside"
        placeholder="Chọn đơn vị"
        selectedKey={formData.unitId}
        onSelectionChange={(key) => updateField("unitId", key as string)}
        variant="bordered"
        isRequired
        isInvalid={!!errors.unitId}
        errorMessage={errors.unitId}
      >
        {mockUnits.map((unit) => (
          <AutocompleteItem key={unit.id}>
            {unit.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>

      {/* Assignee */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-default-700">
            Người được giao *
          </label>
          <Button
            variant="flat"
            size="sm"
            onPress={handleAssignToMe}
            startContent={<Icon icon="solar:user-linear" width={16} />}
            className="text-xs"
          >
            Giao cho tôi
          </Button>
        </div>
        <Autocomplete
          placeholder="Chọn người được giao"
          selectedKey={formData.assigneeId}
          onSelectionChange={handleAssigneeChange}
          variant="bordered"
          isRequired
          isInvalid={!!errors.assigneeId}
          errorMessage={errors.assigneeId}
        >
          {mockAssignees.map((assignee) => (
            <AutocompleteItem
              key={assignee.id}
              startContent={<Avatar src={assignee.avatar} size="sm" />}
            >
              {assignee.name}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      </div>

      {/* Collaborating Unit */}
      <Autocomplete
        label="Đơn vị phối hợp"
        labelPlacement="outside"
        placeholder="Chọn đơn vị phối hợp"
        selectedKey={formData.collaboratingUnitId}
        onSelectionChange={(key) => updateField("collaboratingUnitId", key as string)}
        variant="bordered"
      >
        {mockUnits.map((unit) => (
          <AutocompleteItem key={unit.id}>
            {unit.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>

      {/* Assignment Reference */}
      <Autocomplete
        label="Căn cứ giao việc"
        labelPlacement="outside"
        placeholder="Chọn căn cứ giao việc"
        selectedKey={formData.assignmentReferenceId}
        onSelectionChange={(key) => updateField("assignmentReferenceId", key as string)}
        variant="bordered"
      >
        {mockAssignmentReferences.map((ref) => (
          <AutocompleteItem key={ref.id}>
            {ref.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </FormSection>
  );
}
