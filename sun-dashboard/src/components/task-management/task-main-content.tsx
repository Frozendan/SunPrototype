"use client";

import {Card, CardBody, Divider, Spacer} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { EditableTitle } from "@/components/ui/editable-title";
import { EditableTextArea } from "@/components/ui/editable-textarea";
import { TagInput } from "@/components/ui/tag-input";
import { FileUpload } from "@/components/ui/file-upload";
import { SubtasksSection } from "./sections/subtasks-section";
import { useTranslation } from "@/lib/i18n-context";
import type { TaskFormData, TaskFormErrors, UpdateFieldFunction, MockUnit, MockAssignee, MockAssignmentReference, MockFunctionalGroup, MockTopic, MockTaskType } from "@/types/task-form";

interface TaskMainContentProps {
  formData: TaskFormData;
  errors: TaskFormErrors;
  updateField: UpdateFieldFunction;
  // Optional props for task details view
  taskId?: string;
  showSubtasks?: boolean;
  mockUnits?: MockUnit[];
  mockAssignees?: MockAssignee[];
  mockAssignmentReferences?: MockAssignmentReference[];
  mockFunctionalGroups?: MockFunctionalGroup[];
  mockTopics?: MockTopic[];
  mockTaskTypes?: MockTaskType[];
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function TaskMainContent({
  formData,
  errors,
  updateField,
  taskId,
  showSubtasks = false,
  mockUnits = [],
  mockAssignees = [],
  mockAssignmentReferences = [],
  mockFunctionalGroups = [],
  mockTopics = [],
  mockTaskTypes = []
}: TaskMainContentProps) {
  const { t } = useTranslation();

  return (
    <motion.div variants={itemVariants} className="h-full pb-3 lg:col-span-2">
      <Card className="shadow-none flex flex-col">
        <CardBody className="overflow-y-auto flex-1" role="region" aria-labelledby="task-details-heading">
          {/* Editable Title */}
          <EditableTitle
            value={formData.title}
            onChange={(value) => updateField("title", value)}
            placeholder={t("navigation.taskManagement.enterTaskTitle")}
            isInvalid={!!errors.title}
            errorMessage={errors.title}
          />
          <Spacer y={2} />

          {/* Tags */}
          <div className="space-y-2">
            <TagInput
              selectedTagIds={formData.labelIds}
              onChange={(tagIds) => updateField("labelIds", tagIds)}
              isInvalid={!!errors.labelIds}
              errorMessage={errors.labelIds}
              onTagCreate={(tag) => {
                console.log('New tag created:', tag);
              }}
            />
          </div>
          <Spacer y={6} />

          {/* Description */}
          <EditableTextArea
            label={t("navigation.taskManagement.taskDescription")}
            value={formData.description}
            onChange={(value) => updateField("description", value)}
            placeholder={t("navigation.taskManagement.describeTask")}
            isInvalid={!!errors.description}
            errorMessage={errors.description}
            minRows={8}
          />

          <Spacer y={3} />

          {/* Expected Results */}
          <EditableTextArea
            label={t("navigation.taskManagement.expectedResults")}
            value={formData.expectedResults}
            onChange={(value) => updateField("expectedResults", value)}
            placeholder={t("navigation.taskManagement.describeExpectedResults")}
            isInvalid={!!errors.expectedResults}
            errorMessage={errors.expectedResults}
            minRows={6}
          />

          <Spacer y={3} />
          <Divider />
          <Spacer y={3} />

          {/* Subtasks - Only show in task detail view */}
          {showSubtasks && taskId && (
            <>
              <SubtasksSection
                parentTaskId={taskId}
                formData={formData}
                errors={errors}
                updateField={updateField}
                mockUnits={mockUnits}
                mockAssignees={mockAssignees}
                mockAssignmentReferences={mockAssignmentReferences}
                mockFunctionalGroups={mockFunctionalGroups}
                mockTopics={mockTopics}
                mockTaskTypes={mockTaskTypes}
              />
              <Spacer y={3} />
              <Divider />
              <Spacer y={3} />
            </>
          )}

          {/* Attachments */}
          <FileUpload
            files={formData.attachments}
            onChange={(files) => updateField("attachments", files)}
            isInvalid={!!errors.attachments}
            errorMessage={errors.attachments}
          />
        </CardBody>
      </Card>
    </motion.div>
  );
}
