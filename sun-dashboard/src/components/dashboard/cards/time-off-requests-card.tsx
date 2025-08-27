"use client";
import { Card, CardBody, CardHeader, Button, Skeleton, ScrollShadow } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import { useTranslation } from "@/lib/i18n-context";
import type { TimeOffRequestsCardProps, TimeOffRequest } from "@/types/dashboard";

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

// const getStatusColor = (status: TimeOffRequest['status']) => {
//   switch (status) {
//     case 'approved':
//       return 'success';
//     case 'rejected':
//       return 'danger';
//     case 'pending':
//     default:
//       return 'warning';
//   }
// };

const getTypeIcon = (type: TimeOffRequest['type']) => {
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

export default function TimeOffRequestsCard({ 
  data, 
  state, 
  onViewAll,
  className 
}: TimeOffRequestsCardProps) {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return start === end ? start : `${start} - ${end}`;
  };

  if (state.isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="w-40 h-6 rounded" />
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 border border-default-200 rounded-lg">
              <Skeleton className="w-8 h-8 rounded" />
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

  // const pendingRequests = data.filter(request => request.status === 'pending');
  const recentRequests = data.slice(0, 3); // Show only first 3 requests

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className={`w-full h-80 ${className}`}>
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Icon
                icon="solar:document-text-bold"
                className="text-green-600"
                width={20}
              />
              <h3 className="text-base font-semibold">{t("dashboard.timeOffRequests.title")}</h3>
            </div>
            {data.length > 0 && (
              <Button
                variant="light"
                size="sm"
                onPress={onViewAll}
                endContent={<Icon icon="solar:arrow-right-linear" width={16} />}
              >
                {t("dashboard.timeOffRequests.viewAll")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody className="pt-0 flex-1 overflow-hidden">
          {recentRequests.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <p className="text-sm text-default-500">{t("dashboard.timeOffRequests.noPendingRequests")}</p>
            </div>
          ) : (
            <ScrollShadow className="h-full">
              <div className="space-y-3">
              {recentRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 py-2"
                >
                  <div className="flex-shrink-0 mt-1">
                    <Icon
                      icon={getTypeIcon(request.type)}
                      className="text-green-600"
                      width={16}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-default-700 mb-1">
                      {t(`dashboard.timeOffRequests.type.${request.type}`)}
                    </p>
                    <p className="text-xs text-default-500">
                      {request.days} {request.days === 1 ? 'day' : 'days'} • {formatDateRange(request.startDate, request.endDate)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className={`w-2 h-2 rounded-full ${
                        request.status === 'approved' ? 'bg-green-500' :
                        request.status === 'rejected' ? 'bg-red-500' : 'bg-orange-500'
                      }`} />
                      <span className="text-xs text-default-400 capitalize">
                        {t(`dashboard.timeOffRequests.status.${request.status}`)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              </div>
            </ScrollShadow>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}
