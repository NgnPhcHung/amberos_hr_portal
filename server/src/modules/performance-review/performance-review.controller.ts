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
import { PerformanceReviewService } from './performance-review.service';
import { PerformanceReview } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreatePerformanceReviewDto,
  UpdatePerformanceReviewDto,
} from 'src/dtos/performance-review.dto';

@Controller('performance-reviews')
@UseGuards(JwtAuthGuard)
export class PerformanceReviewController {
  constructor(
    private readonly performanceReviewService: PerformanceReviewService,
  ) {}

  @Get()
  findAll(
    @Body('employeeId') employeeId?: number,
  ): Promise<PerformanceReview[]> {
    return this.performanceReviewService.findAll(employeeId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PerformanceReview> {
    return this.performanceReviewService.findOne(id);
  }

  @Post()
  create(
    @Body() createPerformanceReviewDto: CreatePerformanceReviewDto,
  ): Promise<PerformanceReview> {
    return this.performanceReviewService.create(createPerformanceReviewDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePerformanceReviewDto: UpdatePerformanceReviewDto,
  ): Promise<PerformanceReview> {
    return this.performanceReviewService.update(id, updatePerformanceReviewDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id): Promise<void> {
    return this.performanceReviewService.remove(id);
  }
}
