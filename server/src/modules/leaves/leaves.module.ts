import { Module } from '@nestjs/common';
import { LeaveService } from './leaves.service';
import { LeaveController } from './leaves.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [LeaveService, PrismaService],
  controllers: [LeaveController],
})
export class LeaveModule {}
