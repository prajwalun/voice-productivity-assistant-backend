import { Module } from '@nestjs/common';
import { TranscribeController } from './transcribe.controller';
import { TranscribeService } from './transcribe.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { TasksModule } from '../tasks/tasks.module';
import { OpenaiModule } from '../openai/openai.module'; 

@Module({
  imports: [FirebaseModule, TasksModule, OpenaiModule],
  controllers: [TranscribeController],
  providers: [TranscribeService]
})
export class TranscribeModule {}
