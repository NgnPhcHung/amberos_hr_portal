import { IsInt, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreatePerformanceReviewDto {
  @IsInt()
  employeeId: number;

  @IsDateString()
  reviewDate: string;

  @IsInt()
  rating: number;

  @IsOptional()
  @IsString()
  comments?: string;
}

export class UpdatePerformanceReviewDto {
  @IsOptional()
  @IsInt()
  employeeId?: number;

  @IsOptional()
  @IsDateString()
  reviewDate?: string;

  @IsOptional()
  @IsInt()
  rating?: number;

  @IsOptional()
  @IsString()
  comments?: string;
}
