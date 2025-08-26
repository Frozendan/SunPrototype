"use client";
import { Card, CardBody, CardHeader, Button, Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { useTranslation } from "@/lib/i18n-context";
import type { TimeOffSummaryCardProps } from "@/types/dashboard";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const progressVariants = {
  hidden: { width: 0 },
  visible: { 
    width: "100%",
    transition: { duration: 0.8, ease: "easeOut", delay: 0.2 }
  }
};

export default function TimeOffSummaryCard({ 
  data, 
  state, 
  onRequestTimeOff, 
  onCalculateTimeOff,
  className 
}: TimeOffSummaryCardProps) {
  const { t } = useTranslation();

  const annualLeavePercentage = (data.annualLeave.remaining / data.annualLeave.total) * 100;
  const sickLeavePercentage = (data.sickLeave.remaining / data.sickLeave.total) * 100;

  if (state.isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="w-40 h-6 rounded" />
          </div>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="w-full h-16 rounded" />
            <Skeleton className="w-full h-16 rounded" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="flex-1 h-12 rounded" />
            <Skeleton className="w-12 h-12 rounded" />
          </div>
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
      <Card className={`w-full ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Icon
              icon="solar:calendar-mark-bold"
              className="text-green-600"
              width={20}
            />
            <h3 className="text-base font-semibold">{t("dashboard.timeOff.title")}</h3>
          </div>
        </CardHeader>
        <CardBody className="pt-0 space-y-4">
          {/* Swiper Carousel for Time Off Types */}
          <div className="relative">
            <Swiper
              modules={[Pagination, Navigation]}
              spaceBetween={10}
              slidesPerView={1}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet !bg-green-600',
                bulletActiveClass: 'swiper-pagination-bullet-active !bg-green-600'
              }}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              className="time-off-swiper pb-8"
              style={{
                '--swiper-pagination-color': '#16a34a',
                '--swiper-pagination-bullet-inactive-color': '#d1d5db',
                '--swiper-pagination-bullet-size': '8px',
                '--swiper-pagination-bullet-horizontal-gap': '4px',
                '--swiper-pagination-bottom': '0px'
              } as any}
            >
              {/* Vacation Slide */}
              <SwiperSlide>
                <div className="flex items-center justify-center py-6">
                  <div className="text-center">
                    <Icon
                      icon="solar:sun-bold"
                      className="text-green-600 mx-auto mb-3"
                      width={32}
                    />
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-3xl font-bold text-green-600">{data.annualLeave.remaining}</span>
                      <span className="text-sm text-default-500">hours available</span>
                    </div>
                    <p className="text-sm font-medium text-default-700 mb-1">Vacation</p>
                    <p className="text-xs text-default-400">
                      {data.annualLeave.remaining} of {data.annualLeave.total} hours remaining
                    </p>
                  </div>
                </div>
              </SwiperSlide>

              {/* Sick Leave Slide */}
              <SwiperSlide>
                <div className="flex items-center justify-center py-6">
                  <div className="text-center">
                    <Icon
                      icon="solar:health-bold"
                      className="text-green-600 mx-auto mb-3"
                      width={32}
                    />
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-3xl font-bold text-green-600">{data.sickLeave.remaining}</span>
                      <span className="text-sm text-default-500">hours available</span>
                    </div>
                    <p className="text-sm font-medium text-default-700 mb-1">Sick</p>
                    <p className="text-xs text-default-400">
                      {data.sickLeave.remaining} of {data.sickLeave.total} hours remaining
                    </p>
                  </div>
                </div>
              </SwiperSlide>

              {/* Personal Leave Slide */}
              <SwiperSlide>
                <div className="flex items-center justify-center py-6">
                  <div className="text-center">
                    <Icon
                      icon="solar:user-bold"
                      className="text-green-600 mx-auto mb-3"
                      width={32}
                    />
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-3xl font-bold text-green-600">8</span>
                      <span className="text-sm text-default-500">hours available</span>
                    </div>
                    <p className="text-sm font-medium text-default-700 mb-1">Personal</p>
                    <p className="text-xs text-default-400">
                      8 of 16 hours remaining
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button className="swiper-button-prev-custom absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Icon icon="solar:arrow-left-linear" className="text-gray-600" width={16} />
            </button>
            <button className="swiper-button-next-custom absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Icon icon="solar:arrow-right-linear" className="text-gray-600" width={16} />
            </button>
          </div>

          {/* Hours scheduled info */}
          <p className="text-xs text-default-400 text-center">0 hours scheduled</p>

          {/* Action Buttons - Made Bigger */}
          <div className="flex gap-3">
            <Button
              color="success"
              variant="flat"
              size="lg"
              radius="full"
              className="flex-1 h-12"
              startContent={
                <Icon icon="solar:calendar-add-bold" width={20} />
              }
              onPress={onRequestTimeOff}
            >
              {t("dashboard.timeOff.requestTimeOff")}
            </Button>
            <Button
              variant="light"
              radius="full"
              size="lg"
              isIconOnly
              className="min-w-12 h-12"
              onPress={onCalculateTimeOff}
            >
              <Icon icon="solar:calculator-bold" width={20} />
            </Button>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
