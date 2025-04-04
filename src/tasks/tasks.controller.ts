import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    Body,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { TasksService } from './tasks.service';
  import { CreateTaskDto } from './dto/create-task.dto';
  import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
  
  @Controller('tasks')
  @UseGuards(FirebaseAuthGuard)
  export class TasksController {
    constructor(private readonly tasksService: TasksService) {}
  
    @Post()
    create(@Req() req, @Body() dto: CreateTaskDto) {
      const userId = req.user.uid; // 👈 Extract user ID from Firebase token
      return this.tasksService.createTask(dto, userId);
    }
  
    @Get()
    findAll(@Req() req) {
      const userId = req.user.uid;
      return this.tasksService.getAllTasks(userId);
    }
  
    @Delete(':id')
    delete(@Req() req, @Param('id') id: string) {
      const userId = req.user.uid;
      const success = this.tasksService.deleteTask(id, userId);
      return { success };
    }
  }
  