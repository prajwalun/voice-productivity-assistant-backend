import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import * as streamifier from 'streamifier';

@Injectable()
export class TranscribeService {
  async transcribe(file: Express.Multer.File): Promise<{ transcription: string }> {
    try {
      const formData = new FormData();

      // Convert buffer to stream
      const stream = streamifier.createReadStream(file.buffer);

      formData.append('file', stream, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
      formData.append('model', 'whisper-1');
      formData.append('language', 'en'); // Optional, for better accuracy

      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      });

      return {
        transcription: response.data.text.trim(),
      };
    } catch (error: any) {
      console.error('❌ Whisper API error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to transcribe audio');
    }
  }
}
