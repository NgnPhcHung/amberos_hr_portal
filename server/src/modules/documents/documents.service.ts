import { Injectable, NotFoundException } from '@nestjs/common';
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
    // Logic to handle actual file upload (e.g., to S3 or local storage) can be added here
    return this.prisma.document.update({
      where: { id },
      data: { filePath },
    });
  }
}
