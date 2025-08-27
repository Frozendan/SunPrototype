"use client";

import { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "@/lib/i18n-context";

interface RequestTimeOffHeaderProps {
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

export function RequestTimeOffHeader({
  onCancel,
  onSubmit,
  isSubmitting,
  title,
  description,
}: RequestTimeOffHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/time-management/dashboard');
    onCancel();
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-20 bg-content1 rounded-t-xl backdrop-blur-md border-b border-divider px-3 py-4"
    >
      <div className="flex items-center justify-between">
        {/* Left side - Back button and title */}
        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            variant="light"
            radius="full"
            onPress={handleCancel}
            aria-label={t("common.cancel")}
          >
            <Icon icon="solar:arrow-left-linear" width={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {title || t("timeOff.pageTitle")}
            </h1>
            <p className="text-default-500">
              {description || t("timeOff.pageDescription")}
            </p>
          </div>
        </div>

        {/* Right side - Action bar */}
        <div className="flex items-center bg-content2 p-2 rounded-full gap-2">
          {/* Desktop: Show all actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Cancel Action */}
            <Button variant="light" radius="full" onPress={handleCancel}>
              {t("common.cancel")}
            </Button>

            {/* Submit Action - Primary action */}
            <Button
              color="primary"
              radius="full"
              onPress={onSubmit}
              isLoading={isSubmitting}
              startContent={!isSubmitting && <Icon icon="solar:calendar-mark-bold" width={18} />}
            >
              {t("timeOff.submitRequest")}
            </Button>
          </div>

          {/* Mobile: Compact actions */}
          <div className="flex lg:hidden items-center gap-2">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  isIconOnly
                  variant="light"
                  radius="full"
                  aria-label="More actions"
                >
                  <Icon icon="solar:menu-dots-bold" width={20} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Actions">
                <DropdownSection title="Actions">
                  <DropdownItem
                    key="cancel"
                    className="h-12"
                    startContent={
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/30">
                        <Icon icon="solar:close-circle-bold" className="text-rose-600 dark:text-rose-300" width={16} />
                      </div>
                    }
                    onPress={handleCancel}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{t("common.cancel")}</span>
                      <span className="text-xs text-default-500">{t("timeOff.discardChanges")}</span>
                    </div>
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
            <Button
              color="primary"
              radius="full"
              onPress={onSubmit}
              isLoading={isSubmitting}
              startContent={!isSubmitting && <Icon icon="solar:calendar-mark-bold" width={18} />}
            >
              {t("timeOff.submitRequest")}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
