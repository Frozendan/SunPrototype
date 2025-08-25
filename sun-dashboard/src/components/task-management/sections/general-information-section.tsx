"use client";

import { useState } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
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

  // State for tracking which field is being edited
  const [editingField, setEditingField] = useState<string | null>(null);

  // Filter topics based on selected functional group
  const filteredTopics = formData.functionalGroupId
    ? mockTopics.filter(topic => topic.functionalGroupId === formData.functionalGroupId)
    : mockTopics;

  // Get display value for a field
  const getDisplayValue = (fieldKey: string, value: string) => {
    switch (fieldKey) {
      case 'functionalGroupId':
        return mockFunctionalGroups.find(group => group.id === value)?.name || 'Chưa chọn';
      case 'topicId':
        return mockTopics.find(topic => topic.id === value)?.name || 'Chưa chọn';
      case 'taskTypeId':
        return mockTaskTypes.find(type => type.id === value)?.name || 'Chưa chọn';
      default:
        return value || 'Chưa chọn';
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

  // Handle field selection change
  const handleFieldChange = (fieldKey: string, value: string | null) => {
    if (fieldKey === 'functionalGroupId') {
      updateField("functionalGroupId", value as string);
      // Clear topic when functional group changes
      if (formData.topicId) {
        updateField("topicId", "");
      }
    } else {
      updateField(fieldKey as keyof TaskFormData, value as any);
    }
    setEditingField(null);
  };

  return (
    <FormSection>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {/* Functional Group */}
        <div className="flex items-center">
          <label className="text-sm font-medium text-default-700">
            {t("navigation.taskManagement.generalInfo.functionalGroup")}
          </label>
        </div>
        <div className="relative">
          {editingField === 'functionalGroupId' ? (
            <Autocomplete
              placeholder={t("navigation.taskManagement.generalInfo.selectFunctionalGroup")}
              selectedKey={formData.functionalGroupId}
              onSelectionChange={(key) => handleFieldChange('functionalGroupId', key as string)}
              onBlur={handleFieldBlur}
              variant="bordered"
              size="sm"
              isInvalid={!!errors.functionalGroupId}
              errorMessage={errors.functionalGroupId}
              autoFocus
            >
              {mockFunctionalGroups.map((group) => (
                <AutocompleteItem key={group.id} value={group.id}>
                  {group.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          ) : (
            <motion.div
              className="min-h-[32px] px-3 py-2 rounded-lg hover:bg-default-100 cursor-pointer transition-colors flex items-center text-sm group"
              onClick={() => handleFieldClick('functionalGroupId')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className={formData.functionalGroupId ? "text-default-700" : "text-default-500"}>
                {getDisplayValue('functionalGroupId', formData.functionalGroupId)}
              </span>
              <Icon icon="solar:pen-bold" width={14} className="ml-auto text-default-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          )}
        </div>

        {/* Topic - Required field */}
        <div className="flex items-center">
          <label className="text-sm font-medium text-default-700">
            {t("navigation.taskManagement.generalInfo.topic")}*
          </label>
        </div>
        <div className="relative">
          {editingField === 'topicId' ? (
            <Autocomplete
              placeholder={t("navigation.taskManagement.generalInfo.selectTopic")}
              selectedKey={formData.topicId}
              onSelectionChange={(key) => handleFieldChange('topicId', key as string)}
              onBlur={handleFieldBlur}
              variant="bordered"
              size="sm"
              isRequired
              isInvalid={!!errors.topicId}
              errorMessage={errors.topicId}
              autoFocus
            >
              {filteredTopics.map((topic) => (
                <AutocompleteItem key={topic.id} value={topic.id}>
                  {topic.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          ) : (
            <motion.div
              className="min-h-[32px] px-3 py-2 rounded-lg hover:bg-default-100 cursor-pointer transition-colors flex items-center text-sm group"
              onClick={() => handleFieldClick('topicId')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className={formData.topicId ? "text-default-700" : "text-default-500"}>
                {getDisplayValue('topicId', formData.topicId)}
              </span>
              <Icon icon="solar:pen-bold" width={14} className="ml-auto text-default-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          )}
        </div>

        {/* Task Type */}
        <div className="flex items-center">
          <label className="text-sm font-medium text-default-700">
            {t("navigation.taskManagement.generalInfo.taskType")}
          </label>
        </div>
        <div className="relative">
          {editingField === 'taskTypeId' ? (
            <Autocomplete
              placeholder={t("navigation.taskManagement.generalInfo.selectTaskType")}
              selectedKey={formData.taskTypeId}
              onSelectionChange={(key) => handleFieldChange('taskTypeId', key as string)}
              onBlur={handleFieldBlur}
              variant="bordered"
              size="sm"
              isInvalid={!!errors.taskTypeId}
              errorMessage={errors.taskTypeId}
              autoFocus
            >
              {mockTaskTypes.map((type) => (
                <AutocompleteItem key={type.id} value={type.id}>
                  {type.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          ) : (
            <motion.div
              className="min-h-[32px] px-3 py-2 rounded-lg hover:bg-default-100 cursor-pointer transition-colors flex items-center text-sm group"
              onClick={() => handleFieldClick('taskTypeId')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className={formData.taskTypeId ? "text-default-700" : "text-default-500"}>
                {getDisplayValue('taskTypeId', formData.taskTypeId)}
              </span>
              <Icon icon="solar:pen-bold" width={14} className="ml-auto text-default-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          )}
        </div>
      </div>
    </FormSection>
  );
}
