import { Card, CardBody, CardHeader, Chip, Button } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import { title } from "@/components/primitives";
import { useTranslation } from "@/lib/i18n-context";
import { DashboardLayout } from "@/layouts/dashboard";

export default function NewsDashboardPage() {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const newsStats = [
    {
      title: "Total Articles",
      value: "1,234",
      icon: "solar:document-text-outline",
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      title: "Published Today",
      value: "23",
      icon: "solar:calendar-outline",
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      title: "Draft Articles",
      value: "45",
      icon: "solar:pen-outline",
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    },
    {
      title: "Total Views",
      value: "89.2K",
      icon: "solar:eye-outline",
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
  ];

  const recentArticles = [
    {
      id: 1,
      title: "Breaking: New Technology Breakthrough",
      category: "Technology",
      author: "John Doe",
      publishedAt: "2 hours ago",
      views: "1.2K",
      status: "published",
    },
    {
      id: 2,
      title: "Market Analysis: Q4 2024 Report",
      category: "Business",
      author: "Jane Smith",
      publishedAt: "4 hours ago",
      views: "856",
      status: "published",
    },
    {
      id: 3,
      title: "Climate Change Impact Study",
      category: "Environment",
      author: "Mike Johnson",
      publishedAt: "6 hours ago",
      views: "2.1K",
      status: "published",
    },
  ];

  return (
    <DashboardLayout>
      <motion.section
        className="flex flex-col gap-6 py-8 px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3 mb-2">
            <Icon
              icon="solar:document-text-outline"
              className="text-blue-500"
              width={32}
            />
            <h1 className={title()}>{t('navigation.news.dashboard')}</h1>
          </div>
          <p className="text-lg text-default-600">
            {t('apps.news.description')}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={itemVariants}
        >
          {newsStats.map((stat, index) => (
            <Card key={index} className="w-full">
              <CardBody className="flex flex-row items-center gap-4 p-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon
                    icon={stat.icon}
                    className={stat.color}
                    width={24}
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-small text-default-500">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </motion.div>

        {/* Recent Articles */}
        <motion.div variants={itemVariants}>
          <Card className="w-full">
            <CardHeader className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Recent Articles</h3>
              <Button
                color="primary"
                variant="flat"
                size="sm"
                startContent={<Icon icon="solar:add-circle-outline" width={16} />}
              >
                New Article
              </Button>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {recentArticles.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center justify-between p-4 border border-default-200 rounded-lg hover:bg-default-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-default-900 mb-1">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-4 text-small text-default-500">
                        <span>By {article.author}</span>
                        <span>•</span>
                        <span>{article.publishedAt}</span>
                        <span>•</span>
                        <span>{article.views} views</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Chip
                        size="sm"
                        variant="flat"
                        color="primary"
                      >
                        {article.category}
                      </Chip>
                      <Chip
                        size="sm"
                        variant="flat"
                        color="success"
                      >
                        {article.status}
                      </Chip>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card className="w-full">
            <CardHeader>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  color="primary"
                  variant="flat"
                  className="justify-start h-16"
                  startContent={<Icon icon="solar:pen-outline" width={20} />}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Write Article</span>
                    <span className="text-small text-default-500">Create new content</span>
                  </div>
                </Button>
                <Button
                  color="secondary"
                  variant="flat"
                  className="justify-start h-16"
                  startContent={<Icon icon="solar:folder-outline" width={20} />}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Manage Categories</span>
                    <span className="text-small text-default-500">Organize content</span>
                  </div>
                </Button>
                <Button
                  color="warning"
                  variant="flat"
                  className="justify-start h-16"
                  startContent={<Icon icon="solar:chart-outline" width={20} />}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">View Analytics</span>
                    <span className="text-small text-default-500">Track performance</span>
                  </div>
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </motion.section>
    </DashboardLayout>
  );
}
