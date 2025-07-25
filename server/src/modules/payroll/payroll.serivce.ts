import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Payroll } from '@prisma/client';
import { CreatePayrollDto, UpdatePayrollDto } from 'src/dtos/payroll.dto';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  async findAll(employeeId?: number): Promise<Payroll[]> {
    return this.prisma.payroll.findMany({
      where: employeeId ? { employeeId } : {},
    });
  }

  async findOne(id: number): Promise<Payroll> {
    const payroll = await this.prisma.payroll.findUnique({ where: { id } });
    if (!payroll) {
      throw new NotFoundException(`Payroll with ID ${id} not found`);
    }
    return payroll;
  }

  async create(createPayrollDto: CreatePayrollDto): Promise<Payroll> {
    const employee = await this.prisma.employee.findUnique({
      where: { id: createPayrollDto.employeeId },
    });
    if (!employee || employee.isArchived) {
      throw new BadRequestException(
        `Invalid or archived employeeId: ${createPayrollDto.employeeId}`,
      );
    }
    return this.prisma.payroll.create({
      data: {
        ...createPayrollDto,
        date: new Date(createPayrollDto.date),
      },
    });
  }

  async update(
    id: number,
    updatePayrollDto: UpdatePayrollDto,
  ): Promise<Payroll> {
    const employee = await this.prisma.employee.findUnique({
      where: { id: updatePayrollDto.employeeId },
    });
    if (!employee || employee.isArchived) {
      throw new BadRequestException(
        `Invalid or archived employeeId: ${updatePayrollDto.employeeId}`,
      );
    }
    await this.findOne(id);
    return this.prisma.payroll.update({
      where: { id },
      data: {
        ...updatePayrollDto,
        date: updatePayrollDto.date
          ? new Date(updatePayrollDto.date)
          : undefined,
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.payroll.delete({ where: { id } });
  }

  async generatePayslip(id: number): Promise<Payroll> {
    const payroll = await this.findOne(id);
    // Logic to generate payslip (e.g., PDF generation) can be added here
    return payroll;
  }
}
