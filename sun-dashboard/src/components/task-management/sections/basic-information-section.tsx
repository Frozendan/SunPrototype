"use client";

import { useState } from "react";
import { Autocomplete, AutocompleteItem, Avatar, Button, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
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

  // State for tracking which field is being edited
  const [editingField, setEditingField] = useState<string | null>(null);

  // Handle assignee change with auto-update unit
  const handleAssigneeChange = (assigneeId: string | null) => {
    if (assigneeId) {
      // Handle special "assign to me" case
      if (assigneeId === "assign-to-me") {
        updateField("assigneeId", "current-user");
        const unitId = getUserUnitMapping("current-user");
        if (unitId) {
          updateField("unitId", unitId);
        }
      } else {
        updateField("assigneeId", assigneeId);
        // Auto-update unit based on assignee
        const unitId = getUserUnitMapping(assigneeId);
        if (unitId) {
          updateField("unitId", unitId);
        }
      }
    } else {
      updateField("assigneeId", "");
    }
    setEditingField(null);
  };

  // Handle "Assign to Me" button
  const handleAssignToMe = () => {
    handleAssigneeChange("current-user");
  };

  // Get display value for a field
  const getDisplayValue = (fieldKey: string, value: string) => {
    switch (fieldKey) {
      case 'unitId':
      case 'collaboratingUnitId':
        return mockUnits.find(unit => unit.id === value)?.name || 'Chưa chọn';
      case 'assigneeId':
        return mockAssignees.find(assignee => assignee.id === value)?.name || 'Chưa chọn';
      case 'assignmentReferenceId':
        return mockAssignmentReferences.find(ref => ref.id === value)?.name || 'Chưa chọn';
      default:
        return value || 'Chưa chọn';
    }
  };

  // Get assignee avatar
  const getAssigneeAvatar = (assigneeId: string) => {
    return mockAssignees.find(assignee => assignee.id === assigneeId)?.avatar;
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
    updateField(fieldKey as keyof TaskFormData, value as any);
    setEditingField(null);
  };

  return (
    <FormSection>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {/* Unit Field */}
        <div className="flex items-center">
          <label className="text-sm font-medium text-default-700">
            Đơn vị *
          </label>
        </div>
        <div className="relative">
          {editingField === 'unitId' ? (
            <Autocomplete
              placeholder="Chọn đơn vị"
              selectedKey={formData.unitId}
              onSelectionChange={(key) => handleFieldChange('unitId', key as string)}
              onBlur={handleFieldBlur}
              variant="bordered"
              size="sm"
              isRequired
              isInvalid={!!errors.unitId}
              errorMessage={errors.unitId}
              autoFocus
            >
              {mockUnits.map((unit) => (
                <AutocompleteItem key={unit.id}>
                  {unit.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          ) : (
            <motion.div
              className="min-h-[32px] px-3 py-2 rounded-lg hover:bg-default-100 cursor-pointer transition-colors flex items-center text-sm group"
              onClick={() => handleFieldClick('unitId')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className={formData.unitId ? "text-default-700" : "text-default-500"}>
                {getDisplayValue('unitId', formData.unitId)}
              </span>
              <Icon icon="solar:pen-bold" width={14} className="ml-auto text-default-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          )}
        </div>

        {/* Assignee Field */}
        <div className="flex items-center">
          <label className="text-sm font-medium text-default-700">
            Người được giao *
          </label>
        </div>
        <div className="relative">
          {editingField === 'assigneeId' ? (
            <Autocomplete
              placeholder="Chọn người được giao"
              selectedKey={formData.assigneeId}
              onSelectionChange={handleAssigneeChange}
              onBlur={handleFieldBlur}
              variant="bordered"
              size="sm"
              isRequired
              isInvalid={!!errors.assigneeId}
              errorMessage={errors.assigneeId}
              autoFocus
            >
              {/* Assign to Me Option */}
              <AutocompleteItem
                key="assign-to-me"
                startContent={<Icon icon="solar:user-linear" width={16} className="text-primary" />}
                className="text-primary font-medium"
              >
                Giao cho tôi
              </AutocompleteItem>

              {/* Divider - Using a custom section */}
              <AutocompleteItem key="divider-spacer" className="h-px p-0 m-0" isDisabled>
                <div className="w-full">
                  <Divider className="my-1" />
                </div>
              </AutocompleteItem>

              {/* Regular Assignees */}
              {mockAssignees.map((assignee) => (
                <AutocompleteItem
                  key={assignee.id}
                  startContent={<Avatar src={assignee.avatar} size="sm" />}
                >
                  {assignee.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          ) : (
            <motion.div
              className="min-h-[32px] px-3 py-2 rounded-lg hover:bg-default-100 cursor-pointer transition-colors flex items-center text-sm group"
              onClick={() => handleFieldClick('assigneeId')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-2">
                {formData.assigneeId && (
                  <Avatar src={getAssigneeAvatar(formData.assigneeId)} size="sm" />
                )}
                <span className={formData.assigneeId ? "text-default-700" : "text-default-500"}>
                  {getDisplayValue('assigneeId', formData.assigneeId)}
                </span>
              </div>
              <Icon icon="solar:pen-bold" width={14} className="ml-auto text-default-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          )}
        </div>

        {/* Collaborating Unit Field */}
        <div className="flex items-center">
          <label className="text-sm font-medium text-default-700">
            Đơn vị phối hợp
          </label>
        </div>
        <div className="relative">
          {editingField === 'collaboratingUnitId' ? (
            <Autocomplete
              placeholder="Chọn đơn vị phối hợp"
              selectedKey={formData.collaboratingUnitId}
              onSelectionChange={(key) => handleFieldChange('collaboratingUnitId', key as string)}
              onBlur={handleFieldBlur}
              variant="bordered"
              size="sm"
              autoFocus
            >
              {mockUnits.map((unit) => (
                <AutocompleteItem key={unit.id}>
                  {unit.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          ) : (
            <motion.div
              className="min-h-[32px] px-3 py-2 rounded-lg hover:bg-default-100 cursor-pointer transition-colors flex items-center text-sm group"
              onClick={() => handleFieldClick('collaboratingUnitId')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className={formData.collaboratingUnitId ? "text-default-700" : "text-default-500"}>
                {getDisplayValue('collaboratingUnitId', formData.collaboratingUnitId)}
              </span>
              <Icon icon="solar:pen-bold" width={14} className="ml-auto text-default-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          )}
        </div>

        {/* Assignment Reference Field */}
        <div className="flex items-center">
          <label className="text-sm font-medium text-default-700">
            Căn cứ giao việc
          </label>
        </div>
        <div className="relative">
          {editingField === 'assignmentReferenceId' ? (
            <Autocomplete
              placeholder="Chọn căn cứ giao việc"
              selectedKey={formData.assignmentReferenceId}
              onSelectionChange={(key) => handleFieldChange('assignmentReferenceId', key as string)}
              onBlur={handleFieldBlur}
              variant="bordered"
              size="sm"
              autoFocus
            >
              {mockAssignmentReferences.map((ref) => (
                <AutocompleteItem key={ref.id}>
                  {ref.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          ) : (
            <motion.div
              className="min-h-[32px] px-3 py-2 rounded-lg hover:bg-default-100 cursor-pointer transition-colors flex items-center text-sm group"
              onClick={() => handleFieldClick('assignmentReferenceId')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className={formData.assignmentReferenceId ? "text-default-700" : "text-default-500"}>
                {getDisplayValue('assignmentReferenceId', formData.assignmentReferenceId)}
              </span>
              <Icon icon="solar:pen-bold" width={14} className="ml-auto text-default-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          )}
        </div>
      </div>
    </FormSection>
  );
}
