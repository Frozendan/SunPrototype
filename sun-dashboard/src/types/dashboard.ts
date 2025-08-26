// Dashboard-specific types and interfaces

export interface TimeOffSummary {
  annualLeave: {
    remaining: number;
    total: number;
  };
  sickLeave: {
    remaining: number;
    total: number;
  };
}

export interface TimeOffRequest {
  id: string;
  type: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity';
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  submittedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  isAllDay: boolean;
  type: 'meeting' | 'event' | 'reminder' | 'deadline';
  attendees?: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'inProgress' | 'review' | 'done';
  dueDate?: string;
  assignedTo: string;
  assignedBy?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail?: string;
  publishedAt: string;
  author: string;
  category: string;
  readTime?: number;
  url?: string;
}

export interface Celebration {
  id: string;
  type: 'birthday' | 'anniversary' | 'achievement';
  employeeName: string;
  employeeAvatar?: string;
  date: string;
  title: string;
  description?: string;
  yearsOfService?: number; // For anniversaries
  achievementType?: string; // For achievements
}

export interface EmployeeOnLeave {
  id: string;
  name: string;
  avatar?: string;
  department: string;
  leaveType: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity';
  startDate: string;
  endDate: string;
  returnDate: string;
}

export interface NewTeamMember {
  id: string;
  name: string;
  avatar?: string;
  position: string;
  department: string;
  joinDate: string;
  manager?: string;
  bio?: string;
}

// Dashboard card loading states
export interface DashboardCardState {
  isLoading: boolean;
  error?: string;
  lastUpdated?: string;
}

// Combined dashboard data interface
export interface DashboardData {
  timeOffSummary: TimeOffSummary;
  timeOffRequests: TimeOffRequest[];
  calendarEvents: CalendarEvent[];
  tasks: Task[];
  news: NewsArticle[];
  celebrations: Celebration[];
  employeesOnLeave: EmployeeOnLeave[];
  newTeamMembers: NewTeamMember[];
}

// Dashboard card props interfaces
export interface DashboardCardProps {
  className?: string;
}

export interface TimeOffSummaryCardProps extends DashboardCardProps {
  data: TimeOffSummary;
  state: DashboardCardState;
  onRequestTimeOff: () => void;
  onCalculateTimeOff: () => void;
}

export interface TimeOffRequestsCardProps extends DashboardCardProps {
  data: TimeOffRequest[];
  state: DashboardCardState;
  onViewAll: () => void;
}

export interface CalendarCardProps extends DashboardCardProps {
  data: CalendarEvent[];
  state: DashboardCardState;
  onViewFullCalendar: () => void;
}

export interface TasksCardProps extends DashboardCardProps {
  data: Task[];
  state: DashboardCardState;
  onViewAllTasks: () => void;
  onMarkComplete: (taskId: string) => void;
  onViewDetails: (taskId: string) => void;
}

export interface NewsCardProps extends DashboardCardProps {
  data: NewsArticle[];
  state: DashboardCardState;
  onViewAllNews: () => void;
  onReadMore: (articleId: string) => void;
}

export interface CelebrationsCardProps extends DashboardCardProps {
  data: Celebration[];
  state: DashboardCardState;
}

export interface WhosOutCardProps extends DashboardCardProps {
  data: EmployeeOnLeave[];
  state: DashboardCardState;
}

export interface WelcomeCardProps extends DashboardCardProps {
  data: NewTeamMember[];
  state: DashboardCardState;
}
