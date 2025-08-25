"use client";

import { useState } from "react";
import { Button, Chip, Avatar, useDisclosure, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Listbox, ListboxItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowDown, Minus, ArrowUp, ChevronsUp, MoreVertical, Trash2, Link, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FormSection } from "@/components/ui/form-section";
import { CreateTaskModal } from "../create-task-modal";
import { useTranslation } from "@/lib/i18n-context";
import type { TaskFormData, TaskFormErrors, UpdateFieldFunction, MockUnit, MockAssignee, MockAssignmentReference, MockFunctionalGroup, MockTopic, MockTaskType } from "@/types/task-form";

// Mock subtask data - in real app this would come from props or API
interface Subtask {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: {
    id: string;
    name: string;
    avatar: string;
  };
  dueDate?: string;
  createdAt: string;
}

interface SubtasksSectionProps {
  parentTaskId: string;
  formData: TaskFormData;
  errors: TaskFormErrors;
  updateField: UpdateFieldFunction;
  mockUnits: MockUnit[];
  mockAssignees: MockAssignee[];
  mockAssignmentReferences: MockAssignmentReference[];
  mockFunctionalGroups: MockFunctionalGroup[];
  mockTopics: MockTopic[];
  mockTaskTypes: MockTaskType[];
}

const mockSubtasks: Subtask[] = [
  {
    id: "ST.25.000001",
    title: "Thiết kế giao diện người dùng",
    status: "done",
    priority: "high",
    assignee: {
      id: "1",
      name: "Nguyễn Văn A",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
    },
    dueDate: "2025-08-30",
    createdAt: "2025-08-20"
  },
  {
    id: "ST.25.000002", 
    title: "Phát triển API backend",
    status: "in-progress",
    priority: "urgent",
    assignee: {
      id: "2",
      name: "Trần Thị B",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
    },
    dueDate: "2025-09-05",
    createdAt: "2025-08-22"
  },
  {
    id: "ST.25.000003",
    title: "Viết unit tests",
    status: "todo",
    priority: "medium",
    assignee: {
      id: "3",
      name: "Lê Văn C",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d"
    },
    dueDate: "2025-09-10",
    createdAt: "2025-08-25"
  }
];

export function SubtasksSection({
  parentTaskId,
  formData,
  errors,
  updateField,
  mockUnits,
  mockAssignees,
  mockAssignmentReferences,
  mockFunctionalGroups,
  mockTopics,
  mockTaskTypes
}: SubtasksSectionProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isParentModalOpen, onOpen: onParentModalOpen, onClose: onParentModalClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  const [subtasks, setSubtasks] = useState<Subtask[]>(mockSubtasks);
  const [selectedSubtaskForAction, setSelectedSubtaskForAction] = useState<string | null>(null);
  const [parentSearchQuery, setParentSearchQuery] = useState("");
  const [selectedParentTask, setSelectedParentTask] = useState<string | null>(null);
  const [currentParentTask, setCurrentParentTask] = useState<{id: string; title: string} | null>(null);

  // Mock available parent tasks - in real app this would come from API
  const mockAvailableParentTasks = [
    {
      id: "GV.25.000147",
      title: "Phát triển hệ thống quản lý người dùng",
      description: "Xây dựng hệ thống quản lý người dùng với phân quyền chi tiết"
    },
    {
      id: "GV.25.000148",
      title: "Tối ưu hóa hiệu suất ứng dụng",
      description: "Cải thiện tốc độ tải trang và trải nghiệm người dùng"
    },
    {
      id: "GV.25.000149",
      title: "Triển khai hệ thống backup tự động",
      description: "Thiết lập quy trình sao lưu dữ liệu định kỳ"
    },
    {
      id: "GV.25.000150",
      title: "Phát triển API RESTful",
      description: "Xây dựng API cho ứng dụng mobile và web"
    }
  ];

  // Get status color and icon
  const getStatusConfig = (status: Subtask['status']) => {
    switch (status) {
      case 'todo':
        return { color: 'default', icon: 'solar:clock-circle-bold', label: 'Chờ thực hiện' };
      case 'in-progress':
        return { color: 'primary', icon: 'solar:play-circle-bold', label: 'Đang thực hiện' };
      case 'done':
        return { color: 'success', icon: 'solar:check-circle-bold', label: 'Hoàn thành' };
      case 'cancelled':
        return { color: 'danger', icon: 'solar:close-circle-bold', label: 'Đã hủy' };
      default:
        return { color: 'default', icon: 'solar:clock-circle-bold', label: 'Chờ thực hiện' };
    }
  };

  // Get priority config with Lucide icons
  const getPriorityConfig = (priority: Subtask['priority']) => {
    switch (priority) {
      case 'low':
        return {
          icon: ArrowDown,
          color: 'text-blue-600',
          label: 'Thấp'
        };
      case 'medium':
        return {
          icon: Minus,
          color: 'text-gray-600',
          label: 'Bình thường'
        };
      case 'high':
        return {
          icon: ArrowUp,
          color: 'text-orange-600',
          label: 'Quan trọng'
        };
      case 'urgent':
        return {
          icon: ChevronsUp,
          color: 'text-red-600',
          label: 'Khẩn cấp'
        };
      default:
        return {
          icon: Minus,
          color: 'text-gray-600',
          label: 'Bình thường'
        };
    }
  };

  // Handle subtask creation
  const handleSubtaskCreated = (newSubtask: any) => {
    // In real app, this would make an API call
    const subtask: Subtask = {
      id: `ST.25.${String(Date.now()).slice(-6)}`,
      title: newSubtask.title,
      status: 'todo',
      priority: newSubtask.priority || 'medium',
      assignee: newSubtask.assigneeId ? mockAssignees.find(a => a.id === newSubtask.assigneeId) : undefined,
      dueDate: newSubtask.requiredDeadline,
      createdAt: new Date().toISOString()
    };

    setSubtasks(prev => [...prev, subtask]);
    onClose();
  };

  // Handle subtask click to navigate to detail page
  const handleSubtaskClick = (subtaskId: string) => {
    navigate(`/task-management/task/${subtaskId}`);
  };

  // Handle section-level parent task assignment
  const handleAddSectionParentTask = () => {
    setParentSearchQuery("");
    setSelectedParentTask(null);
    onParentModalOpen();
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    setSelectedSubtaskForAction(subtaskId);
    onDeleteModalOpen();
  };

  const handleConfirmAddParent = () => {
    if (selectedParentTask) {
      // Find the selected parent task details
      const parentTaskDetails = mockAvailableParentTasks.find(task => task.id === selectedParentTask);
      if (parentTaskDetails) {
        // Set or replace the current parent task
        setCurrentParentTask({
          id: parentTaskDetails.id,
          title: parentTaskDetails.title
        });
        // In real app, this would make an API call to update the parent relationship for all subtasks
        console.log(`Setting parent ${selectedParentTask} for all subtasks in this section`);
      }
      onParentModalClose();
      setSelectedParentTask(null);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedSubtaskForAction) {
      // In real app, this would make an API call to delete the subtask
      setSubtasks(prev => prev.filter(subtask => subtask.id !== selectedSubtaskForAction));
      onDeleteModalClose();
      setSelectedSubtaskForAction(null);
    }
  };

  const handleRemoveParentTask = () => {
    setCurrentParentTask(null);
    // In real app, this would make an API call to remove the parent relationship
    console.log('Removing parent task from all subtasks in this section');
  };

  // Filter available parent tasks based on search query
  const filteredParentTasks = mockAvailableParentTasks.filter(task =>
    task.title.toLowerCase().includes(parentSearchQuery.toLowerCase()) ||
    task.id.toLowerCase().includes(parentSearchQuery.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  return (
    <FormSection>
      <div className="space-y-4">
        {/* Header with Add Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-md font-bold text-default-700">
              Công việc liên quan ({subtasks.length})
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              color="secondary"
              variant="flat"
              startContent={<Link size={16} />}
              onPress={handleAddSectionParentTask}
              className="h-8"
            >
              {currentParentTask ? 'Thay đổi công việc cha' : 'Thêm công việc cha'}
            </Button>
            <Button
              size="sm"
              color="primary"
              variant="flat"
              startContent={<Plus size={16} />}
              onPress={onOpen}
              className="h-8"
            >
              Thêm công việc liên quan
            </Button>
          </div>
        </div>

        {/* Parent Task Display */}
        {currentParentTask && (
          <div className="mb-4 space-y-2">
            <p className="text-sm font-bold">Công việc cha</p>
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 items-center py-2 px-3 rounded-lg hover:bg-default-50 transition-colors cursor-pointer"
                 onClick={() => navigate(`/task-management/task/${currentParentTask.id}`)}>
              {/* 1. Link Icon - Fixed width column (replacing priority icon) */}
              <div className="w-12 flex justify-center">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <Link size={14} className="text-blue-600" />
                </div>
              </div>

              {/* 2. Task Name - Flexible column */}
              <div className="min-w-0">
                <p className="text-sm font-medium text-default-700 truncate text-ellipsis overflow-hidden">
                  {currentParentTask.title}
                </p>
                <p className="text-xs text-default-500 truncate">
                  {currentParentTask.id}
                </p>
              </div>

              {/* 3. Status - Fixed width column */}
              <div className="w-24">
                <Chip
                  size="sm"
                  variant="flat"
                  color="primary"
                  className="text-xs"
                >
                  Đang thực hiện
                </Chip>
              </div>

              {/* 4. Assignee - Fixed width column */}
              <div className="w-32">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-default-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-default-500">?</span>
                  </div>
                  <span className="text-xs text-default-500 truncate">
                    Chưa giao
                  </span>
                </div>
              </div>

              {/* 5. Actions - Fixed width column */}
              <div className="w-10 flex justify-center">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="h-6 w-6 min-w-6"
                      aria-label="Thao tác"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical size={14} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Thao tác công việc cha">
                    <DropdownItem
                      key="remove"
                      className="text-danger"
                      color="danger"
                      startContent={<Trash2 size={16} />}
                      onPress={handleRemoveParentTask}
                    >
                      Xóa công việc cha
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </div>
        )}

        {/* Subtasks List - Grid Layout for Table-like Alignment */}
        <div className="space-y-1">
          {/* Grid Header (Optional - for visual reference) */}
            <p className="text-sm font-bold">Công việc con</p>
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 px-3 py-1 text-xs font-medium text-default-500 border-b border-default-200">
            <div className="w-12 text-center">Ưu tiên</div>
            <div>Tên công việc</div>
            <div className="w-24 text-center">Trạng thái</div>
            <div className="w-32 text-center">Người thực hiện</div>
            <div className="w-10 text-center">Thao tác</div>
          </div>

          <AnimatePresence>
            {subtasks.map((subtask, index) => {
              const statusConfig = getStatusConfig(subtask.status);
              const priorityConfig = getPriorityConfig(subtask.priority);
              const PriorityIcon = priorityConfig.icon;

              return (
                <motion.div
                  key={subtask.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 items-center py-2 px-3 rounded-lg hover:bg-default-50 transition-colors">
                    {/* 1. Priority Icon - Fixed width column */}
                    <div className="w-12 flex justify-center">
                      <PriorityIcon
                        size={16}
                        className={priorityConfig.color}
                        title={priorityConfig.label}
                      />
                    </div>

                    {/* 2. Task Name - Flexible column */}
                    <div
                      className="min-w-0 cursor-pointer"
                      onClick={() => handleSubtaskClick(subtask.id)}
                    >
                      <p className="text-sm font-medium text-default-700 truncate text-ellipsis overflow-hidden">
                        {subtask.title}
                      </p>
                      <p className="text-xs text-default-500 truncate">
                        {subtask.id}
                      </p>
                    </div>

                    {/* 3. Status Indicator - Fixed width column */}
                    <div className="w-24 flex justify-center">
                      <Chip
                        size="sm"
                        variant="flat"
                        color={statusConfig.color as any}
                        className="h-6 text-xs min-w-0"
                      >
                        <span className="truncate">
                          {statusConfig.label}
                        </span>
                      </Chip>
                    </div>

                    {/* 4. Assignee - Fixed width column */}
                    <div className="w-32">
                      {subtask.assignee ? (
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar
                            src={subtask.assignee.avatar}
                            name={subtask.assignee.name}
                            size="sm"
                            className="w-6 h-6 flex-shrink-0"
                          />
                          <span className="text-xs text-default-600 truncate">
                            {subtask.assignee.name}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-default-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-default-500">?</span>
                          </div>
                          <span className="text-xs text-default-500 truncate">
                            Chưa giao
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 5. Actions - Only for subtasks (ST. prefix) */}
                    <div className="w-10 flex justify-center">
                      {subtask.id.startsWith('ST.') && (
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              className="h-6 w-6 min-w-6"
                              aria-label="Thao tác"
                            >
                              <MoreVertical size={14} />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="Thao tác công việc con">
                            <DropdownItem
                              key="delete"
                              className="text-danger"
                              color="danger"
                              startContent={<Trash2 size={16} />}
                              onPress={() => handleDeleteSubtask(subtask.id)}
                            >
                              Xóa công việc con
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Empty State */}
          {subtasks.length === 0 && (
            <div className="text-center py-6">
              <div className="flex flex-col items-center gap-2">
                <div className="p-2 rounded-full bg-default-100">
                  <Icon icon="solar:list-check-bold" width={20} className="text-default-400" />
                </div>
                <div>
                  <p className="text-sm text-default-600">
                    Chưa có công việc con nào
                  </p>
                  <p className="text-xs text-default-500">
                    Thêm công việc con để chia nhỏ công việc này
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Parent Task Modal */}
      <Modal
        isOpen={isParentModalOpen}
        onClose={onParentModalClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">Chọn công việc cha</h3>
            <p className="text-sm text-default-500">
              Chọn một công việc để làm công việc cha cho tất cả công việc con trong phần này
            </p>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              {/* Search Input */}
              <Input
                placeholder="Tìm kiếm công việc..."
                value={parentSearchQuery}
                onValueChange={setParentSearchQuery}
                startContent={<Search size={16} />}
                variant="bordered"
              />

              {/* Task List */}
              <div className="max-h-64 overflow-y-auto">
                <Listbox
                  aria-label="Chọn công việc cha"
                  selectedKeys={selectedParentTask ? [selectedParentTask] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setSelectedParentTask(selected);
                  }}
                  selectionMode="single"
                >
                  {filteredParentTasks.map((task) => (
                    <ListboxItem
                      key={task.id}
                      value={task.id}
                      className="py-3"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{task.title}</span>
                          <span className="text-xs text-default-500 bg-default-100 px-2 py-1 rounded">
                            {task.id}
                          </span>
                        </div>
                        <p className="text-sm text-default-500">{task.description}</p>
                      </div>
                    </ListboxItem>
                  ))}
                </Listbox>
              </div>

              {filteredParentTasks.length === 0 && (
                <div className="text-center py-8 text-default-500">
                  <p>Không tìm thấy công việc nào</p>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onParentModalClose}>
              Hủy
            </Button>
            <Button
              color="primary"
              onPress={handleConfirmAddParent}
              isDisabled={!selectedParentTask}
            >
              Xác nhận
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        size="md"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-danger">Xác nhận xóa</h3>
          </ModalHeader>
          <ModalBody>
            <p className="text-default-700">
              Bạn có chắc chắn muốn xóa công việc con "{selectedSubtaskForAction}"?
            </p>
            <p className="text-sm text-default-500">
              Hành động này không thể hoàn tác.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteModalClose}>
              Hủy
            </Button>
            <Button
              color="danger"
              onPress={handleConfirmDelete}
            >
              Xóa
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Create Subtask Modal */}
      <CreateTaskModal
        isOpen={isOpen}
        onClose={onClose}
        onTaskCreated={handleSubtaskCreated}
        parentTaskId={parentTaskId}
        mockUnits={mockUnits}
        mockAssignees={mockAssignees}
        mockAssignmentReferences={mockAssignmentReferences}
        mockFunctionalGroups={mockFunctionalGroups}
        mockTopics={mockTopics}
        mockTaskTypes={mockTaskTypes}
      />
    </FormSection>
  );
}
