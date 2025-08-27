export interface TimeOffBalance {
  id: string;
  type: TimeOffType;
  name: string;
  icon: string;
  currentBalance: number;
  totalAllowed: number;
  unit: 'days' | 'hours';
}

export interface TimeOffRequest {
  id?: string;
  employeeId: string;
  type: TimeOffType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: RequestStatus;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
}

export interface WorkScheduleChangeRequest {
  id?: string;
  employeeId: string;
  requestedDate: string;
  currentStartTime: string;
  currentEndTime: string;
  requestedStartTime: string;
  requestedEndTime: string;
  reason: string;
  status: RequestStatus;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
}

export interface LateArrivalEarlyDepartureRequest {
  id?: string;
  employeeId: string;
  requestedDate: string;
  type: 'late_arrival' | 'early_departure';
  normalTime: string;
  requestedTime: string;
  reason: string;
  status: RequestStatus;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
}

export interface OvertimeRequest {
  id?: string;
  employeeId: string;
  requestedDate: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  reason: string;
  projectId?: string;
  taskId?: string;
  status: RequestStatus;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
}

export type TimeOffType = 
  | 'annual_leave'
  | 'unpaid_leave'
  | 'sick_leave'
  | 'vacation'
  | 'funeral_leave'
  | 'business_leave'
  | 'training_leave';

export type RequestStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled';

export interface TimeOffFormData {
  type: TimeOffType;
  startDate: string;
  endDate: string;
  reason: string;
  attachments?: File[];
}

export interface WorkScheduleChangeFormData {
  requestedDate: string;
  requestedStartTime: string;
  requestedEndTime: string;
  reason: string;
}

export interface LateArrivalEarlyDepartureFormData {
  requestedDate: string;
  type: 'late_arrival' | 'early_departure';
  requestedTime: string;
  reason: string;
}

export interface OvertimeFormData {
  requestedDate: string;
  startTime: string;
  endTime: string;
  reason: string;
  projectId?: string;
  taskId?: string;
}
