// src/transcribe/transcribe.module.ts
import { Module } from '@nestjs/common';
import { TranscribeController } from './transcribe.controller';
import { TranscribeService } from './transcribe.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { TasksModule } from '../tasks/tasks.module'; // ✅ Already here, just make sure it's imported
import { OpenaiModule } from '../openai/openai.module';
import { UserPreferencesModule } from '../user-preferences/user-preferences.module';

@Module({
  imports: [
    FirebaseModule,
    TasksModule,             // ✅ Needed to inject TasksService
    OpenaiModule,
    UserPreferencesModule,
  ],
  controllers: [TranscribeController],
  providers: [TranscribeService],
})
export class TranscribeModule {}
