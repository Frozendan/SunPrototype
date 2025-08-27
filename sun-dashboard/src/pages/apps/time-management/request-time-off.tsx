"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import DashboardLayout from "@/layouts/dashboard/dashboard-layout";
import { useTranslation } from "@/lib/i18n-context";
import { RequestTimeOffHeader } from "@/components/time-management/request-time-off-header";
import { TimeOffBalances } from "@/components/time-management/time-off-balances";
import type { TimeOffBalance, TimeOffFormData } from "@/types/time-management";

function RequestTimeOffPage() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TimeOffFormData>({
    type: 'annual_leave',
    startDate: '',
    endDate: '',
    reason: '',
    attachments: []
  });

  // Mock data for time off balances
  const mockBalances: TimeOffBalance[] = [
    {
      id: '1',
      type: 'annual_leave',
      name: 'Annual Leave',
      icon: 'solar:calendar-mark-bold',
      currentBalance: 15,
      totalAllowed: 20,
      unit: 'days'
    },
    {
      id: '2',
      type: 'unpaid_leave',
      name: 'Unpaid Leave',
      icon: 'solar:calendar-minimalistic-bold',
      currentBalance: 5,
      totalAllowed: 10,
      unit: 'days'
    },
    {
      id: '3',
      type: 'sick_leave',
      name: 'Sick Leave',
      icon: 'solar:health-bold',
      currentBalance: 8,
      totalAllowed: 12,
      unit: 'days'
    },
    {
      id: '4',
      type: 'vacation',
      name: 'Vacation',
      icon: 'solar:suitcase-tag-bold',
      currentBalance: 3,
      totalAllowed: 5,
      unit: 'days'
    },
    {
      id: '5',
      type: 'funeral_leave',
      name: 'Funeral Leave',
      icon: 'solar:sad-circle-bold',
      currentBalance: 2,
      totalAllowed: 3,
      unit: 'days'
    },
    {
      id: '6',
      type: 'business_leave',
      name: 'Business Leave',
      icon: 'solar:case-round-bold',
      currentBalance: 4,
      totalAllowed: 7,
      unit: 'days'
    },
    {
      id: '7',
      type: 'training_leave',
      name: 'Training Leave',
      icon: 'solar:book-bookmark-bold',
      currentBalance: 6,
      totalAllowed: 10,
      unit: 'days'
    }
  ];

  const handleCancel = () => {
    console.log("Cancel request time off");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
        toast.error(t('timeOff.validation.requiredFields'));
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(t('timeOff.success.requestSubmitted'));
      
      setFormData({
        type: 'annual_leave',
        startDate: '',
        endDate: '',
        reason: '',
        attachments: []
      });
      
    } catch (error) {
      console.error('Error submitting time off request:', error);
      toast.error(t('timeOff.error.submitFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <RequestTimeOffHeader
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        <motion.div
          className="flex-1 px-3 pt-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-7xl mx-auto space-y-6">
            <motion.div variants={itemVariants}>
              <TimeOffBalances balances={mockBalances} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-content1 rounded-xl p-6 border border-divider">
                    <h3 className="text-lg font-semibold mb-4">
                      {t('timeOff.form.title')}
                    </h3>
                    <p className="text-default-500">
                      {t('timeOff.form.placeholder')}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-content1 rounded-xl p-6 border border-divider">
                    <h3 className="text-lg font-semibold mb-4">
                      {t('timeOff.guidelines.title')}
                    </h3>
                    <p className="text-default-500">
                      {t('timeOff.guidelines.placeholder')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export default RequestTimeOffPage;
