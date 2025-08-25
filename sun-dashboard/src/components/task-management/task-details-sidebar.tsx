"use client";

import { useState } from "react";
import {Card, CardHeader, CardBody, Button, CardFooter} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { GeneralInformationSection } from "./sections/general-information-section";
import { BasicInformationSection } from "./sections/basic-information-section";
import { PrioritySection } from "./sections/priority-section";
import { DateSection } from "./sections/date-section";
import { RecurringTaskSection } from "./sections/recurring-task-section";
import { useTranslation } from "@/lib/i18n-context";
import type { TaskFormData, TaskFormErrors, UpdateFieldFunction, MockUnit, MockAssignee, MockAssignmentReference, MockFunctionalGroup, MockTopic, MockTaskType } from "@/types/task-form";

interface TaskDetailsSidebarProps {
  formData: TaskFormData;
  errors: TaskFormErrors;
  updateField: UpdateFieldFunction;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  mockUnits: MockUnit[];
  mockAssignees: MockAssignee[];
  mockAssignmentReferences: MockAssignmentReference[];
  mockFunctionalGroups: MockFunctionalGroup[];
  mockTopics: MockTopic[];
  mockTaskTypes: MockTaskType[];
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function TaskDetailsSidebar({
  formData,
  errors,
  updateField,
  isExpanded,
  onToggleExpanded,
  mockUnits,
  mockAssignees,
  mockAssignmentReferences,
  mockFunctionalGroups,
  mockTopics,
  mockTaskTypes
}: TaskDetailsSidebarProps) {
  const { t } = useTranslation();

  // Separate state for General Information card
  const [isGeneralInfoExpanded, setIsGeneralInfoExpanded] = useState(true);

  // Check if general information section is active
  const isGeneralInfoActive = formData.functionalGroupId || formData.topicId || formData.taskTypeId;

  // Handle adding general information
  const handleAddGeneralInfo = () => {
    updateField("functionalGroupId", "1"); // Set default functional group to trigger section
  };

  // Handle removing general information
  const handleRemoveGeneralInfo = () => {
    updateField("functionalGroupId", "");
    updateField("topicId", "");
    updateField("taskTypeId", "");
  };

  // Handle toggling General Information card
  const handleToggleGeneralInfo = () => {
    setIsGeneralInfoExpanded(!isGeneralInfoExpanded);
  };
  return (
    <motion.div variants={itemVariants} className="h-full">
      {/* Add General Information Button - Only show when section is not active */}
      {!isGeneralInfoActive && (
        <div className="mb-3 flex justify-end">
          <Button
            variant="flat"
            size="sm"
            startContent={<Icon icon="solar:add-circle-bold" width={16} />}
            onPress={handleAddGeneralInfo}
            className="text-default-500 hover:text-primary"
          >
            {t("navigation.taskManagement.sections.generalInformation")}
          </Button>
        </div>
      )}

      {/* General Information Card - Separate collapsible card */}
      {isGeneralInfoActive && (
        <Card className="rounded-2xl flex flex-col mb-3">
          <CardHeader
            onClick={handleToggleGeneralInfo}
            className="flex cursor-pointer items-center justify-between p-4 border-b border-divider flex-shrink-0"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-foreground">{t("navigation.taskManagement.sections.generalInformation")}</h2>
            </div>
            <Icon
              icon={isGeneralInfoExpanded ? "solar:alt-arrow-down-linear" : "solar:alt-arrow-right-linear"}
              width={18}
            />
          </CardHeader>

          <AnimatePresence>
            {isGeneralInfoExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="overflow-hidden"
              >
                <CardBody className="p-4">
                  <GeneralInformationSection
                    formData={formData}
                    errors={errors}
                    updateField={updateField}
                    mockFunctionalGroups={mockFunctionalGroups}
                    mockTopics={mockTopics}
                    mockTaskTypes={mockTaskTypes}
                  />

                </CardBody>
                  <CardFooter>
                      <Button
                          variant="light"
                          size="sm"
                          startContent={<Icon icon="solar:trash-bin-minimalistic-bold" width={16} />}
                          onPress={handleRemoveGeneralInfo}
                          className="text-danger ml-auto hover:bg-danger-50 dark:hover:bg-danger-950"
                      >
                          {t("navigation.taskManagement.sections.removeGeneralInformation")}
                      </Button>
                  </CardFooter>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      )}

      <Card className="rounded-2xl flex flex-col">
        <CardHeader onClick={onToggleExpanded} className="flex cursor-pointer items-center justify-between p-4 border-b border-divider flex-shrink-0">
          <h2 className="text-lg font-semibold text-foreground">Chi tiết công việc</h2>
            <Icon
                icon={isExpanded ? "solar:alt-arrow-down-linear" : "solar:alt-arrow-right-linear"}
                width={18}
            />
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="overflow-hidden"
            >
              <CardBody className="p-4">
                <div className="space-y-6">
                  {/* Basic Information Group */}
                  <div className="rounded-2xl bg-default-50 dark:bg-default-100 p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <Icon className="text-blue-600 dark:text-blue-300" icon="solar:users-group-rounded-bold" width={16} />
                      </div>
                      <h3 className="text-sm font-semibold text-default-700 dark:text-default-300">{t("navigation.taskManagement.sections.basicInformation")}</h3>
                    </div>
                    <BasicInformationSection
                      formData={formData}
                      errors={errors}
                      updateField={updateField}
                      mockUnits={mockUnits}
                      mockAssignees={mockAssignees}
                      mockAssignmentReferences={mockAssignmentReferences}
                    />
                  </div>

                  {/* Priority Group */}
                  <div className="rounded-2xl bg-default-50 dark:bg-default-100 p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                        <Icon className="text-amber-600 dark:text-amber-300" icon="solar:star-bold" width={16} />
                      </div>
                      <h3 className="text-sm font-semibold text-default-700 dark:text-default-300">{t("navigation.taskManagement.sections.priorityImportance")}</h3>
                    </div>
                    <PrioritySection
                      formData={formData}
                      updateField={updateField}
                    />
                  </div>

                  {/* Date & Recurring Group */}
                  <div className="rounded-2xl bg-default-50 dark:bg-default-100 p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                        <Icon className="text-emerald-600 dark:text-emerald-300" icon="solar:calendar-bold" width={16} />
                      </div>
                      <h3 className="text-sm font-semibold text-default-700 dark:text-default-300">{t("navigation.taskManagement.sections.scheduleTiming")}</h3>
                    </div>
                    <div className="space-y-6">
                      <DateSection
                        formData={formData}
                        errors={errors}
                        updateField={updateField}
                      />

                      <RecurringTaskSection
                        formData={formData}
                        errors={errors}
                        updateField={updateField}
                      />
                    </div>
                  </div>
                </div>
              </CardBody>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
