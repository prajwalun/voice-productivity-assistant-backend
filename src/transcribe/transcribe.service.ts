import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class TranscribeService {
  async transcribe(file: Express.Multer.File) {
    const filename = `${uuid()}.wav`;
    const filepath = `./temp/${filename}`;

    try {
      // 1️⃣ Ensure ./temp folder exists
      fs.mkdirSync('./temp', { recursive: true });

      // 2️⃣ Save uploaded file to disk
      fs.writeFileSync(filepath, file.buffer);

      // 3️⃣ Run the Python Whisper script
      const { stdout } = await execAsync(`python3 transcribe_local.py ${filepath}`);

      // 4️⃣ Clean up file after transcription
      fs.unlinkSync(filepath);

      // 5️⃣ Return the transcribed text
      return {
        transcription: stdout.trim(),
      };
    } catch (error) {
      console.error('❌ Local Whisper transcription failed:', error.message);

      // Clean up if file exists
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }

      throw new InternalServerErrorException('Failed to transcribe audio');
    }
  }
}
