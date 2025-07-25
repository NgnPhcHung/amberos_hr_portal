import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  position: string;

  @IsString()
  department: string;

  @IsDateString()
  hireDate: string;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsDateString()
  hireDate?: string;

  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}
