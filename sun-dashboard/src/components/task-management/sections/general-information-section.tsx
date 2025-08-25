"use client";

import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { FormSection } from "@/components/ui/form-section";
import { useTranslation } from "@/lib/i18n-context";
import type { TaskFormData, TaskFormErrors, UpdateFieldFunction, MockFunctionalGroup, MockTopic, MockTaskType } from "@/types/task-form";

interface GeneralInformationSectionProps {
  formData: TaskFormData;
  errors: TaskFormErrors;
  updateField: UpdateFieldFunction;
  mockFunctionalGroups: MockFunctionalGroup[];
  mockTopics: MockTopic[];
  mockTaskTypes: MockTaskType[];
}

export function GeneralInformationSection({
  formData,
  errors,
  updateField,
  mockFunctionalGroups,
  mockTopics,
  mockTaskTypes
}: GeneralInformationSectionProps) {
  const { t } = useTranslation();

  // Filter topics based on selected functional group
  const filteredTopics = formData.functionalGroupId 
    ? mockTopics.filter(topic => topic.functionalGroupId === formData.functionalGroupId)
    : mockTopics;

  return (
    <FormSection>
      <div className="grid grid-cols-1 gap-4">
        {/* Functional Group */}
        <Autocomplete
          label={t("navigation.taskManagement.generalInfo.functionalGroup")}
          placeholder={t("navigation.taskManagement.generalInfo.selectFunctionalGroup")}
          selectedKey={formData.functionalGroupId}
          onSelectionChange={(key) => {
            updateField("functionalGroupId", key as string);
            // Clear topic when functional group changes
            if (formData.topicId) {
              updateField("topicId", "");
            }
          }}
          isInvalid={!!errors.functionalGroupId}
          errorMessage={errors.functionalGroupId}
          variant="bordered"
          radius="lg"
          labelPlacement="outside"
        >
          {mockFunctionalGroups.map((group) => (
            <AutocompleteItem key={group.id} value={group.id}>
              {group.name}
            </AutocompleteItem>
          ))}
        </Autocomplete>

        {/* Topic - Required field */}
        <Autocomplete
          label={t("navigation.taskManagement.generalInfo.topic")}
          placeholder={t("navigation.taskManagement.generalInfo.selectTopic")}
          selectedKey={formData.topicId}
          onSelectionChange={(key) => updateField("topicId", key as string)}
          isInvalid={!!errors.topicId}
          errorMessage={errors.topicId}
          variant="bordered"
          radius="lg"
          labelPlacement="outside"
          isRequired
        >
          {filteredTopics.map((topic) => (
            <AutocompleteItem key={topic.id} value={topic.id}>
              {topic.name}
            </AutocompleteItem>
          ))}
        </Autocomplete>

        {/* Task Type */}
        <Autocomplete
          label={t("navigation.taskManagement.generalInfo.taskType")}
          placeholder={t("navigation.taskManagement.generalInfo.selectTaskType")}
          selectedKey={formData.taskTypeId}
          onSelectionChange={(key) => updateField("taskTypeId", key as string)}
          isInvalid={!!errors.taskTypeId}
          errorMessage={errors.taskTypeId}
          variant="bordered"
          radius="lg"
          labelPlacement="outside"
        >
          {mockTaskTypes.map((type) => (
            <AutocompleteItem key={type.id} value={type.id}>
              {type.name}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      </div>
    </FormSection>
  );
}
