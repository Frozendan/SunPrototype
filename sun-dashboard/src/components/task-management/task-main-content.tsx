"use client";

import { Card, CardBody, Textarea } from "@heroui/react";
import { motion } from "framer-motion";
import { EditableTitle } from "@/components/ui/editable-title";
import { useTranslation } from "@/lib/i18n-context";
import type { TaskFormData, TaskFormErrors, UpdateFieldFunction } from "@/types/task-form";

interface TaskMainContentProps {
  formData: TaskFormData;
  errors: TaskFormErrors;
  updateField: UpdateFieldFunction;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function TaskMainContent({ formData, errors, updateField }: TaskMainContentProps) {
  const { t } = useTranslation();

  return (
    <motion.div variants={itemVariants} className="h-full pb-3 lg:col-span-2">
      <Card className="flex flex-col">
        <CardBody className="space-y-6 overflow-y-auto flex-1" role="region" aria-labelledby="task-details-heading">
          {/* Editable Title */}
          <div className="space-y-2">
            <EditableTitle
              value={formData.title}
              onChange={(value) => updateField("title", value)}
              placeholder="Enter task title"
              isInvalid={!!errors.title}
              errorMessage={errors.title}
            />
          </div>

          {/* Description */}
          <Textarea
            label={t("navigation.taskManagement.taskDescription")}
            placeholder="Describe what needs to be done..."
            value={formData.description}
            onValueChange={(value) => updateField("description", value)}
            minRows={6}
            variant="bordered"
            aria-label="Task description"
          />
        </CardBody>
      </Card>
    </motion.div>
  );
}
