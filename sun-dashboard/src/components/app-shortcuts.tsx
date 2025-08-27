"use client";
import { Card, CardBody, CardHeader, Button, Tooltip } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "@/lib/i18n-context";
import type { AppType } from "@/layouts/dashboard/types";

interface AppShortcut {
  id: AppType;
  name: string;
  fullName: string;
  icon: string;
  iconColor: string;
  route: string;
  bgColor: string;
  darkBgColor: string;
}

export default function AppShortcuts() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const apps: AppShortcut[] = [
    {
      id: "news",
      name: t("apps.news.shortName"),
      fullName: t("apps.news.name"),
      icon: "solar:document-text-bold",
      iconColor: "text-blue-500",
      route: "/news/dashboard",
      bgColor: "bg-blue-100",
      darkBgColor: "dark:bg-blue-900/40",
    },
    {
      id: "taskManagement",
      name: t("apps.taskManagement.shortName"),
      fullName: t("apps.taskManagement.name"),
      icon: "solar:checklist-minimalistic-bold",
      iconColor: "text-green-500",
      route: "/task-management/dashboard",
      bgColor: "bg-green-100",
      darkBgColor: "dark:bg-green-900/40",
    },
    {
      id: "timeManagement",
      name: t("apps.timeManagement.shortName"),
      fullName: t("apps.timeManagement.name"),
      icon: "solar:clock-circle-bold",
      iconColor: "text-purple-500",
      route: "/time-management/dashboard",
      bgColor: "bg-purple-100",
      darkBgColor: "dark:bg-purple-900/40",
    },
  ];

  const handleAppClick = (route: string) => {
    navigate(route);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Icon
            icon="solar:widget-4-bold"
            className="text-orange-500"
            width={24}
          />
          <h3 className="text-lg font-semibold">{t("dashboard.appShortcuts")}</h3>
        </div>
      </CardHeader>
      <CardBody>
        <motion.div
          className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-4 justify-items-start"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {apps.map((app) => (
            <motion.div
              key={app.id}
              variants={itemVariants}
              className="w-20 h-20"
            >
              <Tooltip content={app.fullName} placement="bottom" delay={500}>
                <Button
                  className="w-full h-full p-2 flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform duration-200 bg-transparent hover:bg-default-100 dark:hover:bg-default-800/50"
                  variant="light"
                  onPress={() => handleAppClick(app.route)}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${app.bgColor} ${app.darkBgColor} shadow-sm flex-shrink-0`}>
                    <Icon
                      icon={app.icon}
                      className={app.iconColor}
                      width={16}
                    />
                  </div>
                  <span className="text-xs font-medium text-foreground text-center leading-tight w-full truncate px-1">
                    {app.name}
                  </span>
                </Button>
              </Tooltip>
            </motion.div>
          ))}
        </motion.div>
      </CardBody>
    </Card>
  );
}
