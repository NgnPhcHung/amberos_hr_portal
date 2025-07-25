import { IsInt, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateLeaveRequestDto {
  @IsInt()
  employeeId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  type: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class UpdateLeaveRequestDto {
  @IsOptional()
  @IsInt()
  employeeId?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
