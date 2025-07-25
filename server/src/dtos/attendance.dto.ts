import { IsInt, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateAttendanceDto {
  @IsInt()
  employeeId: number;

  @IsDateString()
  date: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsDateString()
  clockIn?: string;

  @IsOptional()
  @IsDateString()
  clockOut?: string;
}

export class UpdateAttendanceDto {
  @IsOptional()
  @IsInt()
  employeeId?: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  clockIn?: string;

  @IsOptional()
  @IsDateString()
  clockOut?: string;
}
