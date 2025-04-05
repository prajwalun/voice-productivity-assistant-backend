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
import { OpenaiService } from '../openai/openai.service';

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
    private readonly openaiService: OpenaiService,
  ) {}

  @UseGuards(FirebaseAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async transcribe(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const userId = req.user.uid;

    // Validate file presence
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

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

    // 1️⃣ Transcribe
    const result = await this.transcribeService.transcribe(file);
    const fullText = result.transcription.trim();

    // 2️⃣ Generate smart title
    const smartTitle = await this.openaiService.generateSmartTitle(fullText);

    // 3️⃣ Create task
    const newTask = this.tasksService.createTask(
      { title: smartTitle, description: fullText },
      userId,
    );

    return {
      transcription: fullText,
      title: smartTitle,
      task: newTask,
    };
  }
}
