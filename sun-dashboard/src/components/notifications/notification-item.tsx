"use client";

import React from "react";
import { Avatar, Badge, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

import { useTranslation } from "@/lib/i18n-context";
import type { NotificationItemProps, NotificationType } from "./types";

const NotificationItem = React.forwardRef<HTMLDivElement, NotificationItemProps>(
  ({ notification, onMarkAsRead, onAction, className, ...props }, ref) => {
    const { t } = useTranslation();
    const { id, avatar, name, description, type, time, isRead } = notification;

    /**
     * Defines the content for different types of notifications.
     */
    const contentByType: Record<NotificationType, React.ReactNode> = {
      default: null,
      request: (
        <div className="flex gap-2 pt-2">
          <Button 
            color="primary" 
            size="sm"
            onPress={() => onAction?.(id, 'accept')}
          >
            {t('components.notifications.actions.accept' as any)}
          </Button>
          <Button 
            size="sm" 
            variant="flat"
            onPress={() => onAction?.(id, 'decline')}
          >
            {t('components.notifications.actions.decline' as any)}
          </Button>
        </div>
      ),
      file: (
        <div className="flex items-center gap-2 pt-2">
          <Icon className="text-secondary" icon="solar:figma-file-linear" width={30} />
          <div className="flex flex-col">
            <strong className="text-small font-medium">Brand_Logo_v1.2.fig</strong>
            <p className="text-tiny text-default-400">3.4 MB</p>
          </div>
        </div>
      ),
    };

    const handleClick = () => {
      if (!isRead && onMarkAsRead) {
        onMarkAsRead(id);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "border-divider flex gap-3 border-b px-4 py-3 cursor-pointer hover:bg-default-50 transition-colors",
          {
            "bg-primary-50/50": !isRead,
          },
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        <div className="relative flex-none">
          <Badge
            color="primary"
            content=""
            isInvisible={isRead}
            placement="bottom-right"
            shape="circle"
          >
            <Avatar src={avatar} size="sm" />
          </Badge>
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <p className="text-small text-foreground">
            <strong className="font-medium">{name}</strong> {description}
          </p>
          <time className="text-tiny text-default-400">{time}</time>
          {type && contentByType[type]}
        </div>
      </div>
    );
  },
);

NotificationItem.displayName = "NotificationItem";

export default NotificationItem;
