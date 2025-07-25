import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Document } from '@prisma/client';
import { CreateDocumentDto, UpdateDocumentDto } from 'src/dtos/documents.dto';

@Injectable()
export class DocumentService {
  constructor(private prisma: PrismaService) {}

  async findAll(employeeId?: number): Promise<Document[]> {
    return this.prisma.document.findMany({
      where: employeeId ? { employeeId } : {},
    });
  }

  async findOne(id: number): Promise<Document> {
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
  }

  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    const employee = await this.prisma.employee.findUnique({
      where: { id: createDocumentDto.employeeId },
    });
    if (!employee || employee.isArchived) {
      throw new BadRequestException(
        `Invalid or archived employeeId: ${createDocumentDto.employeeId}`,
      );
    }
    return this.prisma.document.create({
      data: {
        ...createDocumentDto,
        uploadedAt: new Date(createDocumentDto.uploadedAt),
      },
    });
  }

  async update(
    id: number,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    const employee = await this.prisma.employee.findUnique({
      where: { id: updateDocumentDto.employeeId },
    });
    if (!employee || employee.isArchived) {
      throw new BadRequestException(
        `Invalid or archived employeeId: ${updateDocumentDto.employeeId}`,
      );
    }

    await this.findOne(id);
    return this.prisma.document.update({
      where: { id },
      data: {
        ...updateDocumentDto,
        uploadedAt: updateDocumentDto.uploadedAt
          ? new Date(updateDocumentDto.uploadedAt)
          : undefined,
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.document.delete({ where: { id } });
  }

  async upload(id: number, filePath: string): Promise<Document> {
    await this.findOne(id);
    return this.prisma.document.update({
      where: { id },
      data: { filePath },
    });
  }
}
