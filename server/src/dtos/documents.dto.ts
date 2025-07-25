import { IsInt, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateDocumentDto {
  @IsInt()
  employeeId: number;

  @IsString()
  fileName: string;

  @IsString()
  filePath: string;

  @IsDateString()
  uploadedAt: string;
}

export class UpdateDocumentDto {
  @IsOptional()
  @IsInt()
  employeeId?: number;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsString()
  filePath?: string;

  @IsOptional()
  @IsDateString()
  uploadedAt?: string;
}
