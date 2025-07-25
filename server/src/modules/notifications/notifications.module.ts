import { Module } from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsController } from './notifications.controller';

@Module({
  providers: [NotificationService, PrismaService],
  controllers: [NotificationsController],
})
export class NotificationModule {}
