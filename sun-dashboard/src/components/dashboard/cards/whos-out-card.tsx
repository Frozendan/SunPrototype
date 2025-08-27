"use client";
import { Card, CardBody, CardHeader, Avatar, Skeleton, Chip, ScrollShadow } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import { useTranslation } from "@/lib/i18n-context";
import type { WhosOutCardProps, EmployeeOnLeave } from "@/types/dashboard";

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

const getLeaveTypeIcon = (type: EmployeeOnLeave['leaveType']) => {
  switch (type) {
    case 'annual':
      return 'solar:sun-bold';
    case 'sick':
      return 'solar:health-bold';
    case 'personal':
      return 'solar:user-bold';
    case 'maternity':
      return 'solar:heart-bold';
    case 'paternity':
      return 'solar:users-group-two-rounded-bold';
    default:
      return 'solar:calendar-bold';
  }
};

const getLeaveTypeColor = (type: EmployeeOnLeave['leaveType']) => {
  switch (type) {
    case 'annual':
      return 'primary';
    case 'sick':
      return 'danger';
    case 'personal':
      return 'secondary';
    case 'maternity':
      return 'success';
    case 'paternity':
      return 'warning';
    default:
      return 'default';
  }
};

export default function WhosOutCard({ 
  data, 
  state,
  className 
}: WhosOutCardProps) {
  const { t } = useTranslation();

  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return today.toDateString() === date.toDateString();
  };

  const isTomorrow = (dateString: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = new Date(dateString);
    return tomorrow.toDateString() === date.toDateString();
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
            <Skeleton className="w-24 h-6 rounded" />
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

  // Filter employees who are out today or tomorrow
  const todayOut = data.filter(employee => 
    isToday(employee.startDate) || 
    (new Date(employee.startDate) <= new Date() && new Date(employee.endDate) >= new Date())
  );
  
  const tomorrowOut = data.filter(employee => 
    isTomorrow(employee.startDate) || 
    (new Date(employee.startDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000) && 
     new Date(employee.endDate) >= new Date(Date.now() + 24 * 60 * 60 * 1000))
  );

  const allOut = [...todayOut, ...tomorrowOut.filter(emp => !todayOut.find(t => t.id === emp.id))];

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
              icon="solar:user-cross-bold"
              className="text-orange-500"
              width={24}
            />
            <h3 className="text-lg font-semibold">{t("dashboard.whosOut.title")}</h3>
          </div>
        </CardHeader>
        <CardBody className="flex-1 overflow-hidden">
          {allOut.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Icon
                icon="solar:users-group-rounded-outline"
                className="text-default-300 text-4xl mb-3"
              />
              <p className="text-default-500">{t("dashboard.whosOut.noOneOut")}</p>
            </div>
          ) : (
            <ScrollShadow hideScrollBar className="h-full">
              <div className="space-y-4">
              {/* Today */}
              {todayOut.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-default-700 mb-3 flex items-center gap-2">
                    <Icon icon="solar:sun-bold" className="text-orange-500" width={16} />
                    {t("dashboard.whosOut.today")}
                  </h4>
                  <div className="space-y-3">
                    {todayOut.map((employee, index) => (
                      <motion.div
                        key={employee.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 border border-default-200 rounded-lg hover:bg-default-50 transition-colors"
                      >
                        <Avatar
                          src={employee.avatar}
                          name={employee.name}
                          size="md"
                          className="flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{employee.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-default-500">{employee.department}</span>
                            <span className="text-xs text-default-300">•</span>
                            <span className="text-xs text-default-500">
                              {t("dashboard.whosOut.returnsOn")} {formatDate(employee.returnDate)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon
                            icon={getLeaveTypeIcon(employee.leaveType)}
                            className="text-default-400"
                            width={16}
                          />
                          <Chip
                            size="sm"
                            color={getLeaveTypeColor(employee.leaveType)}
                            variant="flat"
                          >
                            {t(`dashboard.timeOffRequests.type.${employee.leaveType}`)}
                          </Chip>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tomorrow */}
              {tomorrowOut.length > 0 && !tomorrowOut.every(emp => todayOut.find(t => t.id === emp.id)) && (
                <div>
                  {todayOut.length > 0 && (
                    <div className="border-t border-default-200 my-4"></div>
                  )}
                  <h4 className="text-sm font-semibold text-default-700 mb-3 flex items-center gap-2">
                    <Icon icon="solar:calendar-outline" className="text-blue-500" width={16} />
                    {t("dashboard.whosOut.tomorrow")}
                  </h4>
                  <div className="space-y-3">
                    {tomorrowOut
                      .filter(emp => !todayOut.find(t => t.id === emp.id))
                      .map((employee, index) => (
                        <motion.div
                          key={employee.id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: (todayOut.length + index) * 0.1 }}
                          className="flex items-center gap-3 p-3 border border-default-200 rounded-lg hover:bg-default-50 transition-colors"
                        >
                          <Avatar
                            src={employee.avatar}
                            name={employee.name}
                            size="sm"
                            className="flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{employee.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-default-500">{employee.department}</span>
                              <span className="text-xs text-default-300">•</span>
                              <span className="text-xs text-default-500">
                                {formatDate(employee.startDate)} - {formatDate(employee.endDate)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon
                              icon={getLeaveTypeIcon(employee.leaveType)}
                              className="text-default-400"
                              width={14}
                            />
                            <Chip
                              size="sm"
                              color="default"
                              variant="flat"
                            >
                              {t(`dashboard.timeOffRequests.type.${employee.leaveType}`)}
                            </Chip>
                          </div>
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
