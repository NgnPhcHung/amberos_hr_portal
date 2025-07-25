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
import { Payroll } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePayrollDto, UpdatePayrollDto } from 'src/dtos/payroll.dto';
import { PayrollService } from './payroll.serivce';

@Controller('payroll')
@UseGuards(JwtAuthGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get()
  findAll(@Body('employeeId') employeeId?: number): Promise<Payroll[]> {
    return this.payrollService.findAll(employeeId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Payroll> {
    return this.payrollService.findOne(id);
  }

  @Post()
  create(@Body() createPayrollDto: CreatePayrollDto): Promise<Payroll> {
    return this.payrollService.create(createPayrollDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePayrollDto: UpdatePayrollDto,
  ): Promise<Payroll> {
    return this.payrollService.update(id, updatePayrollDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.payrollService.remove(id);
  }

  @Post(':id/payslip')
  generatePayslip(@Param('id', ParseIntPipe) id: number): Promise<Payroll> {
    return this.payrollService.generatePayslip(id);
  }
}
