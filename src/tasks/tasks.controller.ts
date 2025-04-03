import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';  
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.model';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto): Task {
    return this.tasksService.createTask(dto);
  }

  @Get()
  findAll(): Task[] {
    return this.tasksService.getAllTasks();
  }

  @Delete(':id')
  delete(@Param('id') id: string): { success: boolean } {
    const success = this.tasksService.deleteTask(id);
    return { success };
  }
}
