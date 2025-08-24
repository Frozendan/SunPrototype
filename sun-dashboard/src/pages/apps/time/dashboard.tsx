import { Card, CardBody, CardHeader, Chip, Button, CircularProgress } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import { title } from "@/components/primitives";
import { useTranslation } from "@/lib/i18n-context";
import { DashboardLayout } from "@/layouts/dashboard";

export default function TimeDashboardPage() {
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

  const timeStats = [
    {
      title: "Today's Hours",
      value: "6.5h",
      icon: "solar:clock-circle-outline",
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
    {
      title: "This Week",
      value: "32.5h",
      icon: "solar:calendar-outline",
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Projects",
      value: "8",
      icon: "solar:widget-2-outline",
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      title: "Productivity",
      value: "87%",
      icon: "solar:graph-outline",
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    },
  ];

  const recentSessions = [
    {
      id: 1,
      project: "Website Redesign",
      task: "Design mockups",
      duration: "2h 30m",
      startTime: "09:00",
      endTime: "11:30",
      status: "completed",
    },
    {
      id: 2,
      project: "Mobile App",
      task: "Code review",
      duration: "1h 15m",
      startTime: "14:00",
      endTime: "15:15",
      status: "completed",
    },
    {
      id: 3,
      project: "Backend API",
      task: "Database optimization",
      duration: "45m",
      startTime: "16:00",
      endTime: "16:45",
      status: "active",
    },
  ];

  const projectTime = [
    {
      name: "Website Redesign",
      timeSpent: "24.5h",
      percentage: 35,
      color: "primary",
    },
    {
      name: "Mobile App",
      percentage: 28,
      timeSpent: "19.2h",
      color: "secondary",
    },
    {
      name: "Backend API",
      percentage: 22,
      timeSpent: "15.8h",
      color: "success",
    },
    {
      name: "Documentation",
      percentage: 15,
      timeSpent: "10.5h",
      color: "warning",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "completed": return "default";
      case "paused": return "warning";
      default: return "default";
    }
  };

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
              icon="solar:clock-circle-outline"
              className="text-purple-500"
              width={32}
            />
            <h1 className={title()}>{t('navigation.timeManagement.dashboard')}</h1>
          </div>
          <p className="text-lg text-default-600">
            {t('apps.timeManagement.description')}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={itemVariants}
        >
          {timeStats.map((stat, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Time Sessions */}
          <motion.div variants={itemVariants}>
            <Card className="w-full h-fit">
              <CardHeader className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Recent Sessions</h3>
                <Button
                  color="success"
                  variant="flat"
                  size="sm"
                  startContent={<Icon icon="solar:play-outline" width={16} />}
                >
                  Start Timer
                </Button>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border border-default-200 rounded-lg hover:bg-default-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-default-900 mb-1">
                          {session.task}
                        </h4>
                        <div className="flex items-center gap-4 text-small text-default-500">
                          <span>{session.project}</span>
                          <span>•</span>
                          <span>{session.startTime} - {session.endTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-lg">{session.duration}</span>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={getStatusColor(session.status)}
                        >
                          {session.status}
                        </Chip>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Project Time Distribution */}
          <motion.div variants={itemVariants}>
            <Card className="w-full h-fit">
              <CardHeader>
                <h3 className="text-lg font-semibold">Project Time Distribution</h3>
              </CardHeader>
              <CardBody>
                <div className="flex justify-center mb-6">
                  <CircularProgress
                    size="lg"
                    value={75}
                    color="primary"
                    showValueLabel={true}
                    valueLabel="75%"
                    className="text-center"
                  />
                </div>
                <div className="space-y-4">
                  {projectTime.map((project, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-${project.color}-500`}></div>
                        <span className="font-medium">{project.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-small text-default-500">{project.timeSpent}</span>
                        <span className="font-semibold">{project.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* Active Timer */}
        <motion.div variants={itemVariants}>
          <Card className="w-full bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Icon
                      icon="solar:clock-circle-outline"
                      className="text-purple-500"
                      width={32}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Current Session</h3>
                    <p className="text-default-600">Backend API - Database optimization</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">00:45:23</p>
                    <p className="text-small text-default-500">Running time</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      color="warning"
                      variant="flat"
                      size="sm"
                      startContent={<Icon icon="solar:pause-outline" width={16} />}
                    >
                      Pause
                    </Button>
                    <Button
                      color="danger"
                      variant="flat"
                      size="sm"
                      startContent={<Icon icon="solar:stop-outline" width={16} />}
                    >
                      Stop
                    </Button>
                  </div>
                </div>
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button
                  color="success"
                  variant="flat"
                  className="justify-start h-16"
                  startContent={<Icon icon="solar:play-outline" width={20} />}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Start Timer</span>
                    <span className="text-small text-default-500">Begin tracking</span>
                  </div>
                </Button>
                <Button
                  color="primary"
                  variant="flat"
                  className="justify-start h-16"
                  startContent={<Icon icon="solar:chart-outline" width={20} />}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">View Reports</span>
                    <span className="text-small text-default-500">Time analytics</span>
                  </div>
                </Button>
                <Button
                  color="secondary"
                  variant="flat"
                  className="justify-start h-16"
                  startContent={<Icon icon="solar:widget-2-outline" width={20} />}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Manage Projects</span>
                    <span className="text-small text-default-500">Project settings</span>
                  </div>
                </Button>
                <Button
                  color="warning"
                  variant="flat"
                  className="justify-start h-16"
                  startContent={<Icon icon="solar:settings-outline" width={20} />}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Settings</span>
                    <span className="text-small text-default-500">Configure timer</span>
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
