import type { MockUnit, MockAssignee, MockAssignmentReference, MockLabel } from "@/types/task-form";

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
