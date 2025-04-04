import { Injectable } from '@nestjs/common';
import { Task } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasksByUser: { [userId: string]: Task[] } = {};

  createTask(dto: CreateTaskDto, userId: string): Task {
    const task: Task = {
      id: uuidv4(),
      title: dto.title,
      description: dto.description,
      completed: false,
      createdAt: new Date(),
      userId,
    };

    if (!this.tasksByUser[userId]) {
      this.tasksByUser[userId] = [];
    }

    this.tasksByUser[userId].push(task);
    return task;
  }

  getAllTasks(userId: string): Task[] {
    return this.tasksByUser[userId] || [];
  }

  deleteTask(id: string, userId: string): boolean {
    const tasks = this.tasksByUser[userId] || [];
    const index = tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      tasks.splice(index, 1);
      return true;
    }
    return false;
  }
}
