"use client";

import React from "react";
import { Card, CardBody, CardHeader, Avatar, Skeleton, Chip, ScrollShadow } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import { useTranslation } from "@/lib/i18n-context";
import type { CelebrationsCardProps, Celebration } from "@/types/dashboard";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const getCelebrationIcon = (type: Celebration['type']) => {
  switch (type) {
    case 'birthday':
      return 'solar:cake-bold';
    case 'anniversary':
      return 'solar:medal-star-bold';
    case 'achievement':
      return 'solar:cup-star-bold';
    default:
      return 'solar:star-bold';
  }
};

const getCelebrationColor = (type: Celebration['type']) => {
  switch (type) {
    case 'birthday':
      return 'text-pink-500';
    case 'anniversary':
      return 'text-blue-500';
    case 'achievement':
      return 'text-yellow-500';
    default:
      return 'text-default-500';
  }
};

const getCelebrationBgColor = (type: Celebration['type']) => {
  switch (type) {
    case 'birthday':
      return 'bg-pink-100 dark:bg-pink-900/40';
    case 'anniversary':
      return 'bg-blue-100 dark:bg-blue-900/40';
    case 'achievement':
      return 'bg-yellow-100 dark:bg-yellow-900/40';
    default:
      return 'bg-default-100';
  }
};

export default function CelebrationsCard({ 
  data, 
  state,
  className 
}: CelebrationsCardProps) {
  const { t } = useTranslation();

  const isToday = (dateString: string) => {
    const today = new Date();
    const celebrationDate = new Date(dateString);
    return today.toDateString() === celebrationDate.toDateString();
  };

  const isThisWeek = (dateString: string) => {
    const today = new Date();
    const celebrationDate = new Date(dateString);
    const diffTime = celebrationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (state.isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="w-32 h-6 rounded" />
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 border border-default-200 rounded-lg">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-3/4 h-4 rounded" />
                <Skeleton className="w-1/2 h-3 rounded" />
              </div>
              <Skeleton className="w-16 h-6 rounded-full" />
            </div>
          ))}
        </CardBody>
      </Card>
    );
  }

  if (state.error) {
    return (
      <Card className={`w-full ${className}`}>
        <CardBody className="flex items-center justify-center py-8">
          <div className="text-center space-y-3">
            <Icon 
              icon="solar:danger-circle-bold" 
              className="text-danger text-4xl mx-auto" 
            />
            <p className="text-danger text-sm">{state.error}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  const todayCelebrations = data.filter(celebration => isToday(celebration.date));
  const thisWeekCelebrations = data.filter(celebration => 
    !isToday(celebration.date) && isThisWeek(celebration.date)
  ).slice(0, 3);

  const allCelebrations = [...todayCelebrations, ...thisWeekCelebrations];

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className={`w-full h-96 ${className}`}>
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <Icon
              icon="solar:star-bold"
              className="text-yellow-500"
              width={24}
            />
            <h3 className="text-lg font-semibold">{t("dashboard.celebrations.title")}</h3>
          </div>
        </CardHeader>
        <CardBody className="flex-1 overflow-hidden">
          {allCelebrations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Icon
                icon="solar:star-outline"
                className="text-default-300 text-4xl mb-3"
              />
              <p className="text-default-500">{t("dashboard.celebrations.noCelebrations")}</p>
            </div>
          ) : (
            <ScrollShadow hideScrollBar className="h-full">
              <div className="space-y-4">
              {/* Today's Celebrations */}
              {todayCelebrations.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-default-700 mb-3 flex items-center gap-2">
                    <Icon icon="solar:sun-bold" className="text-orange-500" width={16} />
                    {t("dashboard.celebrations.today")}
                  </h4>
                  <div className="space-y-3">
                    {todayCelebrations.map((celebration, index) => (
                      <motion.div
                        key={celebration.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center gap-3 p-3 rounded-lg ${getCelebrationBgColor(celebration.type)} border border-default-200`}
                      >
                        <Avatar
                          src={celebration.employeeAvatar}
                          name={celebration.employeeName}
                          size="md"
                          className="flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon
                              icon={getCelebrationIcon(celebration.type)}
                              className={getCelebrationColor(celebration.type)}
                              width={16}
                            />
                            <p className="font-medium text-sm truncate">
                              {celebration.employeeName}
                            </p>
                          </div>
                          <p className="text-xs text-default-600">
                            {celebration.title}
                            {celebration.type === 'anniversary' && celebration.yearsOfService && (
                              <span className="ml-1">
                                ({celebration.yearsOfService} {t("dashboard.celebrations.years")})
                              </span>
                            )}
                          </p>
                        </div>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={celebration.type === 'birthday' ? 'secondary' : 
                                 celebration.type === 'anniversary' ? 'primary' : 'warning'}
                        >
                          {t(`dashboard.celebrations.${celebration.type}`)}
                        </Chip>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* This Week's Celebrations */}
              {thisWeekCelebrations.length > 0 && (
                <div>
                  {todayCelebrations.length > 0 && (
                    <div className="border-t border-default-200 my-4"></div>
                  )}
                  <h4 className="text-sm font-semibold text-default-700 mb-3 flex items-center gap-2">
                    <Icon icon="solar:calendar-outline" className="text-blue-500" width={16} />
                    {t("dashboard.celebrations.thisWeek")}
                  </h4>
                  <div className="space-y-3">
                    {thisWeekCelebrations.map((celebration, index) => (
                      <motion.div
                        key={celebration.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: (todayCelebrations.length + index) * 0.1 }}
                        className="flex items-center gap-3 p-3 border border-default-200 rounded-lg hover:bg-default-50 transition-colors"
                      >
                        <Avatar
                          src={celebration.employeeAvatar}
                          name={celebration.employeeName}
                          size="sm"
                          className="flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon
                              icon={getCelebrationIcon(celebration.type)}
                              className={getCelebrationColor(celebration.type)}
                              width={14}
                            />
                            <p className="font-medium text-sm truncate">
                              {celebration.employeeName}
                            </p>
                          </div>
                          <p className="text-xs text-default-500">
                            {celebration.title} • {formatDate(celebration.date)}
                          </p>
                        </div>
                        <Chip
                          size="sm"
                          variant="flat"
                          color="default"
                        >
                          {t(`dashboard.celebrations.${celebration.type}`)}
                        </Chip>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              </div>
            </ScrollShadow>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}
