"use client";

import { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import type { NotificationDropdownProps } from "./types";

export default function NotificationDropdown({ className }: NotificationDropdownProps) {
  const [unreadCount] = useState(3);

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="light"
          className="relative"
          aria-label="Notifications"
        >
          <Badge
            color="danger"
            content={unreadCount > 0 ? unreadCount : ""}
            isInvisible={unreadCount === 0}
            shape="circle"
          >
            <Icon
              icon="solar:bell-linear"
              className="text-default-500 text-xl"
            />
          </Badge>
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Notifications" variant="flat">
        <DropdownItem key="header" className="h-14 gap-2">
          <div className="flex flex-col">
            <p className="font-semibold">Notifications</p>
            <p className="text-small text-default-500">{unreadCount} unread</p>
          </div>
        </DropdownItem>
        <DropdownItem key="notification1">
          Tony Reichert requested to join your organization
        </DropdownItem>
        <DropdownItem key="notification2">
          Ben Berman modified the Brand logo file
        </DropdownItem>
        <DropdownItem key="notification3">
          Jane Doe liked your post
        </DropdownItem>
        <DropdownItem key="viewall" color="primary">
          View All Notifications
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}


