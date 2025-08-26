"use client";

import { motion } from "framer-motion";

import AppShortcuts from "@/components/app-shortcuts";
import {
  TimeOffSummaryCard,
  TimeOffRequestsCard,
  MyStuffCard,
  CalendarCard,
  TasksCard,
  NewsCard,
  CelebrationsCard,
  WhosOutCard,
  WelcomeCard,
} from "@/components/dashboard";
import type { DashboardData, DashboardCardState } from "@/types/dashboard";

interface DashboardGridProps {
  data: DashboardData;
  states: {
    timeOffSummary: DashboardCardState;
    timeOffRequests: DashboardCardState;
    myStuff: DashboardCardState;
    calendar: DashboardCardState;
    tasks: DashboardCardState;
    news: DashboardCardState;
    celebrations: DashboardCardState;
    whosOut: DashboardCardState;
    welcome: DashboardCardState;
  };
  onRequestTimeOff: () => void;
  onCalculateTimeOff: () => void;
  onViewAllTimeOffRequests: () => void;
  onViewFullCalendar: () => void;
  onViewAllTasks: () => void;
  onMarkTaskComplete: (taskId: string) => void;
  onViewTaskDetails: (taskId: string) => void;
  onViewAllNews: () => void;
  onReadMoreNews: (articleId: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function DashboardGrid({
  data,
  states,
  onRequestTimeOff,
  onCalculateTimeOff,
  onViewAllTimeOffRequests,
  onViewFullCalendar,
  onViewAllTasks,
  onMarkTaskComplete,
  onViewTaskDetails,
  onViewAllNews,
  onReadMoreNews,
}: DashboardGridProps) {
  return (
    <motion.div
      className="w-full space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* App Shortcuts - Full Width */}
      <motion.div variants={gridItemVariants}>
        <AppShortcuts />
      </motion.div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-3 space-y-6">
              {/* Bottom Row - Three Equal Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div variants={gridItemVariants}>
                      <CelebrationsCard
                          data={data.celebrations}
                          state={states.celebrations}
                      />
                  </motion.div>

                  <motion.div variants={gridItemVariants}>
                      <WhosOutCard
                          data={data.employeesOnLeave}
                          state={states.whosOut}
                      />
                  </motion.div>

                  <motion.div variants={gridItemVariants}>
                      <WelcomeCard
                          data={data.newTeamMembers}
                          state={states.welcome}
                      />
                  </motion.div>
              </div>
          </div>
          <div className="col-span-1 space-y-6">
              {/* Left Column - Time Off Cards */}
              <motion.div className="space-y-6" variants={gridItemVariants}>
                  <TimeOffSummaryCard
                      data={data.timeOffSummary}
                      state={states.timeOffSummary}
                      onRequestTimeOff={onRequestTimeOff}
                      onCalculateTimeOff={onCalculateTimeOff}
                  />
                  

              </motion.div>
          </div>
          <div className="col-span-2 space-y-6 h-full">
              {/* Right Column - News */}
              <motion.div variants={gridItemVariants} style={{ height: '100%' }}>
                  <NewsCard
                      data={data.news}
                      state={states.news}
                      onViewAllNews={onViewAllNews}
                      onReadMore={onReadMoreNews}
                      className="h-full"
                  />
              </motion.div>
          </div>
          <div className="col-span-1 space-y-6">
              <TimeOffRequestsCard
                  data={data.timeOffRequests}
                  state={states.timeOffRequests}
                  onViewAll={onViewAllTimeOffRequests}
              />
          </div>
          <div className="col-span-1 space-y-6">
              <MyStuffCard
                  state={states.myStuff}
              />
          </div>
          <div className="col-span-1 space-y-6">
              {/* Middle Column - Calendar and Tasks */}
              <motion.div className="space-y-6" variants={gridItemVariants}>
                  <CalendarCard
                      data={data.calendarEvents}
                      state={states.calendar}
                      onViewFullCalendar={onViewFullCalendar}
                  />
                  <TasksCard
                      data={data.tasks}
                      state={states.tasks}
                      onViewAllTasks={onViewAllTasks}
                      onMarkComplete={onMarkTaskComplete}
                      onViewDetails={onViewTaskDetails}
                  />
              </motion.div>
          </div>
      </div>
    </motion.div>
  );
}
