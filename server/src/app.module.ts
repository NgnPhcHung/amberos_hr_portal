import { Module } from '@nestjs/common';
import { EmployeeModule } from './modules/employee/employee.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { PerformanceReviewModule } from './modules/performance-review/performance-review.module';
import { LeaveModule } from './modules/leaves/leaves.module';
import { DocumentModule } from './modules/documents/documents.module';
import { NotificationModule } from './modules/notifications/notifications.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaService } from './modules/prisma/prisma.service';

@Module({
  imports: [
    AuthModule,
    EmployeeModule,
    AttendanceModule,
    PayrollModule,
    PerformanceReviewModule,
    LeaveModule,
    DocumentModule,
    NotificationModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
