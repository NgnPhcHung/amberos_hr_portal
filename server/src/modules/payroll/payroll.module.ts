import { Module } from '@nestjs/common';
import { PayrollController } from './payroll.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PayrollService } from './payroll.serivce';

@Module({
  providers: [PayrollService, PrismaService],
  controllers: [PayrollController],
})
export class PayrollModule {}
