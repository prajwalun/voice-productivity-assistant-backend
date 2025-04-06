import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ Create a new task and store it in the DB
  async createTask(dto: CreateTaskDto, userId: string): Promise<Task> {
    return this.prisma.task.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description || '',
        completed: false,
      },
    });
  }
  

  // ✅ Fetch all tasks for the user
  async getAllTasks(userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ✅ Delete a task only if it belongs to the user
  async deleteTask(id: string, userId: string): Promise<boolean> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task || task.userId !== userId) return false;

    await this.prisma.task.delete({ where: { id } });
    return true;
  }
}
