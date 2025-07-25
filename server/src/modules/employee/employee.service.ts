import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from 'src/dtos/employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  private formatDateToISO(dateString: string): string {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return `${dateString}T00:00:00.000Z`;
    } catch (error) {
      throw new BadRequestException(
        `Invalid hireDate format: ${dateString}. Expected YYYY-MM-DD`,
      );
    }
  }

  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      const data = {
        ...createEmployeeDto,
        hireDate: this.formatDateToISO(createEmployeeDto.hireDate),
      };
      return await this.prisma.employee.create({
        data,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

  async findAll(includeArchived = false) {
    return this.prisma.employee.findMany({
      where: { isArchived: includeArchived ? undefined : false },
    });
  }

  async findOne(id: number) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    await this.findOne(id);

    try {
      const data = {
        ...updateEmployeeDto,
        hireDate: updateEmployeeDto.hireDate
          ? this.formatDateToISO(updateEmployeeDto.hireDate)
          : undefined,
      };
      return await this.prisma.employee.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.employee.update({
      where: { id },
      data: { isArchived: true },
    });
  }

  async restore(id: number) {
    await this.findOne(id);

    return this.prisma.employee.update({
      where: { id },
      data: { isArchived: false },
    });
  }
}
