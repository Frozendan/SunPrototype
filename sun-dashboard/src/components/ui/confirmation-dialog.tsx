"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n-context";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  icon?: string;
  iconColor?: string;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  isDangerous = false,
  isLoading = false,
  icon,
  iconColor
}: ConfirmationDialogProps) {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm();
  };

  const defaultIcon = isDangerous ? "solar:danger-triangle-bold" : "solar:question-circle-bold";
  const defaultIconColor = isDangerous ? "text-danger" : "text-warning";

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      placement="center"
      backdrop="blur"
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isDangerous ? 'bg-danger-100 dark:bg-danger-900/30' : 'bg-success-100 dark:bg-warning-900/30'}`}>
                  <Icon 
                    icon={icon || defaultIcon} 
                    width={24} 
                    className={iconColor || defaultIconColor}
                  />
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
              </div>
            </ModalHeader>
            <ModalBody>
              <p className="text-default-600">{message}</p>
            </ModalBody>
            <ModalFooter>
              <Button 
                variant="light" 
                onPress={onClose}
                isDisabled={isLoading}
              >
                {cancelText || t("common.cancel")}
              </Button>
              <Button 
                color={isDangerous ? "danger" : "primary"}
                onPress={handleConfirm}
                isLoading={isLoading}
                startContent={!isLoading && isDangerous && <Icon icon="solar:trash-bin-minimalistic-bold" width={16} />}
              >
                {confirmText || t("common.confirm")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

/**
 * Hook for managing confirmation dialogs
 */
export function useConfirmationDialog() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const confirm = (
    title: string,
    message: string,
    options?: {
      confirmText?: string;
      cancelText?: string;
      isDangerous?: boolean;
      icon?: string;
      iconColor?: string;
    }
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const handleConfirm = () => {
        onClose();
        resolve(true);
      };

      const handleCancel = () => {
        onClose();
        resolve(false);
      };

      // This would need to be implemented with a state management solution
      // or by rendering the dialog in a portal. For now, this is a simplified version.
      onOpen();
    });
  };

  return {
    isOpen,
    onClose,
    confirm,
    ConfirmationDialog: (props: Omit<ConfirmationDialogProps, 'isOpen' | 'onClose'>) => (
      <ConfirmationDialog
        {...props}
        isOpen={isOpen}
        onClose={onClose}
      />
    )
  };
}

/**
 * Draft restoration dialog component
 */
interface DraftRestoreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: () => void;
  onDiscard: () => void;
  draftAge?: number;
  isLoading?: boolean;
}

export function DraftRestoreDialog({
  isOpen,
  onClose,
  onRestore,
  onDiscard,
  draftAge,
  isLoading = false
}: DraftRestoreDialogProps) {
  const { t } = useTranslation();

  const formatDraftAge = (minutes: number | undefined): string => {
    if (!minutes) return '';
    
    if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(minutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      placement="center"
      backdrop="blur"
      isDismissable={!isLoading}
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Icon 
                    icon="solar:diskette-bold" 
                    width={24} 
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t("navigation.taskManagement.actionBar.draftLoaded")}</h3>
                  {draftAge && (
                    <p className="text-sm text-default-500">
                      Last saved {formatDraftAge(draftAge)}
                    </p>
                  )}
                </div>
              </div>
            </ModalHeader>
            <ModalBody>
              <p className="text-default-600">
                We found a saved draft of your task. Would you like to restore it or start fresh?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button 
                variant="light" 
                onPress={onDiscard}
                isDisabled={isLoading}
                startContent={<Icon icon="solar:trash-bin-minimalistic-bold" width={16} />}
              >
                Start Fresh
              </Button>
              <Button 
                color="primary"
                onPress={onRestore}
                isLoading={isLoading}
                startContent={!isLoading && <Icon icon="solar:refresh-bold" width={16} />}
              >
                Restore Draft
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

/**
 * Import confirmation dialog component
 */
interface ImportConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  importCount: number;
  hasExistingData: boolean;
  isLoading?: boolean;
}

export function ImportConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  importCount,
  hasExistingData,
  isLoading = false
}: ImportConfirmDialogProps) {
  const { t } = useTranslation();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      placement="center"
      backdrop="blur"
      isDismissable={!isLoading}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Icon 
                    icon="solar:import-bold" 
                    width={24} 
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <h3 className="text-lg font-semibold">Confirm Import</h3>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-3">
                <p className="text-default-600">
                  Ready to import {importCount} task{importCount > 1 ? 's' : ''}.
                </p>
                {hasExistingData && (
                  <div className="p-3 rounded-lg bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800">
                    <div className="flex items-start gap-2">
                      <Icon icon="solar:danger-triangle-bold" width={16} className="text-warning-600 mt-0.5" />
                      <p className="text-sm text-warning-700 dark:text-warning-300">
                        {t("navigation.taskManagement.actionBar.confirmImport")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button 
                variant="light" 
                onPress={onClose}
                isDisabled={isLoading}
              >
                {t("common.cancel")}
              </Button>
              <Button 
                color="primary"
                onPress={onConfirm}
                isLoading={isLoading}
                startContent={!isLoading && <Icon icon="solar:import-bold" width={16} />}
              >
                Import Tasks
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
