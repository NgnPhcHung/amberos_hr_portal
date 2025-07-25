export interface Payroll {
  id: number;
  employeeId: number;
  amount: number;
  date: string;
  deductions?: number;
  bonuses?: number;
}
