import { Module } from '@nestjs/common';
import { DocumentService } from './documents.service';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentsController } from './documents.controller';

@Module({
  providers: [DocumentService, PrismaService],
  controllers: [DocumentsController],
})
export class DocumentModule {}
