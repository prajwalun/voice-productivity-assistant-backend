// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { FirebaseModule } from './firebase/firebase.module';
import { TranscribeModule } from './transcribe/transcribe.module';
import { OpenaiModule } from './openai/openai.module';
import { UserPreferencesModule } from './user-preferences/user-preferences.module';

@Module({
  imports: [
    TasksModule,
    FirebaseModule,
    TranscribeModule,
    OpenaiModule,
    UserPreferencesModule, // ✅ added for preferences
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
