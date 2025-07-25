export interface LeaveRequest {
  id: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  reason?: string;
}
