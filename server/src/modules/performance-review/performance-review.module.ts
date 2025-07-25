import { Module } from '@nestjs/common';
import { PerformanceReviewService } from './performance-review.service';
import { PerformanceReviewController } from './performance-review.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [PerformanceReviewService, PrismaService],
  controllers: [PerformanceReviewController],
})
export class PerformanceReviewModule {}
