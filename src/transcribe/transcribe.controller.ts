import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    UseGuards,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
  import { TranscribeService } from './transcribe.service';
  
  @Controller('transcribe')
  @UseGuards(FirebaseAuthGuard)
  export class TranscribeController {
    constructor(private readonly transcribeService: TranscribeService) {}
  
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async transcribe(@UploadedFile() file: Express.Multer.File) {
      return this.transcribeService.transcribe(file);
    }
  }
  