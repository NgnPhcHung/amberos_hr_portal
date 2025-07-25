import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Attendance } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AttendanceService } from './attendance.service';
import {
  CreateAttendanceDto,
  UpdateAttendanceDto,
} from 'src/dtos/attendance.dto';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  findAll(@Body('employeeId') employeeId?: number): Promise<Attendance[]> {
    return this.attendanceService.findAll(employeeId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Attendance> {
    return this.attendanceService.findOne(id);
  }

  @Post()
  create(
    @Body() createAttendanceDto: CreateAttendanceDto,
  ): Promise<Attendance> {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<Attendance> {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.attendanceService.remove(id);
  }

  @Post('clock-in/:employeeId')
  clockIn(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<Attendance> {
    return this.attendanceService.clockIn(employeeId);
  }

  @Post('clock-out/:id')
  clockOut(@Param('id', ParseIntPipe) id: number): Promise<Attendance> {
    return this.attendanceService.clockOut(id);
  }
}
