import {
    Controller,
    Post,
    UseGuards,
    UploadedFile,
    UseInterceptors,
    Req,
    BadRequestException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { TranscribeService } from './transcribe.service';
  import { TasksService } from '../tasks/tasks.service';
  import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
  import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
  
  // ✅ Updated: Limit file size to 10MB
  const MAX_FILE_SIZE_MB = 10;
  const multerOptions: MulterOptions = {
    limits: {
      fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    },
  };
  
  @Controller('transcribe')
  export class TranscribeController {
    constructor(
      private readonly transcribeService: TranscribeService,
      private readonly tasksService: TasksService,
    ) {}
  
    @UseGuards(FirebaseAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file', multerOptions))
    async transcribe(@UploadedFile() file: Express.Multer.File, @Req() req) {
      const userId = req.user.uid;
  
      // ✅ Validate MIME type
      const allowedTypes = [
        'audio/wav',
        'audio/x-wav',
        'audio/x-pn-wav',
        'audio/wave',       
        'audio/mpeg',
        'audio/mp3',
        'audio/webm',
        'audio/ogg',
        'audio/x-m4a',
      ];
      
      
      if (!allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `Invalid file type (${file.mimetype}). Only audio files are allowed.`,
        );
      }
      
  
      // 🎙️ Transcribe audio with local Whisper
      const result = await this.transcribeService.transcribe(file);
      const fullText = result.transcription.trim();
  
      // 📝 Extract title from first 5 words
      const title = fullText.split(' ').slice(0, 5).join(' ') + '...';
  
      // 📋 Create task with title + full transcription
      const newTask = this.tasksService.createTask(
        { title, description: fullText },
        userId,
      );
  
      return {
        transcription: fullText,
        task: newTask,
      };
    }
  }
  