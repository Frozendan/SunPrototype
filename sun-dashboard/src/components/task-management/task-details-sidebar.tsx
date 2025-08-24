"use client";

import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { BasicInformationSection } from "./sections/basic-information-section";
import { PrioritySection } from "./sections/priority-section";
import { DateSection } from "./sections/date-section";
import { RecurringTaskSection } from "./sections/recurring-task-section";
import type { TaskFormData, TaskFormErrors, UpdateFieldFunction, MockUnit, MockAssignee, MockAssignmentReference } from "@/types/task-form";

interface TaskDetailsSidebarProps {
  formData: TaskFormData;
  errors: TaskFormErrors;
  updateField: UpdateFieldFunction;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  mockUnits: MockUnit[];
  mockAssignees: MockAssignee[];
  mockAssignmentReferences: MockAssignmentReference[];
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
  mockAssignmentReferences
}: TaskDetailsSidebarProps) {
  return (
    <motion.div variants={itemVariants} className="h-full">
      <Card className="flex flex-col">
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
                  <BasicInformationSection
                    formData={formData}
                    errors={errors}
                    updateField={updateField}
                    mockUnits={mockUnits}
                    mockAssignees={mockAssignees}
                    mockAssignmentReferences={mockAssignmentReferences}
                  />

                  <PrioritySection
                    formData={formData}
                    updateField={updateField}
                  />

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
              </CardBody>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
