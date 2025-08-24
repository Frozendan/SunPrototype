import type { MockUnit, MockAssignee, MockAssignmentReference } from "@/types/task-form";

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

// User-to-Unit mapping for auto-updates
export const getUserUnitMapping = (assigneeId: string): string => {
  const assignee = mockAssignees.find(a => a.id === assigneeId);
  return assignee?.unitId || "";
};

// Check if assignee is current user
export const isCurrentUser = (assigneeId: string): boolean => {
  return assigneeId === "current-user";
};
