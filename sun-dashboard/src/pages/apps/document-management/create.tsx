"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Button,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import DashboardLayout from "@/layouts/dashboard/dashboard-layout";

export default function CreateDocumentPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/task-management/dashboard");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <DashboardLayout>
      <motion.div
        className="h-full px-3 pt-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                isIconOnly
                variant="light"
                onPress={handleGoBack}
                aria-label="Go back"
              >
                <Icon icon="solar:arrow-left-linear" width={20} />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Create Document
                </h1>
                <p className="text-default-500">
                  Create and manage documents within your task management workspace
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Icon
                  icon="solar:document-add-bold"
                  width={32}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
              <h2 className="text-xl font-semibold">Document Management</h2>
            </div>
          </CardHeader>
          <CardBody className="text-center space-y-4">
            <p className="text-default-600">
              The document management feature is currently under development.
              This will allow you to create, organize, and manage documents within your task management workspace.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold text-default-800">Coming Features:</h3>
              <ul className="text-left space-y-1 text-default-600 max-w-md mx-auto">
                <li className="flex items-center gap-2">
                  <Icon icon="solar:check-circle-linear" width={16} className="text-green-500" />
                  Rich text document editor
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="solar:check-circle-linear" width={16} className="text-green-500" />
                  Document templates
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="solar:check-circle-linear" width={16} className="text-green-500" />
                  Collaborative editing
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="solar:check-circle-linear" width={16} className="text-green-500" />
                  Version control
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="solar:check-circle-linear" width={16} className="text-green-500" />
                  Document sharing and permissions
                </li>
              </ul>
            </div>
            <div className="pt-4">
              <Button
                color="primary"
                onPress={handleGoBack}
                startContent={<Icon icon="solar:arrow-left-linear" width={18} />}
              >
                Back to Task Management
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
