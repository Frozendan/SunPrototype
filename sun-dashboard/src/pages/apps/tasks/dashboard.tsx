import { Card, CardBody, CardHeader, Chip, Button, Progress } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import { title } from "@/components/primitives";
import { useTranslation } from "@/lib/i18n-context";
import { DashboardLayout } from "@/layouts/dashboard";

export default function TasksDashboardPage() {
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

  const taskStats = [
    {
      title: "Total Tasks",
      value: "156",
      icon: "solar:checklist-minimalistic-outline",
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      title: "In Progress",
      value: "23",
      icon: "solar:clock-circle-outline",
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      title: "Completed",
      value: "89",
      icon: "solar:check-circle-outline",
      color: "text-success-500",
      bgColor: "bg-success-100",
    },
    {
      title: "Overdue",
      value: "7",
      icon: "solar:danger-circle-outline",
      color: "text-danger-500",
      bgColor: "bg-danger-100",
    },
  ];

  const recentTasks = [
    {
      id: 1,
      title: "Design new landing page",
      project: "Website Redesign",
      assignee: "Alice Johnson",
      dueDate: "Today",
      priority: "high",
      status: "in-progress",
    },
    {
      id: 2,
      title: "Implement user authentication",
      project: "Mobile App",
      assignee: "Bob Smith",
      dueDate: "Tomorrow",
      priority: "medium",
      status: "todo",
    },
    {
      id: 3,
      title: "Write API documentation",
      project: "Backend API",
      assignee: "Carol Davis",
      dueDate: "Dec 28",
      priority: "low",
      status: "completed",
    },
  ];

  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      progress: 75,
      tasks: 12,
      completed: 9,
      team: 4,
    },
    {
      id: 2,
      name: "Mobile App",
      progress: 45,
      tasks: 18,
      completed: 8,
      team: 6,
    },
    {
      id: 3,
      name: "Backend API",
      progress: 90,
      tasks: 8,
      completed: 7,
      team: 3,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "danger";
      case "medium": return "warning";
      case "low": return "success";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "success";
      case "in-progress": return "primary";
      case "todo": return "default";
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
              icon="solar:checklist-minimalistic-outline"
              className="text-green-500"
              width={32}
            />
            <h1 className={title()}>{t('navigation.taskManagement.dashboard')}</h1>
          </div>
          <p className="text-lg text-default-600">
            {t('apps.taskManagement.description')}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={itemVariants}
        >
          {taskStats.map((stat, index) => (
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
          {/* Recent Tasks */}
          <motion.div variants={itemVariants}>
            <Card className="w-full h-fit">
              <CardHeader className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Recent Tasks</h3>
                <Button
                  color="primary"
                  variant="flat"
                  size="sm"
                  startContent={<Icon icon="solar:add-circle-outline" width={16} />}
                >
                  New Task
                </Button>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 border border-default-200 rounded-lg hover:bg-default-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-default-900 mb-1">
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-4 text-small text-default-500">
                          <span>{task.project}</span>
                          <span>•</span>
                          <span>{task.assignee}</span>
                          <span>•</span>
                          <span>Due {task.dueDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Chip
                          size="sm"
                          variant="flat"
                          color={getPriorityColor(task.priority)}
                        >
                          {task.priority}
                        </Chip>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={getStatusColor(task.status)}
                        >
                          {task.status}
                        </Chip>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Project Progress */}
          <motion.div variants={itemVariants}>
            <Card className="w-full h-fit">
              <CardHeader>
                <h3 className="text-lg font-semibold">Project Progress</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-6">
                  {projects.map((project) => (
                    <div key={project.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">{project.name}</h4>
                        <span className="text-small text-default-500">
                          {project.completed}/{project.tasks} tasks
                        </span>
                      </div>
                      <Progress
                        value={project.progress}
                        color="primary"
                        className="w-full"
                      />
                      <div className="flex justify-between items-center text-small text-default-500">
                        <span>{project.progress}% complete</span>
                        <span>{project.team} team members</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card className="w-full">
            <CardHeader>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button
                  color="primary"
                  variant="flat"
                  className="justify-start h-16"
                  startContent={<Icon icon="solar:add-circle-outline" width={20} />}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Create Task</span>
                    <span className="text-small text-default-500">Add new task</span>
                  </div>
                </Button>
                <Button
                  color="secondary"
                  variant="flat"
                  className="justify-start h-16"
                  startContent={<Icon icon="solar:widget-2-outline" width={20} />}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">New Project</span>
                    <span className="text-small text-default-500">Start project</span>
                  </div>
                </Button>
                <Button
                  color="warning"
                  variant="flat"
                  className="justify-start h-16"
                  startContent={<Icon icon="solar:users-group-two-rounded-outline" width={20} />}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Manage Team</span>
                    <span className="text-small text-default-500">Team settings</span>
                  </div>
                </Button>
                <Button
                  color="success"
                  variant="flat"
                  className="justify-start h-16"
                  startContent={<Icon icon="solar:chart-outline" width={20} />}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">View Reports</span>
                    <span className="text-small text-default-500">Analytics</span>
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
