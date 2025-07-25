import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Employee } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateEmployeeDto, UpdateEmployeeDto } from 'src/dtos/employee.dto';

@Controller('employees')
@UseGuards(JwtAuthGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  findAll(
    @Query('includeArchived') includeArchived?: string,
  ): Promise<Employee[]> {
    return this.employeeService.findAll(includeArchived === 'true');
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Employee> {
    return this.employeeService.findOne(id);
  }

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    return this.employeeService.create(createEmployeeDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  archive(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.employeeService.archive(id);
  }

  @Post(':id/restore')
  restore(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.employeeService.restore(id);
  }
}
