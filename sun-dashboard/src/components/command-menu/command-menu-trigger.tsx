"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button, Kbd } from "@heroui/react";
import { isAppleDevice } from "@react-aria/utils";
import { Icon } from "@iconify/react";

import { useTranslation } from "@/lib/i18n-context";
import CommandMenu from "./command-menu";

export default function CommandMenuTrigger() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [commandKey, setCommandKey] = useState<"ctrl" | "command">("command");

  useEffect(() => {
    setCommandKey(isAppleDevice() ? "command" : "ctrl");
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Toggle the menu when ⌘K / CTRL K is pressed
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const hotkey = isAppleDevice() ? "metaKey" : "ctrlKey";

      if (e?.key?.toLowerCase() === "k" && e[hotkey]) {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          onOpen();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onOpen, onClose]);

  const handleOpenCmdk = useCallback(() => {
    onOpen();
  }, [onOpen]);

  return (
    <>
      <Button
        className="bg-default-100 justify-start text-default-500 font-normal h-10 px-3 w-full max-w-sm"
        variant="flat"
        onPress={handleOpenCmdk}
      >
        <Icon className="text-base text-default-400 flex-shrink-0" icon="solar:magnifer-linear" />
        <span className="flex-1 text-left">{t('commandMenu.placeholder')}</span>
        <Kbd className="hidden lg:inline-block" keys={[commandKey]}>
          K
        </Kbd>
      </Button>
      <CommandMenu isOpen={isOpen} onClose={onClose} />
    </>
  );
}
