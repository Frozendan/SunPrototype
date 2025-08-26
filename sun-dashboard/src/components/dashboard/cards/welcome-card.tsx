"use client";

import React from "react";
import { Card, CardBody, CardHeader, Avatar, Skeleton, Chip, ScrollShadow } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import { useTranslation } from "@/lib/i18n-context";
import type { WelcomeCardProps } from "@/types/dashboard";

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

const heartbeatVariants = {
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 0.8,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 0.5
    }
  }
};

export default function WelcomeCard({ 
  data, 
  state,
  className 
}: WelcomeCardProps) {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysAgo = (dateString: string) => {
    const today = new Date();
    const joinDate = new Date(dateString);
    const diffTime = today.getTime() - joinDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  const isNewThisMonth = (dateString: string) => {
    const today = new Date();
    const joinDate = new Date(dateString);
    const diffTime = today.getTime() - joinDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30; // Consider "new" if joined within last 30 days
  };

  if (state.isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="w-48 h-6 rounded" />
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 border border-default-200 rounded-lg">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-3/4 h-4 rounded" />
                <Skeleton className="w-1/2 h-3 rounded" />
                <Skeleton className="w-2/3 h-3 rounded" />
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

  const newMembers = data.filter(member => isNewThisMonth(member.joinDate)).slice(0, 4);

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
              icon="solar:hand-heart-bold"
              className="text-green-500"
              width={24}
            />
            <h3 className="text-lg font-semibold">{t("dashboard.welcome.title")}</h3>
          </div>
        </CardHeader>
        <CardBody className="flex-1 overflow-hidden">
          {newMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Icon
                icon="solar:users-group-rounded-outline"
                className="text-default-300 text-4xl mb-3"
              />
              <p className="text-default-500">{t("dashboard.welcome.noNewMembers")}</p>
            </div>
          ) : (
            <ScrollShadow hideScrollBar className="h-full">
              <div className="space-y-4">
                  {/* Welcome Message */}
                  <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg border border-default-200">
                      <div className="flex items-center gap-2 mb-2">
                          <motion.div
                              variants={heartbeatVariants}
                              animate="animate"
                          >
                              <Icon
                                  icon="solar:heart-bold"
                                  className="text-red-500"
                                  width={16}
                              />
                          </motion.div>

                          <span className="text-sm font-medium text-default-700">
                    Welcome to the Sun Group family!
                  </span>
                      </div>
                      <p className="text-xs text-default-600">
                          We're excited to have our new team members join us. Let's make them feel at home and help them succeed in their new roles.
                      </p>
                  </div>
              <div className="space-y-3">
                {newMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 border border-default-200 rounded-lg hover:bg-default-50 transition-colors bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20"
                  >
                    <Avatar
                      src={member.avatar}
                      name={member.name}
                      size="lg"
                      className="flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-base">{member.name}</p>
                          <p className="text-sm text-default-600">{member.position}</p>
                        </div>
                        <Chip
                          size="sm"
                          color="success"
                          variant="flat"
                          startContent={<Icon icon="solar:star-bold" width={12} />}
                        >
                          New
                        </Chip>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Icon
                            icon="solar:buildings-2-bold"
                            className="text-default-400"
                            width={14}
                          />
                          <span className="text-sm text-default-600">
                            {t("dashboard.welcome.department")}: {member.department}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Icon
                            icon="solar:calendar-bold"
                            className="text-default-400"
                            width={14}
                          />
                          <span className="text-sm text-default-600">
                            {t("dashboard.welcome.joinedOn")} {formatDate(member.joinDate)}
                          </span>
                          <span className="text-xs text-default-400">
                            ({getDaysAgo(member.joinDate)})
                          </span>
                        </div>

                        {member.manager && (
                          <div className="flex items-center gap-2">
                            <Icon
                              icon="solar:user-bold"
                              className="text-default-400"
                              width={14}
                            />
                            <span className="text-sm text-default-600">
                              Manager: {member.manager}
                            </span>
                          </div>
                        )}

                        {member.bio && (
                          <div className="mt-2">
                            <p className="text-xs text-default-500 line-clamp-2">
                              {member.bio}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              
              </div>
            </ScrollShadow>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}
