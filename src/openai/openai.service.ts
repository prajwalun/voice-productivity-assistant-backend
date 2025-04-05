import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OpenaiService {
  async generateSmartTitle(transcription: string): Promise<string> {
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
        },
      },
    );

    const choice = response.data.choices?.[0]?.message?.content?.trim();
    if (!choice) throw new Error('No title returned from GPT');
    return choice;
  }

  async generateEncouragement(transcription: string): Promise<{ tip: string; quote: string }> {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a motivational assistant that encourages users to stay productive.',
          },
          {
            role: 'user',
            content: `Given this transcription:\n\n"${transcription}"\n\nReturn a JSON with two fields: "tip" (a useful productivity tip) and "quote" (a motivational quote).`,
          },
        ],
        temperature: 0.8,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const text = response.data.choices?.[0]?.message?.content?.trim();
    const parsed = JSON.parse(text);
    return {
      tip: parsed.tip,
      quote: parsed.quote,
    };
  }
}
