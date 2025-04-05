import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OpenaiService {
  private readonly OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
  private readonly API_KEY = process.env.OPENAI_API_KEY;
  private readonly ORG_ID = process.env.OPENAI_ORG_ID;

  private async callOpenAI(messages: any[]): Promise<string> {
    try {
      const response = await axios.post(
        this.OPENAI_API_URL,
        {
          model: 'gpt-3.5-turbo',
          messages,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json',
            ...(this.ORG_ID && { 'OpenAI-Organization': this.ORG_ID }),
          },
        }
      );

      const content = response.data.choices?.[0]?.message?.content?.trim();
      if (!content) {
        throw new Error('No response returned from GPT');
      }

      return content;
    } catch (error: any) {
      console.error('❌ GPT API error:', error.response?.data || error.message);
      throw new InternalServerErrorException('OpenAI GPT request failed');
    }
  }

  // 🧠 Generate Smart Task Title
  async generateSmartTitle(transcription: string): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant that summarizes tasks.',
      },
      {
        role: 'user',
        content: `Generate a short, smart, human-friendly task title for this:\n\n"${transcription}"`,
      },
    ];
    return this.callOpenAI(messages);
  }

  // 🌟 Generate Encouragement Tip and Quote
  async generateEncouragement(transcription: string): Promise<{ tip: string; quote: string }> {
    const messages = [
      {
        role: 'system',
        content: 'You are a motivational assistant that encourages users to stay productive.',
      },
      {
        role: 'user',
        content: `Given this transcription:\n\n"${transcription}"\n\nReturn a JSON with two fields: "tip" (a useful productivity tip) and "quote" (a motivational quote).`,
      },
    ];

    const raw = await this.callOpenAI(messages);

    try {
      const parsed = JSON.parse(raw);
      return {
        tip: parsed.tip || 'Stay focused and keep moving forward.',
        quote: parsed.quote || 'Success is the sum of small efforts repeated daily.',
      };
    } catch {
      console.warn('⚠️ GPT did not return valid JSON. Falling back to defaults.');
      return {
        tip: 'Stay focused and take breaks to boost productivity.',
        quote: 'Success is the sum of small efforts, repeated day in and day out.',
      };
    }
  }
}
