import type { MockUnit, MockAssignee, MockAssignmentReference, MockLabel, MockFunctionalGroup, MockTopic, MockTaskType } from "@/types/task-form";

export const mockUnits: MockUnit[] = [
  { id: "1", name: "Phòng Công nghệ thông tin" },
  { id: "2", name: "Phòng Nhân sự" },
  { id: "3", name: "Phòng Kế toán" },
  { id: "4", name: "Phòng Marketing" },
  { id: "5", name: "Phòng Kinh doanh" },
];

export const mockAssignees: MockAssignee[] = [
  { id: "current-user", name: "Current User", avatar: "https://i.pravatar.cc/150?u=current", unitId: "1" },
  { id: "1", name: "John Doe", avatar: "https://i.pravatar.cc/150?u=1", unitId: "1" },
  { id: "2", name: "Jane Smith", avatar: "https://i.pravatar.cc/150?u=2", unitId: "2" },
  { id: "3", name: "Alice Johnson", avatar: "https://i.pravatar.cc/150?u=3", unitId: "4" },
  { id: "4", name: "Bob Wilson", avatar: "https://i.pravatar.cc/150?u=4", unitId: "5" },
];

export const mockAssignmentReferences: MockAssignmentReference[] = [
  { id: "1", name: "Nhiệm vụ trọng tâm" },
  { id: "2", name: "Nhiệm vụ chức năng" },
  { id: "3", name: "Khác" },
];

export const mockLabels: MockLabel[] = [
  { id: "1", name: "Frontend", color: "blue", description: "Frontend development tasks" },
  { id: "2", name: "Backend", color: "green", description: "Backend development tasks" },
  { id: "3", name: "Design", color: "purple", description: "UI/UX design tasks" },
  { id: "4", name: "Security", color: "red", description: "Security related tasks" },
  { id: "5", name: "DevOps", color: "orange", description: "DevOps and infrastructure tasks" },
  { id: "6", name: "Testing", color: "yellow", description: "Testing and QA tasks" },
  { id: "7", name: "Documentation", color: "gray", description: "Documentation tasks" },
  { id: "8", name: "Bug Fix", color: "pink", description: "Bug fixing tasks" },
  { id: "9", name: "Feature", color: "cyan", description: "New feature development" },
  { id: "10", name: "Urgent", color: "red", description: "Urgent priority tasks" },
];

// User-to-Unit mapping for auto-updates
export const getUserUnitMapping = (assigneeId: string): string => {
  const assignee = mockAssignees.find(a => a.id === assigneeId);
  return assignee?.unitId || "";
};

// Check if assignee is current user
export const isCurrentUser = (assigneeId: string): boolean => {
  return assigneeId === "current-user";
};

export const mockFunctionalGroups: MockFunctionalGroup[] = [
  { id: "1", name: "Phát triển phần mềm", description: "Software development related tasks" },
  { id: "2", name: "Quản lý dự án", description: "Project management activities" },
  { id: "3", name: "Kiểm thử chất lượng", description: "Quality assurance and testing" },
  { id: "4", name: "Bảo mật hệ thống", description: "System security and compliance" },
  { id: "5", name: "Hỗ trợ kỹ thuật", description: "Technical support and maintenance" },
];

export const mockTopics: MockTopic[] = [
  // Software Development topics
  { id: "1", name: "Frontend Development", functionalGroupId: "1" },
  { id: "2", name: "Backend Development", functionalGroupId: "1" },
  { id: "3", name: "Mobile Development", functionalGroupId: "1" },
  { id: "4", name: "Database Design", functionalGroupId: "1" },

  // Project Management topics
  { id: "5", name: "Sprint Planning", functionalGroupId: "2" },
  { id: "6", name: "Resource Allocation", functionalGroupId: "2" },
  { id: "7", name: "Risk Management", functionalGroupId: "2" },
  { id: "8", name: "Stakeholder Communication", functionalGroupId: "2" },

  // Quality Assurance topics
  { id: "9", name: "Unit Testing", functionalGroupId: "3" },
  { id: "10", name: "Integration Testing", functionalGroupId: "3" },
  { id: "11", name: "Performance Testing", functionalGroupId: "3" },
  { id: "12", name: "User Acceptance Testing", functionalGroupId: "3" },

  // System Security topics
  { id: "13", name: "Vulnerability Assessment", functionalGroupId: "4" },
  { id: "14", name: "Access Control", functionalGroupId: "4" },
  { id: "15", name: "Data Protection", functionalGroupId: "4" },
  { id: "16", name: "Compliance Audit", functionalGroupId: "4" },

  // Technical Support topics
  { id: "17", name: "Bug Fixes", functionalGroupId: "5" },
  { id: "18", name: "System Maintenance", functionalGroupId: "5" },
  { id: "19", name: "User Training", functionalGroupId: "5" },
  { id: "20", name: "Documentation", functionalGroupId: "5" },
];

export const mockTaskTypes: MockTaskType[] = [
  { id: "1", name: "Development", description: "Development and coding tasks" },
  { id: "2", name: "Research", description: "Research and analysis tasks" },
  { id: "3", name: "Meeting", description: "Meetings and discussions" },
  { id: "4", name: "Review", description: "Code review and documentation review" },
  { id: "5", name: "Testing", description: "Testing and quality assurance" },
  { id: "6", name: "Deployment", description: "Deployment and release tasks" },
  { id: "7", name: "Maintenance", description: "System maintenance and support" },
  { id: "8", name: "Training", description: "Training and knowledge sharing" },
];
