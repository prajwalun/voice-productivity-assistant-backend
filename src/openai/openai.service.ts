import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OpenaiService {
  async generateSmartTitle(transcription: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that summarizes tasks.',
            },
            {
              role: 'user',
              content: `Generate a short, smart task title based on this transcription:\n\n"${transcription}"`,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
            ...(process.env.OPENAI_ORG_ID && {
              'OpenAI-Organization': process.env.OPENAI_ORG_ID,
            }),
          },
        }
      );

      const choice = response.data.choices?.[0]?.message?.content;
      if (!choice) {
        throw new Error('No title returned from GPT');
      }

      const title = choice.trim();
    
      return title;
    } catch (error: any) {
      console.error('❌ GPT API error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to generate smart title');
    }
  }
}
