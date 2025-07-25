import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LeaveRequest } from '@prisma/client';
import {
  CreateLeaveRequestDto,
  UpdateLeaveRequestDto,
} from 'src/dtos/leaves.dto';

@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService) {}

  async findAll(employeeId?: number): Promise<LeaveRequest[]> {
    return this.prisma.leaveRequest.findMany({
      where: employeeId ? { employeeId } : {},
    });
  }

  async findOne(id: number): Promise<LeaveRequest> {
    const leave = await this.prisma.leaveRequest.findUnique({ where: { id } });
    if (!leave) {
      throw new NotFoundException(`LeaveRequest with ID ${id} not found`);
    }
    return leave;
  }

  async create(
    createLeaveRequestDto: CreateLeaveRequestDto,
  ): Promise<LeaveRequest> {
    return this.prisma.leaveRequest.create({
      data: {
        ...createLeaveRequestDto,
        startDate: new Date(createLeaveRequestDto.startDate),
        endDate: new Date(createLeaveRequestDto.endDate),
      },
    });
  }

  async update(
    id: number,
    updateLeaveRequestDto: UpdateLeaveRequestDto,
  ): Promise<LeaveRequest> {
    await this.findOne(id);
    return this.prisma.leaveRequest.update({
      where: { id },
      data: {
        ...updateLeaveRequestDto,
        startDate: updateLeaveRequestDto.startDate
          ? new Date(updateLeaveRequestDto.startDate)
          : undefined,
        endDate: updateLeaveRequestDto.endDate
          ? new Date(updateLeaveRequestDto.endDate)
          : undefined,
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.leaveRequest.delete({ where: { id } });
  }

  async approve(id: number): Promise<LeaveRequest> {
    await this.findOne(id);
    return this.prisma.leaveRequest.update({
      where: { id },
      data: { status: 'approved' },
    });
  }

  async reject(id: number): Promise<LeaveRequest> {
    await this.findOne(id);
    return this.prisma.leaveRequest.update({
      where: { id },
      data: { status: 'rejected' },
    });
  }
}
