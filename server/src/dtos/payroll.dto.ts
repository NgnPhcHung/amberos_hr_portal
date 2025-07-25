import { IsInt, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreatePayrollDto {
  @IsInt()
  employeeId: number;

  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsNumber()
  deductions?: number;

  @IsOptional()
  @IsNumber()
  bonuses?: number;
}

export class UpdatePayrollDto {
  @IsOptional()
  @IsInt()
  employeeId?: number;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsNumber()
  deductions?: number;

  @IsOptional()
  @IsNumber()
  bonuses?: number;
}
