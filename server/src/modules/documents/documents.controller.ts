import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { DocumentService } from './documents.service';
import { Document } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateDocumentDto, UpdateDocumentDto } from 'src/dtos/documents.dto';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentService) {}

  @Get()
  findAll(@Body('employeeId') employeeId?: number): Promise<Document[]> {
    return this.documentsService.findAll(employeeId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Document> {
    return this.documentsService.findOne(id);
  }

  @Post()
  create(@Body() createDocumentDto: CreateDocumentDto): Promise<Document> {
    return this.documentsService.create(createDocumentDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.documentsService.remove(id);
  }

  @Post(':id/upload')
  upload(
    @Param('id', ParseIntPipe) id: number,
    @Body('filePath') filePath: string,
  ): Promise<Document> {
    return this.documentsService.upload(id, filePath);
  }
}
