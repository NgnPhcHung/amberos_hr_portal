import {
  IsInt,
  IsString,
  IsBoolean,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateNotificationDto {
  @IsInt()
  userId: number;

  @IsString()
  message: string;

  @IsDateString()
  createdAt: string;

  @IsBoolean()
  read: boolean;
}

export class UpdateNotificationDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @IsOptional()
  @IsBoolean()
  read?: boolean;
}
