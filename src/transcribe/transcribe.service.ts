import { Injectable } from '@nestjs/common';

@Injectable()
export class TranscribeService {
  async transcribe(file: Express.Multer.File) {
    console.log('📥 Received file:', file.originalname);
    return {
      message: 'Received file',
      filename: file.originalname,
    };
  }
}
