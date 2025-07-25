import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Notification } from '@prisma/client';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from 'src/dtos/notifications.dto';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId?: number): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: userId ? { userId } : {},
    });
  }

  async findOne(id: number): Promise<Notification> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return notification;
  }

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return this.prisma.notification.create({
      data: {
        ...createNotificationDto,
        createdAt: new Date(createNotificationDto.createdAt),
      },
    });
  }

  async update(
    id: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    await this.findOne(id);
    return this.prisma.notification.update({
      where: { id },
      data: {
        ...updateNotificationDto,
        createdAt: updateNotificationDto.createdAt
          ? new Date(updateNotificationDto.createdAt)
          : undefined,
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.notification.delete({ where: { id } });
  }

  async markAsRead(id: number): Promise<Notification> {
    await this.findOne(id);
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }
}
