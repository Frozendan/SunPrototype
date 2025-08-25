"use client";

import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TaskBreadcrumbProps {
  parentTaskId: string;
  currentTaskId: string;
}

export function TaskBreadcrumb({ parentTaskId, currentTaskId }: TaskBreadcrumbProps) {
  const navigate = useNavigate();

  const handleParentClick = () => {
    navigate(`/task-management/task/${parentTaskId}`);
  };

  const handleHomeClick = () => {
    navigate('/task-management');
  };

  return (
    <div className=" px-1">
      <Breadcrumbs
        size="sm"
        variant="solid"
        radius="full"
        className="text-default-600"
        itemClasses={{
          item: "text-default-600 hover:text-primary-600",
          separator: "text-default-400"
        }}
      >
        <BreadcrumbItem
          onPress={handleHomeClick}
          className="cursor-pointer"
        >
          Quản lý công việc
        </BreadcrumbItem>

        <BreadcrumbItem
          onPress={handleParentClick}
          className="cursor-pointer"
        >
          {parentTaskId}
        </BreadcrumbItem>

        <BreadcrumbItem>
          <span className="font-medium text-default-900">
            {currentTaskId}
          </span>
        </BreadcrumbItem>
      </Breadcrumbs>
    </div>
  );
}
