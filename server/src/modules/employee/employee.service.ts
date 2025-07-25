import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Employee } from '@prisma/client';
import { CreateEmployeeDto, UpdateEmployeeDto } from 'src/dtos/employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async findAll(includeArchived = false): Promise<Employee[]> {
    return this.prisma.employee.findMany({
      where: { isArchived: includeArchived ? undefined : false },
    });
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    return this.prisma.employee.create({
      data: {
        ...createEmployeeDto,
        hireDate: new Date(createEmployeeDto.hireDate),
      },
    });
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    await this.findOne(id);
    return this.prisma.employee.update({
      where: { id },
      data: {
        ...updateEmployeeDto,
        hireDate: updateEmployeeDto.hireDate
          ? new Date(updateEmployeeDto.hireDate)
          : undefined,
      },
    });
  }

  async archive(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.employee.update({
      where: { id },
      data: { isArchived: true },
    });
  }

  async restore(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.employee.update({
      where: { id },
      data: { isArchived: false },
    });
  }
}
