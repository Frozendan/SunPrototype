import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { title } from "@/components/primitives";
import { useTranslation } from "@/lib/i18n-context";
import { useAuth } from "@/hooks/use-auth";
import { DashboardLayout } from "@/layouts/dashboard";
import { useDashboard } from "@/hooks/use-dashboard";
import DashboardGrid from "@/components/dashboard/dashboard-grid";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, states, actions, refreshData } = useDashboard();

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <DashboardLayout>
      <motion.section
        className="flex flex-col gap-6 py-8 md:py-10 px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Header */}
        <motion.div
          className="text-center"
          variants={itemVariants}
        >
          <h1 className={title()}>{t('common.dashboard')}</h1>
          <p className="text-lg text-default-600 mt-4">
            {t('auth.welcomeBack')}, {user.name}!
          </p>
        </motion.div>

        {/* Dashboard Grid */}
        <motion.div
          className="w-full max-w-7xl mx-auto"
          variants={itemVariants}
        >
          <DashboardGrid
            data={data}
            states={states}
            onRequestTimeOff={actions.onRequestTimeOff}
            onCalculateTimeOff={actions.onCalculateTimeOff}
            onViewAllTimeOffRequests={actions.onViewAllTimeOffRequests}
            onViewFullCalendar={actions.onViewFullCalendar}
            onViewAllTasks={actions.onViewAllTasks}
            onMarkTaskComplete={actions.onMarkTaskComplete}
            onViewTaskDetails={actions.onViewTaskDetails}
            onViewAllNews={actions.onViewAllNews}
            onReadMoreNews={actions.onReadMoreNews}
          />
        </motion.div>
      </motion.section>
    </DashboardLayout>
  );
}
