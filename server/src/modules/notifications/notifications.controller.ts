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
import { NotificationService } from './notifications.service';
import { Notification } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from 'src/dtos/notifications.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationService) {}

  @Get()
  findAll(@Body('userId') userId?: number): Promise<Notification[]> {
    return this.notificationsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Notification> {
    return this.notificationsService.findOne(id);
  }

  @Post()
  create(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.notificationsService.remove(id);
  }

  @Post(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number): Promise<Notification> {
    return this.notificationsService.markAsRead(id);
  }
}
