import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as FormData from 'form-data';
import axios from 'axios';
import * as streamifier from 'streamifier';

@Injectable()
export class TranscribeService {
  async transcribe(file: Express.Multer.File) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error('❌ OPENAI_API_KEY not found in environment variables');
      throw new InternalServerErrorException('API key not configured');
    }

    try {
      const formData = new FormData();

      const stream = streamifier.createReadStream(file.buffer);

      formData.append('file', stream, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');

      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );

      return {
        transcription: response.data.text,
      };
    } catch (error) {
      console.error('❌ Whisper API error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to transcribe audio');
    }
  }
}
