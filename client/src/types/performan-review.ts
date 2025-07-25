export interface PerformanceReview {
  id: number;
  employeeId: number;
  reviewDate: string;
  rating: number;
  comments?: string;
}
