"use client";

import { Card, CardBody, ScrollShadow } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { useTranslation } from "@/lib/i18n-context";
import type { TimeOffBalance } from "@/types/time-management";

interface TimeOffBalancesProps {
  balances: TimeOffBalance[];
  className?: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function TimeOffBalances({ balances, className }: TimeOffBalancesProps) {
  const { t } = useTranslation();

  const getBalanceIcon = (type: string): string => {
    switch (type) {
      case 'annual_leave':
        return 'solar:calendar-mark-bold';
      case 'unpaid_leave':
        return 'solar:calendar-minimalistic-bold';
      case 'sick_leave':
        return 'solar:health-bold';
      case 'vacation':
        return 'solar:suitcase-tag-bold';
      case 'funeral_leave':
        return 'solar:sad-circle-bold';
      case 'business_leave':
        return 'solar:case-round-bold';
      case 'training_leave':
        return 'solar:book-bookmark-bold';
      default:
        return 'solar:calendar-bold';
    }
  };

  const getBalanceColor = (type: string): string => {
    switch (type) {
      case 'annual_leave':
        return 'text-blue-600 dark:text-blue-400';
      case 'unpaid_leave':
        return 'text-gray-600 dark:text-gray-400';
      case 'sick_leave':
        return 'text-red-600 dark:text-red-400';
      case 'vacation':
        return 'text-green-600 dark:text-green-400';
      case 'funeral_leave':
        return 'text-purple-600 dark:text-purple-400';
      case 'business_leave':
        return 'text-orange-600 dark:text-orange-400';
      case 'training_leave':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-default-600 dark:text-default-400';
    }
  };

  const getBackgroundColor = (type: string): string => {
    switch (type) {
      case 'annual_leave':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'unpaid_leave':
        return 'bg-gray-100 dark:bg-gray-900/30';
      case 'sick_leave':
        return 'bg-red-100 dark:bg-red-900/30';
      case 'vacation':
        return 'bg-green-100 dark:bg-green-900/30';
      case 'funeral_leave':
        return 'bg-purple-100 dark:bg-purple-900/30';
      case 'business_leave':
        return 'bg-orange-100 dark:bg-orange-900/30';
      case 'training_leave':
        return 'bg-yellow-100 dark:bg-yellow-900/30';
      default:
        return 'bg-default-100 dark:bg-default-900/30';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      <Card className="w-full">
        <CardBody className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
              <Icon
                icon="solar:wallet-money-bold"
                width={24}
                className="text-primary-600 dark:text-primary-400"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {t('timeOff.balances.title')}
              </h3>
              <p className="text-sm text-default-500">
                {t('timeOff.balances.description')}
              </p>
            </div>
          </div>

          <ScrollShadow 
            orientation="horizontal" 
            className="w-full"
            hideScrollBar
          >
            <div className="flex gap-4 pb-2 min-w-max">
              {balances.map((balance, index) => (
                <motion.div
                  key={balance.id}
                  variants={itemVariants}
                  className="flex-shrink-0"
                >
                  <Card className="w-48 hover:shadow-md transition-shadow cursor-pointer">
                    <CardBody className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${getBackgroundColor(balance.type)}`}>
                          <Icon
                            icon={getBalanceIcon(balance.type)}
                            width={24}
                            className={getBalanceColor(balance.type)}
                          />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground">
                            {balance.currentBalance}
                          </div>
                          <div className="text-xs text-default-500">
                            / {balance.totalAllowed} {t(`timeOff.balances.${balance.unit}`)}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm text-foreground mb-1">
                          {t(`timeOff.balances.${balance.type}`)}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-default-500">
                          <span>{balance.currentBalance}</span>
                          <span>{t('timeOff.balances.remaining')}</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="w-full bg-default-200 rounded-full h-1.5">
                          <div 
                            className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min((balance.currentBalance / balance.totalAllowed) * 100, 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollShadow>
        </CardBody>
      </Card>
    </motion.div>
  );
}
