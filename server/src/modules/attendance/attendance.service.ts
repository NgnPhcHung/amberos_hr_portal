import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Attendance } from '@prisma/client';
import {
  CreateAttendanceDto,
  UpdateAttendanceDto,
} from 'src/dtos/attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async findAll(employeeId?: number): Promise<Attendance[]> {
    return this.prisma.attendance.findMany({
      where: employeeId ? { employeeId } : {},
    });
  }

  async findOne(id: number): Promise<Attendance> {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
    });
    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }
    return attendance;
  }

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    const employee = await this.prisma.employee.findUnique({
      where: { id: createAttendanceDto.employeeId },
    });
    if (!employee || employee.isArchived) {
      throw new BadRequestException(
        `Invalid or archived employeeId: ${createAttendanceDto.employeeId}`,
      );
    }
    return this.prisma.attendance.create({
      data: {
        ...createAttendanceDto,
        date: new Date(createAttendanceDto.date),
        clockIn: createAttendanceDto.clockIn
          ? new Date(createAttendanceDto.clockIn)
          : undefined,
        clockOut: createAttendanceDto.clockOut
          ? new Date(createAttendanceDto.clockOut)
          : undefined,
      },
    });
  }

  async update(
    id: number,
    updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<Attendance> {
    const employee = await this.prisma.employee.findUnique({
      where: { id: updateAttendanceDto.employeeId },
    });
    if (!employee || employee.isArchived) {
      throw new BadRequestException(
        `Invalid or archived employeeId: ${updateAttendanceDto.employeeId}`,
      );
    }
    await this.findOne(id);
    return this.prisma.attendance.update({
      where: { id },
      data: {
        ...updateAttendanceDto,
        date: updateAttendanceDto.date
          ? new Date(updateAttendanceDto.date)
          : undefined,
        clockIn: updateAttendanceDto.clockIn
          ? new Date(updateAttendanceDto.clockIn)
          : undefined,
        clockOut: updateAttendanceDto.clockOut
          ? new Date(updateAttendanceDto.clockOut)
          : undefined,
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.attendance.delete({ where: { id } });
  }

  async clockIn(employeeId: number): Promise<Attendance> {
    return this.prisma.attendance.create({
      data: {
        employeeId,
        date: new Date(),
        status: 'present',
        clockIn: new Date(),
      },
    });
  }

  async clockOut(id: number): Promise<Attendance> {
    await this.findOne(id);
    return this.prisma.attendance.update({
      where: { id },
      data: { clockOut: new Date(), status: 'present' },
    });
  }
}
