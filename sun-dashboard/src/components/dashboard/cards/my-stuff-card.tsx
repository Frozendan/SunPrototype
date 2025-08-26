"use client";

import { Card, CardBody, CardHeader, Skeleton, ScrollShadow } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import { useTranslation } from "@/lib/i18n-context";
import type { DashboardCardState } from "@/types/dashboard";

interface MyStuffCardProps {
  state: DashboardCardState;
  className?: string;
}

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

export default function MyStuffCard({ 
  state,
  className 
}: MyStuffCardProps) {
  const { t } = useTranslation();

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
            <div key={i} className="flex items-start gap-3 py-2">
              <Skeleton className="w-4 h-4 rounded mt-1" />
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

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className={`w-full h-80 ${className}`}>
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Icon
              icon="solar:clipboard-list-bold"
              className="text-green-600"
              width={20}
            />
            <h3 className="text-base font-semibold">My Stuff</h3>
          </div>
        </CardHeader>
        <CardBody className="pt-0 flex-1 overflow-hidden">
          <ScrollShadow className="h-full">
            <div className="space-y-3">
          {/* Training Section */}
          <motion.div
            variants={itemVariants}
            className="flex items-start gap-3 py-2"
          >
            <Icon
              icon="solar:graduation-square-bold"
              className="text-green-600 mt-1"
              width={16}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-default-700 mb-1">Training</p>
              <p className="text-xs text-default-500">5 active trainings, 2 past due or expired</p>
            </div>
          </motion.div>

          {/* Compensation Benchmarks */}
          <motion.div
            variants={itemVariants}
            className="flex items-start gap-3 py-2"
          >
            <Icon
              icon="solar:chart-square-bold"
              className="text-green-600 mt-1"
              width={16}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-default-700 mb-1">Compensation Benchmarks</p>
              <p className="text-xs text-default-500">Compare your pay with similar orgs</p>
            </div>
          </motion.div>

          {/* Compensation Planning */}
          <motion.div
            variants={itemVariants}
            className="flex items-start gap-3 py-2"
          >
            <Icon
              icon="solar:dollar-minimalistic-bold"
              className="text-green-600 mt-1"
              width={16}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-default-700 mb-1">Compensation Planning Worksheets</p>
              <p className="text-xs text-default-500">Plan out the right combination of salaries, bonuses, and equity</p>
            </div>
          </motion.div>

          {/* Performance Reviews */}
          <motion.div
            variants={itemVariants}
            className="flex items-start gap-3 py-2"
          >
            <Icon
              icon="solar:star-bold"
              className="text-green-600 mt-1"
              width={16}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-default-700 mb-1">Performance Reviews</p>
              <p className="text-xs text-default-500">View and complete your performance assessments</p>
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            variants={itemVariants}
            className="flex items-start gap-3 py-2"
          >
            <Icon
              icon="solar:shield-check-bold"
              className="text-green-600 mt-1"
              width={16}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-default-700 mb-1">Benefits</p>
              <p className="text-xs text-default-500">Manage your health, dental, and other benefits</p>
            </div>
          </motion.div>
            </div>
          </ScrollShadow>
        </CardBody>
      </Card>
    </motion.div>
  );
}
