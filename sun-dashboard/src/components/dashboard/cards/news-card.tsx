"use client";
import { Card, CardBody, CardHeader, Skeleton, Image } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import { useTranslation } from "@/lib/i18n-context";
import type { NewsCardProps } from "@/types/dashboard";

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

export default function NewsCard({ 
  data, 
  state, 
  // onViewAllNews,
  onReadMore,
  className 
}: NewsCardProps) {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // const formatReadTime = (minutes?: number) => {
  //   if (!minutes) return '';
  //   return `${minutes} min read`;
  // };

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
            <div key={i} className="flex gap-3 p-3 border border-default-200 rounded-lg">
              <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-full h-4 rounded" />
                <Skeleton className="w-3/4 h-3 rounded" />
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

  const latestNews = data.slice(0, 3); // Show only first 3 articles

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="h-full"
    >
      <Card className={`w-full ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Icon
              icon="solar:chat-round-dots-bold"
              className="text-green-600"
              width={20}
            />
            <h3 className="text-base font-semibold">What's happening at Sun Group</h3>
          </div>
        </CardHeader>
        <CardBody className="pt-0 space-y-3">
          {latestNews.length === 0 ? (
            <div className="py-4 text-center">
              <p className="text-sm text-default-500">{t("dashboard.news.noNews")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {latestNews.map((article, index) => (
                <motion.div
                  key={article.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 py-2 cursor-pointer hover:bg-default-50 rounded-lg px-2 -mx-2 transition-colors"
                  onClick={() => onReadMore(article.id)}
                >
                  {/* Avatar/Icon */}
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-default-100 flex items-center justify-center">
                      {article.thumbnail ? (
                        <Image
                          src={article.thumbnail}
                          alt={article.title}
                          className="w-8 h-8 object-cover rounded-full"
                          fallbackSrc="/placeholder-news.jpg"
                        />
                      ) : (
                        <Icon
                          icon="solar:document-text-outline"
                          className="text-default-400"
                          width={16}
                        />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-default-700 line-clamp-2 mb-1">
                          {article.title}
                        </p>
                        <p className="text-xs text-default-500">
                          In {formatDate(article.publishedAt)}
                        </p>
                      </div>
                      {/* Status indicator */}
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Additional news items with different statuses */}
              <motion.div
                variants={itemVariants}
                className="flex items-start gap-3 py-2 cursor-pointer hover:bg-default-50 rounded-lg px-2 -mx-2 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <Icon
                      icon="solar:file-text-bold"
                      className="text-orange-600"
                      width={16}
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-default-700 mb-1">
                        Please take a moment to complete your assessment of Ryota Saito.
                      </p>
                      <p className="text-xs text-red-500">
                        Please complete your assessment by Jul 16 (33 days ago) ( PAST DUE )
                      </p>
                    </div>
                    <div className="flex-shrink-0 mt-1">
                      <Icon
                        icon="solar:clock-circle-bold"
                        className="text-orange-500"
                        width={16}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}
