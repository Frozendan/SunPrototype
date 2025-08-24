"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n-context";

interface CreateTaskHeaderProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  title?: string;
  description?: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function CreateTaskHeader({ 
  onCancel, 
  onSubmit, 
  isSubmitting,
  title,
  description
}: CreateTaskHeaderProps) {
  const { t } = useTranslation();

  return (
    <motion.div 
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-20 bg-content1 rounded-t-xl backdrop-blur-md border-b border-divider px-3 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            variant="light"
            onPress={onCancel}
            aria-label="Go back"
          >
            <Icon icon="solar:arrow-left-linear" width={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {title || t("navigation.taskManagement.createTask")}
            </h1>
            <p className="text-default-500">
              {description || "Create a new task and assign it to team members"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="light" onPress={onCancel}>
            {t("common.cancel")}
          </Button>
          <Button
            color="primary"
            onPress={onSubmit}
            isLoading={isSubmitting}
            startContent={!isSubmitting && <Icon icon="solar:add-circle-outline" width={18} />}
          >
            {t("common.create")}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
