"use client";

import { Card, CardBody, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ParentTaskInfoProps {
  parentTaskId: string;
  parentTaskTitle: string;
}

export function ParentTaskInfo({ parentTaskId, parentTaskTitle }: ParentTaskInfoProps) {
  const navigate = useNavigate();

  const handleNavigateToParent = () => {
    navigate(`/task-management/task/${parentTaskId}`);
  };

  const handleBackToParent = () => {
    navigate(`/task-management/task/${parentTaskId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <Card className="bg-blue-50 border-blue-200 border">
        <CardBody className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 p-2 rounded-lg bg-blue-100">
                <Icon 
                  icon="solar:hierarchy-square-3-bold" 
                  width={20} 
                  className="text-blue-600"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                  Công việc con của
                </p>
                <h3 className="text-sm font-semibold text-blue-900 truncate">
                  {parentTaskTitle}
                </h3>
                <p className="text-xs text-blue-700 mt-1">
                  ID: {parentTaskId}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="flat"
                color="primary"
                startContent={<ArrowLeft size={16} />}
                onPress={handleBackToParent}
                className="h-8"
              >
                Quay lại
              </Button>
              <Button
                size="sm"
                variant="bordered"
                color="primary"
                startContent={<ExternalLink size={16} />}
                onPress={handleNavigateToParent}
                className="h-8"
              >
                Xem chi tiết
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
