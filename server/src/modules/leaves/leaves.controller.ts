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
import { LeaveService } from './leaves.service';
import { LeaveRequest } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateLeaveRequestDto,
  UpdateLeaveRequestDto,
} from 'src/dtos/leaves.dto';

@Controller('leaves')
@UseGuards(JwtAuthGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get()
  findAll(@Body('employeeId') employeeId?: number): Promise<LeaveRequest[]> {
    return this.leaveService.findAll(employeeId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<LeaveRequest> {
    return this.leaveService.findOne(id);
  }

  @Post()
  create(
    @Body() createLeaveRequestDto: CreateLeaveRequestDto,
  ): Promise<LeaveRequest> {
    return this.leaveService.create(createLeaveRequestDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLeaveRequestDto: UpdateLeaveRequestDto,
  ): Promise<LeaveRequest> {
    return this.leaveService.update(id, updateLeaveRequestDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.leaveService.remove(id);
  }

  @Post(':id/approve')
  approve(@Param('id', ParseIntPipe) id: number): Promise<LeaveRequest> {
    return this.leaveService.approve(id);
  }

  @Post(':id/reject')
  reject(@Param('id', ParseIntPipe) id: number): Promise<LeaveRequest> {
    return this.leaveService.reject(id);
  }
}
