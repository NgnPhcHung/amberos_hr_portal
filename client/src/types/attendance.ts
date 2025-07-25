export interface Attendance {
  id: number;
  employeeId: number;
  date: string;
  status: string;
  clockIn?: string;
  clockOut?: string;
}
