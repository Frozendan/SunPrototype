import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

import { title } from "@/components/primitives";
import { useTranslation } from "@/lib/i18n-context";
import { DashboardLayout } from "@/layouts/dashboard";
import type { Task } from "@/types/task";
import {
  TaskStatsCards,
  RecentTasksCard,
  DepartmentAnalyticsCard,
  QuickActionsCard,
  type QuickAction
} from "@/components/tasks/dashboard";

export default function TasksDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  // Event handlers
  const handleTaskClick = (taskId: string) => {
    navigate(`/task-management/task/${taskId}`);
  };

  const handleCreateTask = () => {
    navigate("/task-management/create-task");
  };

  const handleViewAllTasks = () => {
    navigate('/task-management/tasks');
  };



  // Enhanced mock data with proper unit assignments for department analytics
  const recentTasks: Task[] = [
    // IT Department (unit-1) tasks
    {
      id: "GV.25.000146",
      title: "Phát triển tính năng đăng nhập SSO",
      description: "Triển khai hệ thống đăng nhập Single Sign-On (SSO) để tích hợp với các hệ thống hiện có của công ty.",
      priority: "urgent",
      status: "inProgress",
      taskType: "assignment",
      assignee: {
        id: "emp-001",
        name: "Nguyễn Văn A",
        email: "a.nguyen@company.com",
        avatar: "https://i.pravatar.cc/150?u=emp001",
        role: "Senior Developer"
      },
      reporter: {
        id: "manager-001",
        name: "Trần Thị B",
        email: "b.tran@company.com",
        avatar: "https://i.pravatar.cc/150?u=manager001"
      },
      labels: [
        { id: "1", name: "Frontend", color: "blue" },
        { id: "4", name: "Security", color: "red" }
      ],
      dueDate: new Date(2025, 7, 30), // August 30, 2025
      createdAt: new Date(2025, 7, 20),
      updatedAt: new Date(2025, 7, 25),
      importanceLevel: "very-important",
      assignmentDate: new Date(2025, 7, 20),
      unitId: "1", // IT Department
      comments: [],
      attachments: [],
      watchers: []
    },
    {
      id: "GV.25.000147",
      title: "Thiết kế giao diện mobile app",
      description: "Tạo mockup và prototype cho ứng dụng mobile, bao gồm các màn hình chính và luồng người dùng.",
      priority: "high",
      status: "inProgress",
      taskType: "assignment",
      assignee: {
        id: "emp-002",
        name: "Hoàng Thị C",
        email: "c.hoang@company.com",
        avatar: "https://i.pravatar.cc/150?u=emp002",
        role: "UI/UX Designer"
      },
      reporter: {
        id: "manager-001",
        name: "Trần Thị B",
        email: "b.tran@company.com",
        avatar: "https://i.pravatar.cc/150?u=manager001"
      },
      labels: [
        { id: "3", name: "Design", color: "purple" },
        { id: "9", name: "Mobile", color: "cyan" }
      ],
      dueDate: new Date(2025, 8, 5), // September 5, 2025
      createdAt: new Date(2025, 7, 22),
      updatedAt: new Date(2025, 7, 26),
      importanceLevel: "important",
      assignmentDate: new Date(2025, 7, 22),
      unitId: "4", // Marketing Department
      comments: [],
      attachments: [],
      watchers: []
    },
    {
      id: "GV.25.000145",
      title: "Tích hợp API thanh toán",
      description: "Tích hợp các cổng thanh toán phổ biến (VNPay, MoMo, ZaloPay) vào hệ thống e-commerce.",
      priority: "medium",
      status: "done",
      taskType: "assignment",
      assignee: {
        id: "emp-003",
        name: "Bùi Văn D",
        email: "d.bui@company.com",
        avatar: "https://i.pravatar.cc/150?u=emp003",
        role: "Backend Developer"
      },
      reporter: {
        id: "manager-002",
        name: "Lê Văn E",
        email: "e.le@company.com",
        avatar: "https://i.pravatar.cc/150?u=manager002"
      },
      labels: [
        { id: "2", name: "Backend", color: "green" },
        { id: "19", name: "Payment", color: "emerald" }
      ],
      dueDate: new Date(2025, 7, 28), // August 28, 2025
      createdAt: new Date(2025, 7, 15),
      updatedAt: new Date(2025, 7, 28),
      completedAt: new Date(2025, 7, 28),
      importanceLevel: "normal",
      assignmentDate: new Date(2025, 7, 15),
      unitId: "1", // IT Department
      comments: [],
      attachments: [],
      watchers: []
    },
    {
      id: "GV.25.000144",
      title: "Viết tài liệu API",
      description: "Tạo tài liệu chi tiết cho các API endpoints, bao gồm examples và error codes.",
      priority: "low",
      status: "todo",
      taskType: "document",
      assignee: {
        id: "emp-004",
        name: "Vũ Thị F",
        email: "f.vu@company.com",
        avatar: "https://i.pravatar.cc/150?u=emp004",
        role: "Technical Writer"
      },
      reporter: {
        id: "manager-001",
        name: "Trần Thị B",
        email: "b.tran@company.com",
        avatar: "https://i.pravatar.cc/150?u=manager001"
      },
      labels: [
        { id: "7", name: "Documentation", color: "gray" }
      ],
      dueDate: new Date(2025, 8, 10), // September 10, 2025
      createdAt: new Date(2025, 7, 25),
      updatedAt: new Date(2025, 7, 25),
      importanceLevel: "normal",
      assignmentDate: new Date(2025, 7, 25),
      unitId: "1", // IT Department
      comments: [],
      attachments: [],
      watchers: []
    },

    // Additional IT Department tasks
    {
      id: "GV.25.000148",
      title: "Cập nhật hệ thống bảo mật",
      description: "Nâng cấp các biện pháp bảo mật và cập nhật firewall.",
      priority: "high",
      status: "done",
      taskType: "assignment",
      assignee: {
        id: "1",
        name: "John Doe",
        email: "john@company.com",
        avatar: "https://i.pravatar.cc/150?u=1",
        role: "Security Engineer"
      },
      reporter: {
        id: "manager-001",
        name: "Trần Thị B",
        email: "b.tran@company.com",
        avatar: "https://i.pravatar.cc/150?u=manager001"
      },
      labels: [
        { id: "4", name: "Security", color: "red" }
      ],
      dueDate: new Date(2025, 7, 25),
      createdAt: new Date(2025, 7, 10),
      updatedAt: new Date(2025, 7, 24),
      completedAt: new Date(2025, 7, 24),
      importanceLevel: "very-important",
      assignmentDate: new Date(2025, 7, 10),
      unitId: "1", // IT Department
      comments: [],
      attachments: [],
      watchers: []
    },
    {
      id: "GV.25.000149",
      title: "Backup dữ liệu hệ thống",
      description: "Thực hiện backup định kỳ và kiểm tra tính toàn vẹn dữ liệu.",
      priority: "medium",
      status: "inProgress",
      taskType: "assignment",
      assignee: {
        id: "current-user",
        name: "Current User",
        email: "current@company.com",
        avatar: "https://i.pravatar.cc/150?u=current",
        role: "System Admin"
      },
      reporter: {
        id: "manager-001",
        name: "Trần Thị B",
        email: "b.tran@company.com",
        avatar: "https://i.pravatar.cc/150?u=manager001"
      },
      labels: [
        { id: "5", name: "DevOps", color: "orange" }
      ],
      dueDate: new Date(2025, 8, 1),
      createdAt: new Date(2025, 7, 20),
      updatedAt: new Date(2025, 7, 26),
      importanceLevel: "important",
      assignmentDate: new Date(2025, 7, 20),
      unitId: "1", // IT Department
      comments: [],
      attachments: [],
      watchers: []
    },
    {
      id: "GV.25.000157",
      title: "Code review cho dự án mobile",
      description: "Review code và đưa ra feedback cho team phát triển mobile app.",
      priority: "high",
      status: "todo",
      taskType: "assignment",
      assignee: {
        id: "current-user",
        name: "Current User",
        email: "current@company.com",
        avatar: "https://i.pravatar.cc/150?u=current",
        role: "Senior Developer"
      },
      reporter: {
        id: "manager-001",
        name: "Trần Thị B",
        email: "b.tran@company.com",
        avatar: "https://i.pravatar.cc/150?u=manager001"
      },
      labels: [
        { id: "4", name: "Review", color: "purple" }
      ],
      dueDate: new Date(2025, 8, 2),
      createdAt: new Date(2025, 7, 27),
      updatedAt: new Date(2025, 7, 27),
      importanceLevel: "important",
      assignmentDate: new Date(2025, 7, 27),
      unitId: "1", // IT Department
      comments: [],
      attachments: [],
      watchers: []
    },
    {
      id: "GV.25.000158",
      title: "Cập nhật documentation hệ thống",
      description: "Cập nhật tài liệu kỹ thuật cho các API mới và quy trình deployment.",
      priority: "medium",
      status: "inProgress",
      taskType: "document",
      assignee: {
        id: "current-user",
        name: "Current User",
        email: "current@company.com",
        avatar: "https://i.pravatar.cc/150?u=current",
        role: "Senior Developer"
      },
      reporter: {
        id: "manager-001",
        name: "Trần Thị B",
        email: "b.tran@company.com",
        avatar: "https://i.pravatar.cc/150?u=manager001"
      },
      labels: [
        { id: "7", name: "Documentation", color: "gray" }
      ],
      dueDate: new Date(2025, 8, 5),
      createdAt: new Date(2025, 7, 26),
      updatedAt: new Date(2025, 7, 27),
      importanceLevel: "normal",
      assignmentDate: new Date(2025, 7, 26),
      unitId: "1", // IT Department
      comments: [],
      attachments: [],
      watchers: []
    },

    // HR Department tasks
    {
      id: "GV.25.000150",
      title: "Tuyển dụng Developer mới",
      description: "Tìm kiếm và phỏng vấn ứng viên cho vị trí Senior Developer.",
      priority: "high",
      status: "inProgress",
      taskType: "assignment",
      assignee: {
        id: "2",
        name: "Jane Smith",
        email: "jane@company.com",
        avatar: "https://i.pravatar.cc/150?u=2",
        role: "HR Manager"
      },
      reporter: {
        id: "manager-002",
        name: "Lê Văn E",
        email: "e.le@company.com",
        avatar: "https://i.pravatar.cc/150?u=manager002"
      },
      labels: [
        { id: "10", name: "Recruitment", color: "purple" }
      ],
      dueDate: new Date(2025, 8, 15),
      createdAt: new Date(2025, 7, 18),
      updatedAt: new Date(2025, 7, 26),
      importanceLevel: "important",
      assignmentDate: new Date(2025, 7, 18),
      unitId: "2", // HR Department
      comments: [],
      attachments: [],
      watchers: []
    },
    {
      id: "GV.25.000151",
      title: "Đánh giá hiệu suất nhân viên Q3",
      description: "Thực hiện đánh giá hiệu suất quý 3 cho toàn bộ nhân viên.",
      priority: "medium",
      status: "todo",
      taskType: "assignment",
      assignee: {
        id: "2",
        name: "Jane Smith",
        email: "jane@company.com",
        avatar: "https://i.pravatar.cc/150?u=2",
        role: "HR Manager"
      },
      reporter: {
        id: "manager-002",
        name: "Lê Văn E",
        email: "e.le@company.com",
        avatar: "https://i.pravatar.cc/150?u=manager002"
      },
      labels: [
        { id: "11", name: "Performance", color: "blue" }
      ],
      dueDate: new Date(2025, 8, 30),
      createdAt: new Date(2025, 7, 25),
      updatedAt: new Date(2025, 7, 25),
      importanceLevel: "normal",
      assignmentDate: new Date(2025, 7, 25),
      unitId: "2", // HR Department
      comments: [],
      attachments: [],
      watchers: []
    },

    // Accounting Department tasks
    {
      id: "GV.25.000152",
      title: "Báo cáo tài chính tháng 8",
      description: "Lập báo cáo tài chính chi tiết cho tháng 8/2025.",
      priority: "urgent",
      status: "inProgress",
      taskType: "document",
      assignee: {
        id: "emp-005",
        name: "Phạm Văn G",
        email: "g.pham@company.com",
        avatar: "https://i.pravatar.cc/150?u=emp005",
        role: "Senior Accountant"
      },
      reporter: {
        id: "manager-003",
        name: "Nguyễn Thị H",
        email: "h.nguyen@company.com",
        avatar: "https://i.pravatar.cc/150?u=manager003"
      },
      labels: [
        { id: "12", name: "Finance", color: "green" }
      ],
      dueDate: new Date(2025, 7, 31), // Overdue
      createdAt: new Date(2025, 7, 20),
      updatedAt: new Date(2025, 7, 26),
      importanceLevel: "very-important",
      assignmentDate: new Date(2025, 7, 20),
      unitId: "3", // Accounting Department
      comments: [],
      attachments: [],
      watchers: []
    },
    {
      id: "GV.25.000153",
      title: "Kiểm tra thuế VAT",
      description: "Rà soát và kiểm tra các khoản thuế VAT cần nộp.",
      priority: "medium",
      status: "done",
      taskType: "assignment",
      assignee: {
        id: "emp-006",
        name: "Lê Thị I",
        email: "i.le@company.com",
        avatar: "https://i.pravatar.cc/150?u=emp006",
        role: "Tax Specialist"
      },
      reporter: {
        id: "manager-003",
        name: "Nguyễn Thị H",
        email: "h.nguyen@company.com",
        avatar: "https://i.pravatar.cc/150?u=manager003"
      },
      labels: [
        { id: "13", name: "Tax", color: "yellow" }
      ],
      dueDate: new Date(2025, 8, 5),
      createdAt: new Date(2025, 7, 15),
      updatedAt: new Date(2025, 7, 22),
      completedAt: new Date(2025, 7, 22),
      importanceLevel: "normal",
      assignmentDate: new Date(2025, 7, 15),
      unitId: "3", // Accounting Department
      comments: [],
      attachments: [],
      watchers: []
    },

    // Marketing Department tasks
    {
      id: "GV.25.000154",
      title: "Chiến dịch quảng cáo Q4",
      description: "Lên kế hoạch và triển khai chiến dịch marketing cho quý 4.",
      priority: "high",
      status: "todo",
      taskType: "assignment",
      assignee: {
        id: "3",
        name: "Alice Johnson",
        email: "alice@company.com",
        avatar: "https://i.pravatar.cc/150?u=3",
        role: "Marketing Manager"
      },
      reporter: {
        id: "manager-004",
        name: "Trần Văn J",
        email: "j.tran@company.com",
        avatar: "https://i.pravatar.cc/150?u=manager004"
      },
      labels: [
        { id: "14", name: "Campaign", color: "pink" }
      ],
      dueDate: new Date(2025, 8, 20),
      createdAt: new Date(2025, 7, 26),
      updatedAt: new Date(2025, 7, 26),
      importanceLevel: "important",
      assignmentDate: new Date(2025, 7, 26),
      unitId: "4", // Marketing Department
      comments: [],
      attachments: [],
      watchers: []
    },

    // Sales Department tasks
    {
      id: "GV.25.000155",
      title: "Đàm phán hợp đồng khách hàng lớn",
      description: "Thương thảo và ký kết hợp đồng với khách hàng doanh nghiệp.",
      priority: "urgent",
      status: "inProgress",
      taskType: "assignment",
      assignee: {
        id: "4",
        name: "Bob Wilson",
        email: "bob@company.com",
        avatar: "https://i.pravatar.cc/150?u=4",
        role: "Sales Director"
      },
      reporter: {
        id: "manager-005",
        name: "Võ Thị K",
        email: "k.vo@company.com",
        avatar: "https://i.pravatar.cc/150?u=manager005"
      },
      labels: [
        { id: "15", name: "Sales", color: "cyan" }
      ],
      dueDate: new Date(2025, 8, 8),
      createdAt: new Date(2025, 7, 24),
      updatedAt: new Date(2025, 7, 26),
      importanceLevel: "very-important",
      assignmentDate: new Date(2025, 7, 24),
      unitId: "5", // Sales Department
      comments: [],
      attachments: [],
      watchers: []
    },
    {
      id: "GV.25.000156",
      title: "Báo cáo doanh số tháng 8",
      description: "Tổng hợp và phân tích doanh số bán hàng tháng 8.",
      priority: "medium",
      status: "done",
      taskType: "document",
      assignee: {
        id: "4",
        name: "Bob Wilson",
        email: "bob@company.com",
        avatar: "https://i.pravatar.cc/150?u=4",
        role: "Sales Director"
      },
      reporter: {
        id: "manager-005",
        name: "Võ Thị K",
        email: "k.vo@company.com",
        avatar: "https://i.pravatar.cc/150?u=manager005"
      },
      labels: [
        { id: "16", name: "Report", color: "gray" }
      ],
      dueDate: new Date(2025, 8, 2),
      createdAt: new Date(2025, 7, 20),
      updatedAt: new Date(2025, 7, 25),
      completedAt: new Date(2025, 7, 25),
      importanceLevel: "normal",
      assignmentDate: new Date(2025, 7, 20),
      unitId: "5", // Sales Department
      comments: [],
      attachments: [],
      watchers: []
    }
  ];



  const quickActions: QuickAction[] = [
    {
      key: "create-task",
      title: "Create Task",
      description: "Add new task",
      icon: "solar:add-circle-outline",
      color: "primary",
      onClick: handleCreateTask,
    },
    {
      key: "new-project",
      title: "New Project",
      description: "Start project",
      icon: "solar:widget-2-outline",
      color: "secondary",
      onClick: () => navigate("/task-management/projects/create"),
    },
    {
      key: "manage-team",
      title: "Manage Team",
      description: "Team settings",
      icon: "solar:users-group-two-rounded-outline",
      color: "warning",
      onClick: () => navigate("/task-management/team"),
    },
    {
      key: "view-reports",
      title: "View Reports",
      description: "Analytics",
      icon: "solar:chart-outline",
      color: "success",
      onClick: () => navigate("/task-management/reports"),
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
            <h1 className={title()}>{t('navigation.taskManagement.dashboard' as any)}</h1>
          </div>
          <p className="text-lg text-default-600">
            {t('apps.taskManagement.description' as any)}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <TaskStatsCards tasks={recentTasks} itemVariants={itemVariants} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-2 ">
                  {/* Project Progress */}
                  <DepartmentAnalyticsCard tasks={recentTasks} itemVariants={itemVariants} />
              </div>
              <div className="col-span-1 space-y-6">
                  {/* Recent Tasks */}
                  <RecentTasksCard
                      tasks={recentTasks.slice(0, 5)}
                      onTaskClick={handleTaskClick}
                      onCreateTask={handleCreateTask}
                      onViewAll={handleViewAllTasks}
                      itemVariants={itemVariants}
                  />

              </div>
          </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          



        </div>
      </motion.section>
    </DashboardLayout>
  );
}
