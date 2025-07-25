import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PerformanceReview } from '@prisma/client';
import {
  CreatePerformanceReviewDto,
  UpdatePerformanceReviewDto,
} from 'src/dtos/performance-review.dto';

@Injectable()
export class PerformanceReviewService {
  constructor(private prisma: PrismaService) {}

  async findAll(employeeId?: number): Promise<PerformanceReview[]> {
    return this.prisma.performanceReview.findMany({
      where: employeeId ? { employeeId } : {},
    });
  }

  async findOne(id: number): Promise<PerformanceReview> {
    const review = await this.prisma.performanceReview.findUnique({
      where: { id },
    });
    if (!review) {
      throw new NotFoundException(`PerformanceReview with ID ${id} not found`);
    }
    return review;
  }

  async create(
    createPerformanceReviewDto: CreatePerformanceReviewDto,
  ): Promise<PerformanceReview> {
    return this.prisma.performanceReview.create({
      data: {
        ...createPerformanceReviewDto,
        reviewDate: new Date(createPerformanceReviewDto.reviewDate),
      },
    });
  }

  async update(
    id: number,
    updatePerformanceReviewDto: UpdatePerformanceReviewDto,
  ): Promise<PerformanceReview> {
    await this.findOne(id);
    return this.prisma.performanceReview.update({
      where: { id },
      data: {
        ...updatePerformanceReviewDto,
        reviewDate: updatePerformanceReviewDto.reviewDate
          ? new Date(updatePerformanceReviewDto.reviewDate)
          : undefined,
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.performanceReview.delete({ where: { id } });
  }
}
