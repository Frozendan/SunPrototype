"use client";
import { Card, CardBody, CardHeader, Button, Skeleton, Divider } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import { useTranslation } from "@/lib/i18n-context";
import type { CalendarCardProps, CalendarEvent } from "@/types/dashboard";

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

const getEventTypeIcon = (type: CalendarEvent['type']) => {
  switch (type) {
    case 'meeting':
      return 'solar:users-group-rounded-bold';
    case 'event':
      return 'solar:calendar-bold';
    case 'reminder':
      return 'solar:bell-bold';
    case 'deadline':
      return 'solar:clock-circle-bold';
    default:
      return 'solar:calendar-bold';
  }
};

const getEventTypeColor = (type: CalendarEvent['type']) => {
  switch (type) {
    case 'meeting':
      return 'text-blue-500';
    case 'event':
      return 'text-green-500';
    case 'reminder':
      return 'text-orange-500';
    case 'deadline':
      return 'text-red-500';
    default:
      return 'text-default-500';
  }
};

export default function CalendarCard({ 
  data, 
  state, 
  onViewFullCalendar,
  className 
}: CalendarCardProps) {
  const { t } = useTranslation();

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    return today.toDateString() === eventDate.toDateString();
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
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="w-12 h-12 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-3/4 h-4 rounded" />
                <Skeleton className="w-1/2 h-3 rounded" />
              </div>
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

  const todayEvents = data.filter(event => isToday(event.startTime));
  const upcomingEvents = data.filter(event => !isToday(event.startTime)).slice(0, 3);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Icon
                icon="solar:calendar-bold"
                className="text-indigo-500"
                width={24}
              />
              <h3 className="text-lg font-semibold">{t("dashboard.calendar.title")}</h3>
            </div>
            <Button
              variant="light"
              size="sm"
              onPress={onViewFullCalendar}
              endContent={<Icon icon="solar:arrow-right-linear" width={16} />}
            >
              {t("dashboard.calendar.viewFullCalendar")}
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Icon 
                icon="solar:calendar-outline" 
                className="text-default-300 text-4xl mb-3" 
              />
              <p className="text-default-500">{t("dashboard.calendar.noEvents")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Today's Events */}
              {todayEvents.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-default-700 mb-3 flex items-center gap-2">
                    <Icon icon="solar:sun-bold" className="text-orange-500" width={16} />
                    {t("dashboard.calendar.today")}
                  </h4>
                  <div className="space-y-3">
                    {todayEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 border border-default-200 rounded-lg hover:bg-default-50 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-default-100 flex items-center justify-center">
                            <Icon
                              icon={getEventTypeIcon(event.type)}
                              className={getEventTypeColor(event.type)}
                              width={16}
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{event.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-default-500">
                              {event.isAllDay 
                                ? t("dashboard.calendar.allDay")
                                : `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`
                              }
                            </span>
                            {event.location && (
                              <>
                                <span className="text-xs text-default-300">•</span>
                                <span className="text-xs text-default-500 truncate">
                                  {event.location}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <>
                  {todayEvents.length > 0 && <Divider className="my-4" />}
                  <div>
                    <h4 className="text-sm font-semibold text-default-700 mb-3 flex items-center gap-2">
                      <Icon icon="solar:calendar-outline" className="text-blue-500" width={16} />
                      {t("dashboard.calendar.upcoming")}
                    </h4>
                    <div className="space-y-3">
                      {upcomingEvents.map((event, index) => (
                        <motion.div
                          key={event.id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: (todayEvents.length + index) * 0.1 }}
                          className="flex items-start gap-3 p-3 border border-default-200 rounded-lg hover:bg-default-50 transition-colors"
                        >
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-lg bg-default-100 flex items-center justify-center">
                              <Icon
                                icon={getEventTypeIcon(event.type)}
                                className={getEventTypeColor(event.type)}
                                width={16}
                              />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{event.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-default-500">
                                {formatDate(event.startTime)}
                                {!event.isAllDay && ` • ${formatTime(event.startTime)}`}
                              </span>
                              {event.location && (
                                <>
                                  <span className="text-xs text-default-300">•</span>
                                  <span className="text-xs text-default-500 truncate">
                                    {event.location}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}
