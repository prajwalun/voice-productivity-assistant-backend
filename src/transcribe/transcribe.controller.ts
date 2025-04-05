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

    // 🎙️ Transcribe the audio
    const result = await this.transcribeService.transcribe(file);
    const fullText = result.transcription.trim();

    // 🧠 Generate a smart title from GPT
    const smartTitle = await this.openaiService.generateSmartTitle(fullText);

    // 💡 Get motivational tip and quote
    const encouragement = await this.openaiService.generateEncouragement(fullText);

    // ✅ Create the task
    const newTask = this.tasksService.createTask(
      { title: smartTitle, description: fullText },
      userId,
    );

    return {
      transcription: fullText,
      title: smartTitle,
      encouragement, // { tip, quote }
      task: newTask,
    };
  }
}
